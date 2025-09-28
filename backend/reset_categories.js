// Reset Categories Script
// This script will update the database with new category structure

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

async function resetCategories() {
  try {
    console.log('🔄 Resetting categories...');
    
    // Clear existing categories
    await promisePool.execute('DELETE FROM categories');
    console.log('✅ Cleared existing categories');
    
    // Insert new comprehensive categories
    await promisePool.execute(`
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
    
    console.log('✅ Inserted new categories');
    
    // Get the new category count
    const [result] = await promisePool.execute('SELECT COUNT(*) as count FROM categories');
    console.log(`✅ Total categories: ${result[0].count}`);
    
    console.log('🎉 Category reset completed successfully!');
    
  } catch (error) {
    console.error('❌ Error resetting categories:', error.message);
  } finally {
    await promisePool.end();
  }
}

// Run the reset
resetCategories();







