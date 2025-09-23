# C&C Mart - Grocery Store E-commerce Platform

A full-stack grocery store application built with React frontend and Node.js backend with MySQL database.

## 🏪 Features

### Customer Features
- Browse products by categories
- Search and filter products
- Add items to cart
- User authentication (login/register)
- Order management
- Profile management
- Contact information

### Admin Features
- Product management (CRUD)
- Category management
- Order management
- User management
- Sales reports and analytics
- Inventory management

## 🛠️ Tech Stack

### Frontend
- React 18
- Material-UI (MUI)
- React Router
- Axios
- React Query
- React Hook Form
- React Toastify

### Backend
- Node.js
- Express.js
- MySQL
- JWT Authentication
- bcryptjs
- Express Validator

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd ccmart
```

### 2. Database Setup
1. Install MySQL and create a database:
```sql
CREATE DATABASE ccmart_db;
```

2. Update database credentials in `backend/start.js`:
```javascript
process.env.DB_USER = 'root';
process.env.DB_PASSWORD = 'Root123@';
process.env.DB_NAME = 'ccmart_db';
```

### 3. Backend Setup
```bash
cd backend
npm install
npm start
```

The backend will start on `http://localhost:8080`

### 4. Frontend Setup
```bash
cd frontend
npm install
npm start
```

The frontend will start on `http://localhost:3000`

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

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `GET /api/categories/:id/products` - Get products by category
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Orders
- `GET /api/orders` - Get orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `PUT /api/orders/:id/cancel` - Cancel order

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart
- `DELETE /api/cart` - Clear cart

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

1. **Customer Flow**:
   - Browse products on homepage
   - Register/Login to place orders
   - Add items to cart
   - Proceed to checkout
   - Track orders in profile

2. **Admin Flow**:
   - Login with admin credentials
   - Access admin dashboard
   - Manage products, categories, orders
   - View reports and analytics

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet security headers

## 📊 Database Schema

The application automatically creates the following tables:
- `users` - User accounts
- `categories` - Product categories
- `products` - Product information
- `orders` - Order details
- `order_items` - Order line items
- `cart` - User cart items

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