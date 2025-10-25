# Order Placement Diagnostic

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host " ORDER PLACEMENT DIAGNOSTIC" -ForegroundColor Cyan  
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check Backend
Write-Host "Checking Backend..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8081/api/products" -Method GET -TimeoutSec 3
    Write-Host "[OK] Backend is running on port 8081" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Backend not responding!" -ForegroundColor Red
}

# Check Frontend  
Write-Host "Checking Frontend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 3
    Write-Host "[OK] Frontend is running on port 3000" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Frontend not responding!" -ForegroundColor Red
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host " WHAT TO DO NEXT" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Open browser and go to: http://localhost:3000/orders" -ForegroundColor White
Write-Host ""
Write-Host "2. Press F12 to open Developer Tools" -ForegroundColor White
Write-Host ""
Write-Host "3. Click the 'Refresh' button on the page" -ForegroundColor White
Write-Host ""
Write-Host "4. Check the Console tab for messages" -ForegroundColor White
Write-Host ""
Write-Host "   Look for:" -ForegroundColor Yellow
Write-Host "   - Orders fetching messages" -ForegroundColor Gray
Write-Host "   - Any error messages in red" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Take a screenshot of the console and show me!" -ForegroundColor White
Write-Host ""
