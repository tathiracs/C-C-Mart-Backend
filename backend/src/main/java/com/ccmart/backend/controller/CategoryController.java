package com.ccmart.backend.controller;

import com.ccmart.backend.model.Category;
import com.ccmart.backend.repository.CategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public ResponseEntity<?> list() {
        System.out.println("CategoryController.list() called");
        List<Category> categories = categoryRepository.findAll();
        System.out.println("Found " + categories.size() + " categories");
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable Long id) {
        Optional<Category> c = categoryRepository.findById(id);
        if (c.isEmpty()) return ResponseEntity.status(404).body("Category not found");
        return ResponseEntity.ok(c.get());
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> create(@RequestBody Category category) {
        Category saved = categoryRepository.save(category);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Category category) {
        Optional<Category> existing = categoryRepository.findById(id);
        if (existing.isEmpty()) return ResponseEntity.status(404).body("Category not found");
        Category e = existing.get();
        e.setName(category.getName());
        e.setDescription(category.getDescription());
        e.setImageUrl(category.getImageUrl());
        e.setIsActive(category.getIsActive());
        categoryRepository.save(e);
        return ResponseEntity.ok(e);
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Optional<Category> existing = categoryRepository.findById(id);
        if (existing.isEmpty()) return ResponseEntity.status(404).body("Category not found");
        Category e = existing.get();
        e.setIsActive(false);
        categoryRepository.save(e);
        return ResponseEntity.ok("Category deleted");
    }
}
