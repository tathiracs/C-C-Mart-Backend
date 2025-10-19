# Fix Onions Image
Write-Host "[FIX] Fixing onions images..." -ForegroundColor Green

# Login
$loginBody = '{"email":"admin@ccmart.com","password":"Admin@123"}'
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$token = $loginResponse.token

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Get onions products
$products = Invoke-RestMethod -Uri "http://localhost:8081/api/products"
$onionsProducts = $products | Where-Object { $_.name -like "*Onion*" }

# New working image URL for onions
$newImageUrl = "https://cdn.pixabay.com/photo/2016/08/11/08/43/potatoes-1585060_640.jpg"

foreach ($onion in $onionsProducts) {
    Write-Host "Updating: $($onion.name) (ID: $($onion.id))" -ForegroundColor Cyan
    
    $updateData = @{
        name = $onion.name
        description = $onion.description
        price = $onion.price
        categoryId = $onion.category.id
        unit = $onion.unit
        stockQuantity = $onion.stockQuantity
        isFeatured = $onion.isFeatured
        isActive = $onion.isActive
        imageUrl = "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=400&fit=crop"
    } | ConvertTo-Json
    
    try {
        Invoke-RestMethod -Uri "http://localhost:8081/api/products/$($onion.id)" -Method PUT -Headers $headers -Body $updateData | Out-Null
        Write-Host "  [OK] Updated successfully" -ForegroundColor Green
    } catch {
        Write-Host "  [ERROR] Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n[DONE] Onions images updated!" -ForegroundColor Green
Write-Host "Refresh browser (Ctrl+F5) to see changes" -ForegroundColor Cyan
