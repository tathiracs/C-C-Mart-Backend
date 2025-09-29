package com.ccmart.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "cart_items")
public class CartItem {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "product_id", referencedColumnName = "product_id")
  private Product product;

  private Integer quantity;
  private String sessionId; // For guest users

  // Constructors
  public CartItem() {
  }

  public CartItem(Product product, Integer quantity, String sessionId) {
    this.product = product;
    this.quantity = quantity;
    this.sessionId = sessionId;
  }

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Product getProduct() {
    return product;
  }

  public void setProduct(Product product) {
    this.product = product;
  }

  public Integer getQuantity() {
    return quantity;
  }

  public void setQuantity(Integer quantity) {
    this.quantity = quantity;
  }

  public String getSessionId() {
    return sessionId;
  }

  public void setSessionId(String sessionId) {
    this.sessionId = sessionId;
  }

  // Calculated field
  public BigDecimal getSubtotal() {
    if (product != null && product.getPrice() != null) {
      return product.getPrice().multiply(BigDecimal.valueOf(quantity));
    }
    return BigDecimal.ZERO;
  }
}