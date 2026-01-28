import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import api from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
];

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [summaryRes, trendsRes] = await Promise.all([
        api.get('/analytics/summary'),
        api.get('/analytics/trends', { params: { days: 30 } }),
      ]);

      setSummary(summaryRes.data.summary);
      setTrends(trendsRes.data.trends);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='60vh'
      >
        <CircularProgress />
      </Box>
    );
  }

  const pieData = trends.map((trend) => ({
    name: trend.category?.replace(/_/g, ' ') || 'Unknown',
    value: parseInt(trend.total_reports) || 0,
  }));

  return (
    <Box>
      <Typography variant='h4' gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant='h3' color='primary'>
              {summary?.total_reports || 0}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Total Reports
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant='h3' color='warning.main'>
              {summary?.pending || 0}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Pending
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant='h3' color='info.main'>
              {summary?.in_progress || 0}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              In Progress
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant='h3' color='success.main'>
              {summary?.resolved || 0}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Resolved
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant='h6' gutterBottom>
              Reports by Category
            </Typography>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={trends}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  dataKey='category'
                  tickFormatter={(value) =>
                    value.replace(/_/g, ' ').substring(0, 10)
                  }
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey='total_reports'
                  fill='#8884d8'
                  name='Total Reports'
                />
                <Bar dataKey='resolved_count' fill='#82ca9d' name='Resolved' />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant='h6' gutterBottom>
              Category Distribution
            </Typography>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant='h6' gutterBottom>
              Performance Metrics
            </Typography>
            <Grid container spacing={2}>
              {trends.slice(0, 4).map((trend, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant='subtitle2'>
                      {trend.category?.replace(/_/g, ' ')}
                    </Typography>
                    <Typography variant='h6' color='primary'>
                      {trend.total_reports}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      Avg Resolution:{' '}
                      {trend.avg_resolution_hours
                        ? `${parseFloat(trend.avg_resolution_hours).toFixed(
                            1,
                          )}h`
                        : 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
