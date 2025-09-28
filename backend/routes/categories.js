const express = require('express');
const { pool } = require('../config/database');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validateCategory, validateId, validatePagination } = require('../middleware/validation');

const router = express.Router();

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get('/', optionalAuth, validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const includeInactive = req.query.include_inactive === 'true';

    // Build WHERE clause
    let whereClause = '';
    if (!includeInactive) {
      whereClause = 'WHERE is_active = true';
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM categories WHERE is_active = true`
    );
    const total = countResult[0].total;

    // Get categories with product count
    const [categories] = await pool.execute(
      `SELECT c.id, c.name, c.description, c.image_url, c.is_active, c.created_at,
              (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.is_active = true) as product_count
       FROM categories c 
       WHERE c.is_active = true
       ORDER BY c.name ASC
       LIMIT ${limit} OFFSET ${offset}`
    );

    res.json({
      success: true,
      count: categories.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
router.get('/:id', optionalAuth, validateId, async (req, res) => {
  try {
    const categoryId = req.params.id;

    const [categories] = await pool.execute(
      `SELECT c.id, c.name, c.description, c.image_url, c.is_active, c.created_at,
              COUNT(p.id) as product_count
       FROM categories c 
       LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
       WHERE c.id = ?
       GROUP BY c.id, c.name, c.description, c.image_url, c.is_active, c.created_at`,
      [categoryId]
    );

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: categories[0]
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get products by category
// @route   GET /api/categories/:id/products
// @access  Public
router.get('/:id/products', optionalAuth, validateId, validatePagination, async (req, res) => {
  try {
    const categoryId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    const sort = req.query.sort || 'created_at';
    const order = req.query.order || 'DESC';

    // Check if category exists
    const [categories] = await pool.execute(
      'SELECT id, name FROM categories WHERE id = ? AND is_active = true',
      [categoryId]
    );

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Validate sort column
    const allowedSortColumns = ['name', 'price', 'created_at', 'stock_quantity'];
    const sortColumn = allowedSortColumns.includes(sort) ? sort : 'created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Get total count
    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM products WHERE category_id = ? AND is_active = true',
      [categoryId]
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
          c.name as category_name,
          c.id as category_id
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.category_id = ? AND p.is_active = true
       ORDER BY p.${sortColumn} ${sortOrder}
       LIMIT ${limit} OFFSET ${offset}`,
      [categoryId]
    );

    res.json({
      success: true,
      category: categories[0],
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: products.map((row) => {
        if (row.image_url) return row;
        const PRODUCT_IMAGE_MAP = {
          'Sugar': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80&auto=format&fit=crop',
          'Brown Sugar': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80&auto=format&fit=crop'
        };
        if (PRODUCT_IMAGE_MAP[row.name]) {
          row.image_url = PRODUCT_IMAGE_MAP[row.name];
          return row;
        }
        row.image_url = `https://picsum.photos/seed/${row.id}-${row.category_id || 0}/400/300`;
        return row;
      })
    });
  } catch (error) {
    console.error('Get category products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
router.post('/', protect, authorize('admin'), validateCategory, async (req, res) => {
  try {
    const { name, description, image_url } = req.body;

    // Check if category name already exists
    const [existingCategory] = await pool.execute(
      'SELECT id FROM categories WHERE name = ?',
      [name]
    );

    if (existingCategory.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    const [result] = await pool.execute(
      'INSERT INTO categories (name, description, image_url) VALUES (?, ?, ?)',
      [name, description || null, image_url || null]
    );

    // Get created category
    const [newCategory] = await pool.execute(
      'SELECT id, name, description, image_url, is_active, created_at FROM categories WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: newCategory[0]
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), validateId, validateCategory, async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, description, image_url, is_active } = req.body;

    // Check if category exists
    const [existingCategory] = await pool.execute(
      'SELECT id FROM categories WHERE id = ?',
      [categoryId]
    );

    if (existingCategory.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category name already exists (excluding current category)
    const [nameCheck] = await pool.execute(
      'SELECT id FROM categories WHERE name = ? AND id != ?',
      [name, categoryId]
    );

    if (nameCheck.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    await pool.execute(
      'UPDATE categories SET name = ?, description = ?, image_url = ?, is_active = ? WHERE id = ?',
      [name, description || null, image_url || null, is_active !== undefined ? is_active : true, categoryId]
    );

    // Get updated category
    const [updatedCategory] = await pool.execute(
      'SELECT id, name, description, image_url, is_active, created_at FROM categories WHERE id = ?',
      [categoryId]
    );

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory[0]
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), validateId, async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Check if category exists
    const [existingCategory] = await pool.execute(
      'SELECT id FROM categories WHERE id = ?',
      [categoryId]
    );

    if (existingCategory.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has products
    const [products] = await pool.execute(
      'SELECT COUNT(*) as count FROM products WHERE category_id = ? AND is_active = true',
      [categoryId]
    );

    if (products[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with active products. Please move or delete products first.'
      });
    }

    // Soft delete - set is_active to false
    await pool.execute(
      'UPDATE categories SET is_active = false WHERE id = ?',
      [categoryId]
    );

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
