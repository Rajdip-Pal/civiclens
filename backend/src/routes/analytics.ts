import { Router, Response } from 'express';
import { authenticate, AuthRequest, authorizeRole } from '../middleware/auth';
import { getFirestore } from '../config/firebase';

const router = Router();

// Get summary statistics
router.get('/summary', authenticate, authorizeRole(['authority', 'admin']), async (req: AuthRequest, res: Response) => {
    try {
        const db = getFirestore();
        const reportsRef = db.collection('reports');

        // Get all reports
        const allReports = await reportsRef.get();
        const total = allReports.size;

        // Count by status
        const statusCounts: any = {};
        const categoryCounts: any = {};
        const priorityCounts: any = {};

        allReports.docs.forEach(doc => {
            const data = doc.data();

            statusCounts[data.status] = (statusCounts[data.status] || 0) + 1;
            categoryCounts[data.category] = (categoryCounts[data.category] || 0) + 1;
            priorityCounts[data.priority] = (priorityCounts[data.priority] || 0) + 1;
        });

        res.json({
            total,
            byStatus: statusCounts,
            byCategory: categoryCounts,
            byPriority: priorityCounts,
        });
    } catch (error) {
        console.error('Error fetching summary:', error);
        res.status(500).json({ error: 'Failed to fetch analytics summary' });
    }
});

// Get analytics trends
router.get('/trends', authenticate, authorizeRole(['authority', 'admin']), async (req: AuthRequest, res: Response) => {
    try {
        const db = getFirestore();
        const { days = 30 } = req.query;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - parseInt(days as string));

        const reportsRef = db.collection('reports')
            .where('createdAt', '>=', cutoffDate);

        const snapshot = await reportsRef.get();

        const trends: any = {};

        snapshot.docs.forEach(doc => {
            const data = doc.data();
            const category = data.category;

            if (!trends[category]) {
                trends[category] = {
                    totalReports: 0,
                    resolved: 0,
                    critical: 0,
                    avgResolutionHours: 0,
                    resolutionTimes: [],
                };
            }

            trends[category].totalReports++;

            if (data.status === 'RESOLVED' || data.status === 'CLOSED') {
                trends[category].resolved++;

                if (data.resolvedAt && data.createdAt) {
                    const hours = (data.resolvedAt.toDate() - data.createdAt.toDate()) / (1000 * 60 * 60);
                    trends[category].resolutionTimes.push(hours);
                }
            }

            if (data.priority === 'CRITICAL') {
                trends[category].critical++;
            }
        });

        // Calculate averages
        Object.keys(trends).forEach(category => {
            const times = trends[category].resolutionTimes;
            if (times.length > 0) {
                trends[category].avgResolutionHours = times.reduce((a: number, b: number) => a + b, 0) / times.length;
            }
            delete trends[category].resolutionTimes;
        });

        res.json({ trends });
    } catch (error) {
        console.error('Error fetching trends:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

// Get time series data
router.get('/timeseries', authenticate, authorizeRole(['authority', 'admin']), async (req: AuthRequest, res: Response) => {
    try {
        const db = getFirestore();
        const { days = 30 } = req.query;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - parseInt(days as string));

        const reportsRef = db.collection('reports')
            .where('createdAt', '>=', cutoffDate)
            .orderBy('createdAt', 'asc');

        const snapshot = await reportsRef.get();

        const timeSeriesMap: any = {};

        snapshot.docs.forEach(doc => {
            const data = doc.data();
            const date = data.createdAt.toDate().toISOString().split('T')[0];
            const category = data.category;
            const key = `${date}_${category}`;

            if (!timeSeriesMap[key]) {
                timeSeriesMap[key] = {
                    date,
                    category,
                    count: 0,
                    priorityScores: [],
                };
            }

            timeSeriesMap[key].count++;

            // Priority scoring
            const priorityWeights: { [key: string]: number } = {
                'CRITICAL': 10,
                'HIGH': 7,
                'MEDIUM': 4,
                'LOW': 1,
            };
            const priorityScore = priorityWeights[data.priority as string] || 1;

            timeSeriesMap[key].priorityScores.push(priorityScore);
        });

        // Calculate averages and format
        const timeSeries = Object.values(timeSeriesMap).map((item: any) => ({
            date: item.date,
            category: item.category,
            count: item.count,
            avgPriorityScore: item.priorityScores.reduce((a: number, b: number) => a + b, 0) / item.priorityScores.length,
        }));

        res.json({ timeSeries });
    } catch (error) {
        console.error('Error fetching timeseries:', error);
        res.status(500).json({ error: 'Failed to fetch timeseries data' });
    }
});

// Get heatmap data
router.get('/heatmap', authenticate, authorizeRole(['authority', 'admin']), async (req: AuthRequest, res: Response) => {
    try {
        const db = getFirestore();
        const { category, status } = req.query;

        let query: any = db.collection('reports');

        if (category) {
            query = query.where('category', '==', category);
        }
        if (status) {
            query = query.where('status', '==', status);
        }

        const snapshot = await query.limit(1000).get();

        const heatmapData = snapshot.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
            const data = doc.data();
            const priorityWeights: { [key: string]: number } = {
                'CRITICAL': 10,
                'HIGH': 7,
                'MEDIUM': 4,
                'LOW': 1,
            };
            return {
                lat: data.location.lat,
                lng: data.location.lng,
                category: data.category,
                priority: data.priority,
                weight: priorityWeights[data.priority as string] || 1,
            };
        });

        res.json({ heatmap: heatmapData, count: heatmapData.length });
    } catch (error) {
        console.error('Error fetching heatmap:', error);
        res.status(500).json({ error: 'Failed to fetch heatmap data' });
    }
});

export default router;
