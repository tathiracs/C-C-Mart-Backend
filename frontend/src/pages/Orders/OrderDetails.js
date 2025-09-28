import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function OrderDetails() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Order Details
        </Typography>
        <Typography variant="body1">
          Order details page - Part of Member 3's Order Module.
        </Typography>
      </Box>
    </Container>
  );
}

export default OrderDetails;










