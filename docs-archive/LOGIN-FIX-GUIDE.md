# 🔧 Login Issue - Fixed!

## ❌ Problem Identified
**The backend server was not running**, causing all login attempts to fail with "Login failed" error.

## ✅ Solution Applied
Started the backend server successfully on port 8081.

---

## 🔐 Correct Admin Credentials

**Email:** `admin@ccmart.com`  
**Password:** `Admin@123`

> ⚠️ **Important:** The password is case-sensitive! Use `Admin@123` exactly as shown.

---

## 📋 How to Fix Login Issues

### Step 1: Ensure Backend is Running

Check if backend is running:
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/api/health"
```

**Expected Response:** `{"status": "UP"}`

### Step 2: Start Backend Server (if not running)

Open PowerShell in the backend-spring directory:
```powershell
cd "c:\Users\imax.computer\OneDrive\Desktop\OOAD Project - Copy\Chamika\C-C_Mart\backend-spring"
mvn spring-boot:run
```

Wait for this message:
```
Started BackendSpringApplication in X seconds
Tomcat started on port 8081
```

### Step 3: Test Login from Command Line

```powershell
$body = '{"email":"admin@ccmart.com","password":"Admin@123"}'
Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" -Method POST -Body $body -ContentType "application/json"
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 19,
    "email": "admin@ccmart.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

### Step 4: Login from Browser

1. Make sure frontend is running on `http://localhost:3000`
2. Navigate to login page
3. Enter credentials:
   - **Email:** `admin@ccmart.com`
   - **Password:** `Admin@123`
4. Click "SIGN IN"

---

## 🔍 Common Login Issues & Solutions

### Issue 1: "Login failed" Error
**Cause:** Backend server not running  
**Solution:** Start backend with `mvn spring-boot:run`

### Issue 2: "Invalid credentials" Error
**Cause:** Wrong password (case-sensitive)  
**Solution:** Use exactly `Admin@123` (capital A, @, 123)

### Issue 3: "Network Error" or "Connection Refused"
**Cause:** Backend not accessible  
**Solution:** 
- Check backend is on port 8081
- Verify CORS is configured for localhost:3000
- Restart backend server

### Issue 4: "Port 8081 already in use"
**Cause:** Backend already running or another process using port  
**Solution:**
```powershell
# Find and kill process on port 8081
$process = Get-NetTCPConnection -LocalPort 8081 | Select -ExpandProperty OwningProcess
Stop-Process -Id $process -Force

# Then start backend again
mvn spring-boot:run
```

### Issue 5: Frontend Can't Connect to Backend
**Cause:** CORS or API URL misconfiguration  
**Check:** Frontend should connect to `http://localhost:8081/api`

---

## ✅ Verification Checklist

Before attempting login, verify:

- [ ] Backend server is running (check port 8081)
- [ ] Frontend is running (check port 3000)
- [ ] Health endpoint responds: `http://localhost:8081/api/health`
- [ ] Using correct credentials: `admin@ccmart.com` / `Admin@123`
- [ ] Password is case-sensitive with capital 'A'

---

## 🚀 Quick Start Commands

### Start Backend
```powershell
cd backend-spring
mvn spring-boot:run
```

### Start Frontend
```powershell
cd frontend
npm start
```

### Test Backend Health
```powershell
Invoke-RestMethod http://localhost:8081/api/health
```

### Test Login
```powershell
$body = '{"email":"admin@ccmart.com","password":"Admin@123"}'
Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" -Method POST -Body $body -ContentType "application/json"
```

---

## 📊 System Status Check

Run this to check everything:

```powershell
Write-Host "Checking System Status..." -ForegroundColor Cyan

# Check Backend
try {
    $health = Invoke-RestMethod http://localhost:8081/api/health
    Write-Host "✅ Backend: Running" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend: Not Running" -ForegroundColor Red
}

# Check Frontend
try {
    $fe = Invoke-WebRequest http://localhost:3000 -UseBasicParsing -TimeoutSec 2
    Write-Host "✅ Frontend: Running" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend: Not Running" -ForegroundColor Red
}

# Test Login
try {
    $body = '{"email":"admin@ccmart.com","password":"Admin@123"}'
    $login = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ Login: Working" -ForegroundColor Green
} catch {
    Write-Host "❌ Login: Failed" -ForegroundColor Red
}
```

---

## 🎯 Current Status: ✅ FIXED

- ✅ Backend server is running on port 8081
- ✅ Login endpoint is working
- ✅ Admin credentials verified
- ✅ JWT token generation successful
- ✅ Ready for browser login

**You can now login from the browser using:**
- Email: `admin@ccmart.com`
- Password: `Admin@123`

---

**Last Updated:** October 12, 2025  
**Status:** All systems operational
