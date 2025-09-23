import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Link, 
  IconButton,
  Divider 
} from '@mui/material';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  LinkedIn,
  Email,
  Phone,
  LocationOn 
} from '@mui/icons-material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              C&C Mart
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Your neighborhood grocery store in Kurunegala. Fresh produce, 
              quality products, and excellent service since 2009.
            </Typography>
            <Box>
              <IconButton color="inherit" aria-label="Facebook">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <Instagram />
              </IconButton>
              <IconButton color="inherit" aria-label="LinkedIn">
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link href="/products" color="inherit" sx={{ mb: 1, textDecoration: 'none' }}>
                Fresh Groceries
              </Link>
              <Link href="/cart" color="inherit" sx={{ mb: 1, textDecoration: 'none' }}>
                Shopping Cart
              </Link>
              <Link href="/orders" color="inherit" sx={{ mb: 1, textDecoration: 'none' }}>
                Track Orders
              </Link>
              <Link href="/about" color="inherit" sx={{ mb: 1, textDecoration: 'none' }}>
                About Us
              </Link>
            </Box>
          </Grid>

          {/* Customer Service */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Customer Service
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link href="/contact" color="inherit" sx={{ mb: 1, textDecoration: 'none' }}>
                Contact Us
              </Link>
              <Link href="/delivery" color="inherit" sx={{ mb: 1, textDecoration: 'none' }}>
                Delivery Info
              </Link>
              <Link href="/returns" color="inherit" sx={{ mb: 1, textDecoration: 'none' }}>
                Returns Policy
              </Link>
              <Link href="/faq" color="inherit" sx={{ mb: 1, textDecoration: 'none' }}>
                FAQ
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Contact Info
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOn sx={{ mr: 1, fontSize: 'small' }} />
              <Typography variant="body2">
                Main Road, Kurunegala, Sri Lanka
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Phone sx={{ mr: 1, fontSize: 'small' }} />
              <Typography variant="body2">
                +94 37 222 3456
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Email sx={{ mr: 1, fontSize: 'small' }} />
              <Typography variant="body2">
                info@ccmart.lk
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="body2">
            © 2024 C&C Mart, Kurunegala. All rights reserved.
          </Typography>
          <Box>
            <Link href="#" color="inherit" sx={{ mr: 2, textDecoration: 'none' }}>
              Privacy Policy
            </Link>
            <Link href="#" color="inherit" sx={{ mr: 2, textDecoration: 'none' }}>
              Terms of Service
            </Link>
            <Link href="#" color="inherit" sx={{ textDecoration: 'none' }}>
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
