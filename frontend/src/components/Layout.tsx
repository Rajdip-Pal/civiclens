import { Outlet, Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { useState } from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAuthStore } from '../store/authStore';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useSnackbar } from 'notistack';

export default function Layout() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      enqueueSnackbar('Logged out successfully', { variant: 'success' });
      navigate('/');
      handleClose();
    } catch (error) {
      enqueueSnackbar('Logout failed', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position='static'>
        <Toolbar>
          <Typography
            variant='h6'
            component={Link}
            to='/'
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
          >
            🏙️ CivicLens
          </Typography>

          <Button color='inherit' component={Link} to='/reports'>
            View Reports
          </Button>

          {user ? (
            <>
              <Button color='inherit' component={Link} to='/submit'>
                Submit Report
              </Button>
              <Button color='inherit' component={Link} to='/dashboard'>
                Dashboard
              </Button>
              <IconButton size='large' onClick={handleMenu} color='inherit'>
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem disabled>{user.email}</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color='inherit' component={Link} to='/login'>
                Login
              </Button>
              <Button color='inherit' component={Link} to='/register'>
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container component='main' sx={{ flex: 1, py: 4 }}>
        <Outlet />
      </Container>

      <Box
        component='footer'
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) => theme.palette.grey[200],
        }}
      >
        <Container maxWidth='lg'>
          <Typography variant='body2' color='text.secondary' align='center'>
            © {new Date().getFullYear()} CivicLens - Empowering Communities
            Technologies
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
