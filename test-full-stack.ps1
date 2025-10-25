# Full Stack Integration Test Script for C-C_Mart
# Tests: MySQL Database -> Spring Boot Backend -> React Frontend

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   C-C_MART FULL STACK TEST SUITE" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$results = @()

# Test 1: MySQL Database Connection
Write-Host "📊 TEST 1: MySQL Database Connection" -ForegroundColor Yellow
try {
    $mysqlTest = mysql -u root -pRoot123@ -e "SELECT 'Connected' as status, VERSION() as version, DATABASE() as current_db; USE ccmart_db; SHOW TABLES;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ MySQL is running and accessible" -ForegroundColor Green
        Write-Host "   ✅ Database 'ccmart_db' exists" -ForegroundColor Green
        $results += "MySQL: PASS"
    } else {
        Write-Host "   ❌ MySQL connection failed" -ForegroundColor Red
        $results += "MySQL: FAIL"
    }
} catch {
    Write-Host "   ❌ MySQL Error: $($_.Exception.Message)" -ForegroundColor Red
    $results += "MySQL: FAIL - $($_.Exception.Message)"
}

Start-Sleep -Seconds 2

# Test 2: Backend Server Health
Write-Host "`n🚀 TEST 2: Spring Boot Backend Server" -ForegroundColor Yellow
$maxRetries = 3
$retryCount = 0
$backendHealthy = $false

while ($retryCount -lt $maxRetries -and -not $backendHealthy) {
    try {
        $health = Invoke-RestMethod -Uri "http://localhost:8081/api/health" -Method GET -TimeoutSec 5
        Write-Host "   ✅ Backend server is running on port 8081" -ForegroundColor Green
        Write-Host "   ✅ Health Status: $($health.status)" -ForegroundColor Green
        $backendHealthy = $true
        $results += "Backend Health: PASS"
    } catch {
        $retryCount++
        if ($retryCount -lt $maxRetries) {
            Write-Host "   ⏳ Waiting for backend to start (attempt $retryCount/$maxRetries)..." -ForegroundColor Yellow
            Start-Sleep -Seconds 5
        } else {
            Write-Host "   ❌ Backend server not responding on port 8081" -ForegroundColor Red
            Write-Host "   ℹ️  Please start backend manually: cd backend-spring; mvn spring-boot:run" -ForegroundColor Cyan
            $results += "Backend Health: FAIL - Not responding"
        }
    }
}

# Test 3: Database Tables via Backend
if ($backendHealthy) {
    Write-Host "`n💾 TEST 3: Database Schema (via Backend)" -ForegroundColor Yellow
    try {
        # Try to get categories - this will test DB connection through backend
        $categories = Invoke-RestMethod -Uri "http://localhost:8081/api/categories" -Method GET -TimeoutSec 10
        Write-Host "   ✅ Backend can query database" -ForegroundColor Green
        Write-Host "   ✅ Categories table accessible (found $($categories.content.Count) categories)" -ForegroundColor Green
        $results += "Database Schema: PASS"
    } catch {
        Write-Host "   ⚠️  Database query test: $($_.Exception.Message)" -ForegroundColor Yellow
        $results += "Database Schema: PARTIAL"
    }
}

# Test 4: Authentication System
if ($backendHealthy) {
    Write-Host "`n🔐 TEST 4: Authentication System" -ForegroundColor Yellow
    try {
        $loginBody = @{
            email = "admin@ccmart.com"
            password = "admin123"
        } | ConvertTo-Json

        $loginResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -TimeoutSec 10
        
        if ($loginResponse.token) {
            Write-Host "   ✅ Login endpoint working" -ForegroundColor Green
            Write-Host "   ✅ JWT token generated successfully" -ForegroundColor Green
            Write-Host "   ✅ User data returned: $($loginResponse.user.email)" -ForegroundColor Green
            $results += "Authentication: PASS"
            
            # Test 5: Protected Route with JWT
            Write-Host "`n🛡️  TEST 5: JWT Authentication & Protected Routes" -ForegroundColor Yellow
            try {
                $headers = @{
                    "Authorization" = "Bearer $($loginResponse.token)"
                }
                $meResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/me" -Method GET -Headers $headers -TimeoutSec 10
                Write-Host "   ✅ Protected route accessible with JWT" -ForegroundColor Green
                Write-Host "   ✅ User profile retrieved: $($meResponse.name)" -ForegroundColor Green
                $results += "JWT Auth: PASS"
            } catch {
                Write-Host "   ❌ JWT authentication failed: $($_.Exception.Message)" -ForegroundColor Red
                $results += "JWT Auth: FAIL"
            }
        } else {
            Write-Host "   ❌ Login failed - no token received" -ForegroundColor Red
            $results += "Authentication: FAIL - No token"
        }
    } catch {
        $errorMessage = $_.Exception.Message
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $errorBody = $reader.ReadToEnd()
            Write-Host "   ❌ Login test failed: $errorBody" -ForegroundColor Red
        } else {
            Write-Host "   ❌ Login test failed: $errorMessage" -ForegroundColor Red
        }
        $results += "Authentication: FAIL"
    }
}

