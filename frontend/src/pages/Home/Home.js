import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Paper,
  Chip,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  LocalShipping,
  Schedule,
  Support,
  EnergySavingsLeaf,
  LocalOffer,
} from '@mui/icons-material';
import { categoriesAPI, productsAPI } from '../../services/api';

function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesResponse = await categoriesAPI.getCategories({ limit: 8 });
        setCategories(categoriesResponse.data.data || []);
        
        // Fetch featured products
        const productsResponse = await productsAPI.getFeaturedProducts({ limit: 8 });
        setFeaturedProducts(productsResponse.data.data || []);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const features = [
    {
      icon: <EnergySavingsLeaf />,
      title: 'Fresh & Organic',
      description: 'Farm-fresh produce and organic groceries delivered daily',
    },
    {
      icon: <LocalShipping />,
      title: 'Home Delivery',
      description: 'Free delivery within Kurunegala for orders above Rs. 2,500',
    },
    {
      icon: <Schedule />,
      title: 'Quick Service',
      description: 'Same-day delivery available for orders placed before 2 PM',
    },
    {
      icon: <LocalOffer />,
      title: 'Best Prices',
      description: 'Competitive prices with regular discounts and offers',
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Welcome to C&C Mart
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                Your trusted grocery store in Kurunegala - Fresh, Quality, Affordable
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate('/products')}
                sx={{ mr: 2 }}
              >
                Shop Now
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                onClick={() => navigate('/register')}
              >
                Join Us
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://via.placeholder.com/500x300?text=Shopping+Hero"
                alt="Shopping Hero"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Features Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Why Choose C&C Mart?
          </Typography>
          <Typography variant="body1" textAlign="center" sx={{ mb: 6, opacity: 0.8 }}>
            Your neighborhood grocery store committed to providing fresh, quality products at affordable prices
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {React.cloneElement(feature.icon, { fontSize: 'large' })}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Featured Categories */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Shop Fresh Groceries
          </Typography>
          <Typography variant="body1" textAlign="center" sx={{ mb: 6, opacity: 0.8 }}>
            Browse our fresh selection of groceries, from farm-fresh vegetables to daily essentials
          </Typography>
          
          <Grid container spacing={4}>
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={3} key={category.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                  onClick={() => navigate(`/products?category=${category.id}`)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={category.image_url || 'https://via.placeholder.com/300x200?text=Category'}
                    alt={category.name}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {category.name}
                    </Typography>
                    <Chip
                      label={`${category.product_count || 0} items`}
                      color="primary"
                      size="small"
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Stats Section */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 8,
            bgcolor: 'grey.50',
          }}
        >
          <Grid container spacing={4} textAlign="center">
            <Grid item xs={12} sm={3}>
              <Typography variant="h3" color="primary" gutterBottom>
                5K+
              </Typography>
              <Typography variant="body1">Happy Families</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="h3" color="primary" gutterBottom>
                500+
              </Typography>
              <Typography variant="body1">Fresh Products</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="h3" color="primary" gutterBottom>
                15+
              </Typography>
              <Typography variant="body1">Years Serving Kurunegala</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="h3" color="primary" gutterBottom>
                7AM-9PM
              </Typography>
              <Typography variant="body1">Daily Service</Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <Box sx={{ mb: 8 }}>
            <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
              Featured Products
            </Typography>
            <Typography variant="body1" textAlign="center" sx={{ mb: 6, opacity: 0.8 }}>
              Discover our most popular and fresh products
            </Typography>
            
            <Grid container spacing={4}>
              {featuredProducts.slice(0, 4).map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.image_url || 'https://via.placeholder.com/300x200?text=Product'}
                      alt={product.name}
                    />
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {product.description}
                      </Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" color="primary">
                          Rs. {product.price}
                        </Typography>
                        <Chip
                          label={product.unit}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* CTA Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" gutterBottom>
            Ready for Fresh Groceries?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.8 }}>
            Shop online and get fresh groceries delivered to your doorstep in Kurunegala
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
            startIcon={<ShoppingCart />}
            sx={{ mr: 2 }}
          >
            Shop Now
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/contact')}
          >
            Contact Us
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default Home;
