# Order Placement & Tracking Guide

## 📋 How to Place an Order

### Step 1: Add Products to Cart
1. Navigate to **Products** page (`/products`)
2. Browse available products
3. Click **"Add to Cart"** button on desired products
   - ⚠️ You must be **logged in** to add items to cart
   - If not logged in, you'll be redirected to the login page

### Step 2: Review Cart
1. Click the **shopping cart icon** in the header (shows number of items)
2. Review your cart at `/cart`
3. Adjust quantities using **+** and **-** buttons
4. Remove items if needed using **trash icon**
5. Click **"Proceed to Checkout"** button

### Step 3: Checkout Process
1. Navigate to **Checkout** page (`/checkout`)
2. Review auto-filled contact information (from your profile):
   - Full Name
   - Email
   - Phone Number
3. Fill in **Delivery Address**:
   - Street Address (required)
   - City (required)
   - Postal Code (required)
4. **Payment Method**: Cash on Delivery (Only option available)
5. Add **Order Notes** (optional):
   - Special delivery instructions
   - Call before delivery
   - Leave at door, etc.
6. Review **Order Summary**:
   - Items and quantities
   - Subtotal
   - Delivery Fee (Rs. 200, FREE if order > Rs. 5000)
   - Total Amount
7. Click **"Place Order"** button

### Step 4: Order Confirmation
- Success message appears: "🎉 Order placed successfully!"
- Automatically redirected to **My Orders** page
- Order appears with status **"Pending"**

## 📦 Where to View Your Orders

### As a Customer

#### Method 1: My Orders Page
- **URL**: `/orders`
- **How to access**:
  1. Click on your profile icon in header
  2. Select **"My Orders"** from dropdown menu
  
OR

- Navigate directly to: `http://localhost:3000/orders`

#### Method 2: Account Settings
- **URL**: `/account`
- Click **"My Orders"** tab

