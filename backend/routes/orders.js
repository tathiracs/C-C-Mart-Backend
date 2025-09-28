const express = require('express');
const { pool } = require('../config/database');
const { protect, authorize } = require('../middleware/auth');
const { validateOrder, validateId, validatePagination } = require('../middleware/validation');

const router = express.Router();

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `CC${timestamp.slice(-6)}${random}`;
};

// @desc    Get all orders (Admin) or user's orders
// @route   GET /api/orders
// @access  Private
router.get('/', protect, validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status;
    const payment_status = req.query.payment_status;

    let whereClause = '';
    const queryParams = [];

    if (req.user.role === 'admin') {
      // Admin can see all orders
      whereClause = 'WHERE 1=1';
    } else {
      // Users can only see their own orders
      whereClause = 'WHERE o.user_id = ?';
      queryParams.push(req.user.id);
    }

    if (status) {
      whereClause += ' AND o.status = ?';
      queryParams.push(status);
    }

    if (payment_status) {
      whereClause += ' AND o.payment_status = ?';
      queryParams.push(payment_status);
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM orders o ${whereClause}`,
      queryParams
    );
    const total = countResult[0].total;

    // Get orders
    const [orders] = await pool.execute(
      `SELECT o.id, o.order_number, o.total_amount, o.status, o.payment_status, 
              o.payment_method, o.delivery_address, o.delivery_phone, o.delivery_notes,
              o.delivery_date, o.delivery_time, o.created_at,
              u.name as customer_name, u.email as customer_email
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       ${whereClause}
       ORDER BY o.created_at DESC
       LIMIT ${limit} OFFSET ${offset}`,
      queryParams
    );

    // Get order items for each order
    for (let order of orders) {
      const [items] = await pool.execute(
        `SELECT oi.id, oi.quantity, oi.price,
                p.name as product_name, p.image_url as product_image
         FROM order_items oi
         LEFT JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json({
      success: true,
      count: orders.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, validateId, async (req, res) => {
  try {
    const orderId = req.params.id;

    // Get order
    const [orders] = await pool.execute(
      `SELECT o.id, o.order_number, o.total_amount, o.status, o.payment_status, 
              o.payment_method, o.delivery_address, o.delivery_phone, o.delivery_notes,
              o.delivery_date, o.delivery_time, o.created_at, o.updated_at,
              u.name as customer_name, u.email as customer_email, u.phone as customer_phone
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       WHERE o.id = ?`,
      [orderId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orders[0];

    // Check if user can access this order
    if (req.user.role !== 'admin' && order.customer_email !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    // Get order items
    const [items] = await pool.execute(
      `SELECT oi.id, oi.quantity, oi.price,
              p.name as product_name, p.description as product_description, 
              p.image_url as product_image, p.unit
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?
       ORDER BY oi.id`,
      [orderId]
    );

    order.items = items;

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, validateOrder, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { items, delivery_address, delivery_phone, delivery_notes, delivery_date, delivery_time, payment_method } = req.body;
    const userId = req.user.id;

    // Validate all products exist and are active
    const productIds = items.map(item => item.product_id);
    const [products] = await connection.execute(
      `SELECT id, name, price, stock_quantity FROM products 
       WHERE id IN (${productIds.map(() => '?').join(',')}) AND is_active = true`,
      productIds
    );

    if (products.length !== productIds.length) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'One or more products not found or inactive'
      });
    }

    // Check stock availability and calculate total
    let totalAmount = 0;
    const productMap = {};
    products.forEach(product => {
      productMap[product.id] = product;
    });

    for (let item of items) {
      const product = productMap[item.product_id];
      if (product.stock_quantity < item.quantity) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock_quantity}`
        });
      }
      totalAmount += product.price * item.quantity;
    }

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create order
    const [orderResult] = await connection.execute(
      `INSERT INTO orders (user_id, order_number, total_amount, delivery_address, delivery_phone, 
                          delivery_notes, delivery_date, delivery_time, payment_method) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, orderNumber, totalAmount, delivery_address, delivery_phone, 
       delivery_notes || null, delivery_date || null, delivery_time || null, payment_method || 'cash_on_delivery']
    );

    const orderId = orderResult.insertId;

    // Create order items and update stock
    for (let item of items) {
      const product = productMap[item.product_id];
      
      // Insert order item
      await connection.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, product.price]
      );

      // Update product stock
      await connection.execute(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    await connection.commit();

    // Get created order with items
    const [newOrder] = await pool.execute(
      `SELECT o.id, o.order_number, o.total_amount, o.status, o.payment_status, 
              o.payment_method, o.delivery_address, o.delivery_phone, o.delivery_notes,
              o.delivery_date, o.delivery_time, o.created_at
       FROM orders o
       WHERE o.id = ?`,
      [orderId]
    );

    const [orderItems] = await pool.execute(
      `SELECT oi.id, oi.quantity, oi.price,
              p.name as product_name, p.image_url as product_image
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId]
    );

    newOrder[0].items = orderItems;

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder[0]
    });

  } catch (error) {
    await connection.rollback();
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  } finally {
    connection.release();
  }
});

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, authorize('admin'), validateId, async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status, payment_status } = req.body;

    // Validate status values
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
    const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status'
      });
    }

    if (payment_status && !validPaymentStatuses.includes(payment_status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status'
      });
    }

    // Check if order exists
    const [existingOrder] = await pool.execute(
      'SELECT id, status FROM orders WHERE id = ?',
      [orderId]
    );

    if (existingOrder.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Build update query
    const updates = [];
    const values = [];

    if (status) {
      updates.push('status = ?');
      values.push(status);
    }

    if (payment_status) {
      updates.push('payment_status = ?');
      values.push(payment_status);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    values.push(orderId);

    await pool.execute(
      `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Get updated order
    const [updatedOrder] = await pool.execute(
      `SELECT o.id, o.order_number, o.total_amount, o.status, o.payment_status, 
              o.payment_method, o.delivery_address, o.delivery_phone, o.delivery_notes,
              o.delivery_date, o.delivery_time, o.created_at, o.updated_at
       FROM orders o
       WHERE o.id = ?`,
      [orderId]
    );

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder[0]
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, validateId, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const orderId = req.params.id;

    // Check if order exists and belongs to user
    const [orders] = await connection.execute(
      'SELECT id, user_id, status FROM orders WHERE id = ?',
      [orderId]
    );

    if (orders.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orders[0];

    // Check if user can cancel this order
    if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
      await connection.rollback();
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled'].includes(order.status)) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled'
      });
    }

    // Get order items to restore stock
    const [orderItems] = await connection.execute(
      'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
      [orderId]
    );

    // Restore product stock
    for (let item of orderItems) {
      await connection.execute(
        'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Update order status
    await connection.execute(
      'UPDATE orders SET status = ?, payment_status = ? WHERE id = ?',
      ['cancelled', 'refunded', orderId]
    );

    await connection.commit();

    res.json({
      success: true,
      message: 'Order cancelled successfully'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  } finally {
    connection.release();
  }
});

module.exports = router;


