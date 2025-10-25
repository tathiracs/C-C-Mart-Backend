-- Create a test notification manually
USE ccmart_db;

-- First, check if you have any users
SELECT id, name, email FROM users WHERE role = 'CUSTOMER' LIMIT 5;

-- Then create a test notification for the first customer (adjust user_id as needed)
-- Replace 'X' with your actual customer user ID
INSERT INTO notifications (user_id, message, status, order_id, notification_type, created_at, updated_at)
VALUES (
    2, -- Change this to your customer user_id
    '🎉 Great news! Your order #1 has been approved and is being prepared.',
    'UNREAD',
    1, -- Change this to a real order_id if you have one
    'ORDER_APPROVED',
    NOW(),
    NOW()
);

-- Verify the notification was created
SELECT * FROM notifications ORDER BY created_at DESC LIMIT 5;
