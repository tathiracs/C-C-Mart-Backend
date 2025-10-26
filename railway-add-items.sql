-- ============================================================
-- RAILWAY DATABASE: Add Order Items Script
-- ============================================================
-- Copy and paste this entire script into Railway MySQL Query tab
-- This will add items to orders #7, #8, and #9
-- ============================================================

-- Step 1: Verify orders exist (you should see 3 rows)
SELECT id, order_number, total_amount, status 
FROM orders 
WHERE id IN (7, 8, 9);

-- Step 2: Clear any existing items (safety measure)
DELETE FROM order_items WHERE order_id IN (7, 8, 9);

-- Step 3: Add items to Order #7 (Basidh Nizam - LKR 1,620)
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(7, 1, 2, 120.00),
(7, 6, 3, 280.00),
(7, 13, 2, 150.00),
(7, 17, 2, 120.00);

-- Step 4: Add items to Order #8 (Geesara adhithya - LKR 330)
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(8, 5, 1, 150.00),
(8, 17, 2, 90.00);
UPDATE orders SET total_amount = 330.00 WHERE id = 8;

-- Step 5: Add items to Order #9 (Tathira Samarakoon - LKR 2,450)
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(9, 4, 2, 180.00),
(9, 8, 2, 550.00),
(9, 6, 3, 280.00),
(9, 13, 1, 150.00);

-- Step 6: VERIFY - Check items were added correctly
SELECT 
    o.id AS 'Order ID',
    o.order_number AS 'Order #',
    u.name AS 'Customer',
    o.total_amount AS 'Total',
    COUNT(oi.id) AS 'Item Count'
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.id IN (7, 8, 9)
GROUP BY o.id, o.order_number, u.name, o.total_amount;

-- Step 7: View detailed items breakdown
SELECT 
    CONCAT('Order #', o.id) AS 'Order',
    p.name AS 'Product',
    oi.quantity AS 'Qty',
    CONCAT('LKR ', FORMAT(oi.price, 2)) AS 'Price',
    CONCAT('LKR ', FORMAT(oi.quantity * oi.price, 2)) AS 'Subtotal'
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
JOIN products p ON oi.product_id = p.id
WHERE o.id IN (7, 8, 9)
ORDER BY o.id, oi.id;

-- SUCCESS MESSAGE
SELECT '✅ Order items added successfully! Refresh your admin dashboard.' AS 'Status';
