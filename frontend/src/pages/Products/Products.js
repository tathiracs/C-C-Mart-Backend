import React from 'react';
import {
  Container,
  Typography,
  Box,
} from '@mui/material';

function Products() {
  return (
    <Container maxWidth="lg">
      <Box
                  sx={{
                    display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          py: 4,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
                    sx={{
            mb: 2,
            color: 'text.secondary',
            fontWeight: 300,
          }}
        >
          Groceries
                        </Typography>
                      </Box>
    </Container>
  );
}

export default Products;