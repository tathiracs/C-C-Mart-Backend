package com.ccmart.backend.dto;

import com.ccmart.backend.model.Product;
import java.math.BigDecimal;

public class ProductDTO {
  private Long id;
  private String name;
  private String description;
  private BigDecimal price;
  private Integer quantity;
  private String category;
  private String image;

  // Default constructor
  public ProductDTO() {
  }

  // Constructor from Product entity
  public ProductDTO(Product product) {
    this.id = product.getProductId();
    this.name = product.getName();
    this.description = product.getDescription();
    this.price = product.getPrice();
    this.quantity = product.getQuantity();
    this.category = product.getCategory() != null ? product.getCategory().getName() : null;
    this.image = product.getImagePath() != null ? "/uploads/images/" + product.getImagePath() : null;
  }

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public BigDecimal getPrice() {
    return price;
  }

  public void setPrice(BigDecimal price) {
    this.price = price;
  }

  public Integer getQuantity() {
    return quantity;
  }

  public void setQuantity(Integer quantity) {
    this.quantity = quantity;
  }

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  public String getImage() {
    return image;
  }

  public void setImage(String image) {
    this.image = image;
  }
}