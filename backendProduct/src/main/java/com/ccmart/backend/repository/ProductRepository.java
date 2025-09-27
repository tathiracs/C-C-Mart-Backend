package com.ccmart.backend.repository;

import com.ccmart.backend.model.Product;
import com.ccmart.backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(Category category);
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByBrandContainingIgnoreCase(String brand);
    
    @Query("SELECT p FROM Product p WHERE p.quantity > 0")
    List<Product> findAvailableProducts();
    
    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId AND p.quantity > 0")
    List<Product> findAvailableProductsByCategory(@Param("categoryId") Long categoryId);
}