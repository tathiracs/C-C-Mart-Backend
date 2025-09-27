# C&C Mart Backend Product Management System

A comprehensive backend system for C&C Mart grocery shop built with Java Spring Boot, featuring a clean HTML interface and MySQL database integration.

## Features

- **Product Management**: Full CRUD operations for products
- **Category Management**: Organize products by categories (Foods, Stationery, Household items, etc.)
- **Image Upload**: Support for product images with file storage
- **Auto-increment Product IDs**: Products get unique IDs starting from 10000+ (5+ digits)
- **Search Functionality**: Search products by name or brand
- **Category Filtering**: Filter products by category
- **Responsive Design**: Modern Bootstrap-based UI
- **Data Validation**: Comprehensive form validation

## Product Fields

Each product contains:
- **Product ID**: Auto-increment unique identifier (5+ digits)
- **Name**: Product name (required)
- **Brand**: Product brand (required)
- **Weight/Size**: Optional weight or size specification
- **Quantity**: Available quantity (required)
- **Price**: Product price (optional)
- **Description**: Product description (optional)
- **Image**: Product image upload (optional)
- **Category**: Product category (required)

## Categories

Pre-configured categories include:
- Foods
- Beverages
- Dairy & Milk
- Fruits & Vegetables
- Meat & Seafood
- Bakery
- Snacks & Confectionery
- Household Cleaning
- Personal Care
- Baby Care
- Pet Care
- Stationery
- Electronics
- Health & Wellness
- Frozen Foods
- Canned & Packaged
- Spices & Condiments
- Breakfast & Cereals
- Tea & Coffee
- Kitchen & Dining

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- MySQL Workbench (optional, for database management)

## Setup Instructions

### 1. Database Setup

Create a MySQL database named `ccmart2`:

```sql
CREATE DATABASE ccmart2;
```

### 2. Database Configuration

Update the database credentials in `src/main/resources/application.properties`:

```properties
spring.datasource.username=root
spring.datasource.password=your_password_here
```

### 3. Build and Run

```bash
# Navigate to project directory
cd backendProduct

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will be available at: `http://localhost:8080`

### 4. Initial Data

When the application starts, it will automatically:
- Create the `ccmart2` database if it doesn't exist
- Create all necessary tables
- Populate initial categories

## Usage

### Available Pages

1. **Product List** (`/products`): View all available products
2. **Create Product** (`/products/create`): Add new products
3. **Edit Product** (`/products/edit/{id}`): Edit existing products
4. **Category Filter** (`/products/category/{categoryId}`): Filter by category
5. **Search** (`/products/search`): Search products by name or brand

### Creating Products

1. Navigate to "Add Product" page
2. Fill in required fields:
   - Product Name (required)
   - Brand (required)
   - Category (required)
   - Quantity (required)
3. Optional fields:
   - Weight/Size
   - Price
   - Description
   - Product Image
4. Click "Create Product"

### Editing Products

1. Click "Edit" button on any product card
2. Modify the desired fields
3. Upload a new image (optional)
4. Click "Update Product"
5. Use "Delete Product" button for removal

### Image Management

- Supported formats: JPG, PNG, GIF
- Maximum file size: 10MB
- Images are stored in `uploads/images/` directory
- Image previews available during upload

## API Endpoints

- `GET /` - Redirect to products list
- `GET /products` - List all available products
- `GET /products/category/{categoryId}` - List products by category
- `GET /products/create` - Show create product form
- `POST /products/create` - Create new product
- `GET /products/edit/{id}` - Show edit product form
- `POST /products/edit/{id}` - Update product
- `POST /products/delete/{id}` - Delete product
- `GET /products/search` - Search products

## Technology Stack

- **Backend**: Spring Boot 3.1.0
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA / Hibernate
- **Template Engine**: Thymeleaf
- **Frontend**: HTML5, Bootstrap 5.1.3, Font Awesome 6.0
- **Build Tool**: Maven
- **Java Version**: 17

## Project Structure

```
src/
├── main/
│   ├── java/com/ccmart/backend/
│   │   ├── config/
│   │   │   ├── DataInitializer.java
│   │   │   └── WebConfig.java
│   │   ├── controller/
│   │   │   ├── HomeController.java
│   │   │   └── ProductController.java
│   │   ├── model/
│   │   │   ├── Category.java
│   │   │   └── Product.java
│   │   ├── repository/
│   │   │   ├── CategoryRepository.java
│   │   │   └── ProductRepository.java
│   │   ├── service/
│   │   │   ├── CategoryService.java
│   │   │   └── ProductService.java
│   │   └── CcMartBackendApplication.java
│   └── resources/
│       ├── templates/
│       │   ├── products/
│       │   │   ├── create.html
│       │   │   ├── edit.html
│       │   │   └── list.html
│       │   └── layout.html
│       └── application.properties
└── uploads/images/ (created at runtime)
```

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check database credentials in `application.properties`
- Ensure `ccmart2` database exists

### File Upload Issues
- Check `uploads/images/` directory exists and is writable
- Verify file size is under 10MB
- Ensure supported image format (JPG, PNG, GIF)

### Port Conflicts
- Default port is 8080
- Change in `application.properties`: `server.port=8081`

## Future Enhancements

- User authentication and authorization
- Product categories management interface
- Inventory tracking and low-stock alerts
- Sales and reporting features
- RESTful API for mobile applications
- Product barcode scanning
- Multi-language support

## Support

For issues and support, please check the application logs and ensure all prerequisites are properly installed and configured.