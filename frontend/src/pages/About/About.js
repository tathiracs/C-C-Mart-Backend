import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Store,
  EnergySavingsLeaf,
  LocalShipping,
  Group,
  Star,
  AccessTime,
  LocationOn,
  Phone,
} from '@mui/icons-material';

function About() {
  const milestones = [
    {
      year: '2009',
      title: 'C&C Mart Founded',
      description: 'Started as a small family grocery store on Main Road, Kurunegala',
    },
    {
      year: '2015',
      title: 'Expansion',
      description: 'Expanded our store and started home delivery service',
    },
    {
      year: '2020',
      title: 'Digital Transformation',
      description: 'Launched online shopping platform during pandemic',
    },
    {
      year: '2024',
      title: 'Modern E-commerce',
      description: 'Redesigned website with enhanced user experience and features',
    },
  ];

  const values = [
    {
      icon: <EnergySavingsLeaf color="primary" />,
      title: 'Fresh & Quality',
      description: 'We source fresh produce daily and maintain the highest quality standards.',
    },
    {
      icon: <Group color="primary" />,
      title: 'Community First',
      description: 'Serving the Kurunegala community with dedication and care.',
    },
    {
      icon: <Star color="primary" />,
      title: 'Customer Satisfaction',
      description: 'Your satisfaction is our priority. We go above and beyond.',
    },
    {
      icon: <AccessTime color="primary" />,
      title: 'Reliable Service',
      description: 'Consistent, timely service you can depend on every day.',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            About C&C Mart
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            Your trusted neighborhood grocery store since 2009
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: '800px', mx: 'auto', lineHeight: 1.8 }}>
            Located on Main Road in Kurunegala, C&C Mart has been serving the local community 
            with fresh groceries, quality products, and exceptional service for over 15 years. 
            What started as a small family business has grown into a modern grocery store 
            that combines traditional values with contemporary convenience.
          </Typography>
        </Box>

        {/* Our Story */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Our Story
          </Typography>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                C&C Mart was born from a simple vision: to provide the Kurunegala community 
                with access to fresh, quality groceries at affordable prices. Founded by 
                the Chandana family in 2009, we started with a small storefront and a 
                big dream to serve our neighbors.
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                Over the years, we have expanded our offerings, improved our services, 
                and embraced technology to better serve you. Today, we are proud to offer 
                both in-store shopping and online delivery, bringing fresh groceries 
                directly to your doorstep.
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                Despite our growth, we remain committed to our core values: quality, 
                freshness, community, and exceptional customer service.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://via.placeholder.com/500x350?text=CCMart+Store+Front"
                alt="CCMart Store"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Our Values */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Our Values
          </Typography>
          <Typography variant="body1" textAlign="center" sx={{ mb: 6, opacity: 0.8 }}>
            The principles that guide everything we do
          </Typography>
          
          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ mb: 2 }}>
                      {value.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Timeline */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Our Journey
          </Typography>
          <Typography variant="body1" textAlign="center" sx={{ mb: 6, opacity: 0.8 }}>
            Key milestones in our growth
          </Typography>
          
          <Grid container spacing={4}>
            {milestones.map((milestone, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    height: '100%',
                    position: 'relative',
                  }}
                >
                  <Chip
                    label={milestone.year}
                    color="primary"
                    sx={{ mb: 2, fontWeight: 'bold' }}
                  />
                  <Typography variant="h6" gutterBottom>
                    {milestone.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {milestone.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Location & Contact */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 6,
            bgcolor: 'primary.main',
            color: 'white',
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" gutterBottom>
                Visit Our Store
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                Come experience our fresh groceries and friendly service in person!
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn sx={{ mr: 2 }} />
                <Typography variant="body1">
                  Main Road, Kurunegala, Sri Lanka
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Phone sx={{ mr: 2 }} />
                <Typography variant="body1">
                  +94 37 222 3456
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTime sx={{ mr: 2 }} />
                <Typography variant="body1">
                  Open Daily: 7:00 AM - 9:00 PM
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: 3,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                }}
              >
                <Store sx={{ fontSize: 64, mb: 2 }} />
                <Typography variant="h6">
                  15+ Years
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Serving Kurunegala
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Team Section */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" component="h2" gutterBottom>
            Our Team
          </Typography>
          <Typography variant="body1" sx={{ mb: 6, opacity: 0.8 }}>
            The dedicated people behind C&C Mart's success
          </Typography>
          
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ textAlign: 'center', p: 3 }}>
                <Avatar
                  src="https://via.placeholder.com/100x100?text=Owner"
                  sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  Mr. Chandana Perera
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Founder & Owner
                </Typography>
                <Typography variant="body2">
                  Visionary leader committed to serving the community with quality groceries.
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ textAlign: 'center', p: 3 }}>
                <Avatar
                  src="https://via.placeholder.com/100x100?text=Manager"
                  sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  Mrs. Sanduni Fernando
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Store Manager
                </Typography>
                <Typography variant="body2">
                  Ensures smooth operations and maintains our high service standards.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default About;