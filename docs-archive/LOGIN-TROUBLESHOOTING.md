# 🔧 C&C Mart Login Troubleshooting Guide

## 🚨 Quick Fix (When Login Fails)

### Option 1: Double-click the Fix File
1. **Double-click** `fix-login.bat` in the project root
2. Wait for it to restart the server
3. Try logging in again

### Option 2: Manual Restart
1. Open PowerShell in project root
2. Run: `cd backend`
3. Run: `node server-checker.js --quick`
4. Try logging in again

## 🔍 Common Causes & Solutions

### 1. **"Login failed" Error**
**Causes:**
- Backend server stopped running
- Rate limiting (too many attempts)
- Database connection issues

**Solutions:**
```powershell
# Quick fix
cd backend
node server-checker.js --quick

# Or full diagnosis
node server-checker.js
```

### 2. **"Network Error" or "Connection Refused"**
**Cause:** Backend server is not running

**Solution:**
```powershell
cd backend
npm start
```

### 3. **"Too many requests" Error**
**Cause:** Rate limiting activated

**Solutions:**
- Wait 15 minutes, OR
- Restart the server (clears rate limits)

### 4. **Server Won't Start**
**Causes:**
- Port 8081 already in use
- Missing dependencies
- Database not running

**Solutions:**
```powershell
# Kill processes using port 8081
netstat -ano | findstr :8081
taskkill /PID [PID_NUMBER] /F

# Reinstall dependencies
npm install

# Start server
npm start
```

## 🔄 Automated Monitoring

### Run Server Checker
```powershell
cd backend
node server-checker.js
```

This will:
- ✅ Check server health
- ✅ Test login endpoint
- ✅ Restart if needed
- ✅ Clear rate limits

## 📋 Manual Server Management

### Start Backend Server
```powershell
cd backend
npm start
```

### Check if Server is Running
```powershell
netstat -ano | findstr :8081
```

### Kill Server Process
```powershell
# Find PID from netstat output above
taskkill /PID [PID_NUMBER] /F
```

### Test Login API Directly
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"admin@ccmart.lk","password":"admin123"}'
```

## 🔐 Login Credentials

### Admin Account
- **Email:** `admin@ccmart.lk`
- **Password:** `admin123`

### Test Account (if created)
- **Email:** `test@example.com`
- **Password:** `password123`

## 🚀 Prevention Tips

1. **Keep Backend Running:** Don't close the terminal running the backend
2. **Use Background Mode:** Start backend with `npm start` in a dedicated terminal
3. **Check Server Status:** Before logging in, ensure backend is running
4. **Avoid Spam Clicking:** Don't click login button multiple times rapidly

## 🆘 Emergency Reset

If everything fails:

```powershell
# 1. Kill all Node processes
taskkill /F /IM node.exe

# 2. Clear npm cache
npm cache clean --force

# 3. Reinstall dependencies
cd backend
npm install

# 4. Restart everything
npm start
```

## 📞 Common Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| "Login failed" | Generic login error | Use quick fix |
| "Too many requests" | Rate limited | Wait or restart server |
| "Network Error" | Backend not running | Start backend server |
| "Invalid credentials" | Wrong email/password | Check credentials |
| "Server Error" | Backend crash | Restart server |

## 🔧 Server Configuration

Current settings in `backend/start.js`:
- **Port:** 8081
- **Rate Limit:** 1000 requests per 15 minutes
- **Database:** ccmart_db on localhost:3306

---

**Need Help?** Run the server checker: `cd backend && node server-checker.js`

