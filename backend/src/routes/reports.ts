import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticate, AuthRequest } from '../middleware/auth';
import { validate, reportSchema, updateStatusSchema } from '../middleware/validation';
import { getFirestore, getStorage } from '../config/firebase';
import { analyzeReportText, analyzeImage, detectDuplicates } from '../services/aiService';
import { analyzeImageSafety, detectLabels } from '../services/visionService';
import { reverseGeocode } from '../services/mapsService';
import { clusterReports, findNearbyReports } from '../services/clusterService';
import { insertReport } from '../config/bigquery';

const router = Router();
const db = getFirestore();

// Submit new report
router.post('/', authenticate, validate(reportSchema), async (req: AuthRequest, res: Response) => {
    try {
        const { description, category, location, images } = req.body;
        const reportId = uuidv4();
        const timestamp = new Date();

        // Get address from coordinates
        const address = location.address || await reverseGeocode(location.lat, location.lng);

        // AI analysis of description
        const aiAnalysis = await analyzeReportText(description);

        // Process images if provided
        let imageUrls: string[] = [];
        let imageAnalysis: string[] = [];

        if (images && images.length > 0) {
            for (const imageBase64 of images) {
                // Safety check
                const isSafe = await analyzeImageSafety(imageBase64);
                if (!isSafe) {
                    return res.status(400).json({ error: 'Image contains inappropriate content' });
                }

                // Upload to Firebase Storage
                const bucket = getStorage().bucket();
                const fileName = `reports/${reportId}/${uuidv4()}.jpg`;
                const file = bucket.file(fileName);

                const buffer = Buffer.from(imageBase64.split(',')[1] || imageBase64, 'base64');
                await file.save(buffer, { contentType: 'image/jpeg' });

                const [url] = await file.getSignedUrl({
                    action: 'read',
                    expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
                });

                imageUrls.push(url);

                // Analyze image with Gemini
                const analysis = await analyzeImage(imageBase64);
                imageAnalysis.push(analysis);

                // Get labels
                const labels = await detectLabels(imageBase64);
                console.log('Image labels:', labels);
            }
        }

        // Check for nearby similar reports
        const recentReportsSnap = await db
            .collection('reports')
            .where('category', '==', aiAnalysis.category)
            .where('status', 'in', ['SUBMITTED', 'VERIFIED'])
            .orderBy('createdAt', 'desc')
            .limit(20)
            .get();

        const recentReports = recentReportsSnap.docs.map(doc => ({
            id: doc.id,
            description: doc.data().description,
            location: doc.data().location,
        }));

        const nearbyReports = findNearbyReports(location, recentReports as any, 500);
        const potentialDuplicates = await detectDuplicates(
            description,
            nearbyReports.map(r => ({ id: r.id, description: r.description }))
        );

        // Create report document
        const reportData = {
            id: reportId,
            userId: req.user!.uid,
            userEmail: req.user!.email,
            description,
            category: category || aiAnalysis.category,
            priority: aiAnalysis.priority,
            urgency: aiAnalysis.urgency,
            status: 'SUBMITTED',
            location: {
                lat: location.lat,
                lng: location.lng,
                address,
            },
            images: imageUrls,
            imageAnalysis,
            aiSummary: aiAnalysis.summary,
            suggestedActions: aiAnalysis.suggestedActions,
            potentialDuplicates,
            createdAt: timestamp,
            updatedAt: timestamp,
            resolvedAt: null,
            assignedTo: null,
            notes: [],
        };

        await db.collection('reports').doc(reportId).set(reportData);

        // Insert into BigQuery for analytics
        await insertReport({
            report_id: reportId,
            timestamp: timestamp.toISOString(),
            category: reportData.category,
            priority: reportData.priority,
            status: reportData.status,
            latitude: location.lat,
            longitude: location.lng,
            address,
            description,
            user_id: req.user!.uid,
            resolution_time_hours: null,
        });

        res.status(201).json({
            success: true,
            reportId,
            report: reportData,
        });
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ error: 'Failed to create report' });
    }
});

// Get all reports with filters
router.get('/', async (req: AuthRequest, res: Response) => {
    try {
        const { status, category, startDate, endDate, limit = 50 } = req.query;

        let query: any = db.collection('reports');

        if (status) {
            query = query.where('status', '==', status);
        }
        if (category) {
            query = query.where('category', '==', category);
        }
        if (startDate) {
            query = query.where('createdAt', '>=', new Date(startDate as string));
        }
        if (endDate) {
            query = query.where('createdAt', '<=', new Date(endDate as string));
        }

        query = query.orderBy('createdAt', 'desc').limit(parseInt(limit as string));

        const snapshot = await query.get();
        const reports = snapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
            resolvedAt: doc.data().resolvedAt?.toDate(),
        }));

        res.json({ reports, count: reports.length });
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
});

// Get report by ID
router.get('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const doc = await db.collection('reports').doc(id).get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Report not found' });
        }

        const report = {
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data()?.createdAt?.toDate(),
            updatedAt: doc.data()?.updatedAt?.toDate(),
            resolvedAt: doc.data()?.resolvedAt?.toDate(),
        };

        res.json(report);
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ error: 'Failed to fetch report' });
    }
});

// Update report status (authorities only)
router.patch('/:id/status', authenticate, validate(updateStatusSchema), async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        const reportRef = db.collection('reports').doc(id);
        const doc = await reportRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Report not found' });
        }

        const updateData: any = {
            status,
            updatedAt: new Date(),
        };

        if (status === 'RESOLVED' || status === 'CLOSED') {
            updateData.resolvedAt = new Date();
        }

        if (notes) {
            const currentNotes = doc.data()?.notes || [];
            updateData.notes = [
                ...currentNotes,
                {
                    text: notes,
                    addedBy: req.user!.uid,
                    addedAt: new Date(),
                },
            ];
        }

        await reportRef.update(updateData);

        res.json({ success: true, message: 'Report updated successfully' });
    } catch (error) {
        console.error('Error updating report:', error);
        res.status(500).json({ error: 'Failed to update report' });
    }
});

// Get clusters
router.get('/clusters/all', async (req: AuthRequest, res: Response) => {
    try {
        const { category } = req.query;

        let query: any = db.collection('reports')
            .where('status', 'in', ['SUBMITTED', 'VERIFIED', 'IN_PROGRESS']);

        if (category) {
            query = query.where('category', '==', category);
        }

        const snapshot = await query.limit(500).get();
        const reports = snapshot.docs.map((doc: any) => ({
            id: doc.id,
            location: doc.data().location,
            category: doc.data().category,
            description: doc.data().description,
        }));

        const clusters = clusterReports(reports as any);

        res.json({ clusters, totalReports: reports.length });
    } catch (error) {
        console.error('Error fetching clusters:', error);
        res.status(500).json({ error: 'Failed to fetch clusters' });
    }
});

export default router;
