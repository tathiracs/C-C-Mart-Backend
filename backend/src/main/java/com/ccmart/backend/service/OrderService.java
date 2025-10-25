package com.ccmart.backend.service;

import com.ccmart.backend.model.Order;
import com.ccmart.backend.model.OrderItem;
import com.ccmart.backend.model.Product;
import com.ccmart.backend.repository.OrderRepository;
import com.ccmart.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final NotificationService notificationService;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository,
                       NotificationService notificationService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public Order createOrder(Order order) throws IllegalArgumentException {
        try {
            // Validate order has items
            if (order.getItems() == null || order.getItems().isEmpty()) {
                throw new IllegalArgumentException("Order must contain at least one item");
            }
            
            BigDecimal total = BigDecimal.ZERO;
            
            for (OrderItem it : order.getItems()) {
                // Validate product ID
                if (it.getProduct() == null || it.getProduct().getId() == null) {
                    throw new IllegalArgumentException("Invalid product in order item");
                }
                
                Long pid = it.getProduct().getId();
                Optional<Product> pOpt = productRepository.findById(pid);
                
                if (pOpt.isEmpty()) {
                    throw new IllegalArgumentException("Product not found with ID: " + pid);
                }
                
                Product p = pOpt.get();
                
                // Check stock availability
                if (p.getStockQuantity() < it.getQuantity()) {
                    throw new IllegalArgumentException("Insufficient stock for " + p.getName() + 
                        ". Available: " + p.getStockQuantity() + ", Requested: " + it.getQuantity());
                }
                
                // Set order item details
                it.setPrice(p.getPrice());
                it.setOrder(order);
                
                // Calculate total
                BigDecimal itemTotal = p.getPrice().multiply(new BigDecimal(it.getQuantity()));
                total = total.add(itemTotal);
                
                // Update stock
                p.setStockQuantity(p.getStockQuantity() - it.getQuantity());
                productRepository.save(p);
            }
            
            // Set order total
            order.setTotalAmount(total);
            
            // Save order
            Order savedOrder = orderRepository.save(order);
            
            // Create notification for order placement
            try {
                notificationService.createOrderNotification(savedOrder, null, savedOrder.getStatus());
                System.out.println("✅ Notification created for new order: " + savedOrder.getId());
            } catch (Exception notifEx) {
                // Log but don't fail the order creation
                System.err.println("⚠️ Failed to create notification for order " + savedOrder.getId() + ": " + notifEx.getMessage());
            }
            
            // Return saved order
            return savedOrder;
            
        } catch (Exception ex) {
            // Log and rethrow
            System.err.println("Error creating order: " + ex.getMessage());
            ex.printStackTrace();
            throw ex;
        }
    }

    @Transactional
    public void cancelOrder(Long orderId) throws IllegalArgumentException {
        Optional<Order> oOpt = orderRepository.findById(orderId);
        if (oOpt.isEmpty()) throw new IllegalArgumentException("Order not found");
        Order order = oOpt.get();
        if (order.getStatus().equals("delivered") || order.getStatus().equals("cancelled")) {
            throw new IllegalArgumentException("Order cannot be cancelled");
        }
        // restore stock
        if (order.getItems() != null) {
            for (OrderItem it : order.getItems()) {
                Product p = it.getProduct();
                p.setStockQuantity(p.getStockQuantity() + it.getQuantity());
                productRepository.save(p);
            }
        }
        order.setStatus("cancelled");
        order.setPaymentStatus("refunded");
        orderRepository.save(order);
    }
}
