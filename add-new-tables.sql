-- ============================================================
-- Add New Tables to C&C Mart Database
-- ============================================================
-- This script adds notifications, roles, and deliveries tables
-- Compatible with existing schema structure
-- ============================================================

USE ccmart_db;

-- ============================================================
-- Table: notifications
-- ============================================================
-- Note: Modified to use 'id' instead of 'notification_id' to match your schema convention
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    status ENUM('UNREAD', 'READ') DEFAULT 'UNREAD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: roles
-- ============================================================
-- Note: Modified to use 'id' instead of 'role_id' to match your schema convention
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_name ENUM('ADMIN', 'CUSTOMER', 'DELIVERY_AGENT') NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_role_name (role_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: deliveries
-- ============================================================
-- Note: Modified to use 'id' instead of 'delivery_id' to match your schema convention
-- Note: Using delivery_agent_id to reference delivery_agents table (already exists in your schema)
CREATE TABLE IF NOT EXISTS deliveries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    delivery_agent_id BIGINT,
    status ENUM('PENDING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING',
    delivery_date TIMESTAMP NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (delivery_agent_id) REFERENCES delivery_agents(id) ON DELETE SET NULL,
    INDEX idx_order (order_id),
    INDEX idx_agent (delivery_agent_id),
    INDEX idx_status (status),
    INDEX idx_delivery_date (delivery_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Insert Default Roles
-- ============================================================
INSERT INTO roles (role_name, description) VALUES
    ('ADMIN', 'Administrator with full system access'),
    ('CUSTOMER', 'Regular customer with shopping privileges'),
    ('DELIVERY_AGENT', 'Delivery personnel for order fulfillment')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- ============================================================
-- Verification Queries
-- ============================================================
-- Uncomment these to verify the tables were created successfully
-- SHOW TABLES LIKE 'notifications';
-- SHOW TABLES LIKE 'roles';
-- SHOW TABLES LIKE 'deliveries';
-- SELECT * FROM roles;
