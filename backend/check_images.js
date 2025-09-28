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

// Create connection pool
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

const checkImages = async () => {
  console.log('🔍 Checking product images in database...');
  try {
    const [products] = await promisePool.execute('SELECT name, image_url FROM products LIMIT 10');
    console.log('\n📦 Sample products with images:');
    products.forEach(product => {
      console.log(`✅ ${product.name}: ${product.image_url}`);
    });

    console.log('\n🔍 Checking category images in database...');
    const [categories] = await promisePool.execute('SELECT name, image_url FROM categories LIMIT 5');
    console.log('\n📂 Sample categories with images:');
    categories.forEach(category => {
      console.log(`✅ ${category.name}: ${category.image_url}`);
    });

    console.log('\n📊 Summary:');
    const [productCount] = await promisePool.execute('SELECT COUNT(*) as count FROM products WHERE image_url IS NOT NULL AND image_url != ""');
    const [categoryCount] = await promisePool.execute('SELECT COUNT(*) as count FROM categories WHERE image_url IS NOT NULL AND image_url != ""');
    
    console.log(`- Products with images: ${productCount[0].count}`);
    console.log(`- Categories with images: ${categoryCount[0].count}`);
    
  } catch (error) {
    console.error('❌ Error checking images:', error.message);
  } finally {
    process.exit();
  }
};

checkImages();
