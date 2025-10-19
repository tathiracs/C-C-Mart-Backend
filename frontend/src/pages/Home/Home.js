import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Paper,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  CircularProgress,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  LocalShipping,
  Schedule,
  Support,
  EnergySavingsLeaf,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { productsAPI } from '../../services/api';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await productsAPI.getProducts();
      const productList = Array.isArray(response.data) 
        ? response.data 
        : response.data?.data || [];
      
      // Get featured products or just the first 4 products
      const featured = productList
        .filter(p => p.isActive !== false)
        .filter(p => p.isFeatured === true)
        .slice(0, 4);
      
      // If no featured products, show first 4 active products
      if (featured.length === 0) {
        setFeaturedProducts(productList.filter(p => p.isActive !== false).slice(0, 4));
      } else {
        setFeaturedProducts(featured);
      }
    } catch (err) {
      console.error('Failed to load featured products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleAddToCart = (product) => {
    try {
      addToCart(product, 1);
    } catch (err) {
      console.error('Failed to add to cart:', err);
      toast.error('Failed to add product to cart');
    }
  };

  const features = [
    {
      icon: <EnergySavingsLeaf />,
      title: 'Quality Service',
      description: 'Providing excellent service and support to our customers',
    },
    {
      icon: <LocalShipping />,
      title: 'Fast Delivery',
      description: 'Quick and reliable delivery services in Kurunegala',
    },
    {
      icon: <Schedule />,
      title: 'Convenient Hours',
      description: 'Flexible service hours to accommodate your schedule',
    },
    {
      icon: <Support />,
      title: 'Customer Support',
      description: '24/7 customer support for all your needs',
    },
  ];

  return (
    <>
      {/* Enhanced Hero Section with Gradient */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
          color: 'white',
          py: 10,
          mb: 6,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box
                sx={{
                  animation: 'fadeInUp 0.8s ease-out',
                  '@keyframes fadeInUp': {
                    from: { opacity: 0, transform: 'translateY(30px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                  },
                }}
              >
                <Chip
                  label="🎉 Serving Kurunegala since 2009"
                  sx={{
                    mb: 2,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 'bold',
                    backdropFilter: 'blur(10px)',
                  }}
                />
                <Typography 
                  variant="h2" 
                  component="h1" 
                  gutterBottom
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                  }}
                >
                  Welcome to C&C Mart
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 4, 
                    opacity: 0.95,
                    fontWeight: 400,
                    lineHeight: 1.6,
                  }}
                >
                  Your trusted neighborhood grocery store offering quality products,
                  fast delivery, and exceptional service 🛒
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/products')}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      px: 4,
                      py: 1.5,
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                      '&:hover': {
                        bgcolor: '#f5f5f5',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    🛍️ Shop Now
                  </Button>
                  {!isAuthenticated && (
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/register')}
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        px: 4,
                        py: 1.5,
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        borderWidth: 2,
                        '&:hover': {
                          borderWidth: 2,
                          bgcolor: 'rgba(255,255,255,0.1)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Join Us Today
                    </Button>
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  justifyContent: 'center',
                  alignItems: 'center',
                  animation: 'float 3s ease-in-out infinite',
                  '@keyframes float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                  },
                }}
              >
                <Box
                  sx={{
                    fontSize: '15rem',
                    opacity: 0.9,
                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
                  }}
                >
                  🏪
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Enhanced Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              color: 'primary.main',
              mb: 2,
            }}
          >
            Why Choose C&C Mart? 🌟
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary',
              maxWidth: '700px',
              mx: 'auto',
              fontWeight: 400,
            }}
          >
            Your neighborhood store committed to excellence
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  border: '2px solid',
                  borderColor: 'transparent',
                  borderRadius: 3,
                  bgcolor: 'primary.main',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 12px 24px rgba(46, 125, 50, 0.3)',
                    borderColor: 'primary.dark',
                  },
                }}
              >
                <Box 
                  sx={{ 
                    mb: 2,
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {React.cloneElement(feature.icon, { 
                    fontSize: 'large',
                    sx: { fontSize: '2.5rem' }
                  })}
                </Box>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{ fontWeight: 700, mb: 1 }}
                >
                  {feature.title}
                </Typography>
                <Typography 
                  variant="body2"
                  sx={{ opacity: 0.95, lineHeight: 1.6 }}
                >
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container maxWidth="lg">

        {/* Enhanced Featured Products Section */}
        <Box sx={{ mb: 10 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                color: 'primary.main',
                mb: 2,
              }}
            >
              ⭐ Featured Products
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'text.secondary',
                maxWidth: '700px',
                mx: 'auto',
                fontWeight: 400,
              }}
            >
              Discover our handpicked selection of quality products
            </Typography>
          </Box>
          
          {loadingProducts ? (
            <Box display="flex" flexDirection="column" alignItems="center" py={8}>
              <CircularProgress size={60} sx={{ color: 'primary.main' }} />
              <Typography sx={{ mt: 2, color: 'text.secondary' }}>
                Loading amazing products...
              </Typography>
            </Box>
          ) : featuredProducts.length > 0 ? (
            <>
              <Grid container spacing={3}>
                {featuredProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={3} key={product.id}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        borderRadius: 3,
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'grey.200',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                          borderColor: 'primary.main',
                        },
                      }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                          alt={product.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                          }}
                          sx={{ 
                            objectFit: 'contain',
                            backgroundColor: '#f8f8f8',
                            padding: 2,
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)',
                            },
                          }}
                        />
                        {product.isFeatured && (
                          <Chip 
                            label="⭐ Featured" 
                            size="small" 
                            sx={{
                              position: 'absolute',
                              top: 12,
                              right: 12,
                              bgcolor: 'primary.main',
                              color: 'white',
                              fontWeight: 'bold',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            }}
                          />
                        )}
                      </Box>
                      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                        <Typography 
                          gutterBottom 
                          variant="h6" 
                          component="h3"
                          sx={{ 
                            fontSize: '1rem',
                            fontWeight: 600,
                            mb: 1,
                            transition: 'color 0.2s ease',
                          }}
                        >
                          {product.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                          <Typography 
                            variant="h5" 
                            color="primary" 
                            sx={{ fontWeight: 700 }}
                          >
                            Rs. {parseFloat(product.price).toFixed(2)}
                          </Typography>
                          {product.unit && (
                            <Typography variant="caption" color="text.secondary">
                              / {product.unit}
                            </Typography>
                          )}
                        </Box>
                      </CardContent>
                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button 
                          size="small" 
                          variant="contained"
                          startIcon={<ShoppingCartIcon />}
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stockQuantity === 0}
                          fullWidth
                          sx={{ 
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 2,
                            py: 1,
                          }}
                        >
                          {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Box textAlign="center" mt={6}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/products')}
                  sx={{
                    px: 5,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    borderRadius: 2,
                    boxShadow: '0 4px 14px rgba(46, 125, 50, 0.3)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(46, 125, 50, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  🛒 View All Products
                </Button>
              </Box>
            </>
          ) : (
            <Box textAlign="center" py={8}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                🏪 No products available yet
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Check back soon for exciting new arrivals!
              </Typography>
            </Box>
          )}
        </Box>

        {/* Stats Section - Eye-catching */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
            borderRadius: 4,
            p: 6,
            mb: 10,
            color: 'white',
            boxShadow: '0 10px 40px rgba(46, 125, 50, 0.3)',
          }}
        >
          <Typography 
            variant="h3" 
            textAlign="center" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              mb: 5,
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            📊 Our Success Story
          </Typography>
          <Grid container spacing={4} textAlign="center">
            <Grid item xs={6} md={3}>
              <Box
                sx={{
                  animation: 'pulse 2s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' },
                  },
                }}
              >
                <Typography 
                  variant="h2" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                  }}
                >
                  15+
                </Typography>
                <Typography 
                  variant="h6"
                  sx={{ 
                    opacity: 0.95,
                    fontWeight: 500,
                  }}
                >
                  Years of Service
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box
                sx={{
                  animation: 'pulse 2s ease-in-out 0.2s infinite',
                }}
              >
                <Typography 
                  variant="h2" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                  }}
                >
                  5K+
                </Typography>
                <Typography 
                  variant="h6"
                  sx={{ 
                    opacity: 0.95,
                    fontWeight: 500,
                  }}
                >
                  Happy Customers
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box
                sx={{
                  animation: 'pulse 2s ease-in-out 0.4s infinite',
                }}
              >
                <Typography 
                  variant="h2" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                  }}
                >
                  24/7
                </Typography>
                <Typography 
                  variant="h6"
                  sx={{ 
                    opacity: 0.95,
                    fontWeight: 500,
                  }}
                >
                  Customer Support
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box
                sx={{
                  animation: 'pulse 2s ease-in-out 0.6s infinite',
                }}
              >
                <Typography 
                  variant="h2" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                  }}
                >
                  100%
                </Typography>
                <Typography 
                  variant="h6"
                  sx={{ 
                    opacity: 0.95,
                    fontWeight: 500,
                  }}
                >
                  Satisfaction
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Enhanced Location Section */}
        <Grid container spacing={4} sx={{ mb: 10 }}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography 
                variant="h3" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  color: 'primary.main',
                  mb: 2,
                }}
              >
                📍 Visit Our Store
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'text.secondary',
                  mb: 4,
                  lineHeight: 1.6,
                }}
              >
                Come visit us at our convenient location in the heart of Kurunegala
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  🏪 Address
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Main Road, Kurunegala, Sri Lanka
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  📞 Phone
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  +94 37 222 3456
                </Typography>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  📧 Email
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  info@ccmart.lk
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/contact')}
                sx={{
                  alignSelf: 'flex-start',
                  px: 4,
                  py: 1.5,
                  fontWeight: 'bold',
                  borderRadius: 2,
                }}
              >
                Get Directions
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                height: '100%',
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'grey.50',
                minHeight: '400px',
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ fontSize: '8rem', mb: 2 }}>
                  🗺️
                </Box>
                <Typography variant="h6" color="text.secondary">
                  Interactive map coming soon!
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Enhanced CTA Section */}
        <Box
          sx={{
            textAlign: 'center',
            mb: 6,
            py: 8,
            px: 4,
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.1) 0%, rgba(27, 94, 32, 0.1) 100%)',
            border: '2px solid',
            borderColor: 'primary.light',
          }}
        >
          <Typography 
            variant="h3" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              color: 'primary.main',
              mb: 2,
            }}
          >
            Ready to Experience C&C Mart? 🚀
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4,
              color: 'text.secondary',
              maxWidth: '700px',
              mx: 'auto',
            }}
          >
            Join our community today and discover quality products, exceptional service, 
            and unbeatable convenience!
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/products')}
              sx={{
                px: 5,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 2,
                boxShadow: '0 4px 14px rgba(46, 125, 50, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(46, 125, 50, 0.4)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              🛒 Start Shopping
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/about')}
              sx={{
                px: 5,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 2,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Learn More
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default Home;