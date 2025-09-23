import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function Profile() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          User Profile
        </Typography>
        <Typography variant="body1">
          User profile page - Part of Member 1's Customer Module (Login, Registration, Profile Management).
        </Typography>
      </Box>
    </Container>
  );
}

export default Profile;
