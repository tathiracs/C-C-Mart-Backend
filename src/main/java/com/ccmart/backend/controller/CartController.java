package com.ccmart.backend.controller;

import com.ccmart.backend.model.CartItem;
import com.ccmart.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

  @Autowired
  private CartService cartService;

  @GetMapping("/{sessionId}")
  public List<CartItem> getCartItems(@PathVariable String sessionId) {
    return cartService.getCartItems(sessionId);
  }

  @PostMapping("/{sessionId}/add")
  public ResponseEntity<CartItem> addToCart(
      @PathVariable String sessionId,
      @RequestBody Map<String, Object> request) {
    try {
      Long productId = Long.valueOf(request.get("productId").toString());
      Integer quantity = Integer.valueOf(request.get("quantity").toString());
      CartItem item = cartService.addToCart(sessionId, productId, quantity);
      return ResponseEntity.ok(item);
    } catch (Exception e) {
      return ResponseEntity.badRequest().build();
    }
  }

  @PutMapping("/item/{itemId}")
  public ResponseEntity<CartItem> updateCartItem(
      @PathVariable Long itemId,
      @RequestBody Map<String, Integer> request) {
    try {
      Integer quantity = request.get("quantity");
      CartItem item = cartService.updateCartItem(itemId, quantity);
      return ResponseEntity.ok(item);
    } catch (Exception e) {
      return ResponseEntity.badRequest().build();
    }
  }

  @DeleteMapping("/item/{itemId}")
  public ResponseEntity<Void> removeFromCart(@PathVariable Long itemId) {
    try {
      cartService.removeFromCart(itemId);
      return ResponseEntity.ok().build();
    } catch (Exception e) {
      return ResponseEntity.badRequest().build();
    }
  }

  @DeleteMapping("/{sessionId}/clear")
  public ResponseEntity<Void> clearCart(@PathVariable String sessionId) {
    cartService.clearCart(sessionId);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/{sessionId}/total")
  public ResponseEntity<Map<String, BigDecimal>> getCartTotal(@PathVariable String sessionId) {
    BigDecimal total = cartService.getCartTotal(sessionId);
    return ResponseEntity.ok(Map.of("total", total));
  }
}