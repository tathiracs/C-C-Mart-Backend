// Cleanup duplicate products by keeping the lowest id per (name, category_id)

process.env.DB_HOST = process.env.DB_HOST || 'localhost';
process.env.DB_PORT = process.env.DB_PORT || '3306';
process.env.DB_NAME = process.env.DB_NAME || 'ccmart_db';
process.env.DB_USER = process.env.DB_USER || 'root';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'Root123@';

const mysql = require('mysql2');
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
const db = pool.promise();

async function cleanup() {
  try {
    console.log('🧹 Cleaning up duplicate products...');

    // Find duplicates by name + category_id
    const [dups] = await db.execute(`
      SELECT name, category_id, COUNT(*) as cnt
      FROM products
      GROUP BY name, category_id
      HAVING cnt > 1
    `);

    let removed = 0;
    for (const row of dups) {
      const [idsRows] = await db.execute(
        'SELECT id FROM products WHERE name = ? AND category_id <=> ? ORDER BY id ASC',
        [row.name, row.category_id]
      );
      const idsToKeep = idsRows[0]?.id;
      const idsToDelete = idsRows.slice(1).map(r => r.id);
      if (idsToDelete.length > 0) {
        await db.execute(
          `DELETE FROM products WHERE id IN (${idsToDelete.map(() => '?').join(',')})`,
          idsToDelete
        );
        removed += idsToDelete.length;
      }
    }

    console.log(`✅ Duplicate cleanup done. Removed ${removed} products.`);
  } catch (e) {
    console.error('❌ Cleanup error:', e.message);
  } finally {
    await db.end();
  }
}

cleanup();










