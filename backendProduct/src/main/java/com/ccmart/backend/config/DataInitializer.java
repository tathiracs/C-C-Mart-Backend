package com.ccmart.backend.config;

import com.ccmart.backend.model.Category;
import com.ccmart.backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CategoryService categoryService;

    @Override
    public void run(String... args) throws Exception {
        // Initialize categories if they don't exist
        initializeCategories();
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
}