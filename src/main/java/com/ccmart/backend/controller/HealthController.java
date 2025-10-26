package com.ccmart.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/health")  // the endpoint URL
    public String healthCheck() {
        return "OK";  // simple response
    }
}
