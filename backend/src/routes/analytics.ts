import { Router, Response } from 'express';
import { authenticate, AuthRequest, authorizeRole } from '../middleware/auth';
import { queryReports } from '../config/bigquery';

const router = Router();

// Get analytics trends
router.get('/trends', authenticate, authorizeRole(['authority', 'admin']), async (req: AuthRequest, res: Response) => {
    try {
        const { days = 30 } = req.query;

        const query = `
      SELECT
        category,
        COUNT(*) as total_reports,
        AVG(resolution_time_hours) as avg_resolution_hours,
        SUM(CASE WHEN status = 'RESOLVED' THEN 1 ELSE 0 END) as resolved_count,
        SUM(CASE WHEN priority = 'CRITICAL' THEN 1 ELSE 0 END) as critical_count
      FROM \`${process.env.GCP_PROJECT_ID}.${process.env.BIGQUERY_DATASET}.${process.env.BIGQUERY_TABLE}\`
      WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL ${days} DAY)
      GROUP BY category
      ORDER BY total_reports DESC
    `;

        const results = await queryReports(query);

        res.json({ trends: results });
    } catch (error) {
        console.error('Error fetching trends:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

// Get time series data
router.get('/timeseries', authenticate, authorizeRole(['authority', 'admin']), async (req: AuthRequest, res: Response) => {
    try {
        const { days = 30 } = req.query;

        const query = `
      SELECT
        DATE(timestamp) as date,
        category,
        COUNT(*) as count,
        AVG(CASE WHEN priority = 'CRITICAL' THEN 10
                 WHEN priority = 'HIGH' THEN 7
                 WHEN priority = 'MEDIUM' THEN 4
                 ELSE 1 END) as avg_priority_score
      FROM \`${process.env.GCP_PROJECT_ID}.${process.env.BIGQUERY_DATASET}.${process.env.BIGQUERY_TABLE}\`
      WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL ${days} DAY)
      GROUP BY date, category
      ORDER BY date DESC, count DESC
    `;

        const results = await queryReports(query);

        res.json({ timeseries: results });
    } catch (error) {
        console.error('Error fetching timeseries:', error);
        res.status(500).json({ error: 'Failed to fetch timeseries data' });
    }
});

// Get location heatmap data
router.get('/heatmap', authenticate, authorizeRole(['authority', 'admin']), async (req: AuthRequest, res: Response) => {
    try {
        const { category, days = 30 } = req.query;

        let categoryFilter = '';
        if (category) {
            categoryFilter = `AND category = '${category}'`;
        }

        const query = `
      SELECT
        latitude,
        longitude,
        category,
        priority,
        COUNT(*) as frequency
      FROM \`${process.env.GCP_PROJECT_ID}.${process.env.BIGQUERY_DATASET}.${process.env.BIGQUERY_TABLE}\`
      WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL ${days} DAY)
      ${categoryFilter}
      GROUP BY latitude, longitude, category, priority
      HAVING frequency > 1
      ORDER BY frequency DESC
      LIMIT 500
    `;

        const results = await queryReports(query);

        res.json({ heatmap: results });
    } catch (error) {
        console.error('Error fetching heatmap:', error);
        res.status(500).json({ error: 'Failed to fetch heatmap data' });
    }
});

// Get summary statistics
router.get('/summary', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const query = `
      SELECT
        COUNT(*) as total_reports,
        SUM(CASE WHEN status = 'SUBMITTED' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'RESOLVED' THEN 1 ELSE 0 END) as resolved,
        SUM(CASE WHEN priority = 'CRITICAL' THEN 1 ELSE 0 END) as critical,
        AVG(resolution_time_hours) as avg_resolution_hours,
        MAX(timestamp) as last_report_time
      FROM \`${process.env.GCP_PROJECT_ID}.${process.env.BIGQUERY_DATASET}.${process.env.BIGQUERY_TABLE}\`
      WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
    `;

        const results = await queryReports(query);

        res.json({ summary: results[0] || {} });
    } catch (error) {
        console.error('Error fetching summary:', error);
        res.status(500).json({ error: 'Failed to fetch summary' });
    }
});

export default router;
