# Seed Sample Products Script
Write-Host "[SEED] Seeding Sample Products..." -ForegroundColor Green

# Step 1: Login as admin
Write-Host "`n[1] Logging in as admin..." -ForegroundColor Cyan
$loginBody = @{
    email = "admin@ccmart.com"
    password = "Admin@123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody
    
    $token = $loginResponse.token
    Write-Host "[OK] Login successful!" -ForegroundColor Green
    Write-Host "Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "[ERROR] Login failed: $_" -ForegroundColor Red
    exit 1
}

# Step 2: Seed sample products
Write-Host "`n[2] Adding sample products..." -ForegroundColor Cyan
try {
    $seedResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/products/seed-samples" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        }
    
    Write-Host "[OK] $seedResponse" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Seeding failed: $_" -ForegroundColor Red
    Write-Host "Error details: $($_.Exception.Response)" -ForegroundColor Red
    exit 1
}

# Step 3: Verify products were added
Write-Host "`n[3] Verifying products..." -ForegroundColor Cyan
try {
    $products = Invoke-RestMethod -Uri "http://localhost:8081/api/products"
    $activeProducts = $products | Where-Object { $_.isActive -eq $true }
    
    Write-Host "[OK] Total products in database: $($products.Count)" -ForegroundColor Green
    Write-Host "[OK] Active products: $($activeProducts.Count)" -ForegroundColor Green
    Write-Host "`n[PRODUCTS] Sample products:" -ForegroundColor Yellow
    $activeProducts | Select-Object -First 10 | ForEach-Object {
        $stockColor = if ($_.stockQuantity -gt 50) { "Green" } elseif ($_.stockQuantity -gt 20) { "Yellow" } else { "Red" }
        Write-Host "   - $($_.name) - Rs.$($_.price) - Stock: $($_.stockQuantity) $($_.unit)" -ForegroundColor $stockColor
    }
} catch {
    Write-Host "[WARN] Verification failed: $_" -ForegroundColor Yellow
}

Write-Host "`n[DONE] Refresh your browser to see the products." -ForegroundColor Green
Write-Host "[WEB] Visit: http://localhost:3000/products" -ForegroundColor Cyan