#### What You'll See:
- **Order List** with columns:
  - Order ID (e.g., #123)
  - Date & Time
  - Number of Items
  - Total Amount
  - Order Status (Pending/Processing/Delivered/Cancelled)
  - Payment Method
  - Actions (View Details, Cancel if Pending)

### As an Admin

#### Order Management Dashboard
- **URL**: `/admin/orders`
- **How to access**:
  1. Login as admin
  2. Navigate to Admin Panel
  3. Click **"Order Management"** in sidebar

#### What You'll See:
- **All Orders** from all customers
- **Filter Options**:
  - By Status (All, Pending, Approved, Assigned, In Transit, Delivered, Cancelled)
  - Search by Order ID, Customer Name
- **Statistics**:
  - Total Orders
  - Pending Orders
  - Completed Orders
  - Total Revenue
- **Actions Available**:
  - Approve Order
  - Assign Delivery Agent
  - Update Status
  - View Details
  - Cancel Order

## 🔄 Order Status Flow

1. **Pending** - Order just placed, waiting for approval
2. **Approved** - Admin approved the order
3. **Assigned** - Delivery agent assigned
4. **In Transit** - Out for delivery
5. **Delivered** - Successfully delivered
6. **Cancelled** - Order cancelled (by customer or admin)

## 🧪 Testing Order Placement

### Test Case 1: Place a New Order
```
1. Login as customer
2. Add 2-3 products to cart
3. Go to cart, verify items
4. Proceed to checkout
5. Fill delivery address:
   - Address: "123 Main Street"
   - City: "Kurunegala"
   - Postal Code: "60000"
6. Add note: "Call before delivery"
7. Click "Place Order"
8. Expected: Success message, redirect to /orders
9. Verify order appears in My Orders list
```

### Test Case 2: View Order as Customer
```
1. Go to /orders
2. Expected: See list of your orders
3. Click "View Details" on an order
4. Expected: See order details page
```

### Test Case 3: View Order as Admin
```
1. Login as admin (admin@ccmart.lk / admin123)
2. Go to /admin/orders
3. Expected: See all orders from all customers
4. Verify your test order appears in the list
```

### Test Case 4: Cancel Pending Order
```
1. As customer, go to /orders
2. Find a "Pending" order
3. Click Cancel icon
4. Confirm cancellation
5. Expected: Order status changes to "Cancelled"
```

## 🔧 API Endpoints

### Customer Endpoints
- **GET** `/api/orders` - Get my orders (returns only user's orders)
- **GET** `/api/orders/my-orders` - Get my orders (alternative endpoint)
- **POST** `/api/orders` - Create new order
- **PUT** `/api/orders/{id}/cancel` - Cancel order

### Admin Endpoints
- **GET** `/api/orders` - Get all orders (when logged in as admin)
- **GET** `/api/orders/status/{status}` - Get orders by status
- **PUT** `/api/orders/{id}/approve` - Approve order
- **PUT** `/api/orders/{id}/assign` - Assign delivery agent
- **PUT** `/api/orders/{id}/status` - Update order status

## 📊 Order Data Structure

### Order Request (POST /api/orders)
```json
{
  "deliveryAddress": "123 Main Street, Kurunegala, 60000",
  "deliveryPhone": "0771234567",
  "paymentMethod": "cash",
  "deliveryNotes": "Call before delivery",
  "items": [
    {
      "product": { "id": 1 },
      "quantity": 2,
      "price": 150.00
    }
  ]
}
```

### Order Response
```json
{
  "id": 123,
  "user": {
    "id": 5,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "orderItems": [
    {
      "id": 456,
      "product": {
        "id": 1,
        "name": "Rice - 5kg",
        "price": 150.00
      },
      "quantity": 2,
      "price": 150.00
    }
  ],
  "totalAmount": 500.00,
  "status": "pending",
  "paymentMethod": "cash",
  "deliveryAddress": "123 Main Street, Kurunegala, 60000",
  "deliveryPhone": "0771234567",
  "deliveryNotes": "Call before delivery",
  "createdAt": "2025-10-19T10:30:00"
}
```

## ❗ Common Issues & Solutions

### Issue 1: "Cart is empty" at Checkout
**Solution**: Add items to cart first from Products page

### Issue 2: "Please update your profile" message
**Solution**: 
1. Go to Profile page (/profile)
2. Fill in Name, Email, and Phone Number
3. Save profile
4. Return to checkout

### Issue 3: Orders not showing in My Orders
**Possible Causes**:
1. Not logged in - Login required to view orders
2. Backend not running - Start backend server
3. Database issue - Check backend logs

**Solution**:
1. Verify you're logged in
2. Check backend is running on port 8081
3. Open browser console (F12) and check for errors
4. Check Network tab for API call to `/api/orders`

### Issue 4: "Unauthorized" error
**Solution**:
1. Logout and login again
2. Check if JWT token is valid
3. Clear browser cache and cookies
4. Check backend logs for authentication errors

## 🔍 Debugging Steps

### Check Order Was Created
1. Open browser console (F12)
2. Go to Network tab
3. Place an order
4. Look for POST request to `/api/orders`
5. Check response:
   - Status 201 = Success
   - Status 401 = Not authenticated
   - Status 400 = Validation error
   - Status 500 = Server error

### Check Order Appears in Database
Using MySQL Workbench:
```sql
-- View all orders
SELECT * FROM orders ORDER BY created_at DESC;

-- View order items
SELECT oi.*, p.name as product_name 
FROM order_items oi 
JOIN products p ON oi.product_id = p.id 
WHERE oi.order_id = 123;

-- View orders by user
SELECT * FROM orders WHERE user_id = 5;
```

### Check Backend Logs
1. Look at terminal where backend is running
2. Look for errors after placing order
3. Check for SQL errors or exceptions

## 📱 User Journey Summary

```
Customer Journey:
1. Browse Products (/products)
2. Add to Cart (login required)
3. View Cart (/cart)
4. Proceed to Checkout (/checkout)
5. Fill Delivery Details
6. Place Order
7. View in My Orders (/orders)
8. Track Status Updates

Admin Journey:
1. Login as Admin
2. View All Orders (/admin/orders)
3. Approve Pending Orders
4. Assign Delivery Agent
5. Update Status
6. Monitor Deliveries
```

## ✅ Verification Checklist

After placing an order, verify:
- [ ] Success toast message appears
- [ ] Redirected to /orders page
- [ ] Order appears in My Orders list
- [ ] Order has correct items and total
- [ ] Order status is "Pending"
- [ ] Order appears in Admin Order Management
- [ ] Cart is cleared after successful order

## 📞 Support

If orders are still not working:
1. Check backend terminal for errors
2. Check browser console for JavaScript errors
3. Verify MySQL database is running
4. Check Network tab for failed API calls
5. Review backend logs in terminal
