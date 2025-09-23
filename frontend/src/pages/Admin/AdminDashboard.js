import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ShoppingCart,
  People,
  Inventory,
  TrendingUp,
  AttachMoney,
  LocalShipping,
  Add,
  Visibility,
  Edit,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { productsAPI, ordersAPI, usersAPI } from '../../services/api';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch products
      const productsResponse = await productsAPI.getProducts({ limit: 1000 });
      const products = productsResponse.data.data || [];
      
      // Fetch orders
      const ordersResponse = await ordersAPI.getOrders({ limit: 1000 });
      const orders = ordersResponse.data.data || [];
      
      // Fetch users
      const usersResponse = await usersAPI.getUsers({ limit: 1000 });
      const users = usersResponse.data.data || [];
      
      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
      
      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalRevenue: totalRevenue,
      });
      
      // Get recent orders (last 5)
      setRecentOrders(orders.slice(0, 5));
      
      // Get recent products (last 5)
      setRecentProducts(products.slice(0, 5));
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'preparing': return 'primary';
      case 'ready': return 'success';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome to C&C Mart Admin Panel - Manage your grocery store
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <Inventory />
                  </Avatar>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Total Products
                    </Typography>
                    <Typography variant="h4">
                      {stats.totalProducts}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate('/admin/products')}>
                  <Visibility sx={{ mr: 1 }} />
                  View All
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                    <ShoppingCart />
                  </Avatar>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Total Orders
                    </Typography>
                    <Typography variant="h4">
                      {stats.totalOrders}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate('/admin/orders')}>
                  <Visibility sx={{ mr: 1 }} />
                  View All
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                    <People />
                  </Avatar>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Total Users
                    </Typography>
                    <Typography variant="h4">
                      {stats.totalUsers}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate('/admin/users')}>
                  <Visibility sx={{ mr: 1 }} />
                  View All
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                    <AttachMoney />
                  </Avatar>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Total Revenue
                    </Typography>
                    <Typography variant="h4">
                      Rs. {stats.totalRevenue.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate('/admin/reports')}>
                  <TrendingUp sx={{ mr: 1 }} />
                  View Reports
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/admin/products')}
              >
                Add Product
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => navigate('/admin/products')}
              >
                Manage Products
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<LocalShipping />}
                onClick={() => navigate('/admin/orders')}
              >
                Manage Orders
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<People />}
                onClick={() => navigate('/admin/users')}
              >
                Manage Users
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Recent Orders and Products */}
        <Grid container spacing={3}>
          {/* Recent Orders */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Orders
              </Typography>
              {recentOrders.length > 0 ? (
                <List>
                  {recentOrders.map((order, index) => (
                    <React.Fragment key={order.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <ShoppingCart />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`Order #${order.order_number}`}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {order.customer_name} • Rs. {order.total_amount}
                              </Typography>
                              <Chip
                                label={order.status}
                                size="small"
                                color={getOrderStatusColor(order.status)}
                                sx={{ mt: 0.5 }}
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < recentOrders.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  No recent orders
                </Typography>
              )}
              <Box sx={{ mt: 2 }}>
                <Button
                  size="small"
                  onClick={() => navigate('/admin/orders')}
                >
                  View All Orders
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Recent Products */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Products
              </Typography>
              {recentProducts.length > 0 ? (
                <List>
                  {recentProducts.map((product, index) => (
                    <React.Fragment key={product.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar
                            src={product.image_url}
                            alt={product.name}
                            sx={{ bgcolor: 'grey.300' }}
                          >
                            <Inventory />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={product.name}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {product.category_name} • Rs. {product.price}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Stock: {product.stock_quantity} {product.unit}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < recentProducts.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  No products available
                </Typography>
              )}
              <Box sx={{ mt: 2 }}>
                <Button
                  size="small"
                  onClick={() => navigate('/admin/products')}
                >
                  View All Products
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default AdminDashboard;
