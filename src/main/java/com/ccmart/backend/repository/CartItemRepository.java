package com.ccmart.backend.repository;

import com.ccmart.backend.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
  List<CartItem> findBySessionId(String sessionId);

  @Query("SELECT c FROM CartItem c WHERE c.sessionId = :sessionId AND c.product.productId = :productId")
  Optional<CartItem> findBySessionIdAndProductId(@Param("sessionId") String sessionId,
      @Param("productId") Long productId);

  void deleteBySessionId(String sessionId);
}