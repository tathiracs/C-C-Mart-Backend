package com.ccmart.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private DataSource dataSource;

    @GetMapping("/db-connection")
    public ResponseEntity<?> testConnection() {
        Map<String, String> response = new HashMap<>();
        
        try (Connection conn = dataSource.getConnection()) {
            response.put("status", "success");
            response.put("message", "Successfully connected to database: " + conn.getCatalog());
            response.put("dbVersion", conn.getMetaData().getDatabaseProductVersion());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to connect to database: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}