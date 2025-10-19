package com.ccmart.backend.controller;

import com.ccmart.backend.model.Product;
import com.ccmart.backend.model.Category;
import com.ccmart.backend.repository.ProductRepository;
import com.ccmart.backend.repository.CategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductController(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public ResponseEntity<?> list(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "12") int limit) {
        List<Product> products = productRepository.findAll();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable Long id) {
        Optional<Product> p = productRepository.findById(id);
        if (p.isEmpty()) return ResponseEntity.status(404).body("Product not found");
        return ResponseEntity.ok(p.get());
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> create(@RequestBody com.ccmart.backend.dto.ProductDTO dto) {
        Product p = new Product();
        p.setName(dto.getName());
        p.setDescription(dto.getDescription());
        p.setPrice(dto.getPrice());
        p.setImageUrl(dto.getImageUrl());
        p.setStockQuantity(dto.getStockQuantity() == null ? 0 : dto.getStockQuantity());
        p.setUnit(dto.getUnit() == null ? "piece" : dto.getUnit());
        p.setIsFeatured(dto.getIsFeatured() == null ? false : dto.getIsFeatured());
        p.setIsActive(true); // Explicitly set new products as active
        
        // Set category if provided
        if (dto.getCategoryId() != null) {
            Optional<Category> categoryOpt = categoryRepository.findById(dto.getCategoryId());
            categoryOpt.ifPresent(p::setCategory);
        }
        
        Product saved = productRepository.save(p);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody com.ccmart.backend.dto.ProductDTO dto) {
        Optional<Product> existing = productRepository.findById(id);
        if (existing.isEmpty()) return ResponseEntity.status(404).body("Product not found");
        Product e = existing.get();
        e.setName(dto.getName());
        e.setDescription(dto.getDescription());
        e.setPrice(dto.getPrice());
        e.setImageUrl(dto.getImageUrl());
        e.setStockQuantity(dto.getStockQuantity());
        e.setUnit(dto.getUnit());
        e.setIsFeatured(dto.getIsFeatured());
        
        // Set isActive to true if not provided (ensures existing products become active)
        if (dto.getIsActive() != null) {
            e.setIsActive(dto.getIsActive());
        } else {
            e.setIsActive(true); // Default to active on update
        }
        
        // Update category if provided
        if (dto.getCategoryId() != null) {
            Optional<Category> categoryOpt = categoryRepository.findById(dto.getCategoryId());
            categoryOpt.ifPresent(e::setCategory);
        }
        
        productRepository.save(e);
        return ResponseEntity.ok(e);
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Optional<Product> existing = productRepository.findById(id);
        if (existing.isEmpty()) return ResponseEntity.status(404).body("Product not found");
        Product e = existing.get();
        e.setIsActive(false);
        productRepository.save(e);
        return ResponseEntity.ok("Product deleted");
    }

    // Fix endpoint to activate all products
    @PostMapping("/fix-active")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> fixActiveProducts() {
        List<Product> allProducts = productRepository.findAll();
        int fixed = 0;
        for (Product p : allProducts) {
            if (p.getIsActive() == null || !p.getIsActive()) {
                p.setIsActive(true);
                productRepository.save(p);
                fixed++;
            }
        }
        return ResponseEntity.ok("Fixed " + fixed + " products. All products are now active.");
    }
    
    // Seed sample products endpoint
    @PostMapping("/seed-samples")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> seedSampleProducts() {
        try {
            int added = 0;
            
            // Get categories
            Category fruits = categoryRepository.findByName("Fruits").orElse(null);
            Category vegetables = categoryRepository.findByName("Vegetables").orElse(null);
            Category dairy = categoryRepository.findByName("Dairy & Eggs").orElse(null);
            Category meat = categoryRepository.findByName("Meat & Seafood").orElse(null);
            Category bakery = categoryRepository.findByName("Bakery").orElse(null);
            Category beverages = categoryRepository.findByName("Beverages").orElse(null);
            Category snacks = categoryRepository.findByName("Snacks").orElse(null);
            Category pantry = categoryRepository.findByName("Pantry Staples").orElse(null);
            
            // Check if product already exists by name
            if (productRepository.findByName("Fresh Apples").isEmpty()) {
                added += addProduct("Fresh Apples", "Crisp and sweet red apples", 350.00, fruits, "kg", 50, true, 
                    "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400");
            }
            
            if (productRepository.findByName("Bananas").isEmpty()) {
                added += addProduct("Bananas", "Fresh yellow bananas", 180.00, fruits, "kg", 100, true,
                    "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400");
            }
            
            if (productRepository.findByName("Oranges").isEmpty()) {
                added += addProduct("Oranges", "Juicy valencia oranges", 280.00, fruits, "kg", 60, false,
                    "https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=400");
            }
            
            if (productRepository.findByName("Strawberries").isEmpty()) {
                added += addProduct("Strawberries", "Fresh organic strawberries", 450.00, fruits, "250g pack", 30, true,
                    "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400");
            }
            
            if (productRepository.findByName("Fresh Tomatoes").isEmpty()) {
                added += addProduct("Fresh Tomatoes", "Red ripe tomatoes", 150.00, vegetables, "kg", 80, false,
                    "https://images.unsplash.com/photo-1546470427-227ffa6cd6c7?w=400");
            }
            
            if (productRepository.findByName("Carrots").isEmpty()) {
                added += addProduct("Carrots", "Fresh orange carrots", 120.00, vegetables, "kg", 70, false,
                    "https://images.unsplash.com/photo-1582515073490-39981397c445?w=400");
            }
            
            if (productRepository.findByName("Potatoes").isEmpty()) {
                added += addProduct("Potatoes", "Quality white potatoes", 100.00, vegetables, "kg", 150, true,
                    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400");
            }
            
            if (productRepository.findByName("Fresh Milk").isEmpty()) {
                added += addProduct("Fresh Milk", "Full cream fresh milk", 280.00, dairy, "1L", 120, true,
                    "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400");
            }
            
            if (productRepository.findByName("Eggs").isEmpty()) {
                added += addProduct("Eggs", "Farm fresh eggs", 450.00, dairy, "dozen", 200, true,
                    "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400");
            }
            
            if (productRepository.findByName("Cheddar Cheese").isEmpty()) {
                added += addProduct("Cheddar Cheese", "Aged cheddar cheese", 850.00, dairy, "250g", 60, false,
                    "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400");
            }
            
            if (productRepository.findByName("Chicken Breast").isEmpty()) {
                added += addProduct("Chicken Breast", "Fresh boneless chicken breast", 1200.00, meat, "kg", 40, true,
                    "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400");
            }
            
            if (productRepository.findByName("White Bread").isEmpty()) {
                added += addProduct("White Bread", "Fresh white bread loaf", 120.00, bakery, "loaf", 80, false,
                    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400");
            }
            
            if (productRepository.findByName("Orange Juice").isEmpty()) {
                added += addProduct("Orange Juice", "Fresh squeezed orange juice", 350.00, beverages, "1L", 60, false,
                    "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400");
            }
            
            if (productRepository.findByName("Potato Chips").isEmpty()) {
                added += addProduct("Potato Chips", "Crispy salted potato chips", 180.00, snacks, "200g pack", 100, false,
                    "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400");
            }
            
            if (productRepository.findByName("White Rice").isEmpty()) {
                added += addProduct("White Rice", "Premium basmati rice", 850.00, pantry, "5kg", 80, true,
                    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400");
            }
            
            return ResponseEntity.ok("Successfully added " + added + " new sample products!");
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error seeding products: " + e.getMessage());
        }
    }
    
    private int addProduct(String name, String desc, double price, Category category, String unit, 
                          int stock, boolean featured, String imageUrl) {
        Product p = new Product();
        p.setName(name);
        p.setDescription(desc);
        p.setPrice(new java.math.BigDecimal(price));
        p.setCategory(category);
        p.setUnit(unit);
        p.setStockQuantity(stock);
        p.setIsFeatured(featured);
        p.setIsActive(true);
        p.setImageUrl(imageUrl);
        productRepository.save(p);
        return 1;
    }
}
