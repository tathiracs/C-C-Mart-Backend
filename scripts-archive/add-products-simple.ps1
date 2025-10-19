Write-Host "Adding Sample Products..." -ForegroundColor Cyan

# Login
$login = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@ccmart.com","password":"Admin@123"}'
$token = $login.token
Write-Host "Logged in!" -ForegroundColor Green

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Product 1
$p1 = '{"name":"Fresh Apples","description":"Crisp and sweet red apples","price":450,"stockQuantity":100,"unit":"kg","imageUrl":"https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400","categoryId":1,"isFeatured":true,"isActive":true}'
Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Method POST -Headers $headers -Body $p1
Write-Host "Added: Fresh Apples" -ForegroundColor Green

# Product 2
$p2 = '{"name":"Fresh Bananas","description":"Ripe yellow bananas","price":280,"stockQuantity":150,"unit":"kg","imageUrl":"https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400","categoryId":1,"isFeatured":true,"isActive":true}'
Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Method POST -Headers $headers -Body $p2
Write-Host "Added: Fresh Bananas" -ForegroundColor Green

# Product 3
$p3 = '{"name":"Organic Carrots","description":"Fresh organic carrots","price":120,"stockQuantity":80,"unit":"kg","imageUrl":"https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400","categoryId":2,"isFeatured":true,"isActive":true}'
Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Method POST -Headers $headers -Body $p3
Write-Host "Added: Organic Carrots" -ForegroundColor Green

# Product 4
$p4 = '{"name":"Fresh Tomatoes","description":"Juicy red tomatoes","price":150,"stockQuantity":120,"unit":"kg","imageUrl":"https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400","categoryId":2,"isFeatured":true,"isActive":true}'
Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Method POST -Headers $headers -Body $p4
Write-Host "Added: Fresh Tomatoes" -ForegroundColor Green

# Product 5
$p5 = '{"name":"Fresh White Bread","description":"Soft and fluffy white bread","price":180,"stockQuantity":50,"unit":"loaf","imageUrl":"https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400","categoryId":3,"isFeatured":false,"isActive":true}'
Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Method POST -Headers $headers -Body $p5
Write-Host "Added: Fresh White Bread" -ForegroundColor Green

# Product 6
$p6 = '{"name":"Fresh Milk","description":"Pure fresh milk from local farms","price":250,"stockQuantity":200,"unit":"liter","imageUrl":"https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400","categoryId":4,"isFeatured":true,"isActive":true}'
Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Method POST -Headers $headers -Body $p6
Write-Host "Added: Fresh Milk" -ForegroundColor Green

# Product 7
$p7 = '{"name":"Brown Eggs","description":"Farm fresh brown eggs","price":380,"stockQuantity":100,"unit":"dozen","imageUrl":"https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400","categoryId":4,"isFeatured":true,"isActive":true}'
Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Method POST -Headers $headers -Body $p7
Write-Host "Added: Brown Eggs" -ForegroundColor Green

# Product 8
$p8 = '{"name":"Chicken Breast","description":"Fresh boneless chicken breast","price":1200,"stockQuantity":50,"unit":"kg","imageUrl":"https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400","categoryId":5,"isFeatured":true,"isActive":true}'
Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Method POST -Headers $headers -Body $p8
Write-Host "Added: Chicken Breast" -ForegroundColor Green

# Product 9
$p9 = '{"name":"Basmati Rice","description":"Premium long grain Basmati rice","price":280,"stockQuantity":200,"unit":"kg","imageUrl":"https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400","categoryId":6,"isFeatured":true,"isActive":true}'
Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Method POST -Headers $headers -Body $p9
Write-Host "Added: Basmati Rice" -ForegroundColor Green

# Product 10
$p10 = '{"name":"Mineral Water","description":"Pure mineral water","price":80,"stockQuantity":300,"unit":"1.5L bottle","imageUrl":"https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400","categoryId":7,"isFeatured":false,"isActive":true}'
Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Method POST -Headers $headers -Body $p10
Write-Host "Added: Mineral Water" -ForegroundColor Green

Write-Host "`nDone! Added 10 sample products" -ForegroundColor Green
Write-Host "Visit http://localhost:3000/products to see them" -ForegroundColor Cyan
