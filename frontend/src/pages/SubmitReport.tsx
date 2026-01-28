import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  CircularProgress,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { useSnackbar } from 'notistack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import api from '../services/api';

const CATEGORIES = [
  'ROAD_DAMAGE',
  'SANITATION',
  'STREET_LIGHTS',
  'WATER_SUPPLY',
  'TRAFFIC',
  'PUBLIC_SAFETY',
  'PARKS',
  'OTHER',
];

export default function SubmitReport() {
  const { enqueueSnackbar } = useSnackbar();
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.slice(0, 5).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setImages((prev) => [...prev, base64]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    maxFiles: 5,
  });

  const getCurrentLocation = () => {
    setGettingLocation(true);
    if (!navigator.geolocation) {
      enqueueSnackbar('Geolocation is not supported', { variant: 'error' });
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        enqueueSnackbar('Location captured', { variant: 'success' });
        setGettingLocation(false);
      },
      (error) => {
        enqueueSnackbar('Failed to get location', { variant: 'error' });
        setGettingLocation(false);
      },
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!location) {
      enqueueSnackbar('Please add location', { variant: 'warning' });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/reports', {
        description,
        category: category || undefined,
        location,
        images: images.length > 0 ? images : undefined,
      });

      enqueueSnackbar('Report submitted successfully!', { variant: 'success' });

      // Reset form
      setDescription('');
      setCategory('');
      setLocation(null);
      setImages([]);

      // Show AI analysis
      if (response.data.report.aiSummary) {
        enqueueSnackbar(`AI Analysis: ${response.data.report.aiSummary}`, {
          variant: 'info',
          autoHideDuration: 5000,
        });
      }
    } catch (error: any) {
      enqueueSnackbar(
        error.response?.data?.error || 'Failed to submit report',
        {
          variant: 'error',
        },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant='h4' gutterBottom>
        Report a Civic Issue
      </Typography>
      <Typography variant='body2' color='text.secondary' paragraph>
        Help improve your community by reporting issues. Our AI will
        automatically categorize and prioritize your report.
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Box component='form' onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label='Description'
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Describe the issue in detail...'
            required
            helperText='Minimum 10 characters'
            sx={{ mb: 3 }}
          />

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Category (Optional - AI will suggest)</InputLabel>
            <Select
              value={category}
              label='Category (Optional - AI will suggest)'
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value=''>
                <em>Let AI decide</em>
              </MenuItem>
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat.replace(/_/g, ' ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mb: 3 }}>
            <Typography variant='subtitle2' gutterBottom>
              Location *
            </Typography>
            {location ? (
              <Chip
                icon={<LocationOnIcon />}
                label={`${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`}
                onDelete={() => setLocation(null)}
                color='primary'
              />
            ) : (
              <Button
                variant='outlined'
                startIcon={<LocationOnIcon />}
                onClick={getCurrentLocation}
                disabled={gettingLocation}
              >
                {gettingLocation
                  ? 'Getting Location...'
                  : 'Use Current Location'}
              </Button>
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant='subtitle2' gutterBottom>
              Photos (Optional, up to 5)
            </Typography>
            <Box
              {...getRootProps()}
              sx={{
                border: '2px dashed',
                borderColor: isDragActive ? 'primary.main' : 'grey.300',
                borderRadius: 1,
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: isDragActive ? 'action.hover' : 'background.paper',
              }}
            >
              <input {...getInputProps()} />
              <CloudUploadIcon
                sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }}
              />
              <Typography>
                {isDragActive
                  ? 'Drop images here'
                  : 'Drag & drop images here, or click to select'}
              </Typography>
            </Box>

            {images.length > 0 && (
              <Stack
                direction='row'
                spacing={1}
                sx={{ mt: 2, flexWrap: 'wrap' }}
              >
                {images.map((img, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 100,
                      height: 100,
                      position: 'relative',
                      mb: 1,
                    }}
                  >
                    <img
                      src={img}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 4,
                      }}
                    />
                    <Button
                      size='small'
                      onClick={() =>
                        setImages(images.filter((_, i) => i !== index))
                      }
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        minWidth: 'auto',
                        p: 0.5,
                      }}
                    >
                      ✕
                    </Button>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>

          <Button
            type='submit'
            variant='contained'
            size='large'
            fullWidth
            disabled={loading || !description || !location}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Report'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
