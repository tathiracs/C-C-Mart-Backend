package com.ccmart.backend.repository;

import com.ccmart.backend.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    boolean existsByProductId(Long productId);
    long countByProductId(Long productId);
}
