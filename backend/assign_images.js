// Assign curated, relevant images to product items (deterministic, non-random)

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

// Curated image URLs per product name
// Use direct Unsplash CDN links sized appropriately to avoid extra redirects
const productImageMap = {
  // Vegetables
  'Fresh Carrots': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&q=80&auto=format&fit=crop',
  'Fresh Tomatoes': 'https://images.unsplash.com/photo-1546470427-5c9d2a73ee3b?w=800&q=80&auto=format&fit=crop',
  'Green Beans': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80&auto=format&fit=crop',
  'Red Onions': 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=800&q=80&auto=format&fit=crop',
  'Bell Peppers': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&q=80&auto=format&fit=crop',
  'Spinach Bunch': 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?w=800&q=80&auto=format&fit=crop',
  'Cucumber': 'https://images.unsplash.com/photo-1615486363876-2348c7896b29?w=800&q=80&auto=format&fit=crop',
  'Lettuce': 'https://images.unsplash.com/photo-1556800469-8ecae5c6f44b?w=800&q=80&auto=format&fit=crop',
  'Cauliflower': 'https://images.unsplash.com/photo-1604908176997-4316511c86b0?w=800&q=80&auto=format&fit=crop',
  'Broccoli': 'https://images.unsplash.com/photo-1584270354949-c26b0d5b0dd9?w=800&q=80&auto=format&fit=crop',

  // Fruits
  'Fresh Bananas': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&q=80&auto=format&fit=crop',
  'Red Apples': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&q=80&auto=format&fit=crop',
  'Mangoes': 'https://images.unsplash.com/photo-1605027990121-1be6e5f7d4d7?w=800&q=80&auto=format&fit=crop',
  'Pineapples': 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=800&q=80&auto=format&fit=crop',
  'Oranges': 'https://images.unsplash.com/photo-1557800634-7bf3c73be389?w=800&q=80&auto=format&fit=crop',
  'Blueberries': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&q=80&auto=format&fit=crop',
  'Papaya': 'https://images.unsplash.com/photo-1605026566359-2c2b9cb5e2aa?w=800&q=80&auto=format&fit=crop',
  'Green Grapes': 'https://images.unsplash.com/photo-1603732551658-5fabbafa84ea?w=800&q=80&auto=format&fit=crop',
  'Pomegranates': 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=800&q=80&auto=format&fit=crop',
  'Avocado': 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80&auto=format&fit=crop',

  // Dairy & Eggs
  'Fresh Milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&q=80&auto=format&fit=crop',
  'Fresh Eggs': 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d3?w=800&q=80&auto=format&fit=crop',
  'Cheddar Cheese': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&q=80&auto=format&fit=crop',
  'Yogurt': 'https://images.unsplash.com/photo-1571212058562-4b1b3b3b3b3b?w=800&q=80&auto=format&fit=crop',
  'Butter': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800&q=80&auto=format&fit=crop',
  'Paneer': 'https://images.unsplash.com/photo-1604908177384-4e0d17822c6e?w=800&q=80&auto=format&fit=crop',
  'Ghee': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop',
  'Greek Yogurt': 'https://images.unsplash.com/photo-1516685018646-549198525c1b?w=800&q=80&auto=format&fit=crop',

  // Meat & Poultry
  'Chicken Breast': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&q=80&auto=format&fit=crop',
  'Ground Beef': 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80&auto=format&fit=crop',
  'Pork Chops': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&q=80&auto=format&fit=crop',
  'Lamb Mince': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&q=80&auto=format&fit=crop',
  'Chicken Thighs': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&q=80&auto=format&fit=crop',
  'Chicken Sausages': 'https://images.unsplash.com/photo-1604908554049-18ee2b0a2f03?w=800&q=80&auto=format&fit=crop',
  'Beef Steak': 'https://images.unsplash.com/photo-1604908553628-3fba6f5e8a11?w=800&q=80&auto=format&fit=crop',

  // Seafood
  'Fresh Fish': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80&auto=format&fit=crop',
  'Prawns': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80&auto=format&fit=crop',
  'Crab': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80&auto=format&fit=crop',
  'Squid': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80&auto=format&fit=crop',
  'Tuna Steaks': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80&auto=format&fit=crop',
  'Salmon Fillet': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80&auto=format&fit=crop',
  'Mackerel': 'https://images.unsplash.com/photo-1514517220031-65e1a1b52f21?w=800&q=80&auto=format&fit=crop',

  // Grains
  'Basmati Rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80&auto=format&fit=crop',
  'Red Rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80&auto=format&fit=crop',
  'Wheat Flour': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80&auto=format&fit=crop',
  'Oats': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80&auto=format&fit=crop',
  'Quinoa': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80&auto=format&fit=crop',
  'Brown Rice': 'https://images.unsplash.com/photo-1505575972945-2804b5e86f81?w=800&q=80&auto=format&fit=crop',
  'Couscous': 'https://images.unsplash.com/photo-1505575972945-2804b5e86f81?w=800&q=80&auto=format&fit=crop',
  'Barley': 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80&auto=format&fit=crop',

  // Spices & Condiments
  'Cinnamon Sticks': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80&auto=format&fit=crop',
  'Turmeric Powder': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80&auto=format&fit=crop',
  'Chili Powder': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80&auto=format&fit=crop',
  'Curry Leaves': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80&auto=format&fit=crop',
  'Garlic Paste': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80&auto=format&fit=crop',
  'Black Pepper': 'https://images.unsplash.com/photo-1505575972945-2804b5e86f81?w=800&q=80&auto=format&fit=crop',
  'Cumin Seeds': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80&auto=format&fit=crop',
  'Mustard Seeds': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80&auto=format&fit=crop',

  // Cooking Essentials
  'Cooking Oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80&auto=format&fit=crop',
  'Sugar': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80&auto=format&fit=crop',
  'Salt': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80&auto=format&fit=crop',
  'Vinegar': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80&auto=format&fit=crop',
  'Soy Sauce': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80&auto=format&fit=crop',
  'Olive Oil': 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?w=800&q=80&auto=format&fit=crop',
  'Brown Sugar': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80&auto=format&fit=crop',
  'Rock Salt': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80&auto=format&fit=crop',

  // Bakery & Bread
  'White Bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80&auto=format&fit=crop',
  'Whole Wheat Bread': 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800&q=80&auto=format&fit=crop',
  'Croissants': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80&auto=format&fit=crop',
  'Cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80&auto=format&fit=crop',
  'Cookies': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80&auto=format&fit=crop',
  'Bagels': 'https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?w=800&q=80&auto=format&fit=crop',
  'Muffins': 'https://images.unsplash.com/photo-1491485880348-85d48a9e5312?w=800&q=80&auto=format&fit=crop',

  // Frozen Foods
  'Frozen Vegetables': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop',
  'Ice Cream': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80&auto=format&fit=crop',
  'Frozen Pizza': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop',
  'Frozen Fries': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop',
  'Frozen Chicken': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop',
  'Veg Spring Rolls': 'https://images.unsplash.com/photo-1617191519006-8215110fefd9?w=800&q=80&auto=format&fit=crop',
  'Frozen Paratha': 'https://images.unsplash.com/photo-1599487488170-4a62d94bea54?w=800&q=80&auto=format&fit=crop',

  // Beverages
  'Coca Cola': 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=800&q=80&auto=format&fit=crop',
  'Orange Juice': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=800&q=80&auto=format&fit=crop',
  'Mineral Water': 'https://images.unsplash.com/photo-1548839140-29a749e1e4b3?w=800&q=80&auto=format&fit=crop',
  'Coffee': 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80&auto=format&fit=crop',
  'Tea Bags': 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80&auto=format&fit=crop',
  'Green Tea': 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&q=80&auto=format&fit=crop',
  'Iced Coffee': 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&q=80&auto=format&fit=crop',

  // Snacks & Confectionery
  'Potato Chips': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&q=80&auto=format&fit=crop',
  'Chocolate Cookies': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80&auto=format&fit=crop',
  'Nuts Mix': 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=800&q=80&auto=format&fit=crop',
  'Chocolate Bar': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80&auto=format&fit=crop',
  'Biscuits': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80&auto=format&fit=crop',
  'Trail Mix': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop',
  'Granola Bars': 'https://images.unsplash.com/photo-1580653316985-7d4f1b9030fb?w=800&q=80&auto=format&fit=crop',

  // Canned & Preserved
  'Canned Tuna': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&q=80&auto=format&fit=crop',
  'Pickles': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&q=80&auto=format&fit=crop',
  'Jam': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&q=80&auto=format&fit=crop',
  'Canned Beans': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&q=80&auto=format&fit=crop',
  'Honey': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&q=80&auto=format&fit=crop',
  'Coconut Milk': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop',
  'Green Peas (Canned)': 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80&auto=format&fit=crop',

  // Personal Care
  'Shampoo': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop',
  'Soap': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop',
  'Toothpaste': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop',
  'Deodorant': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop',
  'Face Cream': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop',
  'Liquid Handwash': 'https://images.unsplash.com/photo-1583947581924-860bda6a26b1?w=800&q=80&auto=format&fit=crop',
  'Body Lotion': 'https://images.unsplash.com/photo-1505575972945-2804b5e86f81?w=800&q=80&auto=format&fit=crop',

  // Household
  'Dish Soap': 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=800&q=80&auto=format&fit=crop',
  'Toilet Paper': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&q=80&auto=format&fit=crop',
  'Laundry Detergent': 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=800&q=80&auto=format&fit=crop',
  'Bleach': 'https://images.unsplash.com/photo-1581579188871-45ea61f2a0b8?w=800&q=80&auto=format&fit=crop',
  'Glass Cleaner': 'https://images.unsplash.com/photo-1581579188871-45ea61f2a0b8?w=800&q=80&auto=format&fit=crop',
  'Trash Bags': 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=800&q=80&auto=format&fit=crop',

  // Baby Care
  'Baby Formula': 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80&auto=format&fit=crop',
  'Diapers': 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80&auto=format&fit=crop',
  'Baby Wipes': 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80&auto=format&fit=crop',
  'Baby Shampoo': 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80&auto=format&fit=crop',
  'Baby Food': 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80&auto=format&fit=crop',
  'Baby Lotion': 'https://images.unsplash.com/photo-1610970878459-c31534c05e65?w=800&q=80&auto=format&fit=crop',
  'Baby Soap': 'https://images.unsplash.com/photo-1581579188871-45ea61f2a0b8?w=800&q=80&auto=format&fit=crop'
};

async function assignImages() {
  try {
    console.log('🖼️ Assigning curated images to products...');

    let updated = 0;
    for (const [name, url] of Object.entries(productImageMap)) {
      const [res] = await db.execute(
        'UPDATE products SET image_url = ? WHERE name = ?',
        [url, name]
      );
      updated += res.affectedRows || 0;
    }

    console.log(`✅ Image assignment completed. Updated ${updated} products.`);
  } catch (e) {
    console.error('❌ Failed to assign images:', e.message);
  } finally {
    await db.end();
  }
}

assignImages();










