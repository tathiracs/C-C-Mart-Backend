# Test the backend API directly
Write-Host "Testing /api/orders/all endpoint..." -ForegroundColor Green

# First, login to get token
Write-Host "`nStep 1: Logging in as admin..." -ForegroundColor Yellow
$loginBody = @{
    email = "admin@ccmart.lk"
    password = "Admin123@"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "✅ Login successful! Token: $($token.Substring(0,20))..." -ForegroundColor Green
    
    # Now get all orders
    Write-Host "`nStep 2: Fetching all orders..." -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $ordersResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/orders/all" -Method GET -Headers $headers
    
    Write-Host "`n============================================" -ForegroundColor Cyan
    Write-Host "TOTAL ORDERS RETURNED: $($ordersResponse.Count)" -ForegroundColor Green
    Write-Host "============================================`n" -ForegroundColor Cyan
    
    Write-Host "Order Details:" -ForegroundColor Yellow
    foreach ($order in $ordersResponse) {
        Write-Host "  Order #$($order.id) | User ID: $($order.user.id) | User: $($order.user.name) | Status: $($order.status) | Total: $($order.totalAmount)" -ForegroundColor White
    }
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
}
