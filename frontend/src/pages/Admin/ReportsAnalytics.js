import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  ShoppingCart,
  People,
  Inventory,
  LocalShipping,
  Star,
} from '@mui/icons-material';
import { productsAPI, ordersAPI, usersAPI } from '../../services/api';

function ReportsAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    averageOrderValue: 0,
    topProducts: [],
    recentOrders: [],
    orderStatusDistribution: {},
    monthlyRevenue: [],
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch all data
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        productsAPI.getProducts(),
        ordersAPI.getOrders(),
        usersAPI.getUsers(),
      ]);

      const products = productsRes.data.data || [];
      const orders = ordersRes.data.data || [];
      const users = usersRes.data.data || [];

      // Calculate analytics
      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
      const totalOrders = orders.length;
      const totalUsers = users.length;
      const totalProducts = products.length;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Top products (mock data - in real app, you'd calculate from order items)
      const topProducts = products.slice(0, 5).map(product => ({
        ...product,
        sales: Math.floor(Math.random() * 100) + 10, // Mock sales data
      }));

      // Recent orders
      const recentOrders = orders.slice(0, 5);

      // Order status distribution
      const orderStatusDistribution = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});

      // Monthly revenue (mock data - in real app, you'd group by month)
      const monthlyRevenue = [
        { month: 'Jan', revenue: Math.floor(Math.random() * 50000) + 20000 },
        { month: 'Feb', revenue: Math.floor(Math.random() * 50000) + 20000 },
        { month: 'Mar', revenue: Math.floor(Math.random() * 50000) + 20000 },
        { month: 'Apr', revenue: Math.floor(Math.random() * 50000) + 20000 },
        { month: 'May', revenue: Math.floor(Math.random() * 50000) + 20000 },
        { month: 'Jun', revenue: Math.floor(Math.random() * 50000) + 20000 },
      ];

      setAnalytics({
        totalRevenue,
        totalOrders,
        totalUsers,
        totalProducts,
        averageOrderValue,
        topProducts,
        recentOrders,
        orderStatusDistribution,
        monthlyRevenue,
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
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
            Reports & Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive insights into your grocery store performance
          </Typography>
        </Box>

        {/* Key Metrics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                    <AttachMoney />
                  </Avatar>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Total Revenue
                    </Typography>
                    <Typography variant="h4">
                      Rs. {analytics.totalRevenue.toLocaleString()}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      <TrendingUp color="success" fontSize="small" />
                      <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                        +12.5%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <ShoppingCart />
                  </Avatar>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Total Orders
                    </Typography>
                    <Typography variant="h4">
                      {analytics.totalOrders}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      <TrendingUp color="success" fontSize="small" />
                      <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                        +8.2%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
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
                      {analytics.totalUsers}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      <TrendingUp color="success" fontSize="small" />
                      <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                        +15.3%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                    <Inventory />
                  </Avatar>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Avg Order Value
                    </Typography>
                    <Typography variant="h4">
                      Rs. {analytics.averageOrderValue.toFixed(0)}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      <TrendingDown color="error" fontSize="small" />
                      <Typography variant="body2" color="error.main" sx={{ ml: 0.5 }}>
                        -2.1%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts and Tables */}
        <Grid container spacing={3}>
          {/* Top Products */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Top Selling Products
              </Typography>
              <List>
                {analytics.topProducts.map((product, index) => (
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
                            <Box display="flex" alignItems="center" mt={0.5}>
                              <Star color="warning" fontSize="small" />
                              <Typography variant="body2" sx={{ ml: 0.5 }}>
                                {product.sales} sales
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < analytics.topProducts.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Order Status Distribution */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Order Status Distribution
              </Typography>
              <Box sx={{ mt: 2 }}>
                {Object.entries(analytics.orderStatusDistribution).map(([status, count]) => (
                  <Box key={status} sx={{ mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center">
                        <Chip
                          label={status}
                          color={getStatusColor(status)}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="body2">
                          {count} orders
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {((count / analytics.totalOrders) * 100).toFixed(1)}%
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Recent Orders */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Orders
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Order #</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analytics.recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>#{order.order_number}</TableCell>
                        <TableCell>{order.customer_name}</TableCell>
                        <TableCell>Rs. {order.total_amount}</TableCell>
                        <TableCell>
                          <Chip
                            label={order.status}
                            color={getStatusColor(order.status)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Monthly Revenue */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Monthly Revenue Trend
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Month</TableCell>
                      <TableCell>Revenue</TableCell>
                      <TableCell>Growth</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analytics.monthlyRevenue.map((month, index) => (
                      <TableRow key={month.month}>
                        <TableCell>{month.month}</TableCell>
                        <TableCell>Rs. {month.revenue.toLocaleString()}</TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            {index > 0 && month.revenue > analytics.monthlyRevenue[index - 1].revenue ? (
                              <>
                                <TrendingUp color="success" fontSize="small" />
                                <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                                  +{(((month.revenue - analytics.monthlyRevenue[index - 1].revenue) / analytics.monthlyRevenue[index - 1].revenue) * 100).toFixed(1)}%
                                </Typography>
                              </>
                            ) : index > 0 ? (
                              <>
                                <TrendingDown color="error" fontSize="small" />
                                <Typography variant="body2" color="error.main" sx={{ ml: 0.5 }}>
                                  -{(((analytics.monthlyRevenue[index - 1].revenue - month.revenue) / analytics.monthlyRevenue[index - 1].revenue) * 100).toFixed(1)}%
                                </Typography>
                              </>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                -
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default ReportsAnalytics;
