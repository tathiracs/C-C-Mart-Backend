package com.ccmart.backend.dto;

import com.ccmart.backend.model.OrderItem;
import com.ccmart.backend.model.Product;
import java.math.BigDecimal;

public class OrderItemDTO {
    private Long id;
    private Integer quantity;
    private BigDecimal price;
    private ProductInfo product;
    
    public static class ProductInfo {
        private Long id;
        private String name;
        private BigDecimal price;
        private String unit;
        
        public ProductInfo(Product product) {
            if (product != null) {
                this.id = product.getId();
                this.name = product.getName();
                this.price = product.getPrice();
                this.unit = product.getUnit();
            }
        }
        
        // Getters
        public Long getId() { return id; }
        public String getName() { return name; }
        public BigDecimal getPrice() { return price; }
        public String getUnit() { return unit; }
    }
    
    public static OrderItemDTO fromOrderItem(OrderItem item) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.id = item.getId();
        dto.quantity = item.getQuantity();
        dto.price = item.getPrice();
        dto.product = new ProductInfo(item.getProduct());
        return dto;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public ProductInfo getProduct() { return product; }
    public void setProduct(ProductInfo product) { this.product = product; }
}
