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

    // Ensure unique index on category name to prevent duplicates (compatible with MySQL versions)
    const [idxRows] = await newPromisePool.execute(`
      SELECT 1 FROM INFORMATION_SCHEMA.STATISTICS 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'categories' 
        AND INDEX_NAME = 'categories_name_unique'
      LIMIT 1
    `);
    if (idxRows.length === 0) {
      await newPromisePool.execute(`
        CREATE UNIQUE INDEX categories_name_unique ON categories (name)
      `);
    }

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

    // Seed categories only if table is empty
    const [catCountRows] = await newPromisePool.execute('SELECT COUNT(*) as count FROM categories');
    if ((catCountRows[0]?.count || 0) === 0) {
      await newPromisePool.execute(`
        INSERT INTO categories (name, description, image_url) VALUES
        ('Fresh Vegetables', 'Local and imported fresh vegetables', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop'),
        ('Fresh Fruits', 'Seasonal fruits and tropical varieties', 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400&h=300&fit=crop'),
        ('Dairy & Eggs', 'Fresh milk, cheese, yogurt, and eggs', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop'),
        ('Meat & Poultry', 'Fresh chicken, beef, pork, and lamb', 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop'),
        ('Seafood', 'Fresh fish, prawns, crabs, and other seafood', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop'),
        ('Rice & Grains', 'Basmati rice, red rice, wheat, and other grains', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop'),
        ('Spices & Condiments', 'Traditional Sri Lankan spices and seasonings', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop'),
        ('Cooking Essentials', 'Oil, sugar, salt, vinegar, and cooking basics', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop'),
        ('Bakery & Bread', 'Fresh bread, pastries, and baked goods', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop'),
        ('Frozen Foods', 'Frozen vegetables, meat, and ready-to-eat meals', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'),
        ('Beverages', 'Soft drinks, juices, tea, coffee, and water', 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=300&fit=crop'),
        ('Snacks & Confectionery', 'Chips, biscuits, chocolates, and sweets', 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=300&fit=crop'),
        ('Canned & Preserved', 'Canned goods, pickles, and preserved foods', 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop'),
        ('Personal Care', 'Shampoo, soap, toothpaste, and hygiene products', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'),
        ('Household Items', 'Cleaning supplies, detergents, and home essentials', 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400&h=300&fit=crop'),
        ('Baby Care', 'Baby food, diapers, and infant care products', 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=300&fit=crop')
      `);
    }

    // Seed products only if table is empty
    const [prodCountRows] = await newPromisePool.execute('SELECT COUNT(*) as count FROM products');
    if ((prodCountRows[0]?.count || 0) === 0) {
      await newPromisePool.execute(`
      INSERT IGNORE INTO products (name, description, price, category_id, stock_quantity, unit, is_featured, image_url) VALUES
      -- Fresh Vegetables (Category 1)
      ('Fresh Carrots', 'Organic carrots - great for cooking', 150.00, 1, 40, 'kg', false, 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop'),
      ('Fresh Tomatoes', 'Juicy red tomatoes for salads and cooking', 180.00, 1, 35, 'kg', true, 'https://images.unsplash.com/photo-1546470427-5c9d2a73ee3b?w=400&h=300&fit=crop'),
      ('Green Beans', 'Fresh green beans - perfect for stir-fry', 200.00, 1, 30, 'kg', false, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'),
      ('Red Onions', 'Large red onions for cooking', 120.00, 1, 50, 'kg', false, 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400&h=300&fit=crop'),
      ('Bell Peppers', 'Mixed colored bell peppers', 350.00, 1, 25, 'kg', false, 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=300&fit=crop'),
      
      -- Fresh Fruits (Category 2)
      ('Fresh Bananas', 'Sweet and ripe bananas from local farms', 120.00, 2, 50, 'kg', true, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop'),
      ('Red Apples', 'Crispy red apples - perfect for snacking', 200.00, 2, 30, 'kg', true, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop'),
      ('Mangoes', 'Sweet local mangoes - seasonal', 180.00, 2, 40, 'kg', true, 'https://images.unsplash.com/photo-1605027990121-1be6e5f7d4d7?w=400&h=300&fit=crop'),
      ('Pineapples', 'Fresh pineapples - ready to eat', 220.00, 2, 20, 'piece', false, 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=300&fit=crop'),
      ('Oranges', 'Sweet oranges - rich in vitamin C', 160.00, 2, 35, 'kg', false, 'https://images.unsplash.com/photo-1557800634-7bf3c73be389?w=400&h=300&fit=crop'),
      
      -- Dairy & Eggs (Category 3)
      ('Fresh Milk', 'Full cream fresh milk from local dairy', 180.00, 3, 100, 'liter', true, 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop'),
      ('Fresh Eggs', 'Farm fresh eggs - 12 pieces', 250.00, 3, 60, 'dozen', false, 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d3?w=400&h=300&fit=crop'),
      ('Cheddar Cheese', 'Aged cheddar cheese - 200g', 320.00, 3, 25, 'packet', false, 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop'),
      ('Yogurt', 'Natural yogurt - 500ml', 120.00, 3, 40, 'cup', false, 'https://images.unsplash.com/photo-1571212058562-4b1b3b3b3b3b?w=400&h=300&fit=crop'),
      ('Butter', 'Fresh butter - 250g', 280.00, 3, 30, 'packet', false, 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=300&fit=crop'),
      
      -- Meat & Poultry (Category 4)
      ('Chicken Breast', 'Fresh chicken breast - skinless', 650.00, 4, 25, 'kg', false, 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop'),
      ('Ground Beef', 'Fresh ground beef - 80% lean', 750.00, 4, 30, 'kg', false, 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop'),
      ('Pork Chops', 'Fresh pork chops', 680.00, 4, 20, 'kg', false, 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop'),
      ('Lamb Mince', 'Fresh lamb mince', 850.00, 4, 15, 'kg', false, 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop'),
      ('Chicken Thighs', 'Fresh chicken thighs with bone', 580.00, 4, 35, 'kg', false, 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop'),
      
      -- Seafood (Category 5)
      ('Fresh Fish', 'Local fresh fish - cleaned and ready', 800.00, 5, 20, 'kg', true, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop'),
      ('Prawns', 'Fresh prawns - large size', 1200.00, 5, 15, 'kg', false, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop'),
      ('Crab', 'Fresh crab - whole', 900.00, 5, 10, 'kg', false, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop'),
      ('Squid', 'Fresh squid rings', 650.00, 5, 12, 'kg', false, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop'),
      ('Tuna Steaks', 'Fresh tuna steaks', 950.00, 5, 8, 'kg', false, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop'),
      
      -- Rice & Grains (Category 6)
      ('Basmati Rice', 'Premium basmati rice - long grain', 450.00, 6, 60, 'kg', true, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop'),
      ('Red Rice', 'Healthy red rice - local variety', 380.00, 6, 40, 'kg', false, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop'),
      ('Wheat Flour', 'All-purpose wheat flour', 120.00, 6, 50, 'kg', false, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop'),
      ('Oats', 'Rolled oats for breakfast', 180.00, 6, 30, 'kg', false, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop'),
      ('Quinoa', 'Organic quinoa grains', 850.00, 6, 15, 'kg', false, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop'),
      
      -- Spices & Condiments (Category 7)
      ('Cinnamon Sticks', 'Premium cinnamon sticks', 450.00, 7, 25, '100g', false, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop'),
      ('Turmeric Powder', 'Pure turmeric powder', 320.00, 7, 30, '100g', false, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop'),
      ('Chili Powder', 'Hot chili powder', 280.00, 7, 35, '100g', false, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop'),
      ('Curry Leaves', 'Fresh curry leaves', 50.00, 7, 40, 'bunch', false, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop'),
      ('Garlic Paste', 'Fresh garlic paste', 150.00, 7, 20, '100g', false, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop'),
      
      -- Cooking Essentials (Category 8)
      ('Cooking Oil', 'Sunflower cooking oil - 1 liter', 280.00, 8, 40, 'bottle', false, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop'),
      ('Sugar', 'White sugar - 1kg', 150.00, 8, 45, 'kg', false, 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop'),
      ('Salt', 'Iodized table salt - 1kg', 80.00, 8, 50, 'kg', false, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop'),
      ('Vinegar', 'White vinegar - 500ml', 120.00, 8, 25, 'bottle', false, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop'),
      ('Soy Sauce', 'Premium soy sauce - 250ml', 180.00, 8, 30, 'bottle', false, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop'),
      
      -- Bakery & Bread (Category 9)
      ('White Bread', 'Fresh white bread loaf - daily baked', 85.00, 9, 40, 'loaf', false, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop'),
      ('Whole Wheat Bread', 'Healthy whole wheat bread', 95.00, 9, 35, 'loaf', false, 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=300&fit=crop'),
      ('Croissants', 'Buttery croissants - 6 pieces', 180.00, 9, 20, 'packet', false, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop'),
      ('Cake', 'Fresh chocolate cake', 450.00, 9, 8, 'piece', false, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop'),
      ('Cookies', 'Mixed variety cookies', 120.00, 9, 25, 'packet', false, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop'),
      
      -- Frozen Foods (Category 10)
      ('Frozen Vegetables', 'Mixed frozen vegetables', 180.00, 10, 30, 'packet', false, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'),
      ('Ice Cream', 'Vanilla ice cream - 1 liter', 350.00, 10, 20, 'tub', true, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop'),
      ('Frozen Pizza', 'Margherita frozen pizza', 280.00, 10, 15, 'piece', false, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'),
      ('Frozen Fries', 'Crispy frozen french fries', 150.00, 10, 25, 'packet', false, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'),
      ('Frozen Chicken', 'Frozen chicken pieces', 480.00, 10, 18, 'kg', false, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'),
      
      -- Beverages (Category 11)
      ('Coca Cola', 'Refreshing cola drink - 500ml', 120.00, 11, 80, 'bottle', false, 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=300&fit=crop'),
      ('Orange Juice', 'Fresh orange juice - 1 liter', 200.00, 11, 30, 'bottle', false, 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop'),
      ('Mineral Water', 'Pure mineral water - 1.5 liter', 80.00, 11, 100, 'bottle', false, 'https://images.unsplash.com/photo-1548839140-29a749e1e4b3?w=400&h=300&fit=crop'),
      ('Coffee', 'Premium coffee beans - 250g', 350.00, 11, 25, 'packet', false, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop'),
      ('Tea Bags', 'Ceylon tea bags - 100 count', 280.00, 11, 40, 'packet', true, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop'),
      
      -- Snacks & Confectionery (Category 12)
      ('Potato Chips', 'Crispy potato chips - 150g', 95.00, 12, 50, 'packet', false, 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=300&fit=crop'),
      ('Chocolate Cookies', 'Sweet chocolate cookies - 200g', 180.00, 12, 40, 'packet', false, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop'),
      ('Nuts Mix', 'Mixed nuts - 250g', 450.00, 12, 30, 'packet', false, 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&h=300&fit=crop'),
      ('Chocolate Bar', 'Milk chocolate bar', 120.00, 12, 35, 'piece', false, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop'),
      ('Biscuits', 'Assorted biscuits', 140.00, 12, 45, 'packet', false, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop'),
      
      -- Canned & Preserved (Category 13)
      ('Canned Tuna', 'Tuna in water - 185g', 280.00, 13, 25, 'can', false, 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop'),
      ('Pickles', 'Mixed vegetable pickles', 180.00, 13, 20, 'jar', false, 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop'),
      ('Jam', 'Strawberry jam - 500g', 220.00, 13, 15, 'jar', false, 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop'),
      ('Canned Beans', 'Baked beans in tomato sauce', 150.00, 13, 30, 'can', false, 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop'),
      ('Honey', 'Pure natural honey - 500g', 380.00, 13, 12, 'jar', false, 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop'),
      
      -- Personal Care (Category 14)
      ('Shampoo', 'Anti-dandruff shampoo - 400ml', 450.00, 14, 20, 'bottle', false, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'),
      ('Soap', 'Moisturizing soap bar', 80.00, 14, 50, 'piece', false, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'),
      ('Toothpaste', 'Fluoride toothpaste - 100g', 180.00, 14, 40, 'tube', false, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'),
      ('Deodorant', 'Antiperspirant deodorant', 280.00, 14, 25, 'bottle', false, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'),
      ('Face Cream', 'Moisturizing face cream', 350.00, 14, 18, 'tube', false, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'),
      
      -- Household Items (Category 15)
      ('Dish Soap', 'Liquid dish soap - 500ml', 120.00, 15, 60, 'bottle', false, 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400&h=300&fit=crop'),
      ('Toilet Paper', 'Soft toilet paper - 12 rolls', 350.00, 15, 40, 'packet', false, 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop'),
      ('Laundry Detergent', 'Powerful laundry detergent - 2kg', 450.00, 15, 25, 'box', false, 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400&h=300&fit=crop'),
      ('Air Freshener', 'Room air freshener spray', 180.00, 15, 30, 'bottle', false, 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400&h=300&fit=crop'),
      ('Trash Bags', 'Heavy duty trash bags - 50 count', 280.00, 15, 35, 'roll', false, 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400&h=300&fit=crop'),
      
      -- Baby Care (Category 16)
      ('Baby Formula', 'Infant milk formula - 900g', 850.00, 16, 15, 'tin', false, 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=300&fit=crop'),
      ('Diapers', 'Baby diapers - size M - 60 count', 1200.00, 16, 12, 'packet', false, 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=300&fit=crop'),
      ('Baby Wipes', 'Gentle baby wipes - 80 count', 280.00, 16, 20, 'packet', false, 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=300&fit=crop'),
      ('Baby Shampoo', 'Tear-free baby shampoo', 180.00, 16, 18, 'bottle', false, 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=300&fit=crop'),
      ('Baby Food', 'Organic baby food - mixed vegetables', 220.00, 16, 25, 'jar', false, 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=300&fit=crop')
    `);
    }

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
