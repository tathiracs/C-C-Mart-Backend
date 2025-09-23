import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function AccountSettings() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Account Settings
        </Typography>
        <Typography variant="body1">
          Account settings page - Part of Member 1's Customer Module.
        </Typography>
      </Box>
    </Container>
  );
}

export default AccountSettings;
