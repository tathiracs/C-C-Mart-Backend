package com.ccmart.backend.config;

import com.ccmart.backend.model.Category;
import com.ccmart.backend.model.Product;
import com.ccmart.backend.service.CategoryService;
import com.ccmart.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private ProductService productService;

    @Override
    public void run(String... args) throws Exception {
        // Initialize categories if they don't exist
        initializeCategories();
        // Initialize sample products if database is empty
        initializeSampleProducts();
    }

    private void initializeCategories() {
        String[] categoryNames = {
                "Foods", "Beverages", "Dairy & Milk", "Fruits & Vegetables",
                "Meat & Seafood", "Bakery", "Snacks & Confectionery",
                "Household Cleaning", "Personal Care", "Baby Care",
                "Pet Care", "Stationery", "Electronics", "Health & Wellness",
                "Frozen Foods", "Canned & Packaged", "Spices & Condiments",
                "Breakfast & Cereals", "Tea & Coffee", "Kitchen & Dining"
        };

        String[] descriptions = {
                "Fresh and packaged food items",
                "Soft drinks, juices, and other beverages",
                "Milk, cheese, yogurt, and dairy products",
                "Fresh fruits and vegetables",
                "Fresh and frozen meat, chicken, fish, and seafood",
                "Bread, cakes, pastries, and baked goods",
                "Chips, chocolates, candies, and snacks",
                "Detergents, cleaning supplies, and household cleaners",
                "Soaps, shampoos, toothpaste, and personal hygiene products",
                "Baby food, diapers, and baby care essentials",
                "Pet food, toys, and pet care products",
                "Pens, papers, notebooks, and office supplies",
                "Small electronics and gadgets",
                "Vitamins, medicines, and health products",
                "Frozen vegetables, meals, and ice cream",
                "Canned goods, instant foods, and packaged items",
                "Spices, sauces, oils, and cooking condiments",
                "Cereals, oats, and breakfast items",
                "Various types of tea and coffee",
                "Kitchen utensils, plates, and dining accessories"
        };

        for (int i = 0; i < categoryNames.length; i++) {
            if (!categoryService.existsByName(categoryNames[i])) {
                Category category = new Category(categoryNames[i], descriptions[i]);
                categoryService.saveCategory(category);
                System.out.println("Created category: " + categoryNames[i]);
            }
        }
    }

    private void initializeSampleProducts() {
        // Only add sample products if database is empty
        if (productService.getAllProducts().isEmpty()) {
            System.out.println("Initializing sample products...");

            // Get categories
            Category foodsCategory = categoryService.getCategoryByName("Foods");
            Category beveragesCategory = categoryService.getCategoryByName("Beverages");
            Category dairyCategory = categoryService.getCategoryByName("Dairy & Milk");
            Category personalCareCategory = categoryService.getCategoryByName("Personal Care");
            Category stationeryCategory = categoryService.getCategoryByName("Stationery");

            // Sample products using existing images
            createSampleProduct("Basmati Rice", "Golden Harvest", "1kg", 50, "4.99",
                    "Premium quality basmati rice, long grain and aromatic", foodsCategory,
                    "fd63a95b-3299-44a9-ad37-eae5634ecba4_rice.jpeg");

            createSampleProduct("Fresh Milk", "Anchor", "1L", 35, "2.79",
                    "Fresh full cream milk, rich in calcium", dairyCategory,
                    "ce9c3404-43fc-40bc-ad90-79374a1c3646_anchor_milk.jpeg");

            createSampleProduct("Elephant House Milk", "Elephant House", "1L", 25, "3.19",
                    "Premium quality fresh milk from Elephant House", dairyCategory,
                    "5d672d68-30cf-4048-b8de-114b4da7b0a5_elephant_milk.jpeg");

            createSampleProduct("Lifebuoy Soap", "Lifebuoy", "125g", 60, "1.99",
                    "Antibacterial soap for complete protection", personalCareCategory,
                    "981c4880-7cf2-4385-aaa0-fba3c48b2573_lifeboy.jpeg");

            createSampleProduct("Ballpoint Pens", "Bic", "Pack of 10", 100, "4.99",
                    "Smooth writing ballpoint pens, assorted colors", stationeryCategory,
                    "12966a2e-e339-43fc-a3b1-fb1e3238b27f_pen.jpeg");

            createSampleProduct("Kirisamba Coconut", "Kirisamba", "500g", 25, "6.99",
                    "Fresh kirisamba coconut, perfect for cooking", foodsCategory,
                    "947380b4-b27c-4028-9c98-919da0993bc1_kirisamba.jpeg");

            // Additional products without images
            createSampleProduct("Orange Juice", "Pure Gold", "1L", 30, "3.29",
                    "100% pure orange juice, no added sugar", beveragesCategory, null);

            createSampleProduct("Whole Wheat Bread", "Fresh Bakery", "500g", 25, "2.49",
                    "Fresh whole wheat bread, baked daily", foodsCategory, null);

            createSampleProduct("Greek Yogurt", "Chobani", "500g", 20, "4.49",
                    "Thick and creamy Greek yogurt, high protein", dairyCategory, null);

            createSampleProduct("Shampoo", "Head & Shoulders", "400ml", 25, "6.99",
                    "Anti-dandruff shampoo for healthy hair", personalCareCategory, null);

            System.out.println("Sample products initialization completed!");
        } else {
            System.out.println("Products already exist, skipping sample data initialization.");
        }
    }

    private void createSampleProduct(String name, String brand, String weight, Integer quantity,
            String price, String description, Category category, String imagePath) {
        try {
            Product product = new Product();
            product.setName(name);
            product.setBrand(brand);
            product.setWeight(weight);
            product.setQuantity(quantity);
            product.setPrice(new BigDecimal(price));
            product.setDescription(description);
            product.setCategory(category);

            if (imagePath != null) {
                product.setImagePath(imagePath);
            }

            productService.saveProduct(product);
            System.out.println("Created product: " + name);
        } catch (Exception e) {
            System.err.println("Error creating product: " + name + " - " + e.getMessage());
        }
    }
}