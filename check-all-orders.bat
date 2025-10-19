@echo off
echo ===================================
echo  Checking Orders in Database
echo ===================================
echo.

echo Total Orders:
echo --------------
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pRoot123@ ccmart_db -e "SELECT COUNT(*) as total_orders FROM orders;"

echo.
echo All Orders:
echo -----------
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pRoot123@ ccmart_db -e "SELECT id, user_id, status, total_amount, created_at FROM orders ORDER BY id;"

echo.
pause
