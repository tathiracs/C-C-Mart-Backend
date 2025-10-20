# 🏪 C&C Mart - Complete Grocery Store E-commerce Platform

> **Status**: ✅ Production Ready | **Version**: 1.0.0 | **Last Updated**: October 19, 2025

A full-stack grocery store application with comprehensive order management and delivery agent assignment system.

## ✨ Key Features

### 🛒 Customer Features
- ✅ User registration and authentication
- ✅ Product browsing with category filters
- ✅ Shopping cart with real-time updates
- ✅ Secure checkout process
- ✅ Order history and tracking
- ✅ View assigned delivery agent details
- ✅ Profile and account management

### 👨‍💼 Admin Features
- ✅ **Complete Order Management Workflow**
  - Approve pending orders
  - Assign delivery agents
  - Track order status progression
  - Real-time statistics dashboard
- ✅ **Delivery Agent Management**
  - Add/edit delivery agents
  - Track availability status
  - View agent assignments
- ✅ Product catalog management (CRUD)
- ✅ Category management
- ✅ User management
- ✅ Sales reports and analytics
- ✅ Role-based access control

### 🚚 Order Workflow
```
Customer Places Order → Admin Approves → Admin Assigns Delivery Agent 
  → Delivery Starts → Order Delivered → Customer Sees Agent Details
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Material-UI (MUI)** - Component library
- **React Router v6** - Navigation
- **Axios** - HTTP client
- **React Context API** - State management
- **React Toastify** - Notifications
- **LocalStorage** - Cart persistence

### Backend
- **Spring Boot 3.x** - Java framework
- **Java 21** - Programming language
- **Spring Security** - Authentication & Authorization
- **JWT** - Token-based authentication
- **JPA/Hibernate** - ORM
- **MySQL 8** - Database
- **Maven** - Build tool

### Database Schema
- **users** - Customer and admin accounts
- **products** - Product catalog
- **categories** - Product categories
- **orders** - Order records with workflow status
- **order_items** - Order line items
- **delivery_agents** - Delivery personnel
- **cart_items** - Shopping cart

## 📋 Prerequisites

- **Java 21** or higher
- **Maven 3.8+** (for building backend)
- **Node.js 16+** (for frontend)
- **MySQL 8.0+** (database)
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd C-C_Mart
```

### 2. Database Setup
1. Install MySQL and create a database:
```sql
CREATE DATABASE ccmart_db;
```

2. Update database credentials in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ccmart_db
spring.datasource.username=root
spring.datasource.password=Root123@
```

### 3. **Build Frontend FIRST** (Important!)
```bash
cd frontend
npm install
npm run build
```
This creates the `frontend/build/` directory needed by the backend.

### 4. Backend Setup
```bash
cd ../backend
mvn clean package
java -jar target/ccmart-backend-0.0.1-SNAPSHOT.jar
```
Or run in development mode:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080` and serve both API and React frontend.

### 5. Frontend Development (Optional)
For hot-reloading during frontend development:
```bash
cd frontend
npm start
```
This starts a dev server on `http://localhost:3000` with live updates.

## 🔑 Default Admin Credentials

- **Email**: admin@ccmart.lk
- **Password**: admin123

## 📁 Project Structure

```
ccmart/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── ...
│   └── package.json
├── backend/                 # Node.js backend API
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── config/             # Database configuration
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### User Management
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get single user (Admin)
- `PUT /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)
- `PUT /api/users/:id/status` - Update user status (Admin)

### Admin Dashboard
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/analytics` - Get analytics data
- `GET /api/admin/reports` - Generate reports
- `GET /api/admin/system-health` - Get system health status

### Orders
- `GET /api/orders` - Get orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `PUT /api/orders/:id/cancel` - Cancel order

### Profile Management
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `PUT /api/profile/password` - Change password
- `DELETE /api/profile` - Delete user account

## 🌐 Environment Variables

### Backend (.env)
```env
PORT=8080
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ccmart_db
DB_USER=root
DB_PASSWORD=Root123@
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8080/api
```

## 📱 Usage

### 🔐 Authentication System

#### User Registration
1. Navigate to `/register` page
2. Fill in required information:
   - Full Name
   - Email Address
   - Phone Number
   - Password (minimum 8 characters)
   - Confirm Password
3. Accept terms and conditions
4. Click "Register" to create account
5. Verify email address (if email verification is enabled)

#### User Login
1. Navigate to `/login` page
2. Enter registered email and password
3. Optional: Check "Remember Me" for persistent login
4. Click "Login" to access account
5. Forgot password option available for password reset

### 👨‍💼 Admin Dashboard

#### Accessing Admin Dashboard
1. Login with admin credentials (admin@ccmart.lk / admin123)
2. Navigate to `/admin/dashboard`
3. Access comprehensive admin panel

#### Dashboard Features

**📊 Analytics Overview**
- Real-time user statistics
- Order trends and metrics
- Revenue analytics
- System performance monitoring

**👥 User Management**
- View all registered users
- User activity monitoring
- Account status management (active/inactive/banned)
- User role assignment
- Bulk user operations

**📋 Order Management**
- View all orders with filtering options
- Order status tracking and updates
- Order details and history
- Customer communication tools

**📈 Reports & Analytics**
- Generate custom reports
- Export data in various formats (PDF, Excel, CSV)
- Sales performance tracking
- User engagement metrics

**⚙️ System Configuration**
- Application settings management
- Email template configuration
- Security settings
- Backup and maintenance tools

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet security headers

## 📊 Database Schema

The application automatically creates the following tables:
- `users` - User accounts and authentication
- `user_profiles` - Extended user profile information
- `user_sessions` - Active user sessions
- `orders` - Order details and history
- `order_items` - Order line items
- `admin_logs` - Admin activity logging
- `system_settings` - Application configuration

## 🚀 Deployment

### Backend Deployment
1. Set up production environment variables
2. Install PM2 for process management
3. Configure reverse proxy (nginx)
4. Set up SSL certificate

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, etc.)
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email info@ccmart.lk or visit our store at Main Road, Kurunegala, Sri Lanka.

---

**C&C Mart** - Your trusted neighborhood grocery store since 2009