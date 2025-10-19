@echo off
echo ===================================
echo   Checking Orders in Database
echo ===================================
echo.

"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pRoot123@ -e "USE ccmart_db; SELECT COUNT(*) AS 'Total Orders' FROM orders;"
echo.

echo Recent Orders:
echo ---------------
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pRoot123@ -e "USE ccmart_db; SELECT o.id, o.user_id, u.name AS customer, o.status, o.total_amount, o.created_at FROM orders o LEFT JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC LIMIT 10;" --table

echo.
echo Order Items:
echo ------------
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pRoot123@ -e "USE ccmart_db; SELECT oi.order_id, p.name AS product, oi.quantity, oi.price FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id ORDER BY oi.order_id DESC LIMIT 15;" --table

echo.
pause
