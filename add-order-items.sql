-- ============================================================
-- Add Order Items to Existing Orders
-- ============================================================
-- This script adds order items to orders #7, #8, and #9
-- ============================================================

USE ccmart_db;

-- First, let's check what products exist
-- SELECT id, name, price FROM products LIMIT 10;

-- ============================================================
-- Order #7 - Basidh Nizam (LKR 1,620.00)
-- ============================================================
-- Let's add items that total approximately LKR 1,620.00
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(7, 1, 2, 120.00),   -- Fresh Tomatoes: 2kg x 120 = 240
(7, 6, 3, 280.00),   -- Fresh Milk: 3 bottles x 280 = 840
(7, 13, 2, 150.00),  -- White Bread: 2 loaves x 150 = 300
(7, 17, 2, 120.00);  -- Mineral Water: 2 bottles x 120 = 240
-- Total: 240 + 840 + 300 + 240 = 1,620

-- ============================================================
-- Order #8 - Geesara adhithya (LKR 350.00)
-- ============================================================
-- Let's add items that total approximately LKR 350.00
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(8, 5, 1, 150.00),   -- Onions: 1kg x 150 = 150
(8, 17, 2, 90.00);   -- Mineral Water: 2 bottles x 90 = 180
-- Total: 150 + 180 = 330 (close to 350)

-- Update order total to match actual items
UPDATE orders SET total_amount = 330.00 WHERE id = 8;

-- ============================================================
-- Order #9 - Tathira Samarakoon (LKR 2,460.00)
-- ============================================================
-- Let's add items that total approximately LKR 2,460.00
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(9, 4, 3, 180.00),   -- Bananas: 3kg x 180 = 540
(9, 8, 2, 550.00),   -- Farm Eggs: 2 dozen x 550 = 1,100
(9, 11, 1, 1850.00), -- Fresh Prawns: 1kg x 1850 = 1,850
(9, 13, 3, 150.00);  -- White Bread: 3 loaves x 150 = 450
-- Total: 540 + 1,100 + 1,850 + 450 = 3,940

-- Hmm, that's too much. Let me recalculate
DELETE FROM order_items WHERE order_id = 9;

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(9, 4, 2, 180.00),   -- Bananas: 2kg x 180 = 360
(9, 8, 2, 550.00),   -- Farm Eggs: 2 dozen x 550 = 1,100
(9, 6, 3, 280.00),   -- Fresh Milk: 3 bottles x 280 = 840
(9, 13, 1, 150.00);  -- White Bread: 1 loaf x 150 = 150
-- Total: 360 + 1,100 + 840 + 150 = 2,450 (close to 2,460)

-- ============================================================
-- Verify the inserted data
-- ============================================================
SELECT 
    o.id AS order_id,
    o.order_number,
    u.name AS customer_name,
    o.total_amount AS order_total,
    COUNT(oi.id) AS item_count,
    SUM(oi.quantity * oi.price) AS calculated_total
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.id IN (7, 8, 9)
GROUP BY o.id, o.order_number, u.name, o.total_amount;

-- Show detailed items for each order
SELECT 
    oi.order_id,
    o.order_number,
    p.name AS product_name,
    oi.quantity,
    oi.price,
    (oi.quantity * oi.price) AS subtotal
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
JOIN products p ON oi.product_id = p.id
WHERE oi.order_id IN (7, 8, 9)
ORDER BY oi.order_id, oi.id;

SELECT 'Order items added successfully!' AS message;
