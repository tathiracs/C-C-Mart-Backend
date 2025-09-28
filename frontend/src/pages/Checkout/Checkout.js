import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function Checkout() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Checkout
        </Typography>
        <Typography variant="body1">
          Checkout page - Part of Member 3's Order Module.
        </Typography>
      </Box>
    </Container>
  );
}

export default Checkout;







