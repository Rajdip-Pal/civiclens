import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { format } from 'date-fns';

const STATUS_COLORS: any = {
  SUBMITTED: 'default',
  VERIFIED: 'info',
  IN_PROGRESS: 'warning',
  RESOLVED: 'success',
  CLOSED: 'default',
};

const PRIORITY_COLORS: any = {
  CRITICAL: 'error',
  HIGH: 'warning',
  MEDIUM: 'info',
  LOW: 'default',
};

export default function Reports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetchReports();
  }, [statusFilter, categoryFilter]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params: any = { limit: 50 };
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;

      const response = await api.get('/reports', { params });
      setReports(response.data.reports);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
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

  return (
    <Box>
      <Typography variant='h4' gutterBottom>
        Civic Issue Reports
      </Typography>

      <Stack direction='row' spacing={2} sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label='Status'
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value=''>All Statuses</MenuItem>
            <MenuItem value='SUBMITTED'>Submitted</MenuItem>
            <MenuItem value='VERIFIED'>Verified</MenuItem>
            <MenuItem value='IN_PROGRESS'>In Progress</MenuItem>
            <MenuItem value='RESOLVED'>Resolved</MenuItem>
            <MenuItem value='CLOSED'>Closed</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            label='Category'
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <MenuItem value=''>All Categories</MenuItem>
            <MenuItem value='ROAD_DAMAGE'>Road Damage</MenuItem>
            <MenuItem value='SANITATION'>Sanitation</MenuItem>
            <MenuItem value='STREET_LIGHTS'>Street Lights</MenuItem>
            <MenuItem value='WATER_SUPPLY'>Water Supply</MenuItem>
            <MenuItem value='TRAFFIC'>Traffic</MenuItem>
            <MenuItem value='PUBLIC_SAFETY'>Public Safety</MenuItem>
            <MenuItem value='PARKS'>Parks</MenuItem>
            <MenuItem value='OTHER'>Other</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {reports.length === 0 ? (
        <Typography variant='body1' color='text.secondary'>
          No reports found
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {reports.map((report) => (
            <Grid item xs={12} md={6} lg={4} key={report.id}>
              <Card
                sx={{ cursor: 'pointer', height: '100%' }}
                onClick={() => navigate(`/reports/${report.id}`)}
              >
                <CardContent>
                  <Stack direction='row' spacing={1} sx={{ mb: 2 }}>
                    <Chip
                      label={report.status}
                      color={STATUS_COLORS[report.status]}
                      size='small'
                    />
                    <Chip
                      label={report.priority}
                      color={PRIORITY_COLORS[report.priority]}
                      size='small'
                    />
                  </Stack>

                  <Typography variant='h6' gutterBottom noWrap>
                    {report.category.replace(/_/g, ' ')}
                  </Typography>

                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {report.description}
                  </Typography>

                  {report.images && report.images.length > 0 && (
                    <Box
                      component='img'
                      src={report.images[0]}
                      alt='Report'
                      sx={{
                        width: '100%',
                        height: 150,
                        objectFit: 'cover',
                        borderRadius: 1,
                        mb: 2,
                      }}
                    />
                  )}

                  <Typography variant='caption' color='text.secondary'>
                    📍 {report.location.address}
                  </Typography>
                  <br />
                  <Typography variant='caption' color='text.secondary'>
                    📅{' '}
                    {format(new Date(report.createdAt), 'MMM dd, yyyy HH:mm')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
