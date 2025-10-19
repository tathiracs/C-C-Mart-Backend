# Order Placement Testing Guide

## 🎯 How to Place an Order and View It

### Prerequisites
✅ Backend running on port 8081
✅ Frontend running on port 3000
✅ User account created and logged in
✅ Products added to cart

---

## 📝 Step-by-Step Order Placement Process

### Step 1: Add Products to Cart
1. Navigate to **Products** page (`/products`)
2. Browse available products
3. Click **Add to Cart** button on desired products
4. You should see the cart badge number increase in the header

### Step 2: Go to Cart
1. Click the **Shopping Cart** icon in the header
2. Verify your items are displayed
3. Adjust quantities if needed
4. Click **Proceed to Checkout** button

### Step 3: Fill Out Checkout Form
1. **Contact Information** (Auto-filled from profile):
   - Full Name ✓ (Read-only, from profile)
   - Email ✓ (Read-only, from profile)
   - Phone ✓ (Read-only, from profile)

2. **Delivery Address** (Required fields):
   - Address ✓ (e.g., "123 Main Street")
   - City ✓ (e.g., "Kurunegala")
   - Postal Code ✓ (e.g., "60000")

3. **Payment Method**:
   - Cash on Delivery ✓ (Only option available)

4. **Additional Notes** (Optional):
   - Any special delivery instructions

### Step 4: Review Order Summary
On the right side panel, review:
- **Order Items** with quantities and prices
- **Subtotal**: Total of all items
- **Delivery Fee**: Rs. 200.00 (Free for orders over Rs. 5,000)
- **Total Amount**: Final amount to pay

### Step 5: Place Order
1. Click the green **Place Order** button
2. Wait for the order to be processed
3. You should see a success message: "🎉 Order placed successfully! Thank you for shopping with us."
4. You will be automatically redirected to **My Orders** page

---

## 👀 Where to View Your Orders

### For Customers:

#### Option 1: My Orders Page
1. Click on **Profile** icon in header (top-right)
2. Select **My Orders** from dropdown menu
3. OR directly navigate to: `http://localhost:3000/orders`

#### Option 2: Profile Dropdown
1. Click on your profile icon/avatar
2. From the dropdown menu, select **My Orders**

### What You'll See:
- **Order List Table** with columns:
  - Order ID
  - Date & Time
  - Total Amount (Rs.)
  - Status (with color-coded chips)
  - Actions (View Details, Cancel buttons)

- **Order Status Colors**:
  - 🟡 **Pending** - Order placed, awaiting admin approval
  - 🔵 **Processing** - Order approved and being prepared
  - 🟢 **Delivered** - Order successfully delivered
  - 🔴 **Cancelled** - Order has been cancelled

---

## 👨‍💼 For Admins: View All Orders

### Admin Order Management
1. Login with admin credentials
   - Email: `admin@ccmart.lk`
   - Password: `admin123`

2. Navigate to **Admin Dashboard**
3. Click **Order Management** in sidebar

### What Admins Can See:
- **All Orders** from all customers
- **Filter by Status**: Pending, Processing, Delivered, Cancelled
- **Order Statistics**:
  - Total Orders
  - Pending Orders
  - Processing Orders
  - Delivered Orders

### Admin Actions:
- ✅ **Approve** pending orders
- 🚚 **Assign Delivery Agent** to approved orders
- 📊 **View Order Details** (customer info, items, delivery address)
- ❌ **Cancel** orders if needed

---

## 🔍 Debugging: What to Check

### Open Browser Console (F12)

#### When Placing Order (Checkout Page):
Look for these console messages:
```
📦 Submitting order: {orderData}
🛒 Cart items: [items array]
✅ Order created successfully: {response}
```

**If you see errors:**
```
❌ Error creating order: {error}
❌ Error response: {response}
❌ Error data: {data}
```

#### When Viewing Orders (My Orders Page):
Look for these console messages:
```
📋 Fetching orders...
📋 Orders API response: {response}
📋 Orders data: [orders array]
📋 Number of orders: X
```

**If you see errors:**
```
❌ Error fetching orders: {error}
❌ Error response: {response}
```

