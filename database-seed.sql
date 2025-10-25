-- ============================================================
-- C&C Mart Database Seed Data
-- ============================================================
-- This script inserts initial sample data for testing
-- Password for all users: password123
-- ============================================================

USE ccmart_db;

-- ============================================================
-- Seed: Users
-- ============================================================
-- Password: password123 (hashed with BCrypt)
INSERT INTO users (name, email, password, phone, address, role, is_active) VALUES
('Admin User', 'admin@ccmart.com', '$2a$10$X3XVY8nFPPFqMbG0R0Z0OuHqVcVYWnP9Z3lX0YZ5ZrI8vQ5Z6Z0Ke', '0771234567', '123 Admin St, Colombo', 'admin', TRUE),
('John Doe', 'john@example.com', '$2a$10$X3XVY8nFPPFqMbG0R0Z0OuHqVcVYWnP9Z3lX0YZ5ZrI8vQ5Z6Z0Ke', '0771234568', '456 Main St, Kandy', 'customer', TRUE),
('Jane Smith', 'jane@example.com', '$2a$10$X3XVY8nFPPFqMbG0R0Z0OuHqVcVYWnP9Z3lX0YZ5ZrI8vQ5Z6Z0Ke', '0771234569', '789 Oak Ave, Galle', 'customer', TRUE);

-- ============================================================
-- Seed: Categories
-- ============================================================
INSERT INTO categories (name, description, is_active) VALUES
('Fruits & Vegetables', 'Fresh fruits and vegetables', TRUE),
('Dairy & Eggs', 'Milk, cheese, yogurt, and eggs', TRUE),
('Meat & Seafood', 'Fresh meat and seafood products', TRUE),
('Bakery', 'Fresh bread, pastries, and baked goods', TRUE),
('Beverages', 'Drinks, juices, and soft drinks', TRUE),
('Snacks', 'Chips, cookies, and snack items', TRUE),
('Pantry Staples', 'Rice, pasta, oil, and cooking essentials', TRUE),
('Personal Care', 'Hygiene and personal care products', TRUE);

-- ============================================================
-- Seed: Products
-- ============================================================
INSERT INTO products (name, description, price, category_id, stock_quantity, unit, is_active, is_featured) VALUES
-- Fruits & Vegetables
('Fresh Tomatoes', 'Farm-fresh red tomatoes', 120.00, 1, 100, 'kg', TRUE, TRUE),
('Green Apples', 'Crispy green apples from hill country', 450.00, 1, 80, 'kg', TRUE, FALSE),
('Carrots', 'Fresh carrots rich in vitamins', 90.00, 1, 120, 'kg', TRUE, FALSE),
('Bananas', 'Sweet yellow bananas', 180.00, 1, 150, 'kg', TRUE, TRUE),
('Onions', 'Red onions', 150.00, 1, 200, 'kg', TRUE, FALSE),

-- Dairy & Eggs
('Fresh Milk', 'Full cream fresh milk 1L', 280.00, 2, 60, 'bottle', TRUE, TRUE),
('Cheddar Cheese', 'Aged cheddar cheese 200g', 850.00, 2, 40, 'pack', TRUE, FALSE),
('Farm Eggs', 'Free-range eggs', 550.00, 2, 100, 'dozen', TRUE, TRUE),
('Greek Yogurt', 'Natural greek yogurt 500g', 420.00, 2, 50, 'tub', TRUE, FALSE),

-- Meat & Seafood
('Chicken Breast', 'Skinless chicken breast', 990.00, 3, 80, 'kg', TRUE, FALSE),
('Fresh Prawns', 'Large fresh prawns', 1850.00, 3, 30, 'kg', TRUE, TRUE),
('Beef Mince', 'Premium beef mince', 1200.00, 3, 50, 'kg', TRUE, FALSE),

-- Bakery
('White Bread', 'Soft white bread loaf', 150.00, 4, 80, 'loaf', TRUE, FALSE),
('Croissants', 'Butter croissants pack of 6', 480.00, 4, 40, 'pack', TRUE, TRUE),
('Whole Wheat Bread', 'Healthy whole wheat bread', 180.00, 4, 60, 'loaf', TRUE, FALSE),

-- Beverages
('Orange Juice', 'Fresh orange juice 1L', 380.00, 5, 70, 'bottle', TRUE, FALSE),
('Mineral Water', 'Pure mineral water 1.5L', 90.00, 5, 200, 'bottle', TRUE, FALSE),
('Green Tea', 'Premium green tea 25 bags', 450.00, 5, 80, 'box', TRUE, TRUE),

-- Snacks
('Potato Chips', 'Crispy potato chips 150g', 280.00, 6, 120, 'pack', TRUE, FALSE),
('Chocolate Cookies', 'Double chocolate cookies 200g', 320.00, 6, 90, 'pack', TRUE, TRUE),
('Mixed Nuts', 'Roasted mixed nuts 250g', 680.00, 6, 60, 'pack', TRUE, FALSE),

-- Pantry Staples
('Basmati Rice', 'Premium basmati rice 5kg', 1450.00, 7, 100, 'pack', TRUE, TRUE),
('Olive Oil', 'Extra virgin olive oil 500ml', 1280.00, 7, 50, 'bottle', TRUE, FALSE),
('Pasta', 'Italian pasta 500g', 320.00, 7, 80, 'pack', TRUE, FALSE),

-- Personal Care
('Hand Soap', 'Antibacterial hand soap 250ml', 280.00, 8, 100, 'bottle', TRUE, FALSE),
('Shampoo', 'Natural shampoo 400ml', 650.00, 8, 70, 'bottle', TRUE, FALSE),
('Toothpaste', 'Mint toothpaste 100g', 180.00, 8, 120, 'tube', TRUE, FALSE);

-- ============================================================
-- Seed: Delivery Agents
-- ============================================================
INSERT INTO delivery_agents (name, phone, email, vehicle_type, vehicle_number, is_available, is_active) VALUES
('Kamal Perera', '0771111111', 'kamal@ccmart.com', 'bike', 'ABC-1234', TRUE, TRUE),
('Nimal Silva', '0772222222', 'nimal@ccmart.com', 'van', 'XYZ-5678', TRUE, TRUE),
('Sunil Fernando', '0773333333', 'sunil@ccmart.com', 'bike', 'DEF-9012', FALSE, TRUE);

-- ============================================================
-- Success message
-- ============================================================
SELECT 'Sample data inserted successfully!' AS message;
SELECT CONCAT('Total Users: ', COUNT(*)) AS info FROM users;
SELECT CONCAT('Total Categories: ', COUNT(*)) AS info FROM categories;
SELECT CONCAT('Total Products: ', COUNT(*)) AS info FROM products;
SELECT CONCAT('Total Delivery Agents: ', COUNT(*)) AS info FROM delivery_agents;
