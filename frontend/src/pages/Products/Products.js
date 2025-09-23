import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Pagination,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search,
  FilterList,
  ExpandMore,
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Star,
  Sort,
  ViewList,
  ViewModule,
  Clear,
} from '@mui/icons-material';
import { productsAPI, categoriesAPI } from '../../services/api';
import { toast } from 'react-toastify';

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name');
  const [viewMode, setViewMode] = useState('grid');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 12;

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, selectedCategory, priceRange, sortBy]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories();
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: productsPerPage,
        search: searchTerm,
        category: selectedCategory,
        min_price: priceRange[0],
        max_price: priceRange[1],
        sort: sortBy,
      };

      const response = await productsAPI.getProducts(params);
      const data = response.data;
      
      setProducts(data.data || []);
      setTotalPages(Math.ceil(data.total / productsPerPage));
      setTotalProducts(data.total);
      
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    updateURL({ search: value, page: 1 });
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCurrentPage(1);
    updateURL({ category: value, page: 1 });
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
    updateURL({ sort: value, page: 1 });
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    updateURL({ page });
  };

  const updateURL = (params) => {
    const newSearchParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });
    setSearchParams(newSearchParams);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange([0, 1000]);
    setSortBy('name');
    setCurrentPage(1);
    setSearchParams({});
  };

  const getSortOptions = () => [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'name_desc', label: 'Name (Z-A)' },
    { value: 'price', label: 'Price (Low to High)' },
    { value: 'price_desc', label: 'Price (High to Low)' },
    { value: 'created_at', label: 'Newest First' },
    { value: 'popularity', label: 'Most Popular' },
  ];

  const getMaxPrice = () => {
    return Math.max(...products.map(p => parseFloat(p.price) || 0), 1000);
  };

  if (loading && products.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Products
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover our wide selection of fresh groceries and daily essentials
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          {/* Search */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleSearch('')} size="small">
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Category Filter */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Sort */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                label="Sort By"
              >
                {getSortOptions().map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* View Mode */}
          <Grid item xs={12} md={2}>
            <Box display="flex" justifyContent="flex-end">
              <Tooltip title="Grid View">
                <IconButton
                  onClick={() => setViewMode('grid')}
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                >
                  <ViewModule />
                </IconButton>
              </Tooltip>
              <Tooltip title="List View">
                <IconButton
                  onClick={() => setViewMode('list')}
                  color={viewMode === 'list' ? 'primary' : 'default'}
                >
                  <ViewList />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>

        {/* Advanced Filters */}
        <Accordion sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box display="flex" alignItems="center">
              <FilterList sx={{ mr: 1 }} />
              <Typography>Advanced Filters</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography gutterBottom>Price Range: Rs. {priceRange[0]} - Rs. {priceRange[1]}</Typography>
                <Slider
                  value={priceRange}
                  onChange={handlePriceChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={getMaxPrice()}
                  step={10}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  variant="outlined"
                  startIcon={<Clear />}
                  onClick={clearFilters}
                  fullWidth
                >
                  Clear All Filters
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Paper>

      {/* Results Summary */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Showing {products.length} of {totalProducts} products
          {searchTerm && ` for "${searchTerm}"`}
          {selectedCategory && ` in ${categories.find(c => c.id == selectedCategory)?.name}`}
        </Typography>
        <Box display="flex" gap={1}>
          {searchTerm && (
            <Chip
              label={`Search: ${searchTerm}`}
              onDelete={() => handleSearch('')}
              color="primary"
              variant="outlined"
            />
          )}
          {selectedCategory && (
            <Chip
              label={`Category: ${categories.find(c => c.id == selectedCategory)?.name}`}
              onDelete={() => handleCategoryChange('')}
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Products Grid/List */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : products.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary">
            No products found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria or filters
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={viewMode === 'grid' ? 4 : 12} key={product.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: viewMode === 'list' ? 'row' : 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height={viewMode === 'list' ? 150 : 200}
                    width={viewMode === 'list' ? 200 : 'auto'}
                    image={product.image_url || 'https://via.placeholder.com/300x200?text=Product'}
                    alt={product.name}
                    sx={{
                      objectFit: 'cover',
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {product.name}
                        </Typography>
                        <IconButton size="small" color="primary">
                          <FavoriteBorder />
                        </IconButton>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {product.description}
                      </Typography>
                      
                      <Box display="flex" alignItems="center" mb={1}>
                        <Star color="warning" fontSize="small" />
                        <Typography variant="body2" sx={{ ml: 0.5 }}>
                          4.5 (128 reviews)
                        </Typography>
                      </Box>
                      
                      <Chip
                        label={product.category_name}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                      
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          Rs. {product.price}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          per {product.unit}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" alignItems="center" mt={1}>
                        <Typography variant="body2" color="text.secondary">
                          Stock: {product.stock_quantity} {product.unit}
                        </Typography>
                        <Chip
                          label={product.stock_quantity > 10 ? 'In Stock' : 'Low Stock'}
                          size="small"
                          color={product.stock_quantity > 10 ? 'success' : 'warning'}
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    </CardContent>
                    
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        variant="contained"
                        startIcon={<ShoppingCart />}
                        fullWidth
                        disabled={product.stock_quantity === 0}
                      >
                        Add to Cart
                      </Button>
                    </CardActions>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
}

export default Products;