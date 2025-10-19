# Clean and Curate Products - Keep only 30 relevant grocery items
Write-Host "[CLEAN] Cleaning and curating product catalog..." -ForegroundColor Green

# Login as admin
$loginBody = '{"email":"admin@ccmart.com","password":"Admin@123"}'
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$token = $loginResponse.token

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "[OK] Logged in as admin" -ForegroundColor Green

# Step 1: Delete all existing products
Write-Host "`n[1] Removing all existing products..." -ForegroundColor Cyan
$existingProducts = Invoke-RestMethod -Uri "http://localhost:8081/api/products"
$deleteCount = 0
foreach ($product in $existingProducts) {
    try {
        Invoke-RestMethod -Uri "http://localhost:8081/api/products/$($product.id)" -Method DELETE -Headers $headers | Out-Null
        $deleteCount++
    } catch {
        # Silent fail
    }
}
Write-Host "[OK] Removed $deleteCount products" -ForegroundColor Green

# Step 2: Get category IDs
Write-Host "[2] Getting categories..." -ForegroundColor Cyan
$categories = Invoke-RestMethod -Uri "http://localhost:8081/api/categories"
$fruits = ($categories | Where-Object { $_.name -eq "Fruits" }).id
$vegetables = ($categories | Where-Object { $_.name -eq "Vegetables" }).id
$dairy = ($categories | Where-Object { $_.name -eq "Dairy & Eggs" }).id
$meat = ($categories | Where-Object { $_.name -eq "Meat & Seafood" }).id
$bakery = ($categories | Where-Object { $_.name -eq "Bakery" }).id
$beverages = ($categories | Where-Object { $_.name -eq "Beverages" }).id
$snacks = ($categories | Where-Object { $_.name -eq "Snacks" }).id
$pantry = ($categories | Where-Object { $_.name -eq "Pantry Staples" }).id

Write-Host "[OK] Found categories" -ForegroundColor Green

# Step 3: Add curated products
Write-Host "`n[3] Adding 30 curated products..." -ForegroundColor Cyan

# Function to add product
function Add-Product {
    param($name, $desc, $price, $categoryId, $unit, $stock, $featured, $imageUrl)
    
    $product = @{
        name = $name
        description = $desc
        price = $price
        categoryId = $categoryId
        unit = $unit
        stockQuantity = $stock
        isFeatured = $featured
        isActive = $true
        imageUrl = $imageUrl
    } | ConvertTo-Json
    
    try {
        Invoke-RestMethod -Uri "http://localhost:8081/api/products" -Method POST -Headers $headers -Body $product | Out-Null
        Write-Host "  + $name" -ForegroundColor Gray
        return 1
    } catch {
        Write-Host "  x Failed: $name - $($_.Exception.Message)" -ForegroundColor Red
        return 0
    }
}

$added = 0

# Fruits (5 products)
Write-Host "`nFruits:" -ForegroundColor Yellow
$added += Add-Product "Red Apples" "Fresh crisp red apples" 350 $fruits "kg" 50 $true "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&h=500&fit=crop"
$added += Add-Product "Bananas" "Fresh yellow bananas" 180 $fruits "kg" 80 $true "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500&h=500&fit=crop"
$added += Add-Product "Oranges" "Juicy sweet oranges" 280 $fruits "kg" 60 $false "https://images.unsplash.com/photo-1547514701-42782101795e?w=500&h=500&fit=crop"
$added += Add-Product "Strawberries" "Fresh organic strawberries" 450 $fruits "250g pack" 30 $true "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&h=500&fit=crop"
$added += Add-Product "Grapes" "Seedless green grapes" 380 $fruits "500g" 40 $false "https://images.unsplash.com/photo-1599819177626-c0f8e1a8ec6e?w=500&h=500&fit=crop"

# Vegetables (5 products)
Write-Host "`nVegetables:" -ForegroundColor Yellow
$added += Add-Product "Tomatoes" "Fresh red tomatoes" 150 $vegetables "kg" 100 $false "https://images.unsplash.com/photo-1546470427-227ffa6cd6c7?w=500&h=500&fit=crop"
$added += Add-Product "Carrots" "Fresh orange carrots" 120 $vegetables "kg" 80 $false "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&h=500&fit=crop"
$added += Add-Product "Potatoes" "White potatoes" 100 $vegetables "kg" 150 $true "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&h=500&fit=crop"
$added += Add-Product "Onions" "Fresh red onions" 140 $vegetables "kg" 90 $false "https://images.unsplash.com/photo-1587049352846-4a222e784313?w=500&h=500&fit=crop"
$added += Add-Product "Cabbage" "Fresh green cabbage" 90 $vegetables "piece" 45 $false "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=500&h=500&fit=crop"

