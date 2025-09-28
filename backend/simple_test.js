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

const testSimple = async () => {
  console.log('🔍 Testing simple queries...');
  
  try {
    // Test basic categories query
    console.log('\n📂 Testing basic categories query...');
    const [categories] = await promisePool.execute(
      `SELECT * FROM categories WHERE is_active = true LIMIT 5`
    );
    console.log(`✅ Categories query successful: ${categories.length} categories found`);
    
    // Test basic products query
    console.log('\n📦 Testing basic products query...');
    const [products] = await promisePool.execute(
      `SELECT * FROM products WHERE is_active = true LIMIT 5`
    );
    console.log(`✅ Products query successful: ${products.length} products found`);
    
    // Test with parameters
    console.log('\n🔢 Testing with parameters...');
    const testLimit = 3;
    const [categoriesWithLimit] = await promisePool.execute(
      `SELECT * FROM categories WHERE is_active = true LIMIT ${testLimit}`
    );
    console.log(`✅ Categories with limit: ${categoriesWithLimit.length} categories found`);
    
    console.log('\n🎉 All simple queries working correctly!');
    
  } catch (error) {
    console.error('❌ Simple test failed:', error.message);
    console.error('SQL Error Code:', error.code);
    console.error('SQL State:', error.sqlState);
  } finally {
    process.exit();
  }
};

testSimple();


