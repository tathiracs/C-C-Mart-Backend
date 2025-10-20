# C&C Mart Database Setup Guide

## 📋 Prerequisites

Before setting up the database, ensure you have:

1. **MySQL Server 8.0+** installed
2. **MySQL Server running** (check Windows Services)
3. **MySQL bin directory** added to your system PATH

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)

Simply double-click the batch file:
```
setup-database.bat
```

This will:
- ✅ Check MySQL installation
- ✅ Create the database `ccmart_db`
- ✅ Create all tables with proper relationships
- ✅ Load sample data for testing

### Option 2: Manual Setup

If you prefer manual setup or need to customize:

1. **Open MySQL Command Line Client** or any MySQL tool
2. **Run the schema script**:
   ```sql
   source database-schema.sql
   ```
3. **Run the seed script** (optional - for sample data):
   ```sql
   source database-seed.sql
   ```

## 📊 Database Schema

### Tables Created:
- `users` - Customer and admin accounts
- `categories` - Product categories
- `products` - Product catalog
- `cart` - Shopping cart items
- `orders` - Customer orders
- `order_items` - Order line items
- `delivery_agents` - Delivery personnel

### Default Credentials:
```
Database: ccmart_db
Username: root
Password: Root123@
Host: localhost
Port: 3306
```

### Sample User Accounts (after seed):
```
Admin:
  Email: admin@ccmart.com
  Password: password123

Customer:
  Email: john@example.com
  Password: password123
```

## 🔧 Additional Scripts

### Start Full Application
```
start-app.bat
```
Starts both backend and frontend servers.

### Reset Database
```
reset-database.bat
```
⚠️ **WARNING**: Deletes all data and recreates the database.

## 🛠️ Troubleshooting

### MySQL Not Found
**Error**: `MySQL not found in PATH!`

**Solution**:
1. Find your MySQL installation (usually `C:\Program Files\MySQL\MySQL Server X.X\bin`)
2. Add it to system PATH:
   - Right-click "This PC" → Properties
   - Advanced System Settings → Environment Variables
   - Edit "Path" → Add MySQL bin directory
   - Restart terminal/command prompt

### Connection Failed
**Error**: `Cannot connect to MySQL!`

**Solutions**:
1. **Check MySQL Service**:
   - Press `Win + R`, type `services.msc`
   - Find "MySQL" service
   - Ensure it's "Running"
   - If not, right-click → Start

2. **Verify Credentials**:
   - Check your MySQL root password
   - Update `application.properties` if different:
     ```properties
     spring.datasource.username=your_username
     spring.datasource.password=your_password
     ```

3. **Check Port**:
   - Ensure MySQL is running on port 3306
   - Check for port conflicts

### Access Denied Error
**Error**: `Access denied for user 'root'@'localhost'`

**Solution**:
Reset MySQL root password:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'Root123@';
FLUSH PRIVILEGES;
```

## 📝 Manual SQL Commands

### Create Database Only
```sql
CREATE DATABASE IF NOT EXISTS ccmart_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

### Check Tables
```sql
USE ccmart_db;
SHOW TABLES;
```

### View Sample Data
```sql
SELECT * FROM users;
SELECT * FROM products;
SELECT * FROM categories;
```

### Drop Database (⚠️ Deletes Everything)
```sql
DROP DATABASE ccmart_db;
```

## 🔐 Security Notes

1. **Change default passwords** in production
2. The sample passwords are **hashed with BCrypt**
3. Never commit real credentials to version control
4. Use environment variables for sensitive data

## 📞 Need Help?

If you encounter issues:
1. Check the error messages carefully
2. Verify MySQL service is running
3. Confirm credentials are correct
4. Check firewall settings
5. Review MySQL error logs

## 🎯 Next Steps

After database setup:
1. ✅ Database created and seeded
2. ⏭️ Start the backend: `java -jar backend/target/backend-spring-0.0.1-SNAPSHOT.jar`
3. ⏭️ Start the frontend: `cd frontend && npm start`
4. 🌐 Access the app: http://localhost:3000

---

**Happy Coding! 🚀**
