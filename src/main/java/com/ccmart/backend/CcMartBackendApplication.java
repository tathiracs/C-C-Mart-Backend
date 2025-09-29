package com.ccmart.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.ccmart.backend")
public class CcMartBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(CcMartBackendApplication.class, args);
    }

}