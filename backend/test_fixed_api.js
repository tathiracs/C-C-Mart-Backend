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

const testFixedAPIs = async () => {
  console.log('🔍 Testing fixed API queries...');
  
  try {
    // Test categories query
    console.log('\n📂 Testing categories query...');
    const [categories] = await promisePool.execute(
      `SELECT c.id, c.name, c.description, c.image_url, c.is_active, c.created_at,
              (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.is_active = true) as product_count
       FROM categories c 
       WHERE c.is_active = true
       ORDER BY c.name ASC
       LIMIT 5 OFFSET 0`
    );
    console.log(`✅ Categories query successful: ${categories.length} categories found`);
    if (categories.length > 0) {
      console.log(`   Sample: ${categories[0].name} (${categories[0].product_count} products)`);
    }
    
    // Test products query
    console.log('\n📦 Testing products query...');
    const [products] = await promisePool.execute(
      `SELECT p.id, p.name, p.description, p.price, p.image_url, 
              p.stock_quantity, p.unit, p.is_featured, p.created_at,
              c.name as category_name, c.id as category_id
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.is_active = true
       ORDER BY p.name ASC
       LIMIT 5 OFFSET 0`
    );
    console.log(`✅ Products query successful: ${products.length} products found`);
    if (products.length > 0) {
      console.log(`   Sample: ${products[0].name} - Rs. ${products[0].price}`);
    }
    
    console.log('\n🎉 All fixed API queries working correctly!');
    
  } catch (error) {
    console.error('❌ Fixed API test failed:', error.message);
    console.error('SQL Error Code:', error.code);
    console.error('SQL State:', error.sqlState);
  } finally {
    process.exit();
  }
};

testFixedAPIs();










