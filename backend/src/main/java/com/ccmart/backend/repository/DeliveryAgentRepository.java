package com.ccmart.backend.repository;

import com.ccmart.backend.model.DeliveryAgent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DeliveryAgentRepository extends JpaRepository<DeliveryAgent, Long> {
    List<DeliveryAgent> findByIsActiveTrue();
    List<DeliveryAgent> findByIsAvailableTrue();
}
