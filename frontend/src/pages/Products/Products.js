import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { productsAPI, categoriesAPI } from '../../services/api';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

function Products() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching products from API...');
      const response = await productsAPI.getProducts();
      console.log('API Response:', response);
      console.log('Response data:', response.data);
      const productList = Array.isArray(response.data) 
        ? response.data 
        : response.data?.data || [];
      console.log('Product list:', productList);
      console.log('Product count:', productList.length);
      productList.forEach(p => console.log(`Product: ${p.name}, Image: ${p.imageUrl}, Active: ${p.isActive}`));
      const activeProducts = productList.filter(p => p.isActive !== false);
      console.log('Active products:', activeProducts.length);
      setProducts(activeProducts);
      setError('');
    } catch (err) {
      console.error('Failed to load products:', err);
      console.error('Error details:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories();
      const categoryList = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      setCategories(categoryList.filter(c => c.isActive !== false));
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleAddToCart = (product) => {
    try {
      if (!isAuthenticated) {
        toast.warning('Please log in to add items to your cart');
        navigate('/login', { state: { from: { pathname: '/products' } } });
        return;
      }
      addToCart(product, 1);
    } catch (err) {
      console.error('Failed to add to cart:', err);
      toast.error('Failed to add product to cart');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || 
                          (product.category && product.category.id === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh' }}>
      {/* Hero Banner */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
          color: 'white',
          py: 6,
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                mb: 2,
              }}
            >
              🛒 Our Products
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                opacity: 0.95,
                maxWidth: '700px',
                mx: 'auto',
                fontWeight: 400,
              }}
            >
              Discover fresh groceries, quality products, and amazing deals
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 6 }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            {error}
          </Alert>
        )}

        {/* Enhanced Search and Filter Section */}
        <Box 
          sx={{ 
            mb: 4,
            bgcolor: 'white',
            p: 3,
            borderRadius: 3,
            boxShadow: 2,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="🔍 Search for products, categories, or brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'primary.main' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  sx={{
                    borderRadius: 2,
                  }}
                >
                  <MenuItem value="">
                    <em>All Categories</em>
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          {/* Active Filters Display */}
          {(searchQuery || selectedCategory) && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Active Filters:
              </Typography>
              {searchQuery && (
                <Chip
                  label={`Search: "${searchQuery}"`}
                  onDelete={() => setSearchQuery('')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {selectedCategory && (
                <Chip
                  label={`Category: ${categories.find(c => c.id === selectedCategory)?.name || ''}`}
                  onDelete={() => setSelectedCategory('')}
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          )}
        </Box>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Box 
            textAlign="center" 
            py={10}
            sx={{
              bgcolor: 'white',
              borderRadius: 3,
              boxShadow: 1,
            }}
          >
            <Box sx={{ fontSize: '5rem', mb: 2 }}>
              {searchQuery || selectedCategory ? '🔍' : '📦'}
            </Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              {searchQuery || selectedCategory ? 'No Products Found' : 'No Products Available'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {searchQuery || selectedCategory 
                ? 'Try adjusting your search or filters to find what you\'re looking for.' 
                : 'Check back soon for new arrivals!'}
            </Typography>
            {(searchQuery || selectedCategory) && (
              <Button
                variant="contained"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                }}
                sx={{ borderRadius: 2 }}
              >
                Clear Filters
              </Button>
            )}
          </Box>
        ) : (
          <>
            {/* Results Header */}
            <Box 
              sx={{ 
                mb: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  color: 'text.primary',
                }}
              >
                ✨ Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              </Typography>
              <Chip
                label={`${filteredProducts.length} items`}
                color="primary"
                sx={{ fontWeight: 600 }}
              />
            </Box>

            {/* Enhanced Product Cards */}
            <Grid container spacing={3}>
              {filteredProducts.map((product, index) => (
                <Grid 
                  item 
                  xs={12} 
                  sm={6} 
                  md={4} 
                  lg={3} 
                  key={product.id}
                  sx={{
                    animation: 'fadeInUp 0.5s ease-out',
                    animationDelay: `${index * 0.05}s`,
                    animationFillMode: 'both',
                    '@keyframes fadeInUp': {
                      from: { opacity: 0, transform: 'translateY(20px)' },
                      to: { opacity: 1, transform: 'translateY(0)' },
                    },
                  }}
                >
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: 3,
                      overflow: 'hidden',
                      border: '1px solid',
                      borderColor: 'grey.200',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    {/* Product Image with Overlay */}
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="240"
                        image={product.imageUrl && product.imageUrl.trim() !== '' 
                          ? product.imageUrl 
                          : 'https://placehold.co/300x240/e0e0e0/666666?text=No+Image'}
                        alt={product.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/300x240/e0e0e0/666666?text=No+Image';
                        }}
                        sx={{ 
                          objectFit: 'contain',
                          backgroundColor: '#f8f8f8',
                          padding: 2,
                        }}
                      />
                      
                      {/* Stock Badge */}
                      {product.stockQuantity !== undefined && product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                        <Chip
                          label={`Only ${product.stockQuantity} left!`}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            bgcolor: 'warning.main',
                            color: 'white',
                            fontWeight: 'bold',
                            boxShadow: 2,
                          }}
                        />
                      )}
                      
                      {product.stockQuantity === 0 && (
                        <Chip
                          label="Out of Stock"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            bgcolor: 'error.main',
                            color: 'white',
                            fontWeight: 'bold',
                            boxShadow: 2,
                          }}
                        />
                      )}
                    </Box>

                    <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                      {/* Category Badge */}
                      {product.category && (
                        <Chip 
                          label={product.category.name} 
                          size="small"
                          sx={{
                            mb: 1.5,
                            bgcolor: 'primary.light',
                            color: 'primary.dark',
                            fontWeight: 600,
                          }}
                        />
                      )}
                      
                      {/* Product Name */}
                      <Typography 
                        gutterBottom 
                        variant="h6" 
                        component="h2"
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          mb: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {product.name}
                      </Typography>
                      
                      {/* Description */}
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.4,
                        }}
                      >
                        {product.description || 'Quality product at great value'}
                      </Typography>
                      
                      {/* Price */}
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                        <Typography 
                          variant="h5" 
                          color="primary" 
                          sx={{ fontWeight: 700 }}
                        >
                          Rs. {parseFloat(product.price).toFixed(2)}
                        </Typography>
                        {product.unit && (
                          <Typography variant="caption" color="text.secondary">
                            / {product.unit}
                          </Typography>
                        )}
                      </Box>
                    </CardContent>

                    {/* Action Button */}
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button 
                        variant="contained"
                        startIcon={<ShoppingCartIcon />}
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stockQuantity === 0}
                        fullWidth
                        sx={{
                          py: 1.2,
                          borderRadius: 2,
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: '0.95rem',
                          boxShadow: 2,
                          '&:hover': {
                            boxShadow: 4,
                          },
                        }}
                      >
                        {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
}

export default Products;