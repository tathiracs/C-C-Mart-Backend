package com.ccmart.cart.config;

import com.ccmart.cart.entity.Product;
import com.ccmart.cart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialize sample products for C&C Mart
        if (productRepository.count() == 0) {
            productRepository.save(new Product("Laptop", "High-performance laptop for work and gaming", 
                new BigDecimal("999.99"), "https://via.placeholder.com/300x200?text=Laptop", 10));
            
            productRepository.save(new Product("Smartphone", "Latest smartphone with advanced features", 
                new BigDecimal("699.99"), "https://via.placeholder.com/300x200?text=Phone", 15));
            
            productRepository.save(new Product("Headphones", "Wireless noise-cancelling headphones", 
                new BigDecimal("199.99"), "https://via.placeholder.com/300x200?text=Headphones", 25));
            
            productRepository.save(new Product("Tablet", "10-inch tablet perfect for entertainment", 
                new BigDecimal("399.99"), "https://via.placeholder.com/300x200?text=Tablet", 8));
            
            productRepository.save(new Product("Smart Watch", "Fitness tracker with heart rate monitor", 
                new BigDecimal("249.99"), "https://via.placeholder.com/300x200?text=Watch", 20));
        }
    }
}