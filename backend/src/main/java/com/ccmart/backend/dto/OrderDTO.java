package com.ccmart.backend.dto;

import com.ccmart.backend.model.Order;
import com.ccmart.backend.model.User;
import com.ccmart.backend.model.OrderItem;
import com.ccmart.backend.model.DeliveryAgent;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDTO {
    private Long id;
    private String orderNumber;
    private BigDecimal totalAmount;
    private String status;
    private String paymentStatus;
    private String paymentMethod;
    private String deliveryAddress;
    private String deliveryPhone;
    private String deliveryNotes;
    private LocalDateTime deliveryDate;
    private String deliveryTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime approvedAt;
    private LocalDateTime assignedAt;
    private List<OrderItem> items;
    private DeliveryAgent deliveryAgent;
    
    // User info - enhanced to show deleted/inactive status
    private UserInfo user;
    
    public static class UserInfo {
        private Long id;
        private String name;
        private String email;
        private boolean isActive;
        private boolean isDeleted;
        private String displayName;
        
        public UserInfo(User user) {
            if (user != null) {
                this.id = user.getId();
                this.name = user.getName();
                this.email = user.getEmail();
                this.isActive = user.getIsActive() != null ? user.getIsActive() : true;
                this.isDeleted = false;
                
                // Create display name based on user status
                if (!this.isActive) {
                    this.displayName = user.getName() + " (Inactive Account)";
                } else {
                    this.displayName = user.getName();
                }
            } else {
                // User was deleted from database
                this.id = null;
                this.name = "Deleted User";
                this.email = "N/A";
                this.isActive = false;
                this.isDeleted = true;
                this.displayName = "[Deleted User]";
            }
        }

        // Getters
        public Long getId() { return id; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public boolean isActive() { return isActive; }
        public boolean isDeleted() { return isDeleted; }
        public String getDisplayName() { return displayName; }
    }
    
    public static OrderDTO fromOrder(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.id = order.getId();
        dto.orderNumber = order.getOrderNumber();
        dto.totalAmount = order.getTotalAmount();
        dto.status = order.getStatus();
        dto.paymentStatus = order.getPaymentStatus();
        dto.paymentMethod = order.getPaymentMethod();
        dto.deliveryAddress = order.getDeliveryAddress();
        dto.deliveryPhone = order.getDeliveryPhone();
        dto.deliveryNotes = order.getDeliveryNotes();
        dto.deliveryDate = order.getDeliveryDate();
        dto.deliveryTime = order.getDeliveryTime();
        dto.createdAt = order.getCreatedAt();
        dto.updatedAt = order.getUpdatedAt();
        dto.approvedAt = order.getApprovedAt();
        dto.assignedAt = order.getAssignedAt();
        dto.items = order.getItems();
        dto.deliveryAgent = order.getDeliveryAgent();
        dto.user = new UserInfo(order.getUser());
        return dto;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
    
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    
    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
    
    public String getDeliveryPhone() { return deliveryPhone; }
    public void setDeliveryPhone(String deliveryPhone) { this.deliveryPhone = deliveryPhone; }
    
    public String getDeliveryNotes() { return deliveryNotes; }
    public void setDeliveryNotes(String deliveryNotes) { this.deliveryNotes = deliveryNotes; }
    
    public LocalDateTime getDeliveryDate() { return deliveryDate; }
    public void setDeliveryDate(LocalDateTime deliveryDate) { this.deliveryDate = deliveryDate; }
    
    public String getDeliveryTime() { return deliveryTime; }
    public void setDeliveryTime(String deliveryTime) { this.deliveryTime = deliveryTime; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }
    
    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }
    
    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }
    
    public DeliveryAgent getDeliveryAgent() { return deliveryAgent; }
    public void setDeliveryAgent(DeliveryAgent deliveryAgent) { this.deliveryAgent = deliveryAgent; }
    
    public UserInfo getUser() { return user; }
    public void setUser(UserInfo user) { this.user = user; }
}
