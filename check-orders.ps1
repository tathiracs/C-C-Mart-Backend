# Check Orders in Database
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   Checking Orders in Database" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"

if (Test-Path $mysqlPath) {
    Write-Host "Connecting to MySQL database..." -ForegroundColor Yellow
    
    # Query to check orders
    $query = @"
USE ccmart_db;
SELECT 
    o.id AS 'Order ID',
    o.user_id AS 'User ID',
    u.name AS 'Customer Name',
    o.status AS 'Status',
    o.total_amount AS 'Total',
    o.delivery_address AS 'Address',
    o.created_at AS 'Created At'
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
ORDER BY o.created_at DESC
LIMIT 10;
"@

    Write-Host "`nExecuting query..." -ForegroundColor Yellow
    $query | & $mysqlPath -u root -pRoot123@ --table
    
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "   Order Items Details" -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan
    
    $itemsQuery = @"
USE ccmart_db;
SELECT 
    oi.order_id AS 'Order ID',
    p.name AS 'Product',
    oi.quantity AS 'Qty',
    oi.price AS 'Price',
    (oi.quantity * oi.price) AS 'Subtotal'
FROM order_items oi
LEFT JOIN products p ON oi.product_id = p.id
ORDER BY oi.order_id DESC
LIMIT 20;
"@
    
    $itemsQuery | & $mysqlPath -u root -pRoot123@ --table
    
} else {
    Write-Host "MySQL not found at expected location!" -ForegroundColor Red
    Write-Host "Please run this query manually in MySQL Workbench:" -ForegroundColor Yellow
    Write-Host @"
    
USE ccmart_db;

-- Check orders
SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;

-- Check order items
SELECT * FROM order_items ORDER BY order_id DESC LIMIT 20;

"@ -ForegroundColor Green
}

Write-Host "`nPress any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
