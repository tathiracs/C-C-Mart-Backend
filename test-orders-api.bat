@echo off
echo.
echo ===================================
echo   Testing Orders API Endpoint
echo ===================================
echo.
echo Testing GET /api/orders endpoint...
echo.
echo This will show what the backend returns when you request orders.
echo.
echo NOTE: You need to be logged in for this to work!
echo.
echo Open your browser and:
echo 1. Make sure you're logged in to http://localhost:3000
echo 2. Open DevTools (F12)
echo 3. Go to Application tab
echo 4. Click on Local Storage -^> http://localhost:3000
echo 5. Find the 'token' key
echo 6. Copy the token value
echo.
echo Then run this command in PowerShell:
echo.
echo $token = "PASTE_YOUR_TOKEN_HERE"
echo $headers = @{Authorization = "Bearer $token"}
echo Invoke-RestMethod -Uri "http://localhost:3000/api/orders" -Headers $headers
echo.
echo OR just check the browser console on the Orders page!
echo.
pause
