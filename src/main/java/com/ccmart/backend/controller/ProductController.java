package com.ccmart.backend.controller;

import com.ccmart.backend.model.Product;
import com.ccmart.backend.model.Category;
import com.ccmart.backend.service.ProductService;
import com.ccmart.backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import jakarta.validation.Valid;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryService categoryService;

    // Display all available products
    @GetMapping
    public String getAllProducts(Model model) {
        List<Product> products = productService.getAvailableProducts();
        List<Category> categories = categoryService.getAllCategories();
        model.addAttribute("products", products);
        model.addAttribute("categories", categories);
        return "products/list";
    }

    // Display products by category
    @GetMapping("/category/{categoryId}")
    public String getProductsByCategory(@PathVariable Long categoryId, Model model) {
        List<Product> products = productService.getProductsByCategoryId(categoryId);
        List<Category> categories = categoryService.getAllCategories();
        Optional<Category> selectedCategory = categoryService.getCategoryById(categoryId);

        model.addAttribute("products", products);
        model.addAttribute("categories", categories);
        model.addAttribute("selectedCategory", selectedCategory.orElse(null));
        return "products/list";
    }

    // Show create product form
    @GetMapping("/create")
    public String showCreateForm(Model model) {
        model.addAttribute("product", new Product());
        model.addAttribute("categories", categoryService.getAllCategories());
        return "products/create";
    }

    // Handle create product form submission
    @PostMapping("/create")
    public String createProduct(@Valid @ModelAttribute Product product,
            BindingResult result,
            @RequestParam("imageFile") MultipartFile imageFile,
            Model model,
            RedirectAttributes redirectAttributes) {

        if (result.hasErrors()) {
            model.addAttribute("categories", categoryService.getAllCategories());
            return "products/create";
        }

        try {
            productService.saveProduct(product, imageFile);
            redirectAttributes.addFlashAttribute("successMessage", "Product created successfully!");
            return "redirect:/products";
        } catch (IOException e) {
            model.addAttribute("errorMessage", "Error uploading image: " + e.getMessage());
            model.addAttribute("categories", categoryService.getAllCategories());
            return "products/create";
        }
    }

    // Show edit product form
    @GetMapping("/edit/{id}")
    public String showEditForm(@PathVariable Long id, Model model, RedirectAttributes redirectAttributes) {
        Optional<Product> product = productService.getProductById(id);

        if (product.isEmpty()) {
            redirectAttributes.addFlashAttribute("errorMessage", "Product not found!");
            return "redirect:/products";
        }

        model.addAttribute("product", product.get());
        model.addAttribute("categories", categoryService.getAllCategories());
        return "products/edit";
    }

    // Handle edit product form submission
    @PostMapping("/edit/{id}")
    public String updateProduct(@PathVariable Long id,
            @Valid @ModelAttribute Product product,
            BindingResult result,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile,
            Model model,
            RedirectAttributes redirectAttributes) {

        if (result.hasErrors()) {
            model.addAttribute("categories", categoryService.getAllCategories());
            return "products/edit";
        }

        Optional<Product> existingProduct = productService.getProductById(id);
        if (existingProduct.isEmpty()) {
            redirectAttributes.addFlashAttribute("errorMessage", "Product not found!");
            return "redirect:/products";
        }

        // Set the ID to ensure we're updating the existing product
        product.setProductId(id);

        // Keep existing image if no new image is uploaded
        if (imageFile == null || imageFile.isEmpty()) {
            product.setImagePath(existingProduct.get().getImagePath());
        }

        try {
            if (imageFile != null && !imageFile.isEmpty()) {
                productService.saveProduct(product, imageFile);
            } else {
                productService.saveProduct(product);
            }
            redirectAttributes.addFlashAttribute("successMessage", "Product updated successfully!");
            return "redirect:/products";
        } catch (IOException e) {
            model.addAttribute("errorMessage", "Error uploading image: " + e.getMessage());
            model.addAttribute("categories", categoryService.getAllCategories());
            return "products/edit";
        }
    }

    // Delete product
    @PostMapping("/delete/{id}")
    public String deleteProduct(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        Optional<Product> product = productService.getProductById(id);

        if (product.isEmpty()) {
            redirectAttributes.addFlashAttribute("errorMessage", "Product not found!");
            return "redirect:/products";
        }

        productService.deleteProduct(id);
        redirectAttributes.addFlashAttribute("successMessage", "Product deleted successfully!");
        return "redirect:/products";
    }

    // Search products - unified search across name, brand, and description
    @GetMapping("/search")
    public String searchProducts(@RequestParam(required = false) String query, Model model) {
        List<Product> products;

        if (query == null || query.trim().isEmpty()) {
            products = productService.getAvailableProducts();
        } else {
            products = productService.searchAvailableProducts(query);
        }

        model.addAttribute("products", products);
        model.addAttribute("categories", categoryService.getAllCategories());
        model.addAttribute("searchQuery", query);
        return "products/list";
    }

    // REST API Endpoints
    @GetMapping("/api/products")
    @ResponseBody
    public List<Product> getAllProductsApi() {
        return productService.getAllProducts();
    }

    @GetMapping("/api/products/{id}")
    @ResponseBody
    public ResponseEntity<Product> getProductByIdApi(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);
        return product.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/api/products/search")
    @ResponseBody
    public List<Product> searchProductsApi(@RequestParam String query) {
        if (query == null || query.trim().isEmpty()) {
            return productService.getAvailableProducts();
        }
        return productService.searchAvailableProducts(query);
    }

}