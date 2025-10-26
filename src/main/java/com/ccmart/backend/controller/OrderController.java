package com.ccmart.backend.controller;

import com.ccmart.backend.model.Order;
import com.ccmart.backend.model.OrderItem;
import com.ccmart.backend.model.Product;
import com.ccmart.backend.model.User;
import com.ccmart.backend.model.DeliveryAgent;
import com.ccmart.backend.model.Notification;
import com.ccmart.backend.dto.OrderDTO;
import com.ccmart.backend.repository.OrderRepository;
import com.ccmart.backend.repository.ProductRepository;
import com.ccmart.backend.repository.UserRepository;
import com.ccmart.backend.repository.DeliveryAgentRepository;
import com.ccmart.backend.repository.OrderItemRepository;
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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final DeliveryAgentRepository deliveryAgentRepository;
    private final OrderItemRepository orderItemRepository;
    private final com.ccmart.backend.service.OrderService orderService;
    private final com.ccmart.backend.service.NotificationService notificationService;
    
    @PersistenceContext
    private EntityManager entityManager;

    public OrderController(OrderRepository orderRepository, UserRepository userRepository, 
                          ProductRepository productRepository, DeliveryAgentRepository deliveryAgentRepository,
                          OrderItemRepository orderItemRepository,
                          com.ccmart.backend.service.OrderService orderService,
                          com.ccmart.backend.service.NotificationService notificationService) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.deliveryAgentRepository = deliveryAgentRepository;
        this.orderItemRepository = orderItemRepository;
        this.orderService = orderService;
        this.notificationService = notificationService;
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
            
            // Convert to DTOs to handle deleted/inactive users gracefully
            List<OrderDTO> orderDTOs = allOrders.stream()
                .map(OrderDTO::fromOrder)
                .collect(Collectors.toList());
            
            System.out.println("====================================");
            System.out.println("GET /api/orders/all called by admin");
            System.out.println("Using EntityManager native query");
            System.out.println("Total orders retrieved: " + orderDTOs.size());
            if (orderDTOs.size() > 0) {
                System.out.println("Order IDs: ");
                for (OrderDTO order : orderDTOs) {
                    System.out.println("  - Order #" + order.getId() + 
                        " | User: " + order.getUser().getDisplayName() + 
                        " | Status: " + order.getStatus());
                }
            }
            System.out.println("====================================");
            return ResponseEntity.ok(orderDTOs);
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
        
        Order order = o.get();
        System.out.println("====================================");
        System.out.println("GET /api/orders/" + id);
        System.out.println("Order ID: " + order.getId());
        System.out.println("Order Number: " + order.getOrderNumber());
        System.out.println("Total Amount: " + order.getTotalAmount());
        System.out.println("Items count: " + (order.getItems() != null ? order.getItems().size() : "NULL"));
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                System.out.println("  - Item: " + item.getProduct().getName() + 
                    " | Qty: " + item.getQuantity() + 
                    " | Price: " + item.getPrice());
            }
        }
        System.out.println("====================================");
        
        return ResponseEntity.ok(order);
    }
    
    // Get order details with items (for admin dashboard) - Enhanced version
    @GetMapping("/{id}/details")
    public ResponseEntity<?> getOrderDetails(@PathVariable Long id) {
        try {
            Optional<Order> orderOpt = orderRepository.findById(id);
            if (orderOpt.isEmpty()) {
                return ResponseEntity.status(404).body("Order not found");
            }
            
            Order order = orderOpt.get();
            
            // Explicitly fetch items using repository to ensure they're loaded
            List<OrderItem> items = orderItemRepository.findByOrderId(id);
            
            // Force initialization of items collection if using JPA relationship
            if (order.getItems() != null) {
                order.getItems().size(); // Trigger lazy loading
            }
            
            // Log for debugging
            System.out.println("====================================");
            System.out.println("GET /api/orders/" + id + "/details");
            System.out.println("Order ID: " + order.getId());
            System.out.println("Order Number: " + order.getOrderNumber());
            System.out.println("Total Amount: " + order.getTotalAmount());
            System.out.println("Items from JPA: " + (order.getItems() != null ? order.getItems().size() : "NULL"));
            System.out.println("Items from Repository: " + items.size());
            
            if (!items.isEmpty()) {
                for (OrderItem item : items) {
                    System.out.println("  - Product: " + item.getProduct().getName() + 
                        " | Qty: " + item.getQuantity() + 
                        " | Price: " + item.getPrice());
                }
            } else {
                System.out.println("  ⚠️ NO ITEMS FOUND FOR THIS ORDER!");
            }
            System.out.println("====================================");
            
            // Create enhanced response with guaranteed items
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("id", order.getId());
            response.put("orderNumber", order.getOrderNumber());
            response.put("totalAmount", order.getTotalAmount());
            response.put("status", order.getStatus());
            response.put("paymentStatus", order.getPaymentStatus());
            response.put("paymentMethod", order.getPaymentMethod());
            response.put("deliveryAddress", order.getDeliveryAddress());
            response.put("deliveryPhone", order.getDeliveryPhone());
            response.put("deliveryNotes", order.getDeliveryNotes());
            response.put("createdAt", order.getCreatedAt());
            response.put("items", items); // Use explicitly fetched items
            response.put("itemsCount", items.size());
            
            // Add user info
            if (order.getUser() != null) {
                Map<String, Object> userInfo = new java.util.HashMap<>();
                userInfo.put("id", order.getUser().getId());
                userInfo.put("name", order.getUser().getName());
                userInfo.put("email", order.getUser().getEmail());
                response.put("user", userInfo);
            }
            
            // Add delivery agent if assigned
            if (order.getDeliveryAgent() != null) {
                response.put("deliveryAgent", order.getDeliveryAgent());
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
    
    // Diagnostic endpoint to check order items directly from database
    @GetMapping("/{id}/items-debug")
    public ResponseEntity<?> debugOrderItems(@PathVariable Long id) {
        try {
            // First check if order exists
            Optional<Order> orderOpt = orderRepository.findById(id);
            if (orderOpt.isEmpty()) {
                return ResponseEntity.status(404).body("Order #" + id + " not found in database");
            }
            
            Order order = orderOpt.get();
            
            // Query order_items table directly using raw SQL
            @SuppressWarnings("unchecked")
            List<Object[]> items = entityManager.createNativeQuery(
                "SELECT oi.id, oi.product_id, p.name, oi.quantity, oi.price " +
                "FROM order_items oi " +
                "JOIN products p ON oi.product_id = p.id " +
                "WHERE oi.order_id = ?1")
                .setParameter(1, id)
                .getResultList();
            
            System.out.println("========================================");
            System.out.println("🔍 DEBUG: Order Items for Order #" + id);
            System.out.println("----------------------------------------");
            System.out.println("Order exists: YES");
            System.out.println("Order Number: " + order.getOrderNumber());
            System.out.println("Order Total: " + order.getTotalAmount());
            System.out.println("Order Status: " + order.getStatus());
            System.out.println("----------------------------------------");
            System.out.println("Items in DATABASE (raw SQL): " + items.size());
            
            List<Map<String, Object>> result = new java.util.ArrayList<>();
            
            if (items.isEmpty()) {
                System.out.println("❌ NO ITEMS FOUND IN DATABASE!");
                System.out.println("This order was created WITHOUT items!");
            } else {
                for (Object[] row : items) {
                    Map<String, Object> item = new java.util.HashMap<>();
                    item.put("itemId", row[0]);
                    item.put("productId", row[1]);
                    item.put("productName", row[2]);
                    item.put("quantity", row[3]);
                    item.put("price", row[4]);
                    result.add(item);
                    
                    System.out.println("  ✅ Item #" + row[0] + ": " + row[2] + 
                        " (Qty: " + row[3] + ", Price: " + row[4] + ")");
                }
            }
            System.out.println("========================================");
            
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("orderId", id);
            response.put("orderNumber", order.getOrderNumber());
            response.put("orderTotal", order.getTotalAmount());
            response.put("itemsCount", items.size());
            response.put("items", result);
            response.put("hasItems", !items.isEmpty());
            response.put("message", items.isEmpty() ? 
                "⚠️ Order exists but has NO items in database. Order was likely created incorrectly." : 
                "✅ Order has " + items.size() + " item(s)");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
    
    // Get order items separately (alternative approach)
    @GetMapping("/{id}/items")
    public ResponseEntity<?> getOrderItems(@PathVariable Long id) {
        try {
            // Verify order exists
            Optional<Order> orderOpt = orderRepository.findById(id);
            if (orderOpt.isEmpty()) {
                return ResponseEntity.status(404).body("Order not found");
            }
            
            // Fetch items using repository
            List<OrderItem> items = orderItemRepository.findByOrderId(id);
            
            System.out.println("====================================");
            System.out.println("GET /api/orders/" + id + "/items");
            System.out.println("Found " + items.size() + " items using OrderItemRepository");
            for (OrderItem item : items) {
                System.out.println("  - " + item.getProduct().getName() + 
                    " | Qty: " + item.getQuantity() + 
                    " | Price: " + item.getPrice());
            }
            System.out.println("====================================");
            
            return ResponseEntity.ok(Map.of(
                "orderId", id,
                "itemsCount", items.size(),
                "items", items
            ));
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
    
    // ADMIN: Manually add items to an existing order (for testing/fixing broken orders)
    @PostMapping("/{id}/add-items")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addItemsToOrder(@PathVariable Long id, @RequestBody List<Map<String, Object>> itemsData) {
        try {
            Optional<Order> orderOpt = orderRepository.findById(id);
            if (orderOpt.isEmpty()) {
                return ResponseEntity.status(404).body("Order not found");
            }
            
            Order order = orderOpt.get();
            
            System.out.println("========================================");
            System.out.println("🔧 ADDING ITEMS TO ORDER #" + id);
            System.out.println("Current items count: " + (order.getItems() != null ? order.getItems().size() : 0));
            System.out.println("Items to add: " + itemsData.size());
            
            BigDecimal newTotal = order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO;
            List<OrderItem> newItems = new java.util.ArrayList<>();
            
            for (Map<String, Object> itemData : itemsData) {
                Long productId = Long.valueOf(itemData.get("productId").toString());
                Integer quantity = Integer.valueOf(itemData.get("quantity").toString());
                
                Optional<Product> productOpt = productRepository.findById(productId);
                if (productOpt.isEmpty()) {
                    return ResponseEntity.badRequest().body("Product not found: " + productId);
                }
                
                Product product = productOpt.get();
                
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setProduct(product);
                orderItem.setQuantity(quantity);
                orderItem.setPrice(product.getPrice());
                
                newItems.add(orderItem);
                
                BigDecimal itemTotal = product.getPrice().multiply(new BigDecimal(quantity));
                newTotal = newTotal.add(itemTotal);
                
                System.out.println("  + Added: " + product.getName() + " x" + quantity + " = " + itemTotal);
            }
            
            // Add new items to order
            if (order.getItems() == null) {
                order.setItems(new java.util.ArrayList<>());
            }
            order.getItems().addAll(newItems);
            order.setTotalAmount(newTotal);
            
            // Save order (cascade will save items)
            Order savedOrder = orderRepository.save(order);
            
            System.out.println("✅ Order updated!");
            System.out.println("New total: " + savedOrder.getTotalAmount());
            System.out.println("Total items: " + savedOrder.getItems().size());
            System.out.println("========================================");
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Items added successfully",
                "orderId", id,
                "itemsAdded", newItems.size(),
                "totalItems", savedOrder.getItems().size(),
                "newTotal", savedOrder.getTotalAmount()
            ));
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
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
        String oldStatus = order.getStatus();
        order.setStatus(newStatus);
        orderRepository.save(order);

        // Create notification for the user when status changes
        if (!oldStatus.equals(newStatus)) {
            try {
                System.out.println("Creating notification for order " + order.getId() + 
                                 " - Status changed from " + oldStatus + " to " + newStatus);
                System.out.println("User ID: " + order.getUser().getId());
                Notification notification = notificationService.createOrderNotification(order, oldStatus, newStatus);
                System.out.println("Notification created successfully with ID: " + notification.getId());
            } catch (Exception e) {
                // Log error but don't fail the status update
                System.err.println("Failed to create notification: " + e.getMessage());
                e.printStackTrace();
            }
        }

        return ResponseEntity.ok(order);
    }
}
