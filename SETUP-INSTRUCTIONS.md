# 🛒 C&C Mart - Complete Setup Instructions

Welcome to C&C Mart! This guide will help you set up and run the complete application.

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Default Credentials](#default-credentials)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

Make sure you have the following installed:

### Required:
- ✅ **Java 21+** - [Download](https://www.oracle.com/java/technologies/downloads/)
- ✅ **MySQL 8.0+** - [Download](https://dev.mysql.com/downloads/mysql/)
- ✅ **Node.js 16+** - [Download](https://nodejs.org/)

### Optional (for development):
- Maven 3.6+ (if rebuilding the backend)
- Git (for version control)

## 🚀 Quick Start

### 1️⃣ Setup Database (One-Time Setup)

#### Option A: Automated Setup (Windows)
Double-click the batch file:
```
setup-database.bat
```

#### Option B: PowerShell
```powershell
.\setup-database.ps1
```

#### Option C: Manual Setup
```bash
# Open MySQL Command Line Client
mysql -u root -p

# Run the schema script
source database-schema.sql

# Load sample data (optional)
source database-seed.sql
```

### 2️⃣ Start the Application

#### Option A: Start Everything at Once
```
start-app.bat
```

#### Option B: Start Manually

**Terminal 1 - Backend:**
```bash
cd backend
java -jar target/backend-spring-0.0.1-SNAPSHOT.jar
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install  # First time only
npm start
```

### 3️⃣ Access the Application

- 🌐 **Frontend**: http://localhost:3000
- 🔌 **Backend API**: http://localhost:8081
- 📊 **H2 Console** (if using H2): http://localhost:8081/h2-console

## 💾 Database Setup

### Automated Setup Scripts

| Script | Purpose |
|--------|---------|
| `setup-database.bat` | Complete database setup (Windows) |
| `setup-database.ps1` | Complete database setup (PowerShell) |
| `reset-database.bat` | ⚠️ Reset database (deletes all data) |
| `database-schema.sql` | Database schema SQL script |
| `database-seed.sql` | Sample data SQL script |

### Database Configuration

Default settings in `backend/src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/ccmart_db
spring.datasource.username=root
spring.datasource.password=Root123@
```

**To use custom credentials**, set environment variables:
```bash
# Windows (CMD)
set DB_USER=your_username
set DB_PASSWORD=your_password

# Windows (PowerShell)
$env:DB_USER="your_username"
$env:DB_PASSWORD="your_password"

# Linux/Mac
export DB_USER=your_username
export DB_PASSWORD=your_password
```

### Database Schema

The application uses the following tables:
- `users` - User accounts (customers & admins)
- `categories` - Product categories
- `products` - Product catalog
- `cart` - Shopping cart items
- `orders` - Customer orders
- `order_items` - Order line items
- `delivery_agents` - Delivery personnel

## 🎮 Running the Application

### Backend (Spring Boot)

The backend will start on **port 8081** by default.

```bash
cd backend
java -jar target/backend-spring-0.0.1-SNAPSHOT.jar
```

**Check if backend is running:**
```bash
curl http://localhost:8081/actuator/health
```

### Frontend (React)

The frontend will start on **port 3000** and open automatically in your browser.

```bash
cd frontend
npm install  # First time only
npm start
```

## 📁 Project Structure

```
C-C-Mart-Backend/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/ccmart/backend/
│   │   │   │   ├── model/          # Entity classes
│   │   │   │   ├── repository/     # Data access layer
│   │   │   │   ├── service/        # Business logic
│   │   │   │   ├── controller/     # REST API endpoints
│   │   │   │   ├── config/         # Configuration classes
│   │   │   │   └── dto/            # Data transfer objects
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── target/
│   │   └── backend-spring-0.0.1-SNAPSHOT.jar
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── contexts/
│   │   └── App.js
│   ├── public/
│   └── package.json
│
├── setup-database.bat           # Windows batch setup
├── setup-database.ps1           # PowerShell setup
├── database-schema.sql          # Database structure
├── database-seed.sql            # Sample data
├── start-app.bat                # Start both servers
├── reset-database.bat           # Reset database
└── DATABASE-SETUP-GUIDE.md      # Detailed DB guide
```

## 🔐 Default Credentials

### Admin Account (After seed data):
```
Email: admin@ccmart.com
Password: password123
```

### Customer Accounts:
```
Email: john@example.com
Password: password123

Email: jane@example.com
Password: password123
```

### Database:
```
Database: ccmart_db
Username: root
Password: Root123@
Host: localhost
Port: 3306
```

## 🐛 Troubleshooting

### MySQL Connection Failed

**Error**: `Access denied for user 'root'@'localhost'`

**Solutions**:
1. Check MySQL service is running:
   - Windows: Open Services (`Win+R` → `services.msc`)
   - Find "MySQL" service
   - Start if stopped

2. Verify password in `application.properties`

3. Reset MySQL root password if needed:
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'Root123@';
   FLUSH PRIVILEGES;
   ```

### Port Already in Use

**Error**: `Port 8081 is already in use`

**Solution**:
```bash
# Windows - Find and kill process
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# Or change port in application.properties
server.port=8082
```

### Frontend Not Starting

**Error**: `react-scripts not found`

**Solution**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Maven Not Found (for rebuilding)

**Solution**: Use the compiled JAR directly:
```bash
java -jar backend/target/backend-spring-0.0.1-SNAPSHOT.jar
```

Or install Maven:
- Download from https://maven.apache.org/download.cgi
- Add `bin` directory to PATH

### Database Tables Not Created

**Solution**:
1. Check `spring.jpa.hibernate.ddl-auto=update` in `application.properties`
2. Or manually run:
   ```bash
   mysql -u root -p < database-schema.sql
   ```

## 📚 API Documentation

### Key Endpoints:

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

**Products:**
- `GET /api/products` - List all products
- `GET /api/products/{id}` - Get product details
- `POST /api/products` - Create product (Admin)

**Cart:**
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `DELETE /api/cart/remove/{id}` - Remove from cart

**Orders:**
- `GET /api/orders` - Get user's orders
- `POST /api/orders/place` - Place new order
- `GET /api/orders/{id}` - Get order details

## 🔄 Development Workflow

### Making Changes to Backend:
```bash
cd backend
mvn clean package
java -jar target/backend-spring-0.0.1-SNAPSHOT.jar
```

### Making Changes to Frontend:
The development server auto-reloads on file changes.

### Reset Database:
```bash
reset-database.bat
```
⚠️ **Warning**: This deletes all data!

## 🎯 Next Steps

1. ✅ Setup database → Run `setup-database.bat`
2. ✅ Start application → Run `start-app.bat`
3. ✅ Open browser → http://localhost:3000
4. ✅ Login with default credentials
5. 🎉 Start shopping!

## 📞 Support

For issues or questions:
1. Check the [DATABASE-SETUP-GUIDE.md](DATABASE-SETUP-GUIDE.md)
2. Review error logs in console
3. Verify all prerequisites are installed
4. Check port availability

---

**Happy Shopping! 🛒**
