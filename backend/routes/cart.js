const express = require('express');
const { pool } = require('../config/database');
const { protect } = require('../middleware/auth');
const { validateCartItem, validateId } = require('../middleware/validation');

const router = express.Router();

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const [cartItems] = await pool.execute(
      `SELECT c.id, c.quantity, c.created_at, c.updated_at,
              p.id as product_id, p.name as product_name, p.description as product_description,
              p.price, p.image_url, p.stock_quantity, p.unit, p.is_active,
              cat.name as category_name
       FROM cart c
       LEFT JOIN products p ON c.product_id = p.id
       LEFT JOIN categories cat ON p.category_id = cat.id
       WHERE c.user_id = ? AND p.is_active = true
       ORDER BY c.created_at DESC`,
      [userId]
    );

    // Calculate totals
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      success: true,
      count: cartItems.length,
      total,
      itemCount,
      data: cartItems
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
router.post('/', protect, validateCartItem, async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity } = req.body;

    // Check if product exists and is active
    const [products] = await pool.execute(
      'SELECT id, name, price, stock_quantity FROM products WHERE id = ? AND is_active = true',
      [product_id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or inactive'
      });
    }

    const product = products[0];

    // Check stock availability
    if (product.stock_quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available: ${product.stock_quantity}`
      });
    }

    // Check if item already exists in cart
    const [existingItems] = await pool.execute(
      'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?',
      [userId, product_id]
    );

    if (existingItems.length > 0) {
      // Update existing item
      const newQuantity = existingItems[0].quantity + quantity;
      
      // Check total stock again
      if (product.stock_quantity < newQuantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock. Available: ${product.stock_quantity}, Requested: ${newQuantity}`
        });
      }

      await pool.execute(
        'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
        [newQuantity, userId, product_id]
      );

      res.json({
        success: true,
        message: 'Cart item updated successfully',
        data: {
          product_id,
          quantity: newQuantity,
          price: product.price,
          total: product.price * newQuantity
        }
      });
    } else {
      // Add new item
      await pool.execute(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, product_id, quantity]
      );

      res.status(201).json({
        success: true,
        message: 'Item added to cart successfully',
        data: {
          product_id,
          quantity,
          price: product.price,
          total: product.price * quantity
        }
      });
    }
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
router.put('/:id', protect, validateId, async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItemId = req.params.id;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Check if cart item exists and belongs to user
    const [cartItems] = await pool.execute(
      `SELECT c.id, c.product_id, c.quantity,
              p.name, p.price, p.stock_quantity, p.is_active
       FROM cart c
       LEFT JOIN products p ON c.product_id = p.id
       WHERE c.id = ? AND c.user_id = ?`,
      [cartItemId, userId]
    );

    if (cartItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    const cartItem = cartItems[0];

    if (!cartItem.is_active) {
      return res.status(400).json({
        success: false,
        message: 'Product is no longer available'
      });
    }

    // Check stock availability
    if (cartItem.stock_quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available: ${cartItem.stock_quantity}`
      });
    }

    // Update quantity
    await pool.execute(
      'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, cartItemId, userId]
    );

    res.json({
      success: true,
      message: 'Cart item updated successfully',
      data: {
        id: cartItemId,
        product_id: cartItem.product_id,
        quantity,
        price: cartItem.price,
        total: cartItem.price * quantity
      }
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
router.delete('/:id', protect, validateId, async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItemId = req.params.id;

    // Check if cart item exists and belongs to user
    const [cartItems] = await pool.execute(
      'SELECT id FROM cart WHERE id = ? AND user_id = ?',
      [cartItemId, userId]
    );

    if (cartItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    // Remove item
    await pool.execute(
      'DELETE FROM cart WHERE id = ? AND user_id = ?',
      [cartItemId, userId]
    );

    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
router.delete('/', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    await pool.execute(
      'DELETE FROM cart WHERE user_id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get cart summary
// @route   GET /api/cart/summary
// @access  Private
router.get('/summary', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const [summary] = await pool.execute(
      `SELECT 
         COUNT(*) as item_count,
         SUM(c.quantity) as total_quantity,
         SUM(c.quantity * p.price) as total_amount
       FROM cart c
       LEFT JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ? AND p.is_active = true`,
      [userId]
    );

    const result = summary[0] || {
      item_count: 0,
      total_quantity: 0,
      total_amount: 0
    };

    res.json({
      success: true,
      data: {
        itemCount: parseInt(result.item_count),
        totalQuantity: parseInt(result.total_quantity),
        totalAmount: parseFloat(result.total_amount) || 0
      }
    });
  } catch (error) {
    console.error('Get cart summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
