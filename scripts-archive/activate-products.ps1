# Fix All Products - Set all inactive products to active
Write-Host "=== C&C Mart - Product Activation Script ===" -ForegroundColor Green
Write-Host ""

# Get all products
Write-Host "Fetching products from database..." -ForegroundColor Yellow
try {
    $products = Invoke-RestMethod -Uri "http://localhost:8081/api/products" -Method Get
    Write-Host "Found $($products.Count) total products" -ForegroundColor Cyan
    
    $inactiveCount = ($products | Where-Object { $_.isActive -eq $false }).Count
    Write-Host "Inactive products: $inactiveCount" -ForegroundColor Red
    Write-Host "Active products: $($products.Count - $inactiveCount)" -ForegroundColor Green
    Write-Host ""
    
    if ($inactiveCount -eq 0) {
        Write-Host "All products are already active! Nothing to fix." -ForegroundColor Green
        exit 0
    }
    
    # Ask for admin credentials
    Write-Host "Please enter admin credentials:" -ForegroundColor Yellow
    $username = Read-Host "Username (default: admin)"
    if ([string]::IsNullOrWhiteSpace($username)) { $username = "admin" }
    
    $password = Read-Host "Password" -AsSecureString
    $passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))
    
    # Login
    Write-Host "Logging in..." -ForegroundColor Yellow
    $loginBody = @{
        username = $username
        password = $passwordPlain
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    
    Write-Host "Login successful!" -ForegroundColor Green
    Write-Host ""
    
    # Call fix endpoint
    Write-Host "Activating all products..." -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $fixResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/products/fix-active" -Method Post -Headers $headers -ContentType "application/json"
    
    Write-Host ""
    Write-Host "SUCCESS! $fixResponse" -ForegroundColor Green
    Write-Host ""
    Write-Host "All products are now active and visible on the Products page!" -ForegroundColor Green
    Write-Host "Go to http://localhost:3000/products and refresh to see all products." -ForegroundColor Cyan
    
} catch {
    Write-Host ""
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please make sure:" -ForegroundColor Yellow
    Write-Host "1. Backend is running on port 8081" -ForegroundColor Yellow
    Write-Host "2. You entered correct admin credentials" -ForegroundColor Yellow
    Write-Host "3. You have admin role permissions" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
