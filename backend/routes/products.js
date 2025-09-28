const express = require('express');
const { pool } = require('../config/database');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validateProduct, validateId, validatePagination } = require('../middleware/validation');

const router = express.Router();

// Curated image map to ensure relevant fallbacks by product name
const PRODUCT_IMAGE_MAP = {
  'Sugar': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80&auto=format&fit=crop',
  'Brown Sugar': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80&auto=format&fit=crop',
  'Cooking Oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80&auto=format&fit=crop',
  'Fresh Carrots': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&q=80&auto=format&fit=crop',
  'Fresh Tomatoes': 'https://images.unsplash.com/photo-1546470427-5c9d2a73ee3b?w=800&q=80&auto=format&fit=crop',
  'Fresh Milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&q=80&auto=format&fit=crop',
  'Fresh Eggs': 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d3?w=800&q=80&auto=format&fit=crop',
  'Basmati Rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80&auto=format&fit=crop',
  'Cookies': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80&auto=format&fit=crop'
};

function withImageFallback(row) {
  if (row.image_url) return row;
  const nameMatch = PRODUCT_IMAGE_MAP[row.name];
  if (nameMatch) {
    row.image_url = nameMatch;
    return row;
  }
  // Category-based stable placeholder
  const categoryId = row.category_id || 0;
  row.image_url = `https://picsum.photos/seed/${row.id}-${categoryId}/400/300`;
  return row;
}

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get('/', optionalAuth, validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    const category = req.query.category;
    const search = req.query.search;
    const featured = req.query.featured;
    const stock = req.query.stock;
    const minPrice = parseFloat(req.query.min_price) || 0;
    const maxPrice = parseFloat(req.query.max_price) || 999999;
    const sort = req.query.sort || 'name';
    const order = req.query.order || 'ASC';

    // Build WHERE clause
    let whereClause = 'WHERE p.is_active = true';
    const queryParams = [];

    if (category) {
      whereClause += ' AND p.category_id = ?';
      queryParams.push(category);
    }

    if (search) {
      whereClause += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    if (featured === 'true') {
      whereClause += ' AND p.is_featured = true';
    }

    // Stock status filter
    if (stock) {
      switch (stock) {
        case 'in_stock':
          whereClause += ' AND p.stock_quantity > 10';
          break;
        case 'low_stock':
          whereClause += ' AND p.stock_quantity > 0 AND p.stock_quantity <= 10';
          break;
        case 'out_of_stock':
          whereClause += ' AND p.stock_quantity = 0';
          break;
      }
    }

    // Price range filter
    if (minPrice > 0 || maxPrice < 999999) {
      whereClause += ' AND p.price BETWEEN ? AND ?';
      queryParams.push(minPrice, maxPrice);
    }

    // Enhanced sorting options
    let sortClause = 'ORDER BY ';
    switch (sort) {
      case 'name':
        sortClause += 'p.name ASC';
        break;
      case 'name_desc':
        sortClause += 'p.name DESC';
        break;
      case 'price':
        sortClause += 'p.price ASC';
        break;
      case 'price_desc':
        sortClause += 'p.price DESC';
        break;
      case 'created_at':
        sortClause += 'p.created_at DESC';
        break;
      case 'popularity':
        sortClause += 'p.stock_quantity DESC, p.created_at DESC';
        break;
      default:
        sortClause += 'p.name ASC';
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       ${whereClause}`,
      queryParams
    );
    const total = countResult[0].total;

    // Get products
    const [products] = await pool.execute(
      `SELECT 
          p.id,
          p.name,
          p.description,
          p.price,
          p.image_url,
          p.stock_quantity,
          p.unit,
          p.is_featured,
          p.created_at,
          c.name AS category_name,
          c.id AS category_id
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       ${whereClause}
        ${sortClause}
       LIMIT ${limit} OFFSET ${offset}`,
      queryParams
    );

    res.json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: products.map(withImageFallback)
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', optionalAuth, validateId, async (req, res) => {
  try {
    const productId = req.params.id;

    const [products] = await pool.execute(
      `SELECT p.id, p.name, p.description, p.price, p.image_url, 
              p.stock_quantity, p.unit, p.is_featured, p.created_at,
              c.name as category_name, c.id as category_id, c.description as category_description
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ? AND p.is_active = true`,
      [productId]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: products[0]
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, authorize('admin'), validateProduct, async (req, res) => {
  try {
    const { name, description, price, category_id, image_url, stock_quantity, unit, is_featured } = req.body;

    // Check if category exists
    const [categories] = await pool.execute(
      'SELECT id FROM categories WHERE id = ? AND is_active = true',
      [category_id]
    );

    if (categories.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Category not found'
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, unit, is_featured) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, price, category_id, image_url || null, stock_quantity || 0, unit || 'piece', is_featured || false]
    );

    // Get created product
    const [newProduct] = await pool.execute(
      `SELECT p.id, p.name, p.description, p.price, p.image_url, 
              p.stock_quantity, p.unit, p.is_featured, p.created_at,
              c.name as category_name, c.id as category_id
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct[0]
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), validateId, validateProduct, async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, price, category_id, image_url, stock_quantity, unit, is_featured, is_active } = req.body;

    // Check if product exists
    const [existingProduct] = await pool.execute(
      'SELECT id FROM products WHERE id = ?',
      [productId]
    );

    if (existingProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if category exists
    const [categories] = await pool.execute(
      'SELECT id FROM categories WHERE id = ? AND is_active = true',
      [category_id]
    );

    if (categories.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Category not found'
      });
    }

    await pool.execute(
      `UPDATE products SET 
       name = ?, description = ?, price = ?, category_id = ?, image_url = ?, 
       stock_quantity = ?, unit = ?, is_featured = ?, is_active = ?
       WHERE id = ?`,
      [name, description, price, category_id, image_url || null, stock_quantity || 0, 
       unit || 'piece', is_featured || false, is_active !== undefined ? is_active : true, productId]
    );

    // Get updated product
    const [updatedProduct] = await pool.execute(
      `SELECT p.id, p.name, p.description, p.price, p.image_url, 
              p.stock_quantity, p.unit, p.is_featured, p.is_active, p.created_at,
              c.name as category_name, c.id as category_id
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`,
      [productId]
    );

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct[0]
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), validateId, async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if product exists
    const [existingProduct] = await pool.execute(
      'SELECT id FROM products WHERE id = ?',
      [productId]
    );

    if (existingProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Soft delete - set is_active to false
    await pool.execute(
      'UPDATE products SET is_active = false WHERE id = ?',
      [productId]
    );

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
router.get('/featured', optionalAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const [products] = await pool.execute(
      `SELECT 
          p.id,
          p.name,
          p.description,
          p.price,
          p.image_url,
          p.stock_quantity,
          p.unit,
          p.is_featured,
          p.created_at,
          c.name as category_name,
          c.id as category_id
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.is_active = true AND p.is_featured = true
       ORDER BY p.created_at DESC
       LIMIT ${limit}`
    );

    res.json({
      success: true,
      count: products.length,
      data: products.map(withImageFallback)
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
