import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Container,
  Tooltip,
} from '@mui/material';
import {
  Dashboard,
  Person,
  Logout,
  Quiz,
  Leaderboard,
  Category,
  Home,
} from '@mui/icons-material';
import { logout } from '../../redux/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    handleMenuClose();
  };

  const menuItems = [
    { label: 'Home', path: '/', icon: <Home /> },
    { label: 'Categories', path: '/categories', icon: <Category /> },
    { label: 'Leaderboard', path: '/leaderboard', icon: <Leaderboard /> },
  ];

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: { xs: 1, md: 0 },
              mr: 4,
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Quiz sx={{ mr: 1 }} />
            QuizMaster
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {menuItems.map((item) => (
              <Button
                key={item.label}
                component={Link}
                to={item.path}
                sx={{ color: 'text.primary' }}
                startIcon={item.icon}
              >
                {item.label}
              </Button>
            ))}
            {isAuthenticated && (
              <Button
                component={Link}
                to="/dashboard"
                sx={{ color: 'text.primary' }}
                startIcon={<Dashboard />}
              >
                Dashboard
              </Button>
            )}
          </Box>

          {/* User Menu */}
          {isAuthenticated ? (
            <Box>
              <Tooltip title="Account menu">
                <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                  <Person sx={{ mr: 1 }} /> Profile
                </MenuItem>
                <MenuItem component={Link} to="/dashboard" onClick={handleMenuClose}>
                  <Dashboard sx={{ mr: 1 }} /> Dashboard
                </MenuItem>
                {user?.role === 'admin' && (
                  <MenuItem component={Link} to="/admin" onClick={handleMenuClose}>
                    <Dashboard sx={{ mr: 1 }} /> Admin Panel
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box>
              <Button component={Link} to="/login" color="primary" variant="outlined" sx={{ mr: 1 }}>
                Login
              </Button>
              <Button component={Link} to="/register" color="primary" variant="contained">
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;