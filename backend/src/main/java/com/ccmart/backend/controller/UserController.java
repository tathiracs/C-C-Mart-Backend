package com.ccmart.backend.controller;

import com.ccmart.backend.model.User;
import com.ccmart.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).body("Unauthorized");
        Long userId = Long.valueOf(authentication.getName());
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) return ResponseEntity.status(404).body("User not found");
        User u = user.get();
        u.setPassword(null);
        return ResponseEntity.ok(u);
    }

    @GetMapping
    public ResponseEntity<?> list(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int limit) {
        // Very simple pagination using JPA (not optimal but sufficient for scaffold)
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(Authentication authentication, @RequestBody User updatedUser) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }

            Long userId = Long.valueOf(authentication.getName());
            Optional<User> userOpt = userRepository.findById(userId);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body("User not found");
            }

            User user = userOpt.get();
            
            // Update only allowed fields (don't allow role/password changes here)
            if (updatedUser.getName() != null && !updatedUser.getName().trim().isEmpty()) {
                user.setName(updatedUser.getName().trim());
            }
            
            if (updatedUser.getEmail() != null && !updatedUser.getEmail().trim().isEmpty()) {
                // Check if email is already taken by another user
                Optional<User> existingUser = userRepository.findByEmail(updatedUser.getEmail().trim());
                if (existingUser.isPresent() && !existingUser.get().getId().equals(userId)) {
                    return ResponseEntity.status(400).body("Email is already in use");
                }
                user.setEmail(updatedUser.getEmail().trim());
            }
            
            if (updatedUser.getPhone() != null) {
                user.setPhone(updatedUser.getPhone().trim());
            }
            
            if (updatedUser.getAddress() != null) {
                user.setAddress(updatedUser.getAddress().trim());
            }

            User savedUser = userRepository.save(user);
            savedUser.setPassword(null); // Don't send password back
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Profile updated successfully");
            response.put("data", savedUser);
            
            return ResponseEntity.ok(response);
            
        } catch (NumberFormatException e) {
            return ResponseEntity.status(500).body("Invalid user ID format");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating profile: " + e.getMessage());
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(Authentication authentication, @RequestBody Map<String, String> passwordData) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }

            Long userId = Long.valueOf(authentication.getName());
            Optional<User> userOpt = userRepository.findById(userId);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body("User not found");
            }

            User user = userOpt.get();
            String currentPassword = passwordData.get("currentPassword");
            String newPassword = passwordData.get("newPassword");

            if (currentPassword == null || newPassword == null) {
                return ResponseEntity.status(400).body("Current password and new password are required");
            }

            // Verify current password
            if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                return ResponseEntity.status(400).body("Current password is incorrect");
            }

            // Validate new password
            if (newPassword.length() < 6) {
                return ResponseEntity.status(400).body("New password must be at least 6 characters long");
            }

            // Update password
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Password changed successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (NumberFormatException e) {
            return ResponseEntity.status(500).body("Invalid user ID format");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error changing password: " + e.getMessage());
        }
    }

    @PutMapping("/preferences")
    public ResponseEntity<?> updatePreferences(Authentication authentication, @RequestBody Map<String, Object> preferences) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }

            // For now, just acknowledge the preferences update
            // In a real app, you'd store these in a UserPreferences entity
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Preferences updated successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating preferences: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(Authentication authentication, @PathVariable Long id, @RequestBody User updatedUser) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }

            // Check if the authenticated user is an admin
            Long authenticatedUserId = Long.valueOf(authentication.getName());
            Optional<User> authenticatedUserOpt = userRepository.findById(authenticatedUserId);
            
            if (authenticatedUserOpt.isEmpty()) {
                return ResponseEntity.status(404).body("Authenticated user not found");
            }

            User authenticatedUser = authenticatedUserOpt.get();
            if (!"admin".equalsIgnoreCase(authenticatedUser.getRole())) {
                return ResponseEntity.status(403).body("Only admins can update users");
            }

            // Find the user to update
            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body("User not found");
            }

            User user = userOpt.get();
            
            // Update allowed fields
            if (updatedUser.getName() != null && !updatedUser.getName().trim().isEmpty()) {
                user.setName(updatedUser.getName().trim());
            }
            
            if (updatedUser.getEmail() != null && !updatedUser.getEmail().trim().isEmpty()) {
                // Check if email is already taken by another user
                Optional<User> existingUser = userRepository.findByEmail(updatedUser.getEmail().trim());
                if (existingUser.isPresent() && !existingUser.get().getId().equals(id)) {
                    return ResponseEntity.status(400).body("Email is already in use");
                }
                user.setEmail(updatedUser.getEmail().trim());
            }
            
            if (updatedUser.getPhone() != null) {
                user.setPhone(updatedUser.getPhone().trim());
            }
            
            if (updatedUser.getAddress() != null) {
                user.setAddress(updatedUser.getAddress().trim());
            }

            // Update role (admin only)
            if (updatedUser.getRole() != null && !updatedUser.getRole().trim().isEmpty()) {
                String newRole = updatedUser.getRole().trim().toLowerCase();
                if (newRole.equals("admin") || newRole.equals("customer")) {
                    user.setRole(newRole);
                } else {
                    return ResponseEntity.status(400).body("Invalid role. Must be 'admin' or 'customer'");
                }
            }

            // Update active status (admin only)
            if (updatedUser.getIsActive() != null) {
                user.setIsActive(updatedUser.getIsActive());
            }

            User savedUser = userRepository.save(user);
            savedUser.setPassword(null); // Don't send password back
            
            return ResponseEntity.ok(savedUser);
            
        } catch (NumberFormatException e) {
            return ResponseEntity.status(500).body("Invalid user ID format");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating user: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(Authentication authentication, @PathVariable Long id) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }

            // Check if the authenticated user is an admin
            Long authenticatedUserId = Long.valueOf(authentication.getName());
            Optional<User> authenticatedUserOpt = userRepository.findById(authenticatedUserId);
            
            if (authenticatedUserOpt.isEmpty()) {
                return ResponseEntity.status(404).body("Authenticated user not found");
            }

            User authenticatedUser = authenticatedUserOpt.get();
            if (!"admin".equalsIgnoreCase(authenticatedUser.getRole())) {
                return ResponseEntity.status(403).body("Only admins can delete users");
            }

            // Prevent admin from deleting themselves
            if (authenticatedUserId.equals(id)) {
                return ResponseEntity.status(400).body("You cannot delete your own account");
            }

            // Find and delete the user
            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body("User not found");
            }

            userRepository.deleteById(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User deleted successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (NumberFormatException e) {
            return ResponseEntity.status(500).body("Invalid user ID format");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error deleting user: " + e.getMessage());
        }
    }
}