# Dairy & Eggs (5 products)
Write-Host "`nDairy & Eggs:" -ForegroundColor Yellow
$added += Add-Product "Fresh Milk" "Full cream fresh milk" 280 $dairy "1 liter" 100 $true "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&h=500&fit=crop"
$added += Add-Product "Farm Eggs" "Fresh farm eggs" 450 $dairy "dozen" 120 $true "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&h=500&fit=crop"
$added += Add-Product "Cheddar Cheese" "Aged cheddar cheese" 850 $dairy "250g" 50 $false "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=500&h=500&fit=crop"
$added += Add-Product "Greek Yogurt" "Creamy Greek yogurt" 320 $dairy "500g" 70 $false "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&h=500&fit=crop"
$added += Add-Product "Butter" "Unsalted butter" 680 $dairy "500g" 60 $false "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&h=500&fit=crop"

# Meat & Seafood (3 products)
Write-Host "`nMeat & Seafood:" -ForegroundColor Yellow
$added += Add-Product "Chicken Breast" "Fresh boneless chicken breast" 1200 $meat "kg" 40 $true "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500&h=500&fit=crop"
$added += Add-Product "Ground Beef" "Fresh lean ground beef" 1500 $meat "kg" 30 $false "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=500&h=500&fit=crop"
$added += Add-Product "Fresh Fish" "Fresh fish fillets" 1800 $meat "kg" 25 $false "https://images.unsplash.com/photo-1580554530778-ca36943938b2?w=500&h=500&fit=crop"

# Bakery (3 products)
Write-Host "`nBakery:" -ForegroundColor Yellow
$added += Add-Product "White Bread" "Fresh white bread loaf" 120 $bakery "loaf" 80 $false "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=500&fit=crop"
$added += Add-Product "Croissants" "Butter croissants" 180 $bakery "pack of 4" 50 $false "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&h=500&fit=crop"
$added += Add-Product "Dinner Rolls" "Soft dinner rolls" 150 $bakery "pack of 6" 60 $false "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=500&h=500&fit=crop"

# Beverages (4 products)
Write-Host "`nBeverages:" -ForegroundColor Yellow
$added += Add-Product "Orange Juice" "Fresh orange juice" 350 $beverages "1 liter" 60 $false "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&h=500&fit=crop"
$added += Add-Product "Bottled Water" "Pure drinking water" 80 $beverages "1.5 liter" 200 $false "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500&h=500&fit=crop"
$added += Add-Product "Coca Cola" "Coca Cola soft drink" 150 $beverages "1.5 liter" 100 $false "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500&h=500&fit=crop"
$added += Add-Product "Green Tea" "Premium green tea bags" 420 $beverages "50 bags" 45 $false "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=500&h=500&fit=crop"

# Snacks (2 products)
Write-Host "`nSnacks:" -ForegroundColor Yellow
$added += Add-Product "Potato Chips" "Salted potato chips" 180 $snacks "200g" 80 $false "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&h=500&fit=crop"
$added += Add-Product "Chocolate Bar" "Milk chocolate bar" 220 $snacks "100g" 120 $false "https://images.unsplash.com/photo-1606312619070-d48b4ceb901e?w=500&h=500&fit=crop"

# Pantry Staples (3 products)
Write-Host "`nPantry Staples:" -ForegroundColor Yellow
$added += Add-Product "Basmati Rice" "Premium basmati rice" 850 $pantry "5kg" 60 $true "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=500&fit=crop"
$added += Add-Product "Wheat Flour" "All-purpose wheat flour" 420 $pantry "2kg" 80 $false "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500&h=500&fit=crop"
$added += Add-Product "Cooking Oil" "Vegetable cooking oil" 680 $pantry "2 liter" 70 $false "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&h=500&fit=crop"

# Verification
Write-Host "`n[4] Verification..." -ForegroundColor Cyan
$finalProducts = Invoke-RestMethod -Uri "http://localhost:8081/api/products"
$activeProducts = $finalProducts | Where-Object { $_.isActive -eq $true }

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Total products added: $added" -ForegroundColor Green
Write-Host "Active products in DB: $($activeProducts.Count)" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host "`nProduct Summary by Category:" -ForegroundColor Yellow
$grouped = $activeProducts | Group-Object { $_.category.name }
foreach ($group in $grouped | Sort-Object Name) {
    Write-Host "  $($group.Name): $($group.Count) products" -ForegroundColor Cyan
}

Write-Host "`n[DONE] Product catalog curated successfully!" -ForegroundColor Green
Write-Host "Refresh your browser (Ctrl+F5) at: http://localhost:3000/products" -ForegroundColor Cyan
