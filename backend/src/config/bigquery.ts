import { BigQuery } from '@google-cloud/bigquery';

const bigquery = new BigQuery({
    projectId: process.env.GCP_PROJECT_ID,
});

const dataset = bigquery.dataset(process.env.BIGQUERY_DATASET || 'civiclens_data');

export const initializeBigQuery = async () => {
    try {
        const [exists] = await dataset.exists();
        if (!exists) {
            await bigquery.createDataset(process.env.BIGQUERY_DATASET || 'civiclens_data');
            console.log('✅ BigQuery dataset created');
        }

        // Create reports table if not exists
        const table = dataset.table(process.env.BIGQUERY_TABLE || 'reports');
        const [tableExists] = await table.exists();

        if (!tableExists) {
            const schema = [
                { name: 'report_id', type: 'STRING', mode: 'REQUIRED' },
                { name: 'timestamp', type: 'TIMESTAMP', mode: 'REQUIRED' },
                { name: 'category', type: 'STRING', mode: 'REQUIRED' },
                { name: 'priority', type: 'STRING', mode: 'REQUIRED' },
                { name: 'status', type: 'STRING', mode: 'REQUIRED' },
                { name: 'latitude', type: 'FLOAT', mode: 'REQUIRED' },
                { name: 'longitude', type: 'FLOAT', mode: 'REQUIRED' },
                { name: 'address', type: 'STRING', mode: 'NULLABLE' },
                { name: 'description', type: 'STRING', mode: 'NULLABLE' },
                { name: 'user_id', type: 'STRING', mode: 'REQUIRED' },
                { name: 'resolution_time_hours', type: 'FLOAT', mode: 'NULLABLE' },
            ];

            await table.create({ schema });
            console.log('✅ BigQuery table created');
        }
    } catch (error) {
        console.error('❌ BigQuery initialization error:', error);
    }
};

export const insertReport = async (reportData: any) => {
    try {
        const table = dataset.table(process.env.BIGQUERY_TABLE || 'reports');
        await table.insert([reportData]);
    } catch (error) {
        console.error('Error inserting into BigQuery:', error);
    }
};

export const queryReports = async (query: string) => {
    try {
        const [rows] = await bigquery.query({ query });
        return rows;
    } catch (error) {
        console.error('Error querying BigQuery:', error);
        throw error;
    }
};

export default bigquery;
