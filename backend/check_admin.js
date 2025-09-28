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
const bcrypt = require('bcryptjs');

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

async function checkAdmin() {
  try {
    console.log('🔍 Checking admin account...');
    
    // Check if admin user exists
    const [users] = await promisePool.execute(
      'SELECT id, name, email, role, is_active FROM users WHERE email = ?',
      ['admin@ccmart.lk']
    );
    
    if (users.length === 0) {
      console.log('❌ Admin user not found. Creating admin account...');
      
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await promisePool.execute(
        'INSERT INTO users (name, email, password, role, is_active) VALUES (?, ?, ?, ?, ?)',
        ['Admin User', 'admin@ccmart.lk', hashedPassword, 'admin', true]
      );
      
      console.log('✅ Admin user created successfully!');
    } else {
      const admin = users[0];
      console.log('✅ Admin user found:');
      console.log(`   - Name: ${admin.name}`);
      console.log(`   - Email: ${admin.email}`);
      console.log(`   - Role: ${admin.role}`);
      console.log(`   - Active: ${admin.is_active ? 'Yes' : 'No'}`);
    }
    
    // Test password
    console.log('\n🔐 Testing admin login...');
    const [adminUsers] = await promisePool.execute(
      'SELECT password FROM users WHERE email = ?',
      ['admin@ccmart.lk']
    );
    
    if (adminUsers.length > 0) {
      const isPasswordValid = await bcrypt.compare('admin123', adminUsers[0].password);
      console.log(`   - Password 'admin123' is ${isPasswordValid ? '✅ Valid' : '❌ Invalid'}`);
    }
    
    console.log('\n📋 Admin Login Credentials:');
    console.log('   Email: admin@ccmart.lk');
    console.log('   Password: admin123');
    
  } catch (error) {
    console.error('❌ Error checking admin:', error.message);
  } finally {
    await pool.end();
  }
}

checkAdmin();







