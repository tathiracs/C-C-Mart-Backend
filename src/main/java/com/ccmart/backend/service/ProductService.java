package com.ccmart.backend.service;

import com.ccmart.backend.model.Product;
import com.ccmart.backend.model.Category;
import com.ccmart.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    private String getUploadDir() {
        String projectDir = System.getProperty("user.dir");
        if (projectDir.endsWith("backendProduct")) {
            return "uploads/images/";
        } else {
            return "backendProduct/uploads/images/";
        }
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getAvailableProducts() {
        return productRepository.findAvailableProducts();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> getProductsByCategory(Category category) {
        return productRepository.findByCategory(category);
    }

    public List<Product> getProductsByCategoryId(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public List<Product> searchProductsByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Product> searchProductsByBrand(String brand) {
        return productRepository.findByBrandContainingIgnoreCase(brand);
    }

    public List<Product> searchProducts(String query) {
        return productRepository.findByNameOrBrandOrDescriptionContaining(query);
    }

    public List<Product> searchAvailableProducts(String query) {
        return productRepository.findAvailableProductsByNameOrBrandOrDescriptionContaining(query);
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public Product saveProduct(Product product, MultipartFile imageFile) throws IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            String imagePath = saveImage(imageFile);
            product.setImagePath(imagePath);
        }
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent() && product.get().getImagePath() != null) {
            deleteImage(product.get().getImagePath());
        }
        productRepository.deleteById(id);
    }

    private String saveImage(MultipartFile file) throws IOException {
        // Create upload directory if it doesn't exist
        String uploadDir = getUploadDir();
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath();
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);

        // Save file
        Files.copy(file.getInputStream(), filePath);

        return fileName;
    }

    private void deleteImage(String fileName) {
        try {
            String uploadDir = getUploadDir();
            Path filePath = Paths.get(uploadDir).toAbsolutePath().resolve(fileName);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Log error but don't throw exception
            System.err.println("Error deleting image: " + e.getMessage());
        }
    }
}