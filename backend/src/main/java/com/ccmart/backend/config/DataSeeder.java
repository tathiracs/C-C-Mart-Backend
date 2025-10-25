package com.ccmart.backend.config;

import com.ccmart.backend.model.User;
import com.ccmart.backend.model.Category;
import com.ccmart.backend.model.Product;
import com.ccmart.backend.service.UserService;
import com.ccmart.backend.repository.CategoryRepository;
import com.ccmart.backend.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.math.BigDecimal;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner initData(UserService userService, CategoryRepository categoryRepository, 
                                     ProductRepository productRepository) {
        return args -> {
            // Create admin user if not exists
            if (userService.findByEmail("admin@ccmart.com").isEmpty()) {
                User admin = new User();
                admin.setName("Admin");
                admin.setEmail("admin@ccmart.com");
                admin.setPassword("admin123"); // Will be encoded by UserService
                admin.setRole("admin");
                userService.register(admin);
                System.out.println("Admin user created successfully");
            }
            
            // Seed categories if none exist
            long catCount = categoryRepository.count();
            if (catCount == 0) {
                String[] categoryNames = {
                    "Fruits", "Vegetables", "Dairy & Eggs", "Meat & Seafood",
                    "Bakery", "Beverages", "Snacks", "Frozen Foods",
                    "Pantry Staples", "Personal Care", "Household Items"
                };
                
                String[] descriptions = {
                    "Fresh fruits and seasonal produce",
                    "Fresh vegetables and greens",
                    "Milk, cheese, eggs, and dairy products",
                    "Fresh meat, poultry, and seafood",
                    "Bread, pastries, and baked goods",
                    "Drinks, juices, and beverages",
                    "Chips, cookies, and snack items",
                    "Frozen meals and frozen products",
                    "Rice, flour, oil, and pantry essentials",
                    "Personal hygiene and care products",
                    "Cleaning supplies and household items"
                };
                
                for (int i = 0; i < categoryNames.length; i++) {
                    Category category = new Category();
                    category.setName(categoryNames[i]);
                    category.setDescription(descriptions[i]);
                    category.setIsActive(true);
                    categoryRepository.save(category);
                }
                System.out.println("✓ Categories seeded successfully: " + categoryNames.length + " categories added");
            } else {
                System.out.println("✓ Categories already exist: " + catCount + " categories found");
            }
            
            // Seed sample products if none exist
            long productCount = productRepository.count();
            if (productCount == 0) {
                System.out.println("Seeding sample products...");
                
                // Get categories for products
                Category fruits = categoryRepository.findByName("Fruits").orElse(null);
                Category vegetables = categoryRepository.findByName("Vegetables").orElse(null);
                Category dairy = categoryRepository.findByName("Dairy & Eggs").orElse(null);
                Category meat = categoryRepository.findByName("Meat & Seafood").orElse(null);
                Category bakery = categoryRepository.findByName("Bakery").orElse(null);
                Category beverages = categoryRepository.findByName("Beverages").orElse(null);
                Category snacks = categoryRepository.findByName("Snacks").orElse(null);
                Category pantry = categoryRepository.findByName("Pantry Staples").orElse(null);
                
                // Fruits (8 products)
                createProduct(productRepository, "Fresh Apples", "Crisp and sweet red apples", 
                    new BigDecimal("350.00"), fruits, "kg", 50, true, 
                    "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400");
                    
                createProduct(productRepository, "Bananas", "Fresh yellow bananas, perfect for snacking", 
                    new BigDecimal("180.00"), fruits, "kg", 100, true,
                    "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400");
                    
                createProduct(productRepository, "Oranges", "Juicy valencia oranges", 
                    new BigDecimal("280.00"), fruits, "kg", 60, false,
                    "https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=400");
                    
                createProduct(productRepository, "Strawberries", "Fresh organic strawberries", 
                    new BigDecimal("450.00"), fruits, "250g pack", 30, true,
                    "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400");
                    
                createProduct(productRepository, "Watermelon", "Sweet and refreshing watermelon", 
                    new BigDecimal("120.00"), fruits, "kg", 25, false,
                    "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=400");
                    
                createProduct(productRepository, "Grapes", "Seedless green grapes", 
                    new BigDecimal("380.00"), fruits, "500g pack", 40, false,
                    "https://images.unsplash.com/photo-1599819177626-c0f8e1a8ec6e?w=400");
                    
                createProduct(productRepository, "Mangoes", "Ripe and juicy mangoes", 
                    new BigDecimal("320.00"), fruits, "kg", 45, true,
                    "https://images.unsplash.com/photo-1605027990121-cbae9d3c8e63?w=400");
                    
                createProduct(productRepository, "Pineapple", "Fresh sweet pineapple", 
                    new BigDecimal("250.00"), fruits, "piece", 35, false,
                    "https://images.unsplash.com/photo-1550828520-4cb496926fc9?w=400");
                
                // Vegetables (8 products)
                createProduct(productRepository, "Fresh Tomatoes", "Red ripe tomatoes", 
                    new BigDecimal("150.00"), vegetables, "kg", 80, false,
                    "https://images.unsplash.com/photo-1546470427-227ffa6cd6c7?w=400");
                    
                createProduct(productRepository, "Carrots", "Fresh orange carrots", 
                    new BigDecimal("120.00"), vegetables, "kg", 70, false,
                    "https://images.unsplash.com/photo-1582515073490-39981397c445?w=400");
                    
                createProduct(productRepository, "Potatoes", "Quality white potatoes", 
                    new BigDecimal("100.00"), vegetables, "kg", 150, true,
                    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400");
                    
                createProduct(productRepository, "Onions", "Fresh red onions", 
                    new BigDecimal("140.00"), vegetables, "kg", 100, false,
                    "https://images.unsplash.com/photo-1587049352846-4a222e784313?w=400");
                    
                createProduct(productRepository, "Green Beans", "Fresh tender green beans", 
                    new BigDecimal("220.00"), vegetables, "500g pack", 50, false,
                    "https://images.unsplash.com/photo-1604667527148-2e2e9b0e3f9f?w=400");
                    
                createProduct(productRepository, "Broccoli", "Fresh green broccoli", 
                    new BigDecimal("280.00"), vegetables, "piece", 40, false,
                    "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400");
                    
                createProduct(productRepository, "Spinach", "Fresh leafy spinach", 
                    new BigDecimal("180.00"), vegetables, "bunch", 45, false,
                    "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400");
                    
                createProduct(productRepository, "Bell Peppers", "Colorful bell peppers mix", 
                    new BigDecimal("320.00"), vegetables, "kg", 55, false,
                    "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400");
                
                // Dairy & Eggs (6 products)
                createProduct(productRepository, "Fresh Milk", "Full cream fresh milk", 
                    new BigDecimal("280.00"), dairy, "1L", 120, true,
                    "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400");
                    
                createProduct(productRepository, "Eggs", "Farm fresh eggs", 
                    new BigDecimal("450.00"), dairy, "dozen", 200, true,
                    "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400");
                    
                createProduct(productRepository, "Cheddar Cheese", "Aged cheddar cheese", 
                    new BigDecimal("850.00"), dairy, "250g", 60, false,
                    "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400");
                    
                createProduct(productRepository, "Yogurt", "Greek style yogurt", 
                    new BigDecimal("320.00"), dairy, "500g", 80, false,
                    "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400");
                    
                createProduct(productRepository, "Butter", "Unsalted butter", 
                    new BigDecimal("680.00"), dairy, "500g", 70, false,
                    "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400");
                    
                createProduct(productRepository, "Cream", "Heavy cream", 
                    new BigDecimal("420.00"), dairy, "250ml", 50, false,
                    "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400");
                
                // Meat & Seafood (4 products)
                createProduct(productRepository, "Chicken Breast", "Fresh boneless chicken breast", 
                    new BigDecimal("1200.00"), meat, "kg", 40, true,
                    "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400");
                    
                createProduct(productRepository, "Ground Beef", "Fresh lean ground beef", 
                    new BigDecimal("1500.00"), meat, "kg", 35, false,
                    "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400");
                    
                createProduct(productRepository, "Fresh Salmon", "Atlantic salmon fillets", 
                    new BigDecimal("2200.00"), meat, "kg", 20, false,
                    "https://images.unsplash.com/photo-1580554530778-ca36943938b2?w=400");
                    
                createProduct(productRepository, "Prawns", "Large fresh prawns", 
                    new BigDecimal("1800.00"), meat, "500g", 25, false,
                    "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400");
                
                // Bakery (5 products)
                createProduct(productRepository, "White Bread", "Fresh white bread loaf", 
                    new BigDecimal("120.00"), bakery, "loaf", 80, false,
                    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400");
                    
                createProduct(productRepository, "Croissants", "Butter croissants", 
                    new BigDecimal("180.00"), bakery, "pack of 4", 50, false,
                    "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400");
                    
                createProduct(productRepository, "Muffins", "Blueberry muffins", 
                    new BigDecimal("220.00"), bakery, "pack of 4", 60, false,
                    "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400");
                    
                createProduct(productRepository, "Bagels", "Plain bagels", 
                    new BigDecimal("280.00"), bakery, "pack of 6", 45, false,
                    "https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?w=400");
                    
                createProduct(productRepository, "Cookies", "Chocolate chip cookies", 
                    new BigDecimal("320.00"), bakery, "250g pack", 70, true,
                    "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400");
                
                // Beverages (6 products)
                createProduct(productRepository, "Orange Juice", "100% pure orange juice", 
                    new BigDecimal("380.00"), beverages, "1L", 90, false,
                    "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400");
                    
                createProduct(productRepository, "Mineral Water", "Natural mineral water", 
                    new BigDecimal("120.00"), beverages, "1.5L", 200, false,
                    "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400");
                    
                createProduct(productRepository, "Green Tea", "Premium green tea bags", 
                    new BigDecimal("450.00"), beverages, "25 bags", 60, false,
                    "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400");
                    
                createProduct(productRepository, "Coffee Beans", "Arabica coffee beans", 
                    new BigDecimal("1200.00"), beverages, "500g", 40, false,
                    "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400");
                    
                createProduct(productRepository, "Soft Drink", "Cola soft drink", 
                    new BigDecimal("180.00"), beverages, "1.5L", 150, false,
                    "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400");
                    
                createProduct(productRepository, "Energy Drink", "Sports energy drink", 
                    new BigDecimal("280.00"), beverages, "500ml", 80, false,
                    "https://images.unsplash.com/photo-1622543925917-763c34f6a3f4?w=400");
                
                // Snacks (5 products)
                createProduct(productRepository, "Potato Chips", "Salted potato chips", 
                    new BigDecimal("220.00"), snacks, "150g pack", 100, false,
                    "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400");
                    
                createProduct(productRepository, "Chocolate Bar", "Milk chocolate bar", 
                    new BigDecimal("180.00"), snacks, "100g", 120, true,
                    "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400");
                    
                createProduct(productRepository, "Nuts Mix", "Roasted nuts mix", 
                    new BigDecimal("580.00"), snacks, "250g", 70, false,
                    "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400");
                    
                createProduct(productRepository, "Popcorn", "Butter popcorn", 
                    new BigDecimal("280.00"), snacks, "200g", 90, false,
                    "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400");
                    
                createProduct(productRepository, "Granola Bars", "Oat granola bars", 
                    new BigDecimal("420.00"), snacks, "pack of 6", 60, false,
                    "https://images.unsplash.com/photo-1606312619070-d48b4cda2f14?w=400");
                
                // Pantry Staples (8 products)
                createProduct(productRepository, "Basmati Rice", "Premium basmati rice", 
                    new BigDecimal("380.00"), pantry, "1kg", 150, true,
                    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400");
                    
                createProduct(productRepository, "All-Purpose Flour", "White wheat flour", 
                    new BigDecimal("180.00"), pantry, "1kg", 200, false,
                    "https://images.unsplash.com/photo-1628431107370-c5e2e9c72b8d?w=400");
                    
                createProduct(productRepository, "Cooking Oil", "Vegetable cooking oil", 
                    new BigDecimal("520.00"), pantry, "1L", 120, true,
                    "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400");
                    
                createProduct(productRepository, "Sugar", "White granulated sugar", 
                    new BigDecimal("220.00"), pantry, "1kg", 180, false,
                    "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400");
                    
                createProduct(productRepository, "Salt", "Iodized table salt", 
                    new BigDecimal("80.00"), pantry, "1kg", 250, false,
                    "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400");
                    
                createProduct(productRepository, "Pasta", "Spaghetti pasta", 
                    new BigDecimal("280.00"), pantry, "500g", 100, false,
                    "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400");
                    
                createProduct(productRepository, "Olive Oil", "Extra virgin olive oil", 
                    new BigDecimal("1200.00"), pantry, "500ml", 50, false,
                    "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400");
                    
                createProduct(productRepository, "Honey", "Pure natural honey", 
                    new BigDecimal("680.00"), pantry, "500g", 60, false,
                    "https://images.unsplash.com/photo-1587049016823-69ea98c1e1d3?w=400");
                
                System.out.println("✓ Sample products seeded successfully: 58 products added");
                System.out.println("✓ All products are active and ready to display on the website");
            } else {
                System.out.println("✓ Products already exist: " + productCount + " products found");
            }
        };
    }
    
    private void createProduct(ProductRepository productRepository, String name, String description,
                              BigDecimal price, Category category, String unit, int stockQuantity,
                              boolean isFeatured, String imageUrl) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setCategory(category);
        product.setUnit(unit);
        product.setStockQuantity(stockQuantity);
        product.setIsFeatured(isFeatured);
        product.setIsActive(true); // Ensure all products are active
        product.setImageUrl(imageUrl);
        productRepository.save(product);
    }
}