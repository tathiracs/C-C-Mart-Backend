# 📋 ORDER API ENDPOINTS - COMPLETE LIST

## Current API Structure:

### 1. `GET /api/orders` 
**Purpose**: Get user's own orders  
**Access**: Any authenticated user  
**Returns**: Only orders belonging to the logged-in user  
**Used by**: "My Orders" page (`/orders`)

### 2. `GET /api/orders/all` ⭐ 
**Purpose**: Get ALL orders from ALL users  
**Access**: Admin only  
**Returns**: ALL orders in database  
**Used by**: Admin Order Management (`/admin/orders`)  
**Debug**: Prints total count to console

### 3. `GET /api/orders/my-orders`
**Purpose**: Get user's own orders (duplicate of #1)  
**Access**: Any authenticated user  
**Returns**: Only orders belonging to the logged-in user

### 4. `GET /api/orders/{id}`
**Purpose**: Get single order by ID  
**Access**: Any authenticated user  
**Returns**: Single order details

### 5. `POST /api/orders`
**Purpose**: Create new order  
**Access**: Any authenticated user  
**Returns**: Created order

### 6. `PUT /api/orders/{id}/cancel`
**Purpose**: Cancel order  
**Access**: Any authenticated user  
**Returns**: Success message

### 7. `PUT /api/orders/{id}/approve`
**Purpose**: Approve pending order  
**Access**: Admin only  
**Returns**: Updated order

### 8. `PUT /api/orders/{id}/assign`
**Purpose**: Assign delivery agent  
**Access**: Admin only  
**Returns**: Updated order

### 9. `GET /api/orders/status/{status}`
**Purpose**: Get orders by status  
**Access**: Admin only  
**Returns**: Orders with specific status

### 10. `PUT /api/orders/{id}/status`
**Purpose**: Update order status  
**Access**: Admin only  
**Returns**: Updated order

---

## Frontend API Calls:

### OrderManagement.js (Admin Dashboard):
```javascript
const response = await ordersAPI.getAllOrders();
```
**Calls**: `GET /api/orders/all`  
**Should return**: ALL 8 orders

### Orders.js (My Orders Page):
```javascript
const response = await ordersAPI.getOrders();
```
**Calls**: `GET /api/orders`  
**Should return**: Only user's orders (5 for admin, 3 for rahal)

---

## 🔍 DIAGNOSTIC STEPS:

### Step 1: Check Browser Console
Go to `/admin/orders` and press F12. Look for:
```
🔄 [UPDATED CODE v3.0] Admin fetching ALL orders from all users...
🔍 Making request to: /api/orders/all
📦 Response.data length: ?
```

**Question**: What number shows for `Response.data length:`?
- If **5**: Backend is only returning 5 orders
- If **8**: Frontend is receiving 8 but only showing 5
- If **error**: API call is failing

### Step 2: Check Java Terminal
After refreshing `/admin/orders`, check the `java` terminal for:
```
====================================
GET /api/orders/all called by admin
Total orders in database: ?
====================================
```

**Question**: What number shows for `Total orders in database:`?
- If **5**: Database only has 5 orders OR findAll() is filtered
- If **8**: Backend has 8 but something else is wrong

### Step 3: Check Network Tab
1. Open browser DevTools (F12)
2. Go to "Network" tab
3. Refresh `/admin/orders`
4. Click on the `all` request
5. Check "Response" tab

**Question**: How many orders in the response?

---

## 🐛 POSSIBLE ISSUES:

### Issue A: Database Only Has 5 Orders
**Cause**: The 3 orders from rahal were deleted  
**Solution**: Check database directly

### Issue B: Repository findAll() Filtered
**Cause**: JPA might be applying some filter  
**Solution**: Check Order entity for @Where annotations

### Issue C: Frontend Not Updated
**Cause**: Browser cache  
**Solution**: Hard refresh (`Ctrl + Shift + R`)

### Issue D: Wrong Endpoint Called
**Cause**: Frontend still calling `/api/orders` instead of `/api/orders/all`  
**Solution**: Check if getAllOrders() exists in api.js

---

## ✅ VERIFICATION COMMANDS:

### Check if getAllOrders() exists:
```bash
grep -n "getAllOrders" frontend/src/services/api.js
```
Expected: Should show line with `getAllOrders: () => api.get('/orders/all')`

### Check if OrderManagement uses it:
```bash
grep -n "getAllOrders" frontend/src/pages/Admin/OrderManagement.js
```
Expected: Should show line with `await ordersAPI.getAllOrders()`

### Check backend endpoint exists:
```bash
grep -n "@GetMapping(\"/all\")" backend/src/main/java/com/ccmart/backend/controller/OrderController.java
```
Expected: Should show the /all endpoint

---

## 🎯 NEXT STEPS:

1. **Open `/admin/orders` in browser**
2. **Press F12** (open console)
3. **Hard refresh**: `Ctrl + Shift + R`
4. **Check console** for `[UPDATED CODE v3.0]`
5. **Check console** for `Response.data length: ?`
6. **Check java terminal** for database count
7. **Tell me all three numbers!**
