import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Grid,
  CircularProgress,
  Stack,
  Divider,
  ImageList,
  ImageListItem,
} from '@mui/material';
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

export default function ReportDetail() {
  const { id } = useParams();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const response = await api.get(`/reports/${id}`);
      setReport(response.data);
    } catch (error) {
      console.error('Failed to fetch report:', error);
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

  if (!report) {
    return (
      <Typography variant='h6' align='center'>
        Report not found
      </Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Paper sx={{ p: 3 }}>
        <Stack direction='row' spacing={2} sx={{ mb: 3 }}>
          <Chip label={report.status} color={STATUS_COLORS[report.status]} />
          <Chip
            label={report.priority}
            color={PRIORITY_COLORS[report.priority]}
          />
          <Chip label={report.category.replace(/_/g, ' ')} variant='outlined' />
        </Stack>

        <Typography variant='h4' gutterBottom>
          {report.category.replace(/_/g, ' ')}
        </Typography>

        <Typography variant='body2' color='text.secondary' gutterBottom>
          Report ID: {report.id}
        </Typography>
        <Typography variant='body2' color='text.secondary' gutterBottom>
          Submitted: {format(new Date(report.createdAt), 'MMM dd, yyyy HH:mm')}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant='h6' gutterBottom>
          Description
        </Typography>
        <Typography variant='body1' paragraph>
          {report.description}
        </Typography>

        {report.aiSummary && (
          <>
            <Typography variant='h6' gutterBottom>
              AI Summary
            </Typography>
            <Typography variant='body2' color='text.secondary' paragraph>
              {report.aiSummary}
            </Typography>
          </>
        )}

        {report.suggestedActions && report.suggestedActions.length > 0 && (
          <>
            <Typography variant='h6' gutterBottom>
              Suggested Actions
            </Typography>
            <ul>
              {report.suggestedActions.map((action: string, index: number) => (
                <li key={index}>
                  <Typography variant='body2'>{action}</Typography>
                </li>
              ))}
            </ul>
          </>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant='h6' gutterBottom>
          Location
        </Typography>
        <Typography variant='body2' gutterBottom>
          📍 {report.location.address}
        </Typography>
        <Typography variant='body2' color='text.secondary' gutterBottom>
          Coordinates: {report.location.lat.toFixed(6)},{' '}
          {report.location.lng.toFixed(6)}
        </Typography>

        {report.images && report.images.length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant='h6' gutterBottom>
              Photos
            </Typography>
            <ImageList cols={3} gap={8}>
              {report.images.map((img: string, index: number) => (
                <ImageListItem key={index}>
                  <img
                    src={img}
                    alt={`Report image ${index + 1}`}
                    loading='lazy'
                    style={{ borderRadius: 8 }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </>
        )}

        {report.potentialDuplicates &&
          report.potentialDuplicates.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant='h6' gutterBottom>
                Potential Duplicate Reports
              </Typography>
              <Typography variant='body2' color='warning.main'>
                ⚠️ This issue may be related to{' '}
                {report.potentialDuplicates.length} other report(s)
              </Typography>
            </>
          )}

        {report.notes && report.notes.length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant='h6' gutterBottom>
              Updates
            </Typography>
            {report.notes.map((note: any, index: number) => (
              <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                <Typography variant='body2'>{note.text}</Typography>
                <Typography variant='caption' color='text.secondary'>
                  {format(new Date(note.addedAt), 'MMM dd, yyyy HH:mm')}
                </Typography>
              </Paper>
            ))}
          </>
        )}
      </Paper>
    </Box>
  );
}
