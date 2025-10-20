# 🚀 C&C Mart - Quick Start Card

## ⚡ 3-Step Setup

### Step 1: Setup Database
```bash
# Double-click this file:
setup-database.bat
```

### Step 2: Start Application
```bash
# Double-click this file:
start-app.bat
```

### Step 3: Open Browser
```
http://localhost:3000
```

## 📝 Login Credentials

**Admin:**
- Email: `admin@ccmart.com`
- Password: `password123`

**Customer:**
- Email: `john@example.com`
- Password: `password123`

## 🔧 If Something Goes Wrong

### Database Connection Failed?
1. Open Services (`Win+R` → `services.msc`)
2. Find "MySQL" → Right-click → Start
3. Run `setup-database.bat` again

### Port 8081 Already in Use?
```bash
netstat -ano | findstr :8081
taskkill /PID <PID_NUMBER> /F
```

### Frontend Won't Start?
```bash
cd frontend
npm install
npm start
```

## 📂 All Setup Files

| File | What It Does |
|------|-------------|
| `setup-database.bat` | ✅ Creates database & tables |
| `start-app.bat` | ✅ Starts backend + frontend |
| `reset-database.bat` | ⚠️ Resets database (deletes data) |
| `database-schema.sql` | 📋 Database structure |
| `database-seed.sql` | 📊 Sample data |
| `SETUP-INSTRUCTIONS.md` | 📖 Full documentation |

## 🌐 URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8081

## 🎯 Quick Commands

### Check if Backend is Running:
```bash
curl http://localhost:8081/actuator/health
```

### View Database:
```bash
mysql -u root -p
USE ccmart_db;
SHOW TABLES;
```

### Stop Application:
- Close the two command windows that opened
- Or press `Ctrl+C` in each terminal

---

**That's it! You're ready to go! 🎉**
