package com.ccmart.backend.controller;

import com.ccmart.backend.model.Order;
import com.ccmart.backend.model.OrderItem;
import com.ccmart.backend.model.Product;
import com.ccmart.backend.model.User;
import com.ccmart.backend.model.DeliveryAgent;
import com.ccmart.backend.repository.OrderRepository;
import com.ccmart.backend.repository.ProductRepository;
import com.ccmart.backend.repository.UserRepository;
import com.ccmart.backend.repository.DeliveryAgentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final DeliveryAgentRepository deliveryAgentRepository;
    private final com.ccmart.backend.service.OrderService orderService;
    
    @PersistenceContext
    private EntityManager entityManager;

    public OrderController(OrderRepository orderRepository, UserRepository userRepository, 
                          ProductRepository productRepository, DeliveryAgentRepository deliveryAgentRepository,
                          com.ccmart.backend.service.OrderService orderService) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.deliveryAgentRepository = deliveryAgentRepository;
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<?> list(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).body("Unauthorized");
        
        try {
            Long userId = Long.valueOf(authentication.getName());
            Optional<User> userOpt = userRepository.findById(userId);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body("User not found");
            }
            
            // Always return only the user's own orders (for "My Orders" page)
            return ResponseEntity.ok(orderRepository.findByUserId(userId));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid user ID format");
        }
    }
    
    @GetMapping("/all")
    public ResponseEntity<?> getAllOrders(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).body("Unauthorized");
        
        try {
            Long userId = Long.valueOf(authentication.getName());
            Optional<User> userOpt = userRepository.findById(userId);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body("User not found");
            }
            
            User user = userOpt.get();
            
            // Only admin can access all orders
            if (!"admin".equalsIgnoreCase(user.getRole())) {
                return ResponseEntity.status(403).body("Access denied. Admin only.");
            }
            
            // Use EntityManager with native query to bypass all JPA filtering
            @SuppressWarnings("unchecked")
            List<Order> allOrders = entityManager.createNativeQuery(
                "SELECT * FROM orders ORDER BY id DESC", Order.class)
                .getResultList();
            
            System.out.println("====================================");
            System.out.println("GET /api/orders/all called by admin");
            System.out.println("Using EntityManager native query");
            System.out.println("Total orders retrieved: " + allOrders.size());
            if (allOrders.size() > 0) {
                System.out.println("Order IDs: ");
                for (Order order : allOrders) {
                    System.out.println("  - Order #" + order.getId() + 
                        " | User: " + order.getUser().getName() + 
                        " (ID: " + order.getUser().getId() + ")" +
                        " | Status: " + order.getStatus());
                }
            }
            System.out.println("====================================");
            return ResponseEntity.ok(allOrders);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid user ID format");
        } catch (Exception e) {
            System.err.println("Error in getAllOrders: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        
        try {
            Long userId = Long.valueOf(authentication.getName());
            List<Order> orders = orderRepository.findByUserId(userId);
            return ResponseEntity.ok(orders);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid user ID format");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable Long id, Authentication authentication) {
        Optional<Order> o = orderRepository.findById(id);
        if (o.isEmpty()) return ResponseEntity.status(404).body("Order not found");
        return ResponseEntity.ok(o.get());
    }

    @PostMapping
    public ResponseEntity<?> create(Authentication authentication, @RequestBody Order order) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }
            
            // Get user ID from authentication
            Long userId = Long.valueOf(authentication.getName());
            Optional<User> uOpt = userRepository.findById(userId);
            if (uOpt.isEmpty()) {
                return ResponseEntity.status(404).body("User not found with ID: " + userId);
            }

            // Set user and default status
            order.setUser(uOpt.get());
            if (order.getStatus() == null || order.getStatus().isEmpty()) {
                order.setStatus("pending");
            }
            
            // Create order through service
            Order saved = orderService.createOrder(order);
            return ResponseEntity.status(201).body(saved);
            
        } catch (NumberFormatException nfe) {
            return ResponseEntity.badRequest().body("Invalid user ID format in authentication");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body("Error creating order: " + ex.getMessage());
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable Long id, Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).body("Unauthorized");
        try {
            orderService.cancelOrder(id);
            return ResponseEntity.ok("Order cancelled successfully");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // Approve order (Admin only)
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveOrder(@PathVariable Long id) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Order not found");
        }

        Order order = orderOpt.get();
        if (!order.getStatus().equals("pending")) {
            return ResponseEntity.badRequest().body("Only pending orders can be approved");
        }

        order.setStatus("approved");
        order.setApprovedAt(LocalDateTime.now());
        orderRepository.save(order);

        return ResponseEntity.ok(order);
    }

    // Assign delivery agent to order (Admin only)
    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignDeliveryAgent(@PathVariable Long id, @RequestBody Map<String, Long> body) {
        Long agentId = body.get("agentId");
        if (agentId == null) {
            return ResponseEntity.badRequest().body("Agent ID is required");
        }

        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Order not found");
        }

        Optional<DeliveryAgent> agentOpt = deliveryAgentRepository.findById(agentId);
        if (agentOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Delivery agent not found");
        }

        Order order = orderOpt.get();
        if (!order.getStatus().equals("approved")) {
            return ResponseEntity.badRequest().body("Only approved orders can be assigned");
        }

        DeliveryAgent agent = agentOpt.get();
        if (!agent.getIsActive() || !agent.getIsAvailable()) {
            return ResponseEntity.badRequest().body("Delivery agent is not available");
        }

        order.setDeliveryAgent(agent);
        order.setStatus("assigned");
        order.setAssignedAt(LocalDateTime.now());
        orderRepository.save(order);

        return ResponseEntity.ok(order);
    }

    // Get orders by status (Admin only)
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getOrdersByStatus(@PathVariable String status) {
        List<Order> orders = orderRepository.findByStatus(status);
        return ResponseEntity.ok(orders);
    }

    // Update order status (Admin only)
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        if (newStatus == null || newStatus.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Status is required");
        }

        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Order not found");
        }

        Order order = orderOpt.get();
        order.setStatus(newStatus);
        orderRepository.save(order);

        return ResponseEntity.ok(order);
    }
}
