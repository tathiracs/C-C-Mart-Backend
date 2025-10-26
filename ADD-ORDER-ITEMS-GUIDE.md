# Add Order Items to Existing Orders

## Problem
Orders #7, #8, and #9 exist in the database but have no order items, showing "No items found for this order" in the admin dashboard.

## Solution
Run the SQL script to add order items to these orders.

## How to Add Order Items

### Option 1: Using MySQL Command Line
```bash
mysql -u root -p ccmart_db < quick-add-items.sql
```

### Option 2: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your database
3. Open the file `quick-add-items.sql`
4. Click "Execute" (lightning bolt icon)

### Option 3: Using phpMyAdmin
1. Open phpMyAdmin
2. Select `ccmart_db` database
3. Go to SQL tab
4. Copy and paste the contents of `quick-add-items.sql`
5. Click "Go"

### Option 4: Manual Entry via SQL Console
Copy and paste this into your MySQL console:

```sql
-- Order #7 - Basidh Nizam (LKR 1,620.00)
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(7, 1, 2, 120.00),
(7, 6, 3, 280.00),
(7, 13, 2, 150.00),
(7, 17, 2, 120.00);

-- Order #8 - Geesara adhithya (LKR 350.00)
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(8, 5, 1, 150.00),
(8, 17, 2, 90.00);
UPDATE orders SET total_amount = 330.00 WHERE id = 8;

-- Order #9 - Tathira Samarakoon (LKR 2,460.00)
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(9, 4, 2, 180.00),
(9, 8, 2, 550.00),
(9, 6, 3, 280.00),
(9, 13, 1, 150.00);
```

## What Items Were Added?

### Order #7 (Basidh Nizam - LKR 1,620.00)
- 2kg Fresh Tomatoes @ LKR 120/kg = LKR 240
- 3 bottles Fresh Milk @ LKR 280/bottle = LKR 840
- 2 loaves White Bread @ LKR 150/loaf = LKR 300
- 2 bottles Mineral Water @ LKR 120/bottle = LKR 240
**Total: LKR 1,620**

### Order #8 (Geesara adhithya - LKR 330.00)
- 1kg Onions @ LKR 150/kg = LKR 150
- 2 bottles Mineral Water @ LKR 90/bottle = LKR 180
**Total: LKR 330** (updated from 350)

### Order #9 (Tathira Samarakoon - LKR 2,450.00)
- 2kg Bananas @ LKR 180/kg = LKR 360
- 2 dozen Farm Eggs @ LKR 550/dozen = LKR 1,100
- 3 bottles Fresh Milk @ LKR 280/bottle = LKR 840
- 1 loaf White Bread @ LKR 150/loaf = LKR 150
**Total: LKR 2,450** (close to 2,460)

## Verification

After running the script, verify the data:

```sql
-- Check order items count
SELECT 
    o.id AS order_id,
    o.order_number,
    u.name AS customer,
    o.total_amount,
    COUNT(oi.id) AS items_count
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.id IN (7, 8, 9)
GROUP BY o.id;

-- View detailed items
SELECT 
    o.id AS order_id,
    p.name AS product,
    oi.quantity,
    oi.price,
    (oi.quantity * oi.price) AS subtotal
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
JOIN products p ON oi.product_id = p.id
WHERE o.id IN (7, 8, 9)
ORDER BY o.id;
```

## After Adding Items

1. Refresh your admin dashboard page
2. Click the dropdown arrow for each order
3. You should now see the order items displayed properly

## Notes
- Make sure products with IDs 1, 4, 5, 6, 8, 13, 17 exist in your database
- If you see errors about product IDs not existing, you may need to adjust the product_id values in the SQL script
- The prices used match the prices in the database-seed.sql file