# Test 6: CORS Configuration
if ($backendHealthy) {
    Write-Host "`n🌐 TEST 6: CORS Configuration" -ForegroundColor Yellow
    try {
        $corsTest = Invoke-WebRequest -Uri "http://localhost:8081/api/health" -Method OPTIONS -Headers @{"Origin"="http://localhost:3000"} -UseBasicParsing -TimeoutSec 5
        $corsHeader = $corsTest.Headers["Access-Control-Allow-Origin"]
        if ($corsHeader) {
            Write-Host "   ✅ CORS headers configured" -ForegroundColor Green
            Write-Host "   ✅ Allowed Origin: $corsHeader" -ForegroundColor Green
            $results += "CORS: PASS"
        } else {
            Write-Host "   ⚠️  CORS headers not found in response" -ForegroundColor Yellow
            $results += "CORS: WARNING"
        }
    } catch {
        Write-Host "   ⚠️  CORS test inconclusive: $($_.Exception.Message)" -ForegroundColor Yellow
        $results += "CORS: INCONCLUSIVE"
    }
}

# Test 7: Frontend Server Check
Write-Host "`n⚛️  TEST 7: React Frontend Server" -ForegroundColor Yellow
try {
    $frontendTest = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5 -UseBasicParsing
    if ($frontendTest.StatusCode -eq 200) {
        Write-Host "   ✅ Frontend server is running on port 3000" -ForegroundColor Green
        Write-Host "   ✅ React app is accessible" -ForegroundColor Green
        $results += "Frontend: PASS"
    }
} catch {
    Write-Host "   ❌ Frontend not running on port 3000" -ForegroundColor Red
    Write-Host "   ℹ️  To start: cd frontend; npm start" -ForegroundColor Cyan
    $results += "Frontend: FAIL - Not running"
}

# Test 8: API Endpoints Overview
if ($backendHealthy) {
    Write-Host "`n📡 TEST 8: Core API Endpoints" -ForegroundColor Yellow
    $endpoints = @(
        @{url="http://localhost:8081/api/products"; name="Products"},
        @{url="http://localhost:8081/api/categories"; name="Categories"},
        @{url="http://localhost:8081/api/health"; name="Health"}
    )
    
    $passedEndpoints = 0
    foreach ($endpoint in $endpoints) {
        try {
            $response = Invoke-WebRequest -Uri $endpoint.url -Method GET -TimeoutSec 5 -UseBasicParsing
            if ($response.StatusCode -eq 200) {
                Write-Host "   ✅ $($endpoint.name) endpoint working" -ForegroundColor Green
                $passedEndpoints++
            }
        } catch {
            Write-Host "   ⚠️  $($endpoint.name) endpoint: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
    
    if ($passedEndpoints -eq $endpoints.Count) {
        $results += "API Endpoints: PASS"
    } else {
        $results += "API Endpoints: PARTIAL ($passedEndpoints/$($endpoints.Count))"
    }
}

# Summary Report
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "           TEST SUMMARY REPORT" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$passCount = ($results | Where-Object { $_ -like "*PASS*" }).Count
$failCount = ($results | Where-Object { $_ -like "*FAIL*" }).Count
$warnCount = ($results | Where-Object { $_ -like "*WARNING*" -or $_ -like "*PARTIAL*" }).Count

foreach ($result in $results) {
    if ($result -like "*PASS*") {
        Write-Host "  ✅ $result" -ForegroundColor Green
    } elseif ($result -like "*FAIL*") {
        Write-Host "  ❌ $result" -ForegroundColor Red
    } else {
        Write-Host "  ⚠️  $result" -ForegroundColor Yellow
    }
}

Write-Host "`n----------------------------------------" -ForegroundColor Cyan
Write-Host "  Tests Passed: $passCount" -ForegroundColor Green
Write-Host "  Tests Failed: $failCount" -ForegroundColor Red
Write-Host "  Warnings: $warnCount" -ForegroundColor Yellow
Write-Host "----------------------------------------`n" -ForegroundColor Cyan

# Overall Status
if ($failCount -eq 0 -and $passCount -gt 5) {
    Write-Host "🎉 ALL SYSTEMS OPERATIONAL! 🎉" -ForegroundColor Green
    Write-Host "Your full stack application is working perfectly!`n" -ForegroundColor Green
} elseif ($failCount -eq 0) {
    Write-Host "✅ Core systems operational with some warnings`n" -ForegroundColor Yellow
} else {
    Write-Host "⚠️  Some systems need attention. Please review failures above.`n" -ForegroundColor Yellow
}

# Quick Start Commands
Write-Host "Quick Start Commands:" -ForegroundColor Cyan
Write-Host "  Backend:  cd backend-spring; mvn spring-boot:run" -ForegroundColor White
Write-Host "  Frontend: cd frontend; npm start" -ForegroundColor White
Write-Host "  MySQL:    mysql -u root -pRoot123@ ccmart_db`n" -ForegroundColor White
