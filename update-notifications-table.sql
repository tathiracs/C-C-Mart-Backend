-- Update notifications table to add order_id and notification_type columns
USE ccmart_db;

ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS order_id BIGINT AFTER status,
ADD COLUMN IF NOT EXISTS notification_type VARCHAR(50) AFTER order_id;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_notification_type ON notifications(notification_type);
CREATE INDEX IF NOT EXISTS idx_order_id ON notifications(order_id);

-- Verify the changes
DESCRIBE notifications;
