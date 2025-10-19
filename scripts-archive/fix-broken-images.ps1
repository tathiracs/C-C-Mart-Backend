# Fix Missing Images - Update products with broken image URLs
Write-Host "[FIX] Fixing missing product images..." -ForegroundColor Green

# Login as admin
$loginBody = '{"email":"admin@ccmart.com","password":"Admin@123"}'
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$token = $loginResponse.token

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "[OK] Logged in" -ForegroundColor Green

# Get all products
$products = Invoke-RestMethod -Uri "http://localhost:8081/api/products"

# Function to update product
function Update-ProductImage {
    param($productId, $name, $newImageUrl)
    
    $product = $products | Where-Object { $_.id -eq $productId }
    if (!$product) {
        Write-Host "  x Product not found: $name" -ForegroundColor Red
        return 0
    }
    
    $updateData = @{
        name = $product.name
        description = $product.description
        price = $product.price
        categoryId = $product.category.id
        unit = $product.unit
        stockQuantity = $product.stockQuantity
        isFeatured = $product.isFeatured
        isActive = $true
        imageUrl = $newImageUrl
    } | ConvertTo-Json
    
    try {
        Invoke-RestMethod -Uri "http://localhost:8081/api/products/$productId" -Method PUT -Headers $headers -Body $updateData | Out-Null
        Write-Host "  + Fixed: $name" -ForegroundColor Green
        return 1
    } catch {
        Write-Host "  x Failed: $name" -ForegroundColor Red
        return 0
    }
}

# Find products by name and update their images
Write-Host "`nFixing product images..." -ForegroundColor Cyan

$fixed = 0

# Fix each product with a better image URL
foreach ($product in $products) {
    $newImageUrl = ""
    
    switch -Wildcard ($product.name) {
        "*Apple*" { $newImageUrl = "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=500" }
        "*Banana*" { $newImageUrl = "https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=500" }
        "*Orange*" { $newImageUrl = "https://images.pexels.com/photos/161559/background-bitter-breakfast-bright-161559.jpeg?auto=compress&cs=tinysrgb&w=500" }
        "*Strawberr*" { $newImageUrl = "https://images.pexels.com/photos/46174/strawberries-berries-fruit-freshness-46174.jpeg?auto=compress&cs=tinysrgb&w=500" }
        "*Grape*" { $newImageUrl = "https://images.pexels.com/photos/23042/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=500" }
        "*Tomato*" { $newImageUrl = "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=500" }
        "*Carrot*" { $newImageUrl = "https://images.pexels.com/photos/3650647/pexels-photo-3650647.jpeg?auto=compress&cs=tinysrgb&w=500" }
        "*Potato*" { $newImageUrl = "https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=500" }
        "*Onion*" { $newImageUrl = "https://images.pexels.com/photos/1306559/pexels-photo-1306559.jpeg?auto=compress&cs=tinysrgb&w=500" }
        "*Cabbage*" { $newImageUrl = "https://images.pexels.com/photos/5737281/pexels-photo-5737281.jpeg?auto=compress&cs=tinysrgb&w=500" }
        "*Milk*" { $newImageUrl = "https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg?auto=compress&cs=tinysrgb&w=500" }
        "*Egg*" { $newImageUrl = "https://images.pexels.com/photos/1556707/pexels-photo-1556707.jpeg?auto=compress&cs=tinysrgb&w=500" }
        "*Cheese*" { $newImageUrl = "https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=500" }
        "*Yogurt*" { $newImageUrl = "https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=500" }
        "*Butter*" { $newImageUrl = "https://images.pexels.com/photos/7808291/pexels-photo-7808291.jpeg?auto=compress&cs=tinysrgb&w=500" }
        "*Chicken*" { $newImageUrl = "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=500" }
        "*Beef*" { $newImageUrl = "https://images.pexels.com/photos/3688/food-dinner-lunch-unhealthy.jpg?auto=compress&cs=tinysrgb&w=500" }
        "*Fish*" { $newImageUrl = "https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=500" }
        "*Bread*" { $newImageUrl = "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=500" }
        "*Croissant*" { $newImageUrl = "https://images.pexels.com/photos/2135677/pexels-photo-2135677.jpeg?auto=compress&cs=tinysrgb&w=500" }
        "*Roll*" { $newImageUrl = "https://images.pexels.com/photos/209403/pexels-photo-209403.jpeg?auto=compress&cs=tinysrgb&w=500" }
        "*Orange Juice*" { $newImageUrl = "https://images.pexels.com/photos/1337824/pexels-photo-1337824.jpeg?auto=compress&cs=tinysrgb&w=500" }
        "*Water*" { $newImageUrl = "https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=500" }
        "*Cola*" { $newImageUrl = "https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=500" }
        "*Tea*" { $newImageUrl = "https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=500" }
        "*Chip*" { $newImageUrl = "https://images.pexels.com/photos/479600/pexels-photo-479600.jpeg?auto=compress&cs=tinysrgb&w=500" }
        "*Chocolate*" { $newImageUrl = "https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&cs=tinysrgb&w=500" }
        "*Rice*" { $newImageUrl = "https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=500" }
        "*Flour*" { $newImageUrl = "https://images.pexels.com/photos/1279337/pexels-photo-1279337.jpeg?auto=compress&cs=tinysrgb&w=500" }
        "*Oil*" { $newImageUrl = "https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=500" }
    }
    
    if ($newImageUrl -ne "") {
        $fixed += Update-ProductImage $product.id $product.name $newImageUrl
        Start-Sleep -Milliseconds 200  # Small delay to avoid overwhelming the server
    }
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Fixed $fixed product images" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host "`n[DONE] All images updated!" -ForegroundColor Green
Write-Host "Hard refresh your browser (Ctrl+Shift+R or Ctrl+F5)" -ForegroundColor Cyan
