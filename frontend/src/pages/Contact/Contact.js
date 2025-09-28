import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Paper,
  Alert,
  Divider,
} from '@mui/material';
import {
  LocationOn,
  Phone,
  Email,
  AccessTime,
  Send,
  Store,
  LocalShipping,
  WhatsApp,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  subject: yup.string().required('Subject is required'),
  message: yup.string().required('Message is required'),
});

function Contact() {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    // Simulate form submission
    console.log('Contact form data:', data);
    setSubmitSuccess(true);
    reset();
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  const contactInfo = [
    {
      icon: <LocationOn color="primary" />,
      title: 'Store Location',
      content: 'Main Road, Kurunegala, Sri Lanka',
      description: 'Visit our physical store for the best shopping experience',
    },
    {
      icon: <Phone color="primary" />,
      title: 'Phone Number',
      content: '+94 37 222 3456',
      description: 'Call us for orders, inquiries, or support',
    },
    {
      icon: <Email color="primary" />,
      title: 'Email Address',
      content: 'info@ccmart.lk',
      description: 'Send us an email for detailed inquiries',
    },
    {
      icon: <AccessTime color="primary" />,
      title: 'Business Hours',
      content: '7:00 AM - 9:00 PM',
      description: 'Open daily, including weekends and holidays',
    },
  ];

  const services = [
    {
      icon: <Store color="primary" />,
      title: 'In-Store Shopping',
      description: 'Browse our fresh selection of groceries in person',
    },
    {
      icon: <LocalShipping color="primary" />,
      title: 'Home Delivery',
      description: 'Free delivery within Kurunegala for orders above Rs. 2,500',
    },
    {
      icon: <WhatsApp color="primary" />,
      title: 'WhatsApp Orders',
      description: 'Send your grocery list via WhatsApp: +94 77 123 4567',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Contact C&C Mart
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
            We're here to help with all your grocery needs
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: '600px', mx: 'auto' }}>
            Whether you have questions about our products, need assistance with your order, 
            or want to provide feedback, we'd love to hear from you.
          </Typography>
        </Box>

        {/* Contact Information Cards */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {contactInfo.map((info, index) => (
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
                    {info.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {info.title}
                  </Typography>
                  <Typography variant="body1" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {info.content}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {info.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Contact Form and Map */}
        <Grid container spacing={6} sx={{ mb: 8 }}>
          {/* Contact Form */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h4" gutterBottom>
                Send us a Message
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                Fill out the form below and we'll get back to you as soon as possible.
              </Typography>

              {submitSuccess && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Thank you for your message! We'll get back to you within 24 hours.
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register('name')}
                      fullWidth
                      label="Full Name"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register('email')}
                      fullWidth
                      label="Email Address"
                      type="email"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register('phone')}
                      fullWidth
                      label="Phone Number"
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register('subject')}
                      fullWidth
                      label="Subject"
                      error={!!errors.subject}
                      helperText={errors.subject?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...register('message')}
                      fullWidth
                      label="Message"
                      multiline
                      rows={4}
                      error={!!errors.message}
                      helperText={errors.message?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={<Send />}
                      fullWidth
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          {/* Location Map */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
              <Typography variant="h4" gutterBottom>
                Find Our Store
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                Located on Main Road, Kurunegala - easily accessible with parking available.
              </Typography>
              
              {/* Placeholder for map */}
              <Box
                sx={{
                  width: '100%',
                  height: '300px',
                  bgcolor: 'grey.200',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  [Interactive Map - Main Road, Kurunegala]
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                <strong>Landmarks:</strong> Near Kurunegala Clock Tower, opposite to People's Bank
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Services Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            How to Shop with Us
          </Typography>
          <Typography variant="body1" textAlign="center" sx={{ mb: 6, opacity: 0.8 }}>
            Multiple convenient ways to get your groceries
          </Typography>
          
          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    textAlign: 'center',
                    p: 4,
                    height: '100%',
                  }}
                >
                  <CardContent>
                    <Box sx={{ mb: 2 }}>
                      {service.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {service.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Emergency Contact */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            bgcolor: 'error.main',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" gutterBottom>
            Need Urgent Groceries?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            For urgent orders or same-day delivery, call us directly or WhatsApp
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="inherit"
              sx={{ color: 'error.main' }}
              startIcon={<Phone />}
            >
              Call: +94 37 222 3456
            </Button>
            <Button
              variant="contained"
              color="inherit"
              sx={{ color: 'success.main' }}
              startIcon={<WhatsApp />}
            >
              WhatsApp: +94 77 123 4567
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Contact;
