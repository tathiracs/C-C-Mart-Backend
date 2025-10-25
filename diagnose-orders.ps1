# Simple Order Diagnostic Tool

Write-Host "`n===================================" -ForegroundColor Cyan
Write-Host "   ORDER PLACEMENT DIAGNOSTIC" -ForegroundColor Cyan  
Write-Host "===================================`n" -ForegroundColor Cyan

Write-Host "STEP 1: Check if Backend is Running" -ForegroundColor Yellow
Write-Host "--------------------------------------"
try {
    $backendTest = Invoke-WebRequest -Uri "http://localhost:8081/api/products" -UseBasicParsing -TimeoutSec 5
    Write-Host "✓ Backend is RUNNING on port 8081" -ForegroundColor Green
} catch {
    Write-Host "✗ Backend is NOT responding!" -ForegroundColor Red
    Write-Host "  Please check the 'java' terminal" -ForegroundColor Yellow
}

Write-Host "`nSTEP 2: Check Frontend" -ForegroundColor Yellow
Write-Host "--------------------------------------"
try {
    $frontendTest = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
    Write-Host "✓ Frontend is RUNNING on port 3000" -ForegroundColor Green
} catch {
    Write-Host "✗ Frontend is NOT responding!" -ForegroundColor Red
    Write-Host "  Please check the 'node' terminal" -ForegroundColor Yellow
}

Write-Host "`nSTEP 3: What to Check in Browser Console" -ForegroundColor Yellow
Write-Host "--------------------------------------"
Write-Host "1. Open http://localhost:3000/orders" -ForegroundColor White
Write-Host "2. Press F12 to open Developer Tools" -ForegroundColor White
Write-Host "3. Go to Console tab" -ForegroundColor White
Write-Host "4. Click the 'Refresh' button" -ForegroundColor White
Write-Host "5. Look for these messages:" -ForegroundColor White
Write-Host ""
Write-Host "   Expected messages:" -ForegroundColor Green
Write-Host "   📋 Fetching orders..." -ForegroundColor Gray
Write-Host "   📋 Orders API response: {...}" -ForegroundColor Gray
Write-Host "   📋 Number of orders: X" -ForegroundColor Gray
Write-Host ""
Write-Host "   If you see error messages:" -ForegroundColor Red
Write-Host "   ❌ Error fetching orders: {...}" -ForegroundColor Gray
Write-Host "   Then copy the error and tell me what it says!" -ForegroundColor Yellow

Write-Host "`nSTEP 4: Database Check (Manual)" -ForegroundColor Yellow
Write-Host "--------------------------------------"
Write-Host "Open MySQL Workbench and run:" -ForegroundColor White
Write-Host @"

USE ccmart_db;

-- Check if orders table exists and has data
SELECT COUNT(*) AS total_orders FROM orders;

-- Show recent orders
SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;

-- Show order items
SELECT 
    o.id as order_id,
    o.status,
    o.total_amount,
    p.name as product_name,
    oi.quantity,
    oi.price
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.id
ORDER BY o.created_at DESC
LIMIT 10;

"@ -ForegroundColor Cyan

Write-Host "`nSTEP 5: Test Order Creation via API" -ForegroundColor Yellow
Write-Host "--------------------------------------"
Write-Host "We need to test if the POST /api/orders endpoint works" -ForegroundColor White
Write-Host "Check the browser console when you click 'Place Order'" -ForegroundColor White
Write-Host ""
Write-Host "Look for:" -ForegroundColor Green
Write-Host "  📦 Submitting order: {...}" -ForegroundColor Gray
Write-Host "  ✅ Order created successfully: {...}" -ForegroundColor Gray
Write-Host ""
Write-Host "If you see:" -ForegroundColor Red
Write-Host "  ❌ Error creating order: {...}" -ForegroundColor Gray
Write-Host "  Then there's a problem with order creation!" -ForegroundColor Yellow

Write-Host "`n===================================`n" -ForegroundColor Cyan

Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Refresh the /orders page and check console" -ForegroundColor White
Write-Host "2. Copy any error messages you see" -ForegroundColor White
Write-Host "3. Check MySQL to see if orders are in database" -ForegroundColor White
Write-Host ""
