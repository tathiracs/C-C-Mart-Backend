# Fix Image Display - Add products with proper image URLs
Write-Host "[FIX] Fixing product images..." -ForegroundColor Green

# Login as admin
$loginBody = '{"email":"admin@ccmart.com","password":"Admin@123"}'
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$token = $loginResponse.token

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "[OK] Logged in" -ForegroundColor Green

# Update the milk product to have a proper image URL
Write-Host "[1] Updating milk product with image URL..." -ForegroundColor Cyan

$updateMilk = @{
    name = "Fresh Milk"
    description = "Full cream fresh milk - 1 liter"
    price = 280.00
    imageUrl = "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400"
    stockQuantity = 50
    unit = "liter"
    isFeatured = $true
    isActive = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8081/api/products/81" -Method PUT -Headers $headers -Body $updateMilk
    Write-Host "[OK] Updated milk product" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Failed to update: $($_.Exception.Message)" -ForegroundColor Red
}

# Activate all products
Write-Host "[2] Activating all products..." -ForegroundColor Cyan
try {
    $activateResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/products/fix-active" -Method POST -Headers $headers
    Write-Host "[OK] $activateResponse" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Failed to activate: $($_.Exception.Message)" -ForegroundColor Red
}

# Check results
Write-Host "[3] Verifying..." -ForegroundColor Cyan
$products = Invoke-RestMethod -Uri "http://localhost:8081/api/products"
$activeProducts = $products | Where-Object { $_.isActive -eq $true }

Write-Host "`nTotal products: $($products.Count)" -ForegroundColor White
Write-Host "Active products: $($activeProducts.Count)" -ForegroundColor Green
Write-Host "`nSample active products:" -ForegroundColor Yellow
$activeProducts | Select-Object -First 5 | ForEach-Object {
    $hasImage = if ($_.imageUrl -and $_.imageUrl.StartsWith("http")) { "[IMG]" } else { "[NO IMG]" }
    Write-Host "  $hasImage $($_.name) - Rs.$($_.price)" -ForegroundColor Cyan
}

Write-Host "`n[DONE] Refresh your browser (Ctrl+F5) to see the changes!" -ForegroundColor Green
Write-Host "Visit: http://localhost:3000/products" -ForegroundColor Cyan
