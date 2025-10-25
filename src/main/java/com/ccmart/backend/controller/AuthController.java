package com.ccmart.backend.controller;

import com.ccmart.backend.dto.AuthRequest;
import com.ccmart.backend.dto.AuthResponse;
import com.ccmart.backend.model.User;
import com.ccmart.backend.security.JwtUtils;
import com.ccmart.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtUtils jwtUtils;

    public AuthController(UserService userService, JwtUtils jwtUtils) {
        this.userService = userService;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> registrationData) {
        String email = registrationData.get("email");
        String rawPassword = registrationData.get("password");
        String phone = registrationData.get("phone");

        if (email == null || email.isBlank() || rawPassword == null || rawPassword.isBlank()) {
            return ResponseEntity.badRequest().body("Email and password are required");
        }

        if (phone == null || phone.isBlank()) {
            return ResponseEntity.badRequest().body("Phone number is required");
        }

        // Basic email uniqueness check
        Optional<User> existing = userService.findByEmail(email);
        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body("User already exists with this email");
        }

        User user = new User();
        user.setEmail(email.trim());
        user.setPassword(rawPassword);
        user.setPhone(phone.trim());

        // Best-effort extraction of full name
        String suppliedName = registrationData.get("name");
        String firstName = registrationData.getOrDefault("firstName", "");
        String lastName = registrationData.getOrDefault("lastName", "");

        String fullName = null;
        if (suppliedName != null && !suppliedName.isBlank()) {
            fullName = suppliedName.trim();
        } else {
            String combined = (firstName + " " + lastName).trim();
            if (!combined.isBlank()) {
                fullName = combined;
            }
        }

        if (fullName == null || fullName.isBlank()) {
            fullName = email;
        }

        user.setName(fullName);
        user.setRole("customer");

        User created = userService.register(user);

        Map<String, Object> userDetails = Map.of(
            "id", created.getId(),
            "email", created.getEmail(),
            "name", created.getName(),
            "phone", created.getPhone() != null ? created.getPhone() : "",
            "role", created.getRole()
        );
        
        Map<String, Object> response = Map.of(
            "success", true,
            "message", "Registration successful! Please log in with your credentials.",
            "user", userDetails
        );
        
        return ResponseEntity.status(201).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req) {
        Optional<User> userOpt = userService.findByEmail(req.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        User user = userOpt.get();

        // Verify password
        org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder enc = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
        if (!enc.matches(req.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        if (!user.getIsActive()) {
            return ResponseEntity.status(401).body("Account is deactivated. Please contact support.");
        }

        // Generate JWT token
        String token = jwtUtils.generateToken(String.valueOf(user.getId()));
        
        // Create response with user details
        Map<String, Object> userDetails = Map.of(
            "id", user.getId(),
            "email", user.getEmail(),
            "name", user.getName(),
            "phone", user.getPhone() != null ? user.getPhone() : "",
            "address", user.getAddress() != null ? user.getAddress() : "",
            "role", user.getRole()
        );
        
        Map<String, Object> response = Map.of(
            "token", token,
            "user", userDetails
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).body("Unauthorized");
        Long userId = Long.valueOf(authentication.getName());
        Optional<User> user = userService.findById(userId);
        if (user.isEmpty()) return ResponseEntity.status(404).body("User not found");
        User u = user.get();
        u.setPassword(null);
        return ResponseEntity.ok(u);
    }

}
