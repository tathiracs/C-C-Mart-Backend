-- Quick Add Order Items for Orders #7, #8, #9
-- Run this in your MySQL/database console

-- Order #7 - Basidh Nizam (LKR 1,620.00)
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(7, 1, 2, 120.00),   -- Fresh Tomatoes
(7, 6, 3, 280.00),   -- Fresh Milk
(7, 13, 2, 150.00),  -- White Bread
(7, 17, 2, 120.00);  -- Mineral Water

-- Order #8 - Geesara adhithya (LKR 350.00)
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(8, 5, 1, 150.00),   -- Onions
(8, 17, 2, 90.00);   -- Mineral Water
UPDATE orders SET total_amount = 330.00 WHERE id = 8;

-- Order #9 - Tathira Samarakoon (LKR 2,460.00)
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(9, 4, 2, 180.00),   -- Bananas
(9, 8, 2, 550.00),   -- Farm Eggs
(9, 6, 3, 280.00),   -- Fresh Milk
(9, 13, 1, 150.00);  -- White Bread
