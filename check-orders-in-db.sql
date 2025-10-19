-- Quick Database Check for Orders
-- Copy and paste this into MySQL Workbench

USE ccmart_db;

-- 1. Count total orders
SELECT COUNT(*) AS 'Total Orders in Database' FROM orders;

-- 2. Show all orders
SELECT 
    o.id AS 'Order ID',
    o.user_id AS 'User ID',
    u.name AS 'Customer Name',
    u.email AS 'Customer Email',
    o.status AS 'Status',
    o.total_amount AS 'Total Amount',
    o.delivery_address AS 'Delivery Address',
    o.created_at AS 'Created At'
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
ORDER BY o.created_at DESC;

-- 3. Show order items
SELECT 
    oi.id AS 'Item ID',
    oi.order_id AS 'Order ID',
    p.name AS 'Product Name',
    oi.quantity AS 'Quantity',
    oi.price AS 'Price',
    (oi.quantity * oi.price) AS 'Subtotal'
FROM order_items oi
LEFT JOIN products p ON oi.product_id = p.id
ORDER BY oi.order_id DESC;

-- 4. Count orders per user
SELECT 
    u.id AS 'User ID',
    u.name AS 'Name',
    u.email AS 'Email',
    u.role AS 'Role',
    COUNT(o.id) AS 'Number of Orders'
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name, u.email, u.role
ORDER BY COUNT(o.id) DESC;

-- 5. Check if orders table exists and structure
DESCRIBE orders;

-- 6. Check if order_items table exists and structure
DESCRIBE order_items;
