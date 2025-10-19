package com.ccmart.backend.repository;

import com.ccmart.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStatus(String status);
    List<Order> findByUserId(Long userId);
    
    // Native query to get ALL orders from database
    @Query(value = "SELECT * FROM orders ORDER BY id DESC", nativeQuery = true)
    List<Order> findAllOrders();
}
