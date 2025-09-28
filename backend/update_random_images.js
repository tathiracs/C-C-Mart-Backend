// Assign unique, category-appropriate Unsplash images to each product

process.env.PORT = '8080';
process.env.NODE_ENV = 'development';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '3306';
process.env.DB_NAME = 'ccmart_db';
process.env.DB_USER = 'root';
process.env.DB_PASSWORD = 'Root123@';

const mysql = require('mysql2');

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

const db = pool.promise();

function buildImageUrl(productId, categoryId) {
  // Use Picsum with a stable seed to avoid CORS/redirect issues
  return `https://picsum.photos/seed/${productId}-${categoryId || 0}/400/300`;
}

async function updateAllProductImages() {
  try {
    console.log('🔄 Generating unique images for products...');
    const [rows] = await db.execute(
      `SELECT p.id, p.category_id FROM products p WHERE p.is_active = true`
    );

    let updated = 0;
    for (const row of rows) {
      const url = buildImageUrl(row.id, row.category_id);
      await db.execute('UPDATE products SET image_url = ? WHERE id = ?', [url, row.id]);
      updated += 1;
    }

    console.log(`✅ Updated images for ${updated} products.`);
  } catch (err) {
    console.error('❌ Failed to update images:', err.message);
  } finally {
    await db.end();
  }
}

updateAllProductImages();


