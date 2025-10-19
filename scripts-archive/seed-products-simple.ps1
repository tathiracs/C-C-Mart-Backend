# Simple Seed Script for Sample Products
Write-Host "[SEED] Adding sample products to database..." -ForegroundColor Green

# Login
$loginBody = '{"email":"admin@ccmart.com","password":"Admin@123"}'
Write-Host "[1] Logging in..." -ForegroundColor Cyan

$loginResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$token = $loginResponse.token

Write-Host "[OK] Logged in successfully" -ForegroundColor Green

# Seed products
Write-Host "[2] Seeding sample products..." -ForegroundColor Cyan

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8081/api/products/seed-samples" -Method POST -Headers $headers
    Write-Host "[OK] $response" -ForegroundColor Green
} catch {
    $errorMessage = $_.Exception.Message
    Write-Host "[ERROR] Failed: $errorMessage" -ForegroundColor Red
    
    # Try to get more details
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Yellow
    }
}

# Verify
Write-Host "[3] Checking products..." -ForegroundColor Cyan
$products = Invoke-RestMethod -Uri "http://localhost:8081/api/products"
$activeProducts = $products | Where-Object { $_.isActive -eq $true }

Write-Host "`nTotal products: $($products.Count)" -ForegroundColor White
Write-Host "Active products: $($activeProducts.Count)" -ForegroundColor Green

Write-Host "`nFirst 10 products:" -ForegroundColor Yellow
$activeProducts | Select-Object -First 10 | ForEach-Object {
    Write-Host "  - $($_.name) | Rs.$($_.price) | Stock: $($_.stockQuantity)" -ForegroundColor Cyan
}

Write-Host "`n[DONE] Refresh your browser to see all products!" -ForegroundColor Green
