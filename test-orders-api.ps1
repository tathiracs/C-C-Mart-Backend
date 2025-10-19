# Test Orders API
Write-Host "Testing Orders API..." -ForegroundColor Cyan
Write-Host ""

# First, test without auth (should fail)
Write-Host "1. Testing without authentication:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8081/api/orders" -Method GET -ErrorAction Stop
    Write-Host "Response: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "Expected error (401 Unauthorized): $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "2. To test with authentication:" -ForegroundColor Yellow
Write-Host "   a) Login at http://localhost:3000/login with admin@ccmart.lk / admin123" -ForegroundColor White
Write-Host "   b) Open browser console (F12)" -ForegroundColor White
Write-Host "   c) Run: localStorage.getItem('token')" -ForegroundColor White  
Write-Host "   d) Copy the token and paste it below when prompted" -ForegroundColor White
Write-Host ""

$token = Read-Host "Paste admin token here (or press Enter to skip)"

if ($token) {
    Write-Host ""
    Write-Host "3. Testing with authentication:" -ForegroundColor Yellow
    try {
        $headers = @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        }
        $response = Invoke-RestMethod -Uri "http://localhost:8081/api/orders" -Method GET -Headers $headers
        Write-Host "✅ SUCCESS! Orders fetched:" -ForegroundColor Green
        Write-Host "Number of orders: $($response.Count)" -ForegroundColor Cyan
        $response | ForEach-Object {
            Write-Host "  - Order #$($_.id): $($_.user.name) - Rs. $($_.totalAmount) - Status: $($_.status)" -ForegroundColor White
        }
    } catch {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response: $responseBody" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "4. Troubleshooting steps:" -ForegroundColor Yellow
Write-Host "   - Hard refresh browser: Ctrl + Shift + R" -ForegroundColor White
Write-Host "   - Clear browser cache" -ForegroundColor White
Write-Host "   - Check console (F12) for errors" -ForegroundColor White
Write-Host "   - Click 'Refresh Orders' button" -ForegroundColor White
Write-Host "================================" -ForegroundColor Cyan
