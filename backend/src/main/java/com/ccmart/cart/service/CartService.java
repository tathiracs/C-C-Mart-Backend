package com.ccmart.cart.service;

import com.ccmart.cart.entity.CartItem;
import com.ccmart.cart.entity.Product;
import com.ccmart.cart.repository.CartItemRepository;
import com.ccmart.cart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {
    
    @Autowired
    private CartItemRepository cartItemRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    public List<CartItem> getCartItems(String sessionId) {
        return cartItemRepository.findBySessionId(sessionId);
    }
    
    public CartItem addToCart(String sessionId, Long productId, Integer quantity) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            throw new RuntimeException("Product not found");
        }
        
        Product product = productOpt.get();
        Optional<CartItem> existingItemOpt = cartItemRepository.findBySessionIdAndProductId(sessionId, productId);
        
        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            return cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = new CartItem(product, quantity, sessionId);
            return cartItemRepository.save(newItem);
        }
    }
    
    public CartItem updateCartItem(Long itemId, Integer quantity) {
        Optional<CartItem> itemOpt = cartItemRepository.findById(itemId);
        if (itemOpt.isEmpty()) {
            throw new RuntimeException("Cart item not found");
        }
        
        CartItem item = itemOpt.get();
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }
    
    public void removeFromCart(Long itemId) {
        cartItemRepository.deleteById(itemId);
    }
    
    @Transactional
    public void clearCart(String sessionId) {
        cartItemRepository.deleteBySessionId(sessionId);
    }
    
    public BigDecimal getCartTotal(String sessionId) {
        List<CartItem> items = cartItemRepository.findBySessionId(sessionId);
        return items.stream()
                .map(CartItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}