import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function ProductDetails() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Product Details
        </Typography>
        <Typography variant="body1">
          Product details page - Part of Member 2's Product Module.
        </Typography>
      </Box>
    </Container>
  );
}

export default ProductDetails;