---

## 🛠️ Common Issues and Solutions

### Issue 1: "Failed to place order"
**Possible Causes:**
- Backend not running
- Authentication token expired
- Invalid order data

**Solution:**
1. Check backend is running: `http://localhost:8081/api/orders`
2. Re-login to refresh authentication token
3. Check browser console for detailed error messages

### Issue 2: Orders not showing on "My Orders" page
**Possible Causes:**
- Order not actually created (check console logs)
- API endpoint returning wrong data
- User ID mismatch

**Solution:**
1. Open browser console
2. Look for "📋 Fetching orders..." messages
3. Check the "Orders data" in console
4. Verify user is logged in correctly

### Issue 3: Empty cart after refresh
**Expected Behavior:**
- Cart is stored in localStorage per user
- Cart should persist across page refreshes
- Cart is cleared only after successful order placement

**If cart is empty unexpectedly:**
1. Check localStorage in browser DevTools
2. Look for key: `cart_user_{userId}`
3. Verify you're still logged in

### Issue 4: "Unauthorized" error
**Solution:**
1. Logout and login again
2. Token might have expired
3. Check if `token` exists in localStorage

---

## 📊 Order Data Flow

### Frontend Flow:
```
1. User adds products to cart
   ↓
2. User proceeds to checkout
   ↓
3. User fills delivery information
   ↓
4. Click "Place Order"
   ↓
5. POST /api/orders with order data
   ↓
6. Backend creates order
   ↓
7. Success response received
   ↓
8. Cart cleared
   ↓
9. Navigate to /orders
   ↓
10. GET /api/orders to fetch user's orders
   ↓
11. Display orders in table
```

### Backend Flow:
```
1. Receive POST /api/orders request
   ↓
2. Extract user ID from JWT token
   ↓
3. Validate user exists
   ↓
4. Create order with status "pending"
   ↓
5. Process order items
   ↓
6. Calculate total amount
   ↓
7. Save order to database
   ↓
8. Return order object to frontend
```

### Database Structure:
```sql
orders table:
- id (Primary Key)
- user_id (Foreign Key → users.id)
- delivery_address
- delivery_phone
- payment_method
- delivery_notes
- status (pending/processing/delivered/cancelled)
- total_amount
- created_at
- approved_at
- assigned_at
- delivered_at

order_items table:
- id (Primary Key)
- order_id (Foreign Key → orders.id)
- product_id (Foreign Key → products.id)
- quantity
- price
```

---

## 🧪 Testing Checklist

### Before Testing:
- [ ] Backend server is running (check terminal: java)
- [ ] Frontend server is running (check terminal: node)
- [ ] User account exists and you're logged in
- [ ] Browser console is open (F12)

### During Order Placement:
- [ ] Products successfully added to cart
- [ ] Cart badge shows correct count
- [ ] Cart page displays items correctly
- [ ] Checkout form is pre-filled with user data
- [ ] All required fields are filled
- [ ] Order summary shows correct totals
- [ ] "Place Order" button is clickable
- [ ] Success message appears after submission
- [ ] Cart is cleared after successful order
- [ ] Redirect to /orders page happens

### Viewing Orders:
- [ ] My Orders page loads without errors
- [ ] Orders table displays
- [ ] Recently placed order appears in the list
- [ ] Order shows correct status (Pending)
- [ ] Total amount is correct
- [ ] Date/time is recent
- [ ] View Details button works
- [ ] Cancel button is available (for pending orders)

### Admin Testing:
- [ ] Login as admin
- [ ] Navigate to Order Management
- [ ] All orders from all users are visible
- [ ] Filter by status works
- [ ] Statistics are accurate
- [ ] Order details can be viewed
- [ ] Orders can be approved
- [ ] Delivery agents can be assigned

---

## 📞 API Endpoints Reference

### Customer Endpoints:

**Get My Orders**
```http
GET /api/orders
Headers: Authorization: Bearer {token}
Response: Array of user's orders
```

