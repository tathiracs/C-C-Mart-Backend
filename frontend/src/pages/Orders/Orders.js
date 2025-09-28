import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function Orders() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Orders
        </Typography>
        <Typography variant="body1">
          Orders listing page - Part of Member 3's Order Module.
        </Typography>
      </Box>
    </Container>
  );
}

export default Orders;







