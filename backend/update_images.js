// Set environment variables
process.env.PORT = '8080';
process.env.NODE_ENV = 'development';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '3306';
process.env.DB_NAME = 'ccmart_db';
process.env.DB_USER = 'root';
process.env.DB_PASSWORD = 'Root123@';
process.env.JWT_SECRET = 'ccmart_super_secret_jwt_key_2024_secure';
process.env.JWT_EXPIRE = '7d';

const mysql = require('mysql2');

// Create connection
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

const promisePool = pool.promise();

// Product images mapping
const productImages = {
  'Fresh Bananas': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',
  'Red Apples': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop',
  'Fresh Carrots': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop',
  'Fresh Tomatoes': 'https://images.unsplash.com/photo-1546470427-5c9d2a73ee3b?w=400&h=300&fit=crop',
  'Fresh Milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
  'Fresh Eggs': 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d3?w=400&h=300&fit=crop',
  'Cheddar Cheese': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop',
  'Yogurt': 'https://images.unsplash.com/photo-1571212058562-4b1b3b3b3b3b?w=400&h=300&fit=crop',
  'Chicken Breast': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop',
  'Fresh Fish': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
  'Ground Beef': 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop',
  'White Bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
  'Whole Wheat Bread': 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=300&fit=crop',
  'Croissants': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop',
  'Basmati Rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
  'Pasta': 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400&h=300&fit=crop',
  'Cooking Oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop',
  'Sugar': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop',
  'Coca Cola': 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=300&fit=crop',
  'Orange Juice': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop',
  'Mineral Water': 'https://images.unsplash.com/photo-1548839140-29a749e1e4b3?w=400&h=300&fit=crop',
  'Coffee': 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop',
  'Potato Chips': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=300&fit=crop',
  'Chocolate Cookies': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop',
  'Nuts Mix': 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&h=300&fit=crop',
  'Dish Soap': 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400&h=300&fit=crop',
  'Toilet Paper': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop',
  'Laundry Detergent': 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400&h=300&fit=crop'
};

// Category images mapping
const categoryImages = {
  'Fruits & Vegetables': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
  'Dairy & Eggs': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
  'Meat & Seafood': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop',
  'Bakery': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
  'Pantry': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
  'Beverages': 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=300&fit=crop',
  'Snacks': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=300&fit=crop',
  'Household': 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400&h=300&fit=crop'
};

async function updateImages() {
  try {
    console.log('🔄 Updating product images...');
    
    // Update product images
    for (const [productName, imageUrl] of Object.entries(productImages)) {
      await promisePool.execute(
        'UPDATE products SET image_url = ? WHERE name = ?',
        [imageUrl, productName]
      );
      console.log(`✅ Updated image for: ${productName}`);
    }
    
    console.log('🔄 Updating category images...');
    
    // Update category images
    for (const [categoryName, imageUrl] of Object.entries(categoryImages)) {
      await promisePool.execute(
        'UPDATE categories SET image_url = ? WHERE name = ?',
        [imageUrl, categoryName]
      );
      console.log(`✅ Updated image for category: ${categoryName}`);
    }
    
    console.log('🎉 All images updated successfully!');
    
    // Verify updates
    const [products] = await promisePool.execute(
      'SELECT name, image_url FROM products WHERE image_url IS NOT NULL'
    );
    
    const [categories] = await promisePool.execute(
      'SELECT name, image_url FROM categories WHERE image_url IS NOT NULL'
    );
    
    console.log(`\n📊 Summary:`);
    console.log(`- Products with images: ${products.length}`);
    console.log(`- Categories with images: ${categories.length}`);
    
  } catch (error) {
    console.error('❌ Error updating images:', error);
  } finally {
    await pool.end();
  }
}

updateImages();







