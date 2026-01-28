import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Container,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MapIcon from '@mui/icons-material/Map';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import GroupsIcon from '@mui/icons-material/Groups';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useAuthStore } from '../store/authStore';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <Container maxWidth='lg'>
      <Box sx={{ textAlign: 'center', my: 8 }}>
        <Typography variant='h2' component='h1' gutterBottom fontWeight='bold'>
          Welcome to CivicLens
        </Typography>
        <Typography variant='h5' color='text.secondary' paragraph>
          Real-Time Civic Issue Detection & Response Platform
        </Typography>
        <Typography
          variant='body1'
          color='text.secondary'
          sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}
        >
          Report civic issues in your community, track their status, and help
          local authorities respond faster. Powered by AI for smart
          categorization and efficient resolution.
        </Typography>

        <Box sx={{ mt: 4 }}>
          {user ? (
            <Button
              variant='contained'
              size='large'
              onClick={() => navigate('/submit')}
              sx={{ mr: 2 }}
            >
              Report an Issue
            </Button>
          ) : (
            <Button
              variant='contained'
              size='large'
              onClick={() => navigate('/register')}
              sx={{ mr: 2 }}
            >
              Get Started
            </Button>
          )}
          <Button
            variant='outlined'
            size='large'
            onClick={() => navigate('/reports')}
          >
            View Reports
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
            <ReportProblemIcon
              sx={{ fontSize: 60, color: 'primary.main', mb: 2 }}
            />
            <Typography variant='h6' gutterBottom>
              Easy Reporting
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Submit issues with photos, descriptions, and location. Our AI
              automatically categorizes and prioritizes reports.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
            <MapIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant='h6' gutterBottom>
              Smart Clustering
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Nearby similar issues are automatically grouped together, helping
              authorities address problems more efficiently.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
            <DashboardIcon
              sx={{ fontSize: 60, color: 'primary.main', mb: 2 }}
            />
            <Typography variant='h6' gutterBottom>
              Real-Time Tracking
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Track your reports in real-time and receive updates when
              authorities take action on civic issues.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box
        sx={{
          mt: 8,
          p: 4,
          bgcolor: 'primary.light',
          borderRadius: 2,
          color: 'white',
        }}
      >
        <Typography variant='h4' gutterBottom align='center'>
          How It Works
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={3}>
            <Typography variant='h6' gutterBottom>
              1. Report
            </Typography>
            <Typography variant='body2'>
              Citizens submit civic issues with photos and location
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant='h6' gutterBottom>
              2. AI Analysis
            </Typography>
            <Typography variant='body2'>
              Gemini AI categorizes and prioritizes issues automatically
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant='h6' gutterBottom>
              3. Authority Action
            </Typography>
            <Typography variant='body2'>
              Local authorities receive alerts and take action
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant='h6' gutterBottom>
              4. Resolution
            </Typography>
            <Typography variant='body2'>
              Issues are resolved and citizens receive updates
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Stats Section */}
      <Box sx={{ mt: 8, mb: 6 }}>
        <Typography variant='h4' gutterBottom align='center' fontWeight='bold'>
          Platform Capabilities
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                bgcolor: 'primary.light',
                color: 'white',
                textAlign: 'center',
                py: 2,
              }}
            >
              <CardContent>
                <AutoAwesomeIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant='h4' fontWeight='bold'>
                  AI-Powered
                </Typography>
                <Typography variant='body2'>Smart Analysis</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                bgcolor: 'success.light',
                color: 'white',
                textAlign: 'center',
                py: 2,
              }}
            >
              <CardContent>
                <SpeedIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant='h4' fontWeight='bold'>
                  Real-Time
                </Typography>
                <Typography variant='body2'>Instant Updates</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                bgcolor: 'warning.light',
                color: 'white',
                textAlign: 'center',
                py: 2,
              }}
            >
              <CardContent>
                <SecurityIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant='h4' fontWeight='bold'>
                  Secure
                </Typography>
                <Typography variant='body2'>Data Protected</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                bgcolor: 'info.light',
                color: 'white',
                textAlign: 'center',
                py: 2,
              }}
            >
              <CardContent>
                <TrendingUpIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant='h4' fontWeight='bold'>
                  Scalable
                </Typography>
                <Typography variant='body2'>Grows With You</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Key Features Section */}
      <Box sx={{ mt: 8, mb: 6 }}>
        <Typography variant='h4' gutterBottom align='center' fontWeight='bold'>
          Why Choose CivicLens?
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <GroupsIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant='h6' gutterBottom>
                Community-Driven
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Empower citizens to actively participate in improving their
                communities. Every report contributes to building better, more
                responsive cities.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip
                  label='Citizen Engagement'
                  size='small'
                  sx={{ mr: 1, mb: 1 }}
                />
                <Chip label='Transparency' size='small' sx={{ mr: 1, mb: 1 }} />
                <Chip label='Accountability' size='small' sx={{ mb: 1 }} />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <AutoAwesomeIcon
                sx={{ fontSize: 40, color: 'primary.main', mb: 2 }}
              />
              <Typography variant='h6' gutterBottom>
                Intelligent Automation
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Advanced AI analyzes text and images to automatically categorize
                issues, detect duplicates, and prioritize based on urgency and
                impact.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip
                  label='Auto-Categorization'
                  size='small'
                  sx={{ mr: 1, mb: 1 }}
                />
                <Chip
                  label='Priority Detection'
                  size='small'
                  sx={{ mr: 1, mb: 1 }}
                />
                <Chip label='Duplicate Removal' size='small' sx={{ mb: 1 }} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Issue Categories */}
      <Box sx={{ mt: 8, mb: 6, textAlign: 'center' }}>
        <Typography variant='h4' gutterBottom fontWeight='bold'>
          Report Categories
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ mb: 3 }}>
          We cover a wide range of civic issues
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <Chip label='🚧 Infrastructure' color='primary' />
          <Chip label='🚮 Sanitation' color='primary' />
          <Chip label='💡 Street Lighting' color='primary' />
          <Chip label='🚗 Traffic' color='primary' />
          <Chip label='🌳 Environment' color='primary' />
          <Chip label='🏛️ Public Services' color='primary' />
          <Chip label='⚠️ Safety' color='primary' />
          <Chip label='📋 Other' color='primary' />
        </Box>
      </Box>
    </Container>
  );
}
