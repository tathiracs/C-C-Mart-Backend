package com.ccmart.backend.config;

import com.ccmart.backend.model.User;
import com.ccmart.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        try {
            // Force create/update admin user
            User admin = userRepository.findByEmail("admin@ccmart.com").orElse(new User());
            admin.setName("Admin User");
            admin.setEmail("admin@ccmart.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRole("admin");
            admin.setIsActive(true);
            User savedAdmin = userRepository.save(admin);
            System.out.println("Admin user created/updated successfully with ID: " + savedAdmin.getId());
        } catch (Exception e) {
            System.err.println("Error creating admin user: " + e.getMessage());
            e.printStackTrace();
            // Rethrow to ensure application fails to start if admin cannot be created
            throw e;
        }
    }
}