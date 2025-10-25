package com.ccmart.backend.service;

import com.ccmart.backend.model.User;
import com.ccmart.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

@Service
public class DataInitializationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializationService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    public CommandLineRunner initializeData() {
        return args -> {
            // Create admin user if not exists
            if (userRepository.findByEmail("admin@ccmart.com").isEmpty()) {
                User adminUser = new User();
                adminUser.setName("Admin");
                adminUser.setEmail("admin@ccmart.com");
                adminUser.setPassword(passwordEncoder.encode("Admin@123"));
                adminUser.setRole("admin");
                adminUser.setIsActive(true);
                userRepository.save(adminUser);
                System.out.println("Admin user created successfully");
            }
        };
    }
}