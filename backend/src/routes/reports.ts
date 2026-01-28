import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticate, AuthRequest } from '../middleware/auth';
import { validate, reportSchema, updateStatusSchema } from '../middleware/validation';
import { getFirestore, getStorage } from '../config/firebase';
import { analyzeReportText, analyzeImage, detectDuplicates } from '../services/aiService';
import { reverseGeocode } from '../services/mapsService';
import { clusterReports, findNearbyReports } from '../services/clusterService';

const router = Router();

// Submit new report
router.post('/', authenticate, validate(reportSchema), async (req: AuthRequest, res: Response) => {
    try {
        const db = getFirestore();
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
            // Skip image upload for now (requires Firebase Storage billing)
            // Images will be stored in report description instead
            console.log('📸 Images received but storage disabled (requires billing). Images not uploaded.');
            imageAnalysis = images.map(() => 'Image analysis skipped - storage not configured');
        }

        // Check for nearby similar reports - simplified to avoid index requirements
        let recentReports: any[] = [];
        try {
            const recentReportsSnap = await db
                .collection('reports')
                .limit(100)
                .get();

            // Filter by category and status in memory
            recentReports = recentReportsSnap.docs
                .filter(doc => {
                    const data = doc.data();
                    return data.category === aiAnalysis.category &&
                        ['SUBMITTED', 'VERIFIED'].includes(data.status);
                })
                .sort((a, b) => {
                    const aTime = a.data().createdAt?.toDate?.() || new Date(0);
                    const bTime = b.data().createdAt?.toDate?.() || new Date(0);
                    return bTime.getTime() - aTime.getTime();
                })
                .slice(0, 20)
                .map(doc => ({
                    id: doc.id,
                    description: doc.data().description,
                    location: doc.data().location,
                }));
        } catch (err) {
            console.log('⚠️  Could not fetch nearby reports, continuing without duplicate detection');
            recentReports = [];
        }

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
        const db = getFirestore();
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
        const db = getFirestore();
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
        const db = getFirestore();
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
        const db = getFirestore();
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
