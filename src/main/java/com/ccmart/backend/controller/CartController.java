package com.ccmart.backend.controller;

import com.ccmart.backend.model.CartItem;
import com.ccmart.backend.model.Product;
import com.ccmart.backend.model.User;
import com.ccmart.backend.repository.CartRepository;
import com.ccmart.backend.repository.ProductRepository;
import com.ccmart.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartController(CartRepository cartRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getCart(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).body("Unauthorized");
        Long userId = Long.valueOf(authentication.getName());
        List<CartItem> items = cartRepository.findAll(); // simplified; should filter by user
        return ResponseEntity.ok(items);
    }

    @PostMapping
    public ResponseEntity<?> addToCart(Authentication authentication, @RequestBody CartItem item) {
        if (authentication == null) return ResponseEntity.status(401).body("Unauthorized");
        Long userId = Long.valueOf(authentication.getName());
        Optional<User> uOpt = userRepository.findById(userId);
        if (uOpt.isEmpty()) return ResponseEntity.status(404).body("User not found");
        Optional<Product> pOpt = productRepository.findById(item.getProduct().getId());
        if (pOpt.isEmpty()) return ResponseEntity.status(404).body("Product not found");
        Product p = pOpt.get();
        if (p.getStockQuantity() < item.getQuantity()) return ResponseEntity.badRequest().body("Insufficient stock");
        item.setUser(uOpt.get());
        item.setProduct(p);
        CartItem saved = cartRepository.save(item);
        return ResponseEntity.status(201).body(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> remove(@PathVariable Long id, Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).body("Unauthorized");
        Optional<CartItem> cOpt = cartRepository.findById(id);
        if (cOpt.isEmpty()) return ResponseEntity.status(404).body("Cart item not found");
        cartRepository.deleteById(id);
        return ResponseEntity.ok("Removed");
    }
}
