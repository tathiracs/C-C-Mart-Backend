# Fix Product Images - Use reliable image sources
Write-Host "[FIX] Updating all product images with reliable sources..." -ForegroundColor Green

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
Write-Host "[INFO] Found $($products.Count) products to update" -ForegroundColor Cyan

# Image mapping with multiple reliable sources
$imageMap = @{
    "Red Apples" = "https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=500"
    "Bananas" = "https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=500"
    "Oranges" = "https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=500"
    "Strawberries" = "https://images.pexels.com/photos/46174/strawberries-berries-fruit-freshness-46174.jpeg?auto=compress&cs=tinysrgb&w=500"
    "Grapes" = "https://images.pexels.com/photos/23042/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=500"
    "Tomatoes" = "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=500"
    "Carrots" = "https://images.pexels.com/photos/3650647/pexels-photo-3650647.jpeg?auto=compress&cs=tinysrgb&w=500"
    "Potatoes" = "https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=500"
    "Onions" = "https://images.pexels.com/photos/2937278/pexels-photo-2937278.jpeg?auto=compress&cs=tinysrgb&w=500"
    "Cabbage" = "https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&cs=tinysrgb&w=500"
    "Fresh Milk" = "https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=500"
    "Farm Eggs" = "https://images.pexels.com/photos/1556707/pexels-photo-1556707.jpeg?auto=compress&cs=tinysrgb&w=500"
    "Cheddar Cheese" = "https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=500"
    "Greek Yogurt" = "https://images.pexels.com/photos/1446318/pexels-photo-1446318.jpeg?auto=compress&cs=tinysrgb&w=500"
    "Butter" = "https://images.pexels.com/photos/1435903/pexels-photo-1435903.jpeg?auto=compress&cs=tinysrgb&w=500"
    "Chicken Breast" = "https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg?auto=compress&cs=tinysrgb&w=500"
    "Ground Beef" = "https://images.pexels.com/photos/618775/pexels-photo-618775.jpeg?auto=compress&cs=tinysrgb&w=500"
    "Fresh Fish" = "https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg?auto=compress&cs=tinysrgb&w=500"
    "White Bread" = "https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=500"
    "Croissants" = "https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg?auto=compress&cs=tinysrgb&w=500"
    "Dinner Rolls" = "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=500"
    "Orange Juice" = "https://images.pexels.com/photos/1233319/pexels-photo-1233319.jpeg?auto=compress&cs=tinysrgb&w=500"
    "Bottled Water" = "https://images.pexels.com/photos/327090/pexels-photo-327090.jpeg?auto=compress&cs=tinysrgb&w=500"
    "Coca Cola" = "https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=500"
    "Green Tea" = "https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=500"
    "Potato Chips" = "https://images.pexels.com/photos/479200/pexels-photo-479200.jpeg?auto=compress&cs=tinysrgb&w=500"
    "Chocolate Bar" = "https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&cs=tinysrgb&w=500"
    "Basmati Rice" = "https://images.pexels.com/photos/1393095/pexels-photo-1393095.jpeg?auto=compress&cs=tinysrgb&w=500"
    "Wheat Flour" = "https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg?auto=compress&cs=tinysrgb&w=500"
    "Cooking Oil" = "https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=500"
}

$updated = 0
$failed = 0

foreach ($product in $products) {
    if ($imageMap.ContainsKey($product.name)) {
        $newImageUrl = $imageMap[$product.name]
        
        # Create update payload with all existing data
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
            Write-Host "  [OK] Updated: $($product.name)" -ForegroundColor Green
            $updated++
        } catch {
            Write-Host "  [FAIL] Failed: $($product.name) - $($_.Exception.Message)" -ForegroundColor Red
            $failed++
        }
    }
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Updated: $updated products" -ForegroundColor Green
Write-Host "Failed: $failed products" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Green

Write-Host "`n[DONE] All product images updated!" -ForegroundColor Green
Write-Host "Hard refresh your browser (Ctrl+Shift+R) to see changes" -ForegroundColor Cyan
Write-Host "Visit: http://localhost:3000/products" -ForegroundColor Cyan
