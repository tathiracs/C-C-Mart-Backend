// Merge duplicate categories by name: keep the lowest id, repoint products, delete the rest

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
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
const db = pool.promise();

async function cleanupCategories() {
  try {
    console.log('🧹 Merging duplicate categories by name...');

    // Find duplicate names
    const [dups] = await db.execute(`
      SELECT name, COUNT(*) as cnt
      FROM categories
      GROUP BY name
      HAVING cnt > 1
    `);

    let merged = 0;
    for (const row of dups) {
      const [idsRows] = await db.execute(
        'SELECT id FROM categories WHERE name = ? ORDER BY id ASC',
        [row.name]
      );
      const keepId = idsRows[0]?.id;
      const idsToDelete = idsRows.slice(1).map(r => r.id);
      if (!keepId || idsToDelete.length === 0) continue;

      // Repoint products to the kept category id
      await db.execute(
        `UPDATE products SET category_id = ? WHERE category_id IN (${idsToDelete.map(() => '?').join(',')})`,
        [keepId, ...idsToDelete]
      );

      // Delete the duplicate categories
      await db.execute(
        `DELETE FROM categories WHERE id IN (${idsToDelete.map(() => '?').join(',')})`,
        idsToDelete
      );

      merged += idsToDelete.length;
      console.log(`✅ Merged category '${row.name}': kept id ${keepId}, removed ${idsToDelete.length}`);
    }

    console.log(`🎉 Category cleanup complete. Removed ${merged} duplicate categories.`);
  } catch (e) {
    console.error('❌ Category cleanup error:', e.message);
  } finally {
    await db.end();
  }
}

cleanupCategories();










