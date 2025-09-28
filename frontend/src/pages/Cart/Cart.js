import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function Cart() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Shopping Cart
        </Typography>
        <Typography variant="body1">
          Shopping cart page - Part of Member 3's Order Module (Shopping Cart, Checkout Process, Order Tracking).
        </Typography>
      </Box>
    </Container>
  );
}

export default Cart;







