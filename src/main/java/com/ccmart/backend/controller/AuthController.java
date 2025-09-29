package com.ccmart.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        // Simple mock authentication - In production, use proper authentication
        if (email != null && password != null && !email.isEmpty() && !password.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            Map<String, Object> user = new HashMap<>();
            user.put("id", 1);
            user.put("name", "John Doe");
            user.put("email", email);
            user.put("address", "123 Farm Road, Country Village");
            user.put("phone", "+1-555-0123");

            response.put("success", true);
            response.put("user", user);
            response.put("token", "mock-jwt-token-" + System.currentTimeMillis());

            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Invalid email or password");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody Map<String, String> signupRequest) {
        String name = signupRequest.get("name");
        String email = signupRequest.get("email");
        String password = signupRequest.get("password");

        // Simple mock registration - In production, use proper user management
        if (name != null && email != null && password != null &&
                !name.isEmpty() && !email.isEmpty() && password.length() >= 6) {

            Map<String, Object> response = new HashMap<>();
            Map<String, Object> user = new HashMap<>();
            user.put("id", System.currentTimeMillis());
            user.put("name", name);
            user.put("email", email);
            user.put("address", "");
            user.put("phone", "");

            response.put("success", true);
            response.put("user", user);
            response.put("token", "mock-jwt-token-" + System.currentTimeMillis());

            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Invalid registration data");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }
}