// Set environment variables
process.env.PORT = '8081';
process.env.NODE_ENV = 'development';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '3306';
process.env.DB_NAME = 'ccmart_db';
process.env.DB_USER = 'root';
process.env.DB_PASSWORD = 'Root123@';
process.env.JWT_SECRET = 'ccmart_super_secret_jwt_key_2024_secure';
process.env.JWT_EXPIRE = '7d';
process.env.RATE_LIMIT_WINDOW_MS = '900000';
process.env.RATE_LIMIT_MAX_REQUESTS = '1000';

// Start the server
require('./server.js');
