package com.ccmart.backend.repository;

import com.ccmart.backend.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    boolean existsByProductId(Long productId);
    long countByProductId(Long productId);
    List<OrderItem> findByOrderId(Long orderId);
}
