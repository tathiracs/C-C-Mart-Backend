package com.ccmart.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // Get the absolute path to the uploads directory relative to the project
        // directory
        String projectDir = System.getProperty("user.dir");
        String uploadPath;

        if (projectDir.endsWith("backendProduct")) {
            uploadPath = new File(projectDir, "uploads/images/").getAbsolutePath() + File.separator;
        } else {
            uploadPath = new File(projectDir, "backendProduct/uploads/images/").getAbsolutePath() + File.separator;
        }

        System.out.println("Serving images from: " + uploadPath);

        // Serve uploaded images
        registry.addResourceHandler("/uploads/images/**")
                .addResourceLocations("file:" + uploadPath);

        // Serve static resources
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");
    }

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/uploads/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "HEAD")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}