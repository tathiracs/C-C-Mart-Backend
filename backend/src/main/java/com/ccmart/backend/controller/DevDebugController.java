package com.ccmart.backend.controller;

import com.ccmart.backend.model.User;
import com.ccmart.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/debug")
public class DevDebugController {

    private final UserRepository userRepository;

    public DevDebugController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public Object listUsers() {
        String enabled = System.getenv("ENABLE_DEBUG");
        if (enabled == null || !enabled.equalsIgnoreCase("true")) {
            return "Debug endpoint disabled. Set ENABLE_DEBUG=true to enable.";
        }

        List<User> users = userRepository.findAll();
        // hide passwords
        users.forEach(u -> u.setPassword(null));
        return users;
    }
}
