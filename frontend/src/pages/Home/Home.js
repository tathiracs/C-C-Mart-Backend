import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  LocalShipping,
  Schedule,
  Support,
  EnergySavingsLeaf,
} from '@mui/icons-material';

function Home() {
  const navigate = useNavigate();

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
                Your trusted neighborhood store in Kurunegala since 2009
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate('/about')}
                sx={{ mr: 2 }}
              >
                Learn More
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
                src="https://via.placeholder.com/500x300?text=C%26C+Mart+Store"
                alt="C&C Mart Store"
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
            Your neighborhood store committed to providing excellent service and value
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

        {/* About Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            About C&C Mart
          </Typography>
          <Typography variant="body1" textAlign="center" sx={{ mb: 6, opacity: 0.8, maxWidth: '800px', mx: 'auto' }}>
            Established in 2009, C&C Mart has been serving the Kurunegala community with dedication and commitment. 
            We pride ourselves on being your trusted neighborhood store, providing quality service and building 
            lasting relationships with our customers.
          </Typography>
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
                15+
              </Typography>
              <Typography variant="body1">Years of Service</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="h3" color="primary" gutterBottom>
                5K+
              </Typography>
              <Typography variant="body1">Happy Customers</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="h3" color="primary" gutterBottom>
                24/7
              </Typography>
              <Typography variant="body1">Customer Support</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="h3" color="primary" gutterBottom>
                100%
              </Typography>
              <Typography variant="body1">Satisfaction Guarantee</Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Location Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Visit Our Store
          </Typography>
          <Typography variant="body1" textAlign="center" sx={{ mb: 4, opacity: 0.8 }}>
            Come visit us at our convenient location in the heart of Kurunegala
          </Typography>
          <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              📍 Main Road, Kurunegala, Sri Lanka
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              📞 Phone: +94 37 222 3456
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              📧 Email: info@ccmart.lk
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/contact')}
            >
              Get Directions
            </Button>
          </Paper>
        </Box>

        {/* CTA Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" gutterBottom>
            Ready to Experience C&C Mart?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.8 }}>
            Join our community and discover what makes us special
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/about')}
            sx={{ mr: 2 }}
          >
            Learn More
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