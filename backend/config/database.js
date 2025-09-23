const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Root123@',
  database: process.env.DB_NAME || 'ccmart_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get promise-based connection
const promisePool = pool.promise();

// Test database connection
const testConnection = async () => {
  try {
    // First try to connect without database
    const tempPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Root123@',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    const tempPromisePool = tempPool.promise();
    const connection = await tempPromisePool.getConnection();
    console.log('✅ MySQL server connected successfully');
    connection.release();
    await tempPromisePool.end();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Initialize database tables
const initializeDatabase = async () => {
  try {
    // First connect without database to create it
    const tempPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Root123@',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    const tempPromisePool = tempPool.promise();
    
    // Create database if it doesn't exist
    await tempPromisePool.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'ccmart_db'}`);
    
    // Now reconnect with the database
    await tempPromisePool.end();
    
    // Recreate the main pool with the database
    const newPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Root123@',
      database: process.env.DB_NAME || 'ccmart_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    const newPromisePool = newPool.promise();
    
    // Update the global pool reference
    Object.assign(pool, newPromisePool);

    // Create users table
    await newPromisePool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        role ENUM('customer', 'admin') DEFAULT 'customer',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create categories table
    await newPromisePool.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        image_url VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create products table
    await newPromisePool.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category_id INT,
        image_url VARCHAR(255),
        stock_quantity INT DEFAULT 0,
        unit VARCHAR(50) DEFAULT 'piece',
        is_active BOOLEAN DEFAULT true,
        is_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      )
    `);

    // Create orders table
    await newPromisePool.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        status ENUM('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled') DEFAULT 'pending',
        payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
        payment_method ENUM('cash_on_delivery', 'card', 'bank_transfer') DEFAULT 'cash_on_delivery',
        delivery_address TEXT NOT NULL,
        delivery_phone VARCHAR(20),
        delivery_notes TEXT,
        delivery_date DATE,
        delivery_time VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create order_items table
    await newPromisePool.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    // Create cart table (for persistent cart)
    await newPromisePool.execute(`
      CREATE TABLE IF NOT EXISTS cart (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_product (user_id, product_id)
      )
    `);

    // Insert default admin user
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await newPromisePool.execute(`
      INSERT IGNORE INTO users (name, email, password, role) 
      VALUES ('Admin User', 'admin@ccmart.lk', ?, 'admin')
    `, [hashedPassword]);

    // Insert sample categories with images
    await newPromisePool.execute(`
      INSERT IGNORE INTO categories (name, description, image_url) VALUES
      ('Fruits & Vegetables', 'Fresh fruits and vegetables from local farms', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop'),
      ('Dairy & Eggs', 'Fresh milk, cheese, eggs and dairy products', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop'),
      ('Meat & Seafood', 'Fresh meat, poultry and seafood', 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop'),
      ('Bakery', 'Fresh bread, pastries and baked goods', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop'),
      ('Pantry', 'Rice, pasta, canned goods and dry foods', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop'),
      ('Beverages', 'Drinks, juices, coffee and beverages', 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=300&fit=crop'),
      ('Snacks', 'Chips, cookies, nuts and snack foods', 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=300&fit=crop'),
      ('Household', 'Cleaning supplies and household items', 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400&h=300&fit=crop')
    `);

    // Insert sample products with images
    await newPromisePool.execute(`
      INSERT IGNORE INTO products (name, description, price, category_id, stock_quantity, unit, is_featured, image_url) VALUES
      ('Fresh Bananas', 'Sweet and ripe bananas from local farms', 120.00, 1, 50, 'kg', true, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop'),
      ('Red Apples', 'Crispy red apples - perfect for snacking', 200.00, 1, 30, 'kg', true, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop'),
      ('Fresh Carrots', 'Organic carrots - great for cooking', 150.00, 1, 40, 'kg', false, 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop'),
      ('Fresh Tomatoes', 'Juicy red tomatoes for salads and cooking', 180.00, 1, 35, 'kg', false, 'https://images.unsplash.com/photo-1546470427-5c9d2a73ee3b?w=400&h=300&fit=crop'),
      ('Fresh Milk', 'Full cream fresh milk from local dairy', 180.00, 2, 100, 'liter', true, 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop'),
      ('Fresh Eggs', 'Farm fresh eggs - 12 pieces', 250.00, 2, 60, 'dozen', false, 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d3?w=400&h=300&fit=crop'),
      ('Cheddar Cheese', 'Aged cheddar cheese - 200g', 320.00, 2, 25, 'packet', false, 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop'),
      ('Yogurt', 'Natural yogurt - 500ml', 120.00, 2, 40, 'cup', false, 'https://images.unsplash.com/photo-1571212058562-4b1b3b3b3b3b?w=400&h=300&fit=crop'),
      ('Chicken Breast', 'Fresh chicken breast - skinless', 650.00, 3, 25, 'kg', false, 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop'),
      ('Fresh Fish', 'Local fresh fish - cleaned and ready', 800.00, 3, 20, 'kg', false, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop'),
      ('Ground Beef', 'Fresh ground beef - 80% lean', 750.00, 3, 30, 'kg', false, 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop'),
      ('White Bread', 'Fresh white bread loaf - daily baked', 85.00, 4, 40, 'loaf', false, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop'),
      ('Whole Wheat Bread', 'Healthy whole wheat bread', 95.00, 4, 35, 'loaf', false, 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=300&fit=crop'),
      ('Croissants', 'Buttery croissants - 6 pieces', 180.00, 4, 20, 'packet', false, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop'),
      ('Basmati Rice', 'Premium basmati rice - long grain', 450.00, 5, 60, 'kg', true, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop'),
      ('Pasta', 'Italian pasta - 500g', 120.00, 5, 50, 'packet', false, 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400&h=300&fit=crop'),
      ('Cooking Oil', 'Sunflower cooking oil - 1 liter', 280.00, 5, 40, 'bottle', false, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop'),
      ('Sugar', 'White sugar - 1kg', 150.00, 5, 45, 'kg', false, 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop'),
      ('Coca Cola', 'Refreshing cola drink - 500ml', 120.00, 6, 80, 'bottle', false, 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=300&fit=crop'),
      ('Orange Juice', 'Fresh orange juice - 1 liter', 200.00, 6, 30, 'bottle', false, 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop'),
      ('Mineral Water', 'Pure mineral water - 1.5 liter', 80.00, 6, 100, 'bottle', false, 'https://images.unsplash.com/photo-1548839140-29a749e1e4b3?w=400&h=300&fit=crop'),
      ('Coffee', 'Premium coffee beans - 250g', 350.00, 6, 25, 'packet', false, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop'),
      ('Potato Chips', 'Crispy potato chips - 150g', 95.00, 7, 50, 'packet', false, 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=300&fit=crop'),
      ('Chocolate Cookies', 'Sweet chocolate cookies - 200g', 180.00, 7, 40, 'packet', false, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop'),
      ('Nuts Mix', 'Mixed nuts - 250g', 450.00, 7, 30, 'packet', false, 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&h=300&fit=crop'),
      ('Dish Soap', 'Liquid dish soap - 500ml', 120.00, 8, 60, 'bottle', false, 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400&h=300&fit=crop'),
      ('Toilet Paper', 'Soft toilet paper - 12 rolls', 350.00, 8, 40, 'packet', false, 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop'),
      ('Laundry Detergent', 'Powerful laundry detergent - 2kg', 450.00, 8, 25, 'box', false, 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400&h=300&fit=crop')
    `);

    console.log('✅ Database tables initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    return false;
  }
};

module.exports = {
  pool: promisePool,
  testConnection,
  initializeDatabase
};
