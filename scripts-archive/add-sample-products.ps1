Write-Host "=== Adding Sample Products to C-C Mart ===" -ForegroundColor Cyan

# Login as admin
Write-Host "`nLogging in as admin..." -ForegroundColor Yellow
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body (@{
        email = "admin@ccmart.com"
        password = "Admin@123"
    } | ConvertTo-Json)

$token = $loginResponse.token
Write-Host "Logged in successfully!" -ForegroundColor Green

# Check current products
Write-Host "`nChecking existing products..." -ForegroundColor Yellow
$existingProducts = Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Method GET
Write-Host "Found $($existingProducts.Count) products in database" -ForegroundColor Cyan

# Sample products to add
$sampleProducts = @(
    @{
        name = "Fresh Apples"
        description = "Crisp and sweet red apples, perfect for snacking or baking"
        price = 450.00
        stockQuantity = 100
        unit = "kg"
        imageUrl = "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400"
        categoryId = 1
        isFeatured = $true
        isActive = $true
    },
    @{
        name = "Fresh Bananas"
        description = "Ripe yellow bananas, rich in potassium and natural energy"
        price = 280.00
        stockQuantity = 150
        unit = "kg"
        imageUrl = "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400"
        categoryId = 1
        isFeatured = $true
        isActive = $true
    },
    @{
        name = "Organic Carrots"
        description = "Fresh organic carrots, great for salads and cooking"
        price = 120.00
        stockQuantity = 80
        unit = "kg"
        imageUrl = "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400"
        categoryId = 2
        isFeatured = $true
        isActive = $true
    },
    @{
        name = "Fresh Tomatoes"
        description = "Juicy red tomatoes, perfect for salads and cooking"
        price = 150.00
        stockQuantity = 120
        unit = "kg"
        imageUrl = "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400"
        categoryId = 2
        isFeatured = $true
        isActive = $true
    },
    @{
        name = "Fresh White Bread"
        description = "Soft and fluffy white bread, freshly baked daily"
        price = 180.00
        stockQuantity = 50
        unit = "loaf"
        imageUrl = "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400"
        categoryId = 3
        isFeatured = $false
        isActive = $true
    },
    @{
        name = "Whole Wheat Bread"
        description = "Healthy whole wheat bread, rich in fiber"
        price = 220.00
        stockQuantity = 40
        unit = "loaf"
        imageUrl = "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400"
        categoryId = 3
        isFeatured = $false
        isActive = $true
    },
    @{
        name = "Fresh Milk"
        description = "Pure fresh milk, delivered daily from local farms"
        price = 250.00
        stockQuantity = 200
        unit = "liter"
        imageUrl = "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400"
        categoryId = 4
        isFeatured = $true
        isActive = $true
    },
    @{
        name = "Greek Yogurt"
        description = "Creamy Greek yogurt, high in protein"
        price = 320.00
        stockQuantity = 60
        unit = "500g"
        imageUrl = "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400"
        categoryId = 4
        isFeatured = $false
        isActive = $true
    },
    @{
        name = "Cheddar Cheese"
        description = "Premium cheddar cheese, aged to perfection"
        price = 850.00
        stockQuantity = 30
        unit = "250g"
        imageUrl = "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400"
        categoryId = 4
        isFeatured = $false
        isActive = $true
    },
    @{
        name = "Brown Eggs"
        description = "Farm fresh brown eggs, rich in nutrients"
        price = 380.00
        stockQuantity = 100
        unit = "dozen"
        imageUrl = "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400"
        categoryId = 4
        isFeatured = $true
        isActive = $true
    },
    @{
        name = "Chicken Breast"
        description = "Fresh boneless chicken breast, high quality protein"
        price = 1200.00
        stockQuantity = 50
        unit = "kg"
        imageUrl = "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400"
        categoryId = 5
        isFeatured = $true
        isActive = $true
    },
    @{
        name = "Ground Beef"
        description = "Premium ground beef, perfect for burgers and meatballs"
        price = 1800.00
        stockQuantity = 40
        unit = "kg"
        imageUrl = "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400"
        categoryId = 5
        isFeatured = $false
        isActive = $true
    },
    @{
        name = "Basmati Rice"
        description = "Premium long grain Basmati rice, aromatic and fluffy"
        price = 280.00
        stockQuantity = 200
        unit = "kg"
        imageUrl = "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400"
        categoryId = 6
        isFeatured = $true
        isActive = $true
    },
    @{
        name = "Whole Wheat Pasta"
        description = "Healthy whole wheat pasta, quick to cook"
        price = 320.00
        stockQuantity = 80
        unit = "500g"
        imageUrl = "https://images.unsplash.com/photo-1551462147-37c1d2c1e1f8?w=400"
        categoryId = 6
        isFeatured = $false
        isActive = $true
    },
    @{
        name = "Orange Juice"
        description = "100% pure orange juice, no added sugar"
        price = 380.00
        stockQuantity = 60
        unit = "liter"
        imageUrl = "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400"
        categoryId = 7
        isFeatured = $false
        isActive = $true
    },
    @{
        name = "Mineral Water"
        description = "Pure mineral water, naturally sourced"
        price = 80.00
        stockQuantity = 300
        unit = "1.5L bottle"
        imageUrl = "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400"
        categoryId = 7
        isFeatured = $false
        isActive = $true
    }
)

# Add each product
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$addedCount = 0
$skippedCount = 0

foreach ($product in $sampleProducts) {
    # Check if product already exists
    $exists = $existingProducts | Where-Object { $_.name -eq $product.name }
    
    if ($exists) {
        Write-Host "  ⏭️  Skipping '$($product.name)' - already exists" -ForegroundColor Gray
        $skippedCount++
    } else {
        try {
            $response = Invoke-RestMethod -Uri "http://localhost:8080/api/products" `
                -Method POST `
                -Headers $headers `
                -Body ($product | ConvertTo-Json)
            
            Write-Host "  ✅ Added: $($product.name) - Rs.$($product.price) - Stock: $($product.stockQuantity) $($product.unit)" -ForegroundColor Green
            $addedCount++
        } catch {
            Write-Host "  ❌ Failed to add '$($product.name)': $_" -ForegroundColor Red
        }
    }
}

Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host "✅ Products added: $addedCount" -ForegroundColor Green
Write-Host "⏭️  Products skipped (already exist): $skippedCount" -ForegroundColor Yellow

# Final product count
$finalProducts = Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Method GET
Write-Host "`n📦 Total products in database: $($finalProducts.Count)" -ForegroundColor Cyan

# Check for inactive products
$inactiveProducts = $finalProducts | Where-Object { -not $_.isActive }
if ($inactiveProducts.Count -gt 0) {
    Write-Host "`n⚠️  Warning: Found $($inactiveProducts.Count) inactive products" -ForegroundColor Yellow
    Write-Host "Run the quick-fix-products.ps1 script to activate them" -ForegroundColor Yellow
}

Write-Host "`n✅ Done! Visit http://localhost:3000/products to see all products" -ForegroundColor Green
