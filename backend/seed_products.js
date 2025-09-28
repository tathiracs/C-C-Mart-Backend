// Seed Additional Sample Grocery Products
// This script inserts a wider variety of products across existing categories.

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

async function getCategoryIdByName(categoryName) {
  const [rows] = await db.execute('SELECT id FROM categories WHERE name = ? AND is_active = true', [categoryName]);
  return rows[0]?.id || null;
}

async function upsertProduct(product) {
  const [existing] = await db.execute('SELECT id FROM products WHERE name = ?', [product.name]);
  if (existing.length > 0) {
    return { inserted: false, id: existing[0].id };
  }

  const values = [
    product.name,
    product.description || null,
    product.price,
    product.category_id || null,
    product.image_url || null,
    product.stock_quantity || 0,
    product.unit || 'piece',
    product.is_featured || false
  ];

  const [result] = await db.execute(
    `INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, unit, is_featured)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    values
  );
  return { inserted: true, id: result.insertId };
}

async function seed() {
  try {
    console.log('🌱 Seeding additional grocery products...');

    const categoryNames = {
      vegetables: 'Fresh Vegetables',
      fruits: 'Fresh Fruits',
      dairy: 'Dairy & Eggs',
      meat: 'Meat & Poultry',
      seafood: 'Seafood',
      grains: 'Rice & Grains',
      spices: 'Spices & Condiments',
      essentials: 'Cooking Essentials',
      bakery: 'Bakery & Bread',
      frozen: 'Frozen Foods',
      beverages: 'Beverages',
      snacks: 'Snacks & Confectionery',
      canned: 'Canned & Preserved',
      personal: 'Personal Care',
      household: 'Household Items',
      baby: 'Baby Care'
    };

    const categoryIds = {};
    for (const [key, name] of Object.entries(categoryNames)) {
      categoryIds[key] = await getCategoryIdByName(name);
    }

    const products = [
      // Fresh Vegetables
      { name: 'Spinach Bunch', description: 'Fresh green spinach', price: 90.00, category_id: categoryIds.vegetables, stock_quantity: 40, unit: 'bunch', image_url: 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?w=400&h=300&fit=crop' },
      { name: 'Cucumber', description: 'Crunchy cucumbers', price: 140.00, category_id: categoryIds.vegetables, stock_quantity: 35, unit: 'kg', image_url: 'https://images.unsplash.com/photo-1615486363876-2348c7896b29?w=400&h=300&fit=crop' },
      { name: 'Lettuce', description: 'Crisp iceberg lettuce', price: 180.00, category_id: categoryIds.vegetables, stock_quantity: 20, unit: 'head', image_url: 'https://images.unsplash.com/photo-1556800469-8ecae5c6f44b?w=400&h=300&fit=crop' },
      { name: 'Cauliflower', description: 'Fresh cauliflower', price: 220.00, category_id: categoryIds.vegetables, stock_quantity: 22, unit: 'piece', image_url: 'https://images.unsplash.com/photo-1604908176997-4316511c86b0?w=400&h=300&fit=crop' },
      { name: 'Broccoli', description: 'Green broccoli florets', price: 260.00, category_id: categoryIds.vegetables, stock_quantity: 18, unit: 'kg', image_url: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b0dd9?w=400&h=300&fit=crop' },

      // Fresh Fruits
      { name: 'Blueberries', description: 'Sweet blueberries - 125g pack', price: 480.00, category_id: categoryIds.fruits, stock_quantity: 25, unit: 'pack', image_url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=300&fit=crop', is_featured: true },
      { name: 'Papaya', description: 'Ripe papaya', price: 170.00, category_id: categoryIds.fruits, stock_quantity: 28, unit: 'kg', image_url: 'https://images.unsplash.com/photo-1605026566359-2c2b9cb5e2aa?w=400&h=300&fit=crop' },
      { name: 'Green Grapes', description: 'Seedless green grapes', price: 360.00, category_id: categoryIds.fruits, stock_quantity: 26, unit: 'kg', image_url: 'https://images.unsplash.com/photo-1603732551658-5fabbafa84ea?w=400&h=300&fit=crop' },
      { name: 'Pomegranates', description: 'Juicy pomegranates', price: 420.00, category_id: categoryIds.fruits, stock_quantity: 15, unit: 'kg', image_url: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=400&h=300&fit=crop' },
      { name: 'Avocado', description: 'Creamy avocados', price: 280.00, category_id: categoryIds.fruits, stock_quantity: 20, unit: 'kg', image_url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=300&fit=crop' },

      // Dairy & Eggs
      { name: 'Paneer', description: 'Fresh paneer - 200g', price: 320.00, category_id: categoryIds.dairy, stock_quantity: 20, unit: 'packet', image_url: 'https://images.unsplash.com/photo-1568051243858-88c5f6b6f2d4?w=400&h=300&fit=crop' },
      { name: 'Ghee', description: 'Pure cow ghee - 200ml', price: 560.00, category_id: categoryIds.dairy, stock_quantity: 18, unit: 'jar', image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop' },
      { name: 'Greek Yogurt', description: 'Thick Greek yogurt - 500g', price: 240.00, category_id: categoryIds.dairy, stock_quantity: 30, unit: 'cup', image_url: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?w=400&h=300&fit=crop' },

      // Meat & Poultry
      { name: 'Chicken Sausages', description: 'Smoked chicken sausages - 500g', price: 650.00, category_id: categoryIds.meat, stock_quantity: 22, unit: 'pack', image_url: 'https://images.unsplash.com/photo-1604908554049-18ee2b0a2f03?w=400&h=300&fit=crop' },
      { name: 'Beef Steak', description: 'Tenderloin beef steaks', price: 1450.00, category_id: categoryIds.meat, stock_quantity: 10, unit: 'kg', image_url: 'https://images.unsplash.com/photo-1604908553628-3fba6f5e8a11?w=400&h=300&fit=crop' },

      // Seafood
      { name: 'Salmon Fillet', description: 'Fresh Atlantic salmon fillet', price: 1650.00, category_id: categoryIds.seafood, stock_quantity: 12, unit: 'kg', image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop' },
      { name: 'Mackerel', description: 'Fresh mackerel fish', price: 620.00, category_id: categoryIds.seafood, stock_quantity: 18, unit: 'kg', image_url: 'https://images.unsplash.com/photo-1514517220031-65e1a1b52f21?w=400&h=300&fit=crop' },

      // Rice & Grains
      { name: 'Brown Rice', description: 'Healthy brown rice - long grain', price: 420.00, category_id: categoryIds.grains, stock_quantity: 40, unit: 'kg', image_url: 'https://images.unsplash.com/photo-1505575972945-2804b5e86f81?w=400&h=300&fit=crop' },
      { name: 'Couscous', description: 'Premium couscous', price: 520.00, category_id: categoryIds.grains, stock_quantity: 20, unit: 'kg', image_url: 'https://images.unsplash.com/photo-1505575972945-2804b5e86f81?w=400&h=300&fit=crop' },
      { name: 'Barley', description: 'Pearl barley grains', price: 260.00, category_id: categoryIds.grains, stock_quantity: 30, unit: 'kg', image_url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=300&fit=crop' },

      // Spices & Condiments
      { name: 'Black Pepper', description: 'Whole black pepper - 100g', price: 380.00, category_id: categoryIds.spices, stock_quantity: 40, unit: '100g', image_url: 'https://images.unsplash.com/photo-1505575972945-2804b5e86f81?w=400&h=300&fit=crop' },
      { name: 'Cumin Seeds', description: 'Whole cumin seeds - 100g', price: 240.00, category_id: categoryIds.spices, stock_quantity: 35, unit: '100g', image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop' },
      { name: 'Mustard Seeds', description: 'Black mustard seeds - 100g', price: 210.00, category_id: categoryIds.spices, stock_quantity: 30, unit: '100g', image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop' },

      // Cooking Essentials
      { name: 'Olive Oil', description: 'Extra virgin olive oil - 500ml', price: 1250.00, category_id: categoryIds.essentials, stock_quantity: 18, unit: 'bottle', image_url: 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?w=400&h=300&fit=crop' },
      { name: 'Brown Sugar', description: 'Natural brown sugar - 1kg', price: 220.00, category_id: categoryIds.essentials, stock_quantity: 30, unit: 'kg', image_url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop' },
      { name: 'Rock Salt', description: 'Pink Himalayan rock salt - 500g', price: 260.00, category_id: categoryIds.essentials, stock_quantity: 24, unit: 'packet', image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop' },

      // Bakery & Bread
      { name: 'Bagels', description: 'Fresh bagels - 4 pieces', price: 180.00, category_id: categoryIds.bakery, stock_quantity: 20, unit: 'packet', image_url: 'https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?w=400&h=300&fit=crop' },
      { name: 'Muffins', description: 'Assorted muffins - 6 pack', price: 240.00, category_id: categoryIds.bakery, stock_quantity: 16, unit: 'packet', image_url: 'https://images.unsplash.com/photo-1491485880348-85d48a9e5312?w=400&h=300&fit=crop' },

      // Frozen Foods
      { name: 'Veg Spring Rolls', description: 'Frozen vegetable spring rolls', price: 320.00, category_id: categoryIds.frozen, stock_quantity: 22, unit: 'packet', image_url: 'https://images.unsplash.com/photo-1617191519006-8215110fefd9?w=400&h=300&fit=crop' },
      { name: 'Frozen Paratha', description: 'Layered frozen paratha - 5 pieces', price: 260.00, category_id: categoryIds.frozen, stock_quantity: 25, unit: 'packet', image_url: 'https://images.unsplash.com/photo-1599487488170-4a62d94bea54?w=400&h=300&fit=crop' },

      // Beverages
      { name: 'Green Tea', description: 'Green tea bags - 50 count', price: 340.00, category_id: categoryIds.beverages, stock_quantity: 28, unit: 'packet', image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&h=300&fit=crop' },
      { name: 'Iced Coffee', description: 'Ready-to-drink iced coffee - 300ml', price: 160.00, category_id: categoryIds.beverages, stock_quantity: 40, unit: 'bottle', image_url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=300&fit=crop' },

      // Snacks & Confectionery
      { name: 'Trail Mix', description: 'Nuts and dried fruits mix - 200g', price: 420.00, category_id: categoryIds.snacks, stock_quantity: 30, unit: 'packet', image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop' },
      { name: 'Granola Bars', description: 'Oats and honey granola bars - 6 pack', price: 260.00, category_id: categoryIds.snacks, stock_quantity: 24, unit: 'box', image_url: 'https://images.unsplash.com/photo-1580653316985-7d4f1b9030fb?w=400&h=300&fit=crop' },

      // Canned & Preserved
      { name: 'Coconut Milk', description: 'Rich coconut milk - 400ml', price: 220.00, category_id: categoryIds.canned, stock_quantity: 26, unit: 'can', image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop' },
      { name: 'Green Peas (Canned)', description: 'Canned green peas - 400g', price: 180.00, category_id: categoryIds.canned, stock_quantity: 28, unit: 'can', image_url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop' },

      // Personal Care
      { name: 'Liquid Handwash', description: 'Antibacterial liquid handwash - 250ml', price: 180.00, category_id: categoryIds.personal, stock_quantity: 40, unit: 'bottle', image_url: 'https://images.unsplash.com/photo-1583947581924-860bda6a26b1?w=400&h=300&fit=crop' },
      { name: 'Body Lotion', description: 'Moisturizing body lotion - 400ml', price: 380.00, category_id: categoryIds.personal, stock_quantity: 22, unit: 'bottle', image_url: 'https://images.unsplash.com/photo-1505575972945-2804b5e86f81?w=400&h=300&fit=crop' },

      // Household Items
      { name: 'Bleach', description: 'Household bleach - 1 liter', price: 220.00, category_id: categoryIds.household, stock_quantity: 30, unit: 'bottle', image_url: 'https://images.unsplash.com/photo-1581579188871-45ea61f2a0b8?w=400&h=300&fit=crop' },
      { name: 'Glass Cleaner', description: 'Streak-free glass cleaner - 500ml', price: 200.00, category_id: categoryIds.household, stock_quantity: 26, unit: 'bottle', image_url: 'https://images.unsplash.com/photo-1581579188871-45ea61f2a0b8?w=400&h=300&fit=crop' },

      // Baby Care
      { name: 'Baby Lotion', description: 'Gentle baby lotion - 200ml', price: 260.00, category_id: categoryIds.baby, stock_quantity: 24, unit: 'bottle', image_url: 'https://images.unsplash.com/photo-1610970878459-c31534c05e65?w=400&h=300&fit=crop' },
      { name: 'Baby Soap', description: 'Mild baby soap - 100g', price: 120.00, category_id: categoryIds.baby, stock_quantity: 40, unit: 'bar', image_url: 'https://images.unsplash.com/photo-1581579188871-45ea61f2a0b8?w=400&h=300&fit=crop' }
    ];

    let insertedCount = 0;
    for (const p of products) {
      // Skip if category not found (in case categories were changed)
      if (!p.category_id) continue;
      const result = await upsertProduct(p);
      if (result.inserted) insertedCount += 1;
    }

    console.log(`✅ Seeding complete. Inserted ${insertedCount} new products.`);
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
  } finally {
    await db.end();
  }
}

seed();










