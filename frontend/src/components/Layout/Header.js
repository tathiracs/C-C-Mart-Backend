import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Container,
  Avatar,
} from '@mui/material';
import {
  ShoppingCart,
  AccountCircle,
  Store,
  Admin,
} from '@mui/icons-material';

import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';


function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };


  const isMenuOpen = Boolean(anchorEl);

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
        Profile
      </MenuItem>
      <MenuItem onClick={() => { navigate('/account'); handleMenuClose(); }}>
        Account Settings
      </MenuItem>
      <MenuItem onClick={() => { navigate('/orders'); handleMenuClose(); }}>
        My Orders
      </MenuItem>
  {user?.role?.toLowerCase() === 'admin' && (
        <MenuItem onClick={() => { navigate('/admin'); handleMenuClose(); }}>
          Admin Dashboard
        </MenuItem>
      )}
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  return (
    <AppBar position="static" sx={{ bgcolor: '#2e7d32' }}>
      <Container maxWidth="lg">
        <Toolbar>
          {/* Logo */}
          <IconButton
            component={RouterLink}
            to="/"
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
          >
            <Store />
          </IconButton>
          
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              mr: 4,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 'bold',
            }}
          >
            C&C Mart
          </Typography>

          {/* Navigation Links */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              component={RouterLink}
              to="/products"
              color="inherit"
              sx={{ mr: 2 }}
            >
              Groceries
            </Button>
            <Button
              component={RouterLink}
              to="/about"
              color="inherit"
              sx={{ mr: 2 }}
            >
              About
            </Button>
            <Button
              component={RouterLink}
              to="/contact"
              color="inherit"
              sx={{ mr: 2 }}
            >
              Contact
            </Button>
          </Box>

          {/* Cart Icon */}
          <IconButton
            component={RouterLink}
            to="/cart"
            size="large"
            color="inherit"
            sx={{ mr: 2 }}
          >
            <Badge 
              badgeContent={isAuthenticated ? itemCount : 0} 
              color="secondary"
              invisible={!isAuthenticated || itemCount === 0}
              max={99}
            >
              <ShoppingCart />
            </Badge>
          </IconButton>

          {/* User Menu */}
          {isAuthenticated ? (
            <Box>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="primary-search-account-menu"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                {user?.profileImage ? (
                  <Avatar src={user.profileImage} alt={user.name} />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
            </Box>
          ) : (
            <Box>
              <Button
                component={RouterLink}
                to="/login"
                color="inherit"
                sx={{ mr: 1 }}
              >
                Login
              </Button>
              <Button
                component={RouterLink}
                to="/register"
                color="inherit"
                variant="outlined"
              >
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
      {renderMenu}
    </AppBar>
  );
}

export default Header;
