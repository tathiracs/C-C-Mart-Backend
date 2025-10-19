# Fix Product Images - Update with reliable image URLs
Write-Host "[FIX] Updating product images with reliable URLs..." -ForegroundColor Green

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

# Image mappings with reliable Pexels CDN URLs
$imageMap = @{
    "Red Apples" = "https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=400"
    "Bananas" = "https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=400"
    "Oranges" = "https://images.pexels.com/photos/161559/background-bitter-breakfast-bright-161559.jpeg?auto=compress&cs=tinysrgb&w=400"
    "Strawberries" = "https://images.pexels.com/photos/46174/strawberries-berries-fruit-freshness-46174.jpeg?auto=compress&cs=tinysrgb&w=400"
    "Grapes" = "https://images.pexels.com/photos/760281/pexels-photo-760281.jpeg?auto=compress&cs=tinysrgb&w=400"
    "Tomatoes" = "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400"
    "Carrots" = "https://images.pexels.com/photos/3650647/pexels-photo-3650647.jpeg?auto=compress&cs=tinysrgb&w=400"
    "Potatoes" = "https://images.pexels.com/photos/2286776/pexels-photo-2286776.jpeg?auto=compress&cs=tinysrgb&w=400"
    "Onions" = "https://images.pexels.com/photos/1323646/pexels-photo-1323646.jpeg?auto=compress&cs=tinysrgb&w=400"
    "Cabbage" = "https://images.pexels.com/photos/5503274/pexels-photo-5503274.jpeg?auto=compress&cs=tinysrgb&w=400"
    "Fresh Milk" = "https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg?auto=compress&cs=tinysrgb&w=400"
    "Farm Eggs" = "https://images.pexels.com/photos/1556707/pexels-photo-1556707.jpeg?auto=compress&cs=tinysrgb&w=400"
    "Cheddar Cheese" = "https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=400"
    "Greek Yogurt" = "https://images.pexels.com/photos/1435706/pexels-photo-1435706.jpeg?auto=compress&cs=tinysrgb&w=400"
    "Butter" = "https://images.pexels.com/photos/7518703/pexels-photo-7518703.jpeg?auto=compress&cs=tinysrgb&w=400"
    "Chicken Breast" = "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400"
    "Ground Beef" = "https://images.pexels.com/photos/618775/pexels-photo-618775.jpeg?auto=compress&cs=tinysrgb&w=400"
    "Fresh Fish" = "https://images.pexels.com/photos/1683545/pexels-photo-1683545.jpeg?auto=compress&cs=tinysrgb&w=400"
    "White Bread" = "https://images.pexels.com/photos/209196/pexels-photo-209196.jpeg?auto=compress&cs=tinysrgb&w=400"
    "Croissants" = "https://images.pexels.com/photos/2135677/pexels-photo-2135677.jpeg?auto=compress&cs=tinysrgb&w=400"
    "Dinner Rolls" = "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400"
    "Orange Juice" = "https://images.pexels.com/photos/1337824/pexels-photo-1337824.jpeg?auto=compress&cs=tinysrgb&w=400"
    "Bottled Water" = "https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=400"
    "Coca Cola" = "https://images.pexels.com/photos/2775860/pexels-photo-2775860.jpeg?auto=compress&cs=tinysrgb&w=400"
    "Green Tea" = "https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=400"
    "Potato Chips" = "https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=400"
    "Chocolate Bar" = "https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&cs=tinysrgb&w=400"
    "Basmati Rice" = "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400"
    "Wheat Flour" = "https://images.pexels.com/photos/5419336/pexels-photo-5419336.jpeg?auto=compress&cs=tinysrgb&w=400"
    "Cooking Oil" = "https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400"
}

Write-Host "`n[UPDATING] Fixing product images..." -ForegroundColor Cyan
$updated = 0

foreach ($product in $products) {
    if ($imageMap.ContainsKey($product.name)) {
        $newImageUrl = $imageMap[$product.name]
        
        $updateData = @{
            name = $product.name
            description = $product.description
            price = $product.price
            categoryId = $product.category.id
            unit = $product.unit
            stockQuantity = $product.stockQuantity
            isFeatured = $product.isFeatured
            isActive = $product.isActive
            imageUrl = $newImageUrl
        } | ConvertTo-Json
        
        try {
            Invoke-RestMethod -Uri "http://localhost:8081/api/products/$($product.id)" -Method PUT -Headers $headers -Body $updateData | Out-Null
            Write-Host "  Fixed: $($product.name)" -ForegroundColor Gray
            $updated++
        } catch {
            Write-Host "  Failed: $($product.name) - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Updated $updated product images" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host "`n[DONE] All product images updated!" -ForegroundColor Green
Write-Host "Refresh your browser (Ctrl+F5) to see the changes" -ForegroundColor Cyan
Write-Host "Visit: http://localhost:3000/products" -ForegroundColor Yellow