**Create Order**
```http
POST /api/orders
Headers: 
  Authorization: Bearer {token}
  Content-Type: application/json
Body:
{
  "deliveryAddress": "123 Main St, Kurunegala, 60000",
  "deliveryPhone": "0771234567",
  "paymentMethod": "cash",
  "deliveryNotes": "Call when arrived",
  "items": [
    {
      "product": { "id": 1 },
      "quantity": 2,
      "price": 250.00
    }
  ]
}
Response: Created order object with ID
```

**Cancel Order**
```http
PUT /api/orders/{orderId}/cancel
Headers: Authorization: Bearer {token}
Response: "Order cancelled successfully"
```

### Admin Endpoints:

**Get All Orders**
```http
GET /api/orders
Headers: Authorization: Bearer {adminToken}
Response: Array of all orders
```

**Approve Order**
```http
PUT /api/orders/{orderId}/approve
Headers: Authorization: Bearer {adminToken}
Response: Updated order object
```

**Assign Delivery Agent**
```http
PUT /api/orders/{orderId}/assign
Headers: Authorization: Bearer {adminToken}
Body: { "agentId": 1 }
Response: Updated order object
```

---

## ✅ Expected Results

### After Successful Order Placement:
1. ✓ Success toast notification appears
2. ✓ Cart is emptied
3. ✓ Redirected to My Orders page
4. ✓ New order appears at top of list
5. ✓ Order status is "Pending"
6. ✓ Order ID is generated
7. ✓ Current date/time is shown
8. ✓ Total amount matches checkout total

### In Database:
1. ✓ New record in `orders` table
2. ✓ Records in `order_items` table for each product
3. ✓ `user_id` matches logged-in user
4. ✓ `status` is set to "pending"
5. ✓ `created_at` timestamp is set
6. ✓ `total_amount` is calculated correctly

---

## 🎓 Next Steps After Order is Placed

### Customer Perspective:
1. Wait for admin to approve the order
2. Order status will change from "Pending" to "Processing"
3. Delivery agent will be assigned
4. Order will be delivered
5. Status changes to "Delivered"

### Admin Workflow:
1. See new order in "Pending Orders"
2. Review order details
3. Click "Approve" button
4. Select available delivery agent
5. Click "Assign Agent"
6. Monitor delivery progress
7. Order marked as "Delivered" when complete

---

## 💡 Tips for Successful Testing

1. **Always check browser console** - Errors and logs provide valuable debugging info
2. **Test with different users** - Ensure orders are isolated per user
3. **Test as both customer and admin** - Verify both views work correctly
4. **Try different order amounts** - Test delivery fee calculation (over/under Rs. 5,000)
5. **Test order cancellation** - Cancel a pending order and verify it updates
6. **Check database directly** - Use MySQL Workbench to verify data is saved

---

## 🔐 Security Notes

- ✓ Orders are protected by JWT authentication
- ✓ Users can only see their own orders
- ✓ Admins can see all orders
- ✓ Order IDs are server-generated (not user-controlled)
- ✓ User ID is extracted from JWT token (not from request body)
- ✓ Authorization header is required for all endpoints

---

## 📝 Summary

**To place an order successfully:**
1. ✅ Add products to cart
2. ✅ Go to cart and click "Proceed to Checkout"
3. ✅ Fill in delivery address details
4. ✅ Review order summary
5. ✅ Click "Place Order"
6. ✅ Wait for success message
7. ✅ View order in "My Orders" page

**To view your orders:**
- Navigate to: Profile → My Orders
- Or direct URL: `http://localhost:3000/orders`

**For admins:**
- Admin Dashboard → Order Management
- View all orders, approve, and assign delivery agents

---

## 🆘 Still Having Issues?

If orders are still not showing:

1. **Check the console logs** in browser DevTools (F12)
2. **Verify backend is responding**:
   ```
   curl -H "Authorization: Bearer {yourToken}" http://localhost:8081/api/orders
   ```
3. **Check database directly**:
   ```sql
   SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;
   ```
4. **Clear browser cache** and try again (Ctrl+F5)
5. **Logout and login** to refresh authentication token
6. **Restart both servers** if nothing else works

---

**Last Updated:** October 19, 2025
**Version:** 1.0
