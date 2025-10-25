package com.ccmart.backend.controller;

import com.ccmart.backend.model.DeliveryAgent;
import com.ccmart.backend.repository.DeliveryAgentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/delivery-agents")
public class DeliveryAgentController {

    private final DeliveryAgentRepository deliveryAgentRepository;

    public DeliveryAgentController(DeliveryAgentRepository deliveryAgentRepository) {
        this.deliveryAgentRepository = deliveryAgentRepository;
    }

    // Get all delivery agents (Admin only)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DeliveryAgent>> getAllAgents() {
        return ResponseEntity.ok(deliveryAgentRepository.findAll());
    }

    // Get active delivery agents
    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DeliveryAgent>> getActiveAgents() {
        return ResponseEntity.ok(deliveryAgentRepository.findByIsActiveTrue());
    }

    // Get available delivery agents
    @GetMapping("/available")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DeliveryAgent>> getAvailableAgents() {
        return ResponseEntity.ok(deliveryAgentRepository.findByIsAvailableTrue());
    }

    // Get delivery agent by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getAgentById(@PathVariable Long id) {
        Optional<DeliveryAgent> agent = deliveryAgentRepository.findById(id);
        if (agent.isEmpty()) {
            return ResponseEntity.status(404).body("Delivery agent not found");
        }
        return ResponseEntity.ok(agent.get());
    }

    // Create new delivery agent (Admin only)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createAgent(@RequestBody DeliveryAgent agent) {
        try {
            agent.setIsActive(true);
            agent.setIsAvailable(true);
            DeliveryAgent savedAgent = deliveryAgentRepository.save(agent);
            return ResponseEntity.status(201).body(savedAgent);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating delivery agent: " + e.getMessage());
        }
    }

    // Update delivery agent (Admin only)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateAgent(@PathVariable Long id, @RequestBody DeliveryAgent updatedAgent) {
        Optional<DeliveryAgent> existing = deliveryAgentRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.status(404).body("Delivery agent not found");
        }

        DeliveryAgent agent = existing.get();
        agent.setName(updatedAgent.getName());
        agent.setPhone(updatedAgent.getPhone());
        agent.setEmail(updatedAgent.getEmail());
        agent.setAddress(updatedAgent.getAddress());
        agent.setVehicleType(updatedAgent.getVehicleType());
        agent.setVehicleNumber(updatedAgent.getVehicleNumber());
        if (updatedAgent.getIsAvailable() != null) {
            agent.setIsAvailable(updatedAgent.getIsAvailable());
        }
        if (updatedAgent.getIsActive() != null) {
            agent.setIsActive(updatedAgent.getIsActive());
        }

        deliveryAgentRepository.save(agent);
        return ResponseEntity.ok(agent);
    }

    // Delete delivery agent (Admin only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAgent(@PathVariable Long id) {
        Optional<DeliveryAgent> existing = deliveryAgentRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.status(404).body("Delivery agent not found");
        }

        DeliveryAgent agent = existing.get();
        agent.setIsActive(false);
        deliveryAgentRepository.save(agent);
        return ResponseEntity.ok("Delivery agent deactivated successfully");
    }

    // Toggle availability (Admin only)
    @PatchMapping("/{id}/availability")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleAvailability(@PathVariable Long id) {
        Optional<DeliveryAgent> existing = deliveryAgentRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.status(404).body("Delivery agent not found");
        }

        DeliveryAgent agent = existing.get();
        agent.setIsAvailable(!agent.getIsAvailable());
        deliveryAgentRepository.save(agent);
        return ResponseEntity.ok(agent);
    }
}
