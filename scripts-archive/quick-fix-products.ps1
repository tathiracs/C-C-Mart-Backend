# Quick Fix - Activate All Products (Auto)
Write-Host "=== Activating All Products ===" -ForegroundColor Green

try {
    # Login with admin credentials (email-based)
    $loginBody = '{"email":"admin@ccmart.com","password":"Admin@123"}'
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    
    Write-Host "Logged in successfully!" -ForegroundColor Green
    
    # Fix products
    $headers = @{"Authorization" = "Bearer $token"}
    $result = Invoke-RestMethod -Uri "http://localhost:8081/api/products/fix-active" -Method Post -Headers $headers
    
    Write-Host "`nSUCCESS: $result" -ForegroundColor Green
    Write-Host "`nAll products are now active!" -ForegroundColor Cyan
    Write-Host "Go to http://localhost:3000/products and refresh!" -ForegroundColor Yellow
    
} catch {
    Write-Host "`nERROR: $($_.Exception.Message)" -ForegroundColor Red
}
