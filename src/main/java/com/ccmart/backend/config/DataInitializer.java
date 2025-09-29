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
    initializeCategories();
    initializeSampleProducts();
  }

  private void initializeCategories() {
    String[] categoryNames = {
        "Fruits & Vegetables",
        "Meat & Seafood",
        "Dairy & Eggs",
        "Bakery & Bread",
        "Pantry & Staples",
        "Beverages",
        "Snacks & Confectionery",
        "Frozen Foods",
        "Personal Care",
        "Household Items",
        "Baby Care",
        "Pet Care"
    };

    String[] descriptions = {
        "Fresh fruits and vegetables including seasonal produce",
        "Fresh meat, poultry, seafood, and processed meats",
        "Milk, cheese, yogurt, eggs, and dairy products",
        "Fresh bread, pastries, cakes, and bakery items",
        "Rice, pasta, flour, oils, spices, and cooking essentials",
        "Soft drinks, juices, water, tea, coffee, and beverages",
        "Chips, nuts, chocolates, candies, and snack foods",
        "Frozen vegetables, fruits, meals, and ice cream",
        "Soap, shampoo, toothpaste, and personal hygiene products",
        "Cleaning supplies, paper products, and household essentials",
        "Baby food, diapers, and child care products",
        "Pet food, treats, and pet care supplies"
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
    // No sample products will be initialized
    // Categories are available for manual product creation
    System.out.println("Sample product initialization skipped - products must be added manually.");
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