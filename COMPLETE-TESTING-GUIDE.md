# 🧪 Complete Testing Guide - C&C Mart

## Pre-Testing Checklist

### 1. Backend Status
- [ ] MySQL server running on port 3306
- [ ] Database `ccmart_db` created
- [ ] Backend running on port 8081
- [ ] No compilation errors

### 2. Frontend Status
- [ ] Node modules installed (`npm install`)
- [ ] Frontend running on port 3000
- [ ] No build errors

### 3. Admin Account Created
- [ ] Email: `admin@ccmart.com`
- [ ] Password: `admin123`
- [ ] Auto-created on backend startup

---

## 🎯 Test Suite 1: Admin Navigation (NEW FIX)

### Test 1.1: Verify No Duplicate Menu Items ✨
**Steps**:
1. Login as admin
2. Check sidebar menu
3. Count menu items

**Expected Result**:
```
✅ Should see exactly 6 menu items:
1. Dashboard
2. Products
3. Order Management (NOT "Orders")
4. Delivery Agents
5. Users
6. Reports
```

**Pass Criteria**: 
- [ ] Only ONE order-related menu item
- [ ] Named "Order Management"
- [ ] Icon is AssignmentInd (clipboard with person)

---

### Test 1.2: Order Management Page Loads Correctly
**Steps**:
1. Click "Order Management" in sidebar
2. Observe page content

**Expected Result**:
```
✅ Should see:
- Page title: "Order Management"
- Statistics cards at top
- Status tabs: Pending, Approved, Assigned, In Delivery, Delivered, Cancelled
- Order list table
```

**Pass Criteria**:
- [ ] Page loads without errors
- [ ] All tabs are visible
- [ ] Statistics display correctly

---

## 🛒 Test Suite 2: Complete Customer Journey

### Test 2.1: Customer Registration & Login
**Steps**:
1. Go to `/register`
2. Fill form:
   - Name: "Test Customer"
   - Email: "customer@test.com"
   - Password: "password123"
3. Click "Register"
4. Login with same credentials

**Expected Result**:
- [ ] Registration successful
- [ ] Redirected to home page
- [ ] Shows "Welcome, Test Customer" in header
- [ ] Cart icon visible (shows 0)

---

### Test 2.2: Add Products to Cart
**Steps**:
1. Go to "Products" page
2. Click on first product
3. Click "Add to Cart"
4. Repeat for 2 more products

**Expected Result**:
- [ ] Toast notification: "Added to cart"
- [ ] Cart badge updates: 1 → 2 → 3
- [ ] Badge is visible (not hidden)

---

### Test 2.3: View Cart & Update Quantities
**Steps**:
1. Click cart icon in header
2. Check cart contents
3. Change quantity of one item to 2
4. Click "Update" button
5. Remove one item

**Expected Result**:
- [ ] All 3 products listed
- [ ] Prices display correctly
- [ ] Quantity update works
- [ ] Total recalculates automatically
- [ ] Item removal works
- [ ] Cart badge updates correctly

---

### Test 2.4: Checkout Process
**Steps**:
1. In cart, click "Proceed to Checkout"
2. Fill delivery form:
   - Address: "123 Test Street, Colombo"
   - Phone: "0771234567"
   - Notes: "Please deliver before 6pm"
3. Click "Place Order"

**Expected Result**:
- [ ] Order created successfully
- [ ] Toast: "Order placed successfully!"
- [ ] Redirected to order details page
- [ ] Order status shows "Pending"
- [ ] Cart clears (badge shows 0 or invisible)

---

### Test 2.5: View Order History
**Steps**:
1. Go to "My Orders" page
2. Check order list

**Expected Result**:
- [ ] Recently placed order appears
- [ ] Order number displayed
- [ ] Status: "Pending"
- [ ] Total amount correct
- [ ] Order date shows current date

---

## 👨‍💼 Test Suite 3: Admin Order Management Workflow

### Test 3.1: View Pending Orders
**Steps**:
1. Login as admin
2. Go to "Order Management"
3. Click "Pending" tab

**Expected Result**:
- [ ] Order from Test 2.4 appears
- [ ] Shows customer name "Test Customer"
- [ ] Shows total amount
- [ ] "Approve Order" button visible
- [ ] Statistics card shows "Pending: 1"

---

### Test 3.2: Add Delivery Agents
**Steps**:
1. Go to "Delivery Agents" page
2. Click "+ Add Agent" button
3. Fill form for Agent 1:
   - Name: "Kamal Perera"
   - Phone: "0771111111"
   - Email: "kamal@delivery.com"
   - Address: "Colombo"
   - Vehicle Type: "Motorcycle"
   - Vehicle Number: "ABC-1234"
4. Click "Save"
5. Repeat for Agent 2:
   - Name: "Nimal Silva"
   - Phone: "0772222222"
   - Email: "nimal@delivery.com"
   - Address: "Colombo"
   - Vehicle Type: "Van"
   - Vehicle Number: "XYZ-5678"

**Expected Result**:
- [ ] Toast: "Agent created successfully"
- [ ] Both agents appear in table
- [ ] Status shows "Available" (green chip)
- [ ] Statistics: "Total: 2, Available: 2, Busy: 0"

---

### Test 3.3: Approve Order
**Steps**:
1. Go to "Order Management"
2. In "Pending" tab, find test order
3. Click "Approve Order" button

**Expected Result**:
- [ ] Toast: "Order approved successfully!"
- [ ] Order disappears from "Pending" tab
- [ ] Order appears in "Approved" tab
- [ ] Statistics update: "Approved: 1"
- [ ] "Assign Delivery Agent" button visible

---

### Test 3.4: Assign Delivery Agent
**Steps**:
1. In "Approved" tab, find order
2. Click "Assign Delivery Agent" button
3. Dialog opens
4. Select "Kamal Perera" from dropdown
5. Click "Assign"

**Expected Result**:
- [ ] Toast: "Delivery agent assigned successfully!"
- [ ] Order moves to "Assigned" tab
- [ ] Order shows "Kamal Perera" in agent column
- [ ] Statistics: "Assigned: 1"
- [ ] "Start Delivery" button visible

---

### Test 3.5: Start Delivery
**Steps**:
1. In "Assigned" tab, find order
2. Click "Start Delivery" button

**Expected Result**:
- [ ] Toast: "Order status updated!"
- [ ] Order moves to "In Delivery" tab
- [ ] Statistics: "In Delivery: 1"
- [ ] "Mark Delivered" button visible

---

### Test 3.6: Mark as Delivered
**Steps**:
1. In "In Delivery" tab, find order
2. Click "Mark Delivered" button

**Expected Result**:
- [ ] Toast: "Order marked as delivered!"
- [ ] Order moves to "Delivered" tab
- [ ] Statistics: "Delivered: 1"
- [ ] No action buttons (final state)

---

### Test 3.7: Verify Agent Availability Status
**Steps**:
1. Go to "Delivery Agents" page
2. Check Kamal Perera's status
3. Create and approve new order
4. Try to assign Kamal again

**Expected Result**:
- [ ] Kamal shows as "Busy" (orange chip)
- [ ] In assign dialog, Kamal appears in dropdown but marked as busy
- [ ] Statistics: "Available: 1, Busy: 1"

---

## 👤 Test Suite 4: Customer View of Delivery Agent

### Test 4.1: Customer Sees Agent Details
**Steps**:
1. Logout admin
2. Login as customer (customer@test.com)
3. Go to "My Orders"
4. Click on the delivered order

**Expected Result**:
```
✅ Should see Delivery Agent Card:
┌─────────────────────────────────────┐
│  🚚 Delivery Agent Information      │
├─────────────────────────────────────┤
│  Name: Kamal Perera                 │
│  Phone: 0771111111                  │
│  Vehicle: Motorcycle (ABC-1234)     │
│  Status: Currently Available        │
└─────────────────────────────────────┘
```

**Pass Criteria**:
- [ ] Agent card is visible
- [ ] All agent details display correctly
- [ ] Status shows availability
- [ ] Card has proper styling

---

### Test 4.2: Pending Orders Don't Show Agent
**Steps**:
1. As customer, place new order
2. Check order details immediately

**Expected Result**:
- [ ] No agent card visible
- [ ] Shows "Waiting for admin approval"
- [ ] Status: "Pending"

---

## 🔒 Test Suite 5: Security & Permissions

### Test 5.1: Customer Cannot Access Admin Pages
**Steps**:
1. Login as customer
2. Try to navigate to `/admin`
3. Try `/admin/orders`
4. Try `/admin/delivery-agents`

**Expected Result**:
- [ ] All admin routes redirect to login or home
- [ ] Shows "Access Denied" or redirects
- [ ] Customer cannot see admin interface

---

### Test 5.2: Unauthenticated User Restrictions
**Steps**:
1. Logout completely
2. Try to access `/orders`
3. Try to access `/checkout`
4. Try to access `/admin`

**Expected Result**:
- [ ] All redirected to `/login`
- [ ] After login, redirected back to intended page

---

### Test 5.3: Admin Can Access Everything
**Steps**:
1. Login as admin
2. Navigate to each menu item
3. Test all actions

**Expected Result**:
- [ ] All pages accessible
- [ ] All actions work
- [ ] No permission errors

---

## 📊 Test Suite 6: Data Validation

### Test 6.1: Empty Cart Checkout
**Steps**:
1. Clear cart completely
2. Try to navigate to `/checkout`

**Expected Result**:
- [ ] Redirected back to cart or products
- [ ] Message: "Cart is empty"

---

### Test 6.2: Invalid Product Quantity
**Steps**:
1. In cart, try to set quantity to 0
2. Try negative number
3. Try text instead of number

**Expected Result**:
- [ ] Quantity validation works
- [ ] Cannot set invalid quantities
- [ ] Shows error message

---

### Test 6.3: Delivery Agent Validation
**Steps**:
1. As admin, try to create agent without required fields
2. Try invalid phone number
3. Try invalid email

**Expected Result**:
- [ ] Form validation works
- [ ] Cannot submit incomplete form
- [ ] Shows validation errors

---

## 🚀 Test Suite 7: Performance & UX

### Test 7.1: Page Load Times
**Steps**:
1. Open DevTools → Network tab
2. Navigate to each main page
3. Check load time

**Expected Result**:
- [ ] All pages load under 2 seconds
- [ ] No 404 errors
- [ ] No console errors

---

### Test 7.2: Responsive Design
**Steps**:
1. Open DevTools → Toggle device toolbar
2. Test on mobile size (375px)
3. Test on tablet size (768px)
4. Test on desktop (1920px)

**Expected Result**:
- [ ] Sidebar collapses on mobile
- [ ] Tables scroll horizontally on mobile
- [ ] Buttons remain accessible
- [ ] Text remains readable

---

### Test 7.3: Real-time Updates
**Steps**:
1. Admin approves order in one tab
2. Customer refreshes order page in another tab

**Expected Result**:
- [ ] Order status updates on refresh
- [ ] No stale data displayed
- [ ] Agent info appears when assigned

---

## 🐛 Test Suite 8: Error Handling

### Test 8.1: Backend Down
**Steps**:
1. Stop backend server
2. Try to login
3. Try to load products

**Expected Result**:
- [ ] Shows error message
- [ ] Doesn't crash app
- [ ] User-friendly error displayed

---

### Test 8.2: Invalid Token
**Steps**:
1. Login and get token
2. Manually corrupt token in localStorage
3. Try to access protected route

**Expected Result**:
- [ ] Redirected to login
- [ ] Token cleared
- [ ] Can login again

---

### Test 8.3: Network Errors
**Steps**:
1. Open DevTools → Network
2. Throttle to "Slow 3G"
3. Try to place order

**Expected Result**:
- [ ] Loading indicators show
- [ ] Request eventually completes
- [ ] Or shows timeout error

---

## 📋 Final Verification Checklist

### Backend:
- [ ] Spring Boot app running without errors
- [ ] Port 8081 accessible
- [ ] Database connected
- [ ] All tables created
- [ ] Admin user exists
- [ ] No exceptions in logs

### Frontend:
- [ ] React app running without errors
- [ ] Port 3000 accessible
- [ ] No console errors
- [ ] No build warnings
- [ ] All routes working
- [ ] All components render

### Features:
- [ ] User registration works
- [ ] Login/logout works
- [ ] Product browsing works
- [ ] Cart functionality works
- [ ] Order placement works
- [ ] Admin dashboard loads
- [ ] Order approval works
- [ ] Agent assignment works
- [ ] Delivery tracking works
- [ ] No duplicate menu items ✨

### Documentation:
- [ ] README.md up to date
- [ ] API endpoints documented
- [ ] Setup instructions clear
- [ ] Testing guide complete

---

## 🎉 Success Criteria

**Project is COMPLETE when**:
- ✅ All 8 test suites pass
- ✅ No console errors
- ✅ No duplicate navigation items
- ✅ Complete order workflow functions
- ✅ Security properly enforced
- ✅ Data persists correctly
- ✅ UI is responsive
- ✅ Error handling works

---

## 📝 Test Results Template

Use this template to track your testing:

```markdown
## Test Execution Results

**Date**: October 19, 2025
**Tester**: [Your Name]
**Build Version**: 1.0.0

### Suite 1: Admin Navigation
- [ ] Test 1.1: No Duplicates - PASS / FAIL
- [ ] Test 1.2: Page Loads - PASS / FAIL

### Suite 2: Customer Journey
- [ ] Test 2.1: Registration - PASS / FAIL
- [ ] Test 2.2: Add to Cart - PASS / FAIL
- [ ] Test 2.3: Cart Updates - PASS / FAIL
- [ ] Test 2.4: Checkout - PASS / FAIL
- [ ] Test 2.5: Order History - PASS / FAIL

### Suite 3: Admin Workflow
- [ ] Test 3.1: View Pending - PASS / FAIL
- [ ] Test 3.2: Add Agents - PASS / FAIL
- [ ] Test 3.3: Approve - PASS / FAIL
- [ ] Test 3.4: Assign - PASS / FAIL
- [ ] Test 3.5: Start Delivery - PASS / FAIL
- [ ] Test 3.6: Delivered - PASS / FAIL
- [ ] Test 3.7: Agent Status - PASS / FAIL

### Suite 4: Customer View
- [ ] Test 4.1: See Agent - PASS / FAIL
- [ ] Test 4.2: No Agent Yet - PASS / FAIL

### Suite 5: Security
- [ ] Test 5.1: Customer Restricted - PASS / FAIL
- [ ] Test 5.2: Unauth Redirect - PASS / FAIL
- [ ] Test 5.3: Admin Access - PASS / FAIL

### Suite 6: Validation
- [ ] Test 6.1: Empty Cart - PASS / FAIL
- [ ] Test 6.2: Invalid Quantity - PASS / FAIL
- [ ] Test 6.3: Agent Validation - PASS / FAIL

### Suite 7: Performance
- [ ] Test 7.1: Load Times - PASS / FAIL
- [ ] Test 7.2: Responsive - PASS / FAIL
- [ ] Test 7.3: Real-time - PASS / FAIL

### Suite 8: Errors
- [ ] Test 8.1: Backend Down - PASS / FAIL
- [ ] Test 8.2: Invalid Token - PASS / FAIL
- [ ] Test 8.3: Network Errors - PASS / FAIL

**Overall Result**: PASS / FAIL
**Notes**: [Any additional comments]
```

---

## 🚀 Quick Start Testing

**Fastest way to verify everything works**:

```bash
# Terminal 1: Start Backend
cd backend
./mvnw spring-boot:run

# Terminal 2: Start Frontend
cd frontend
npm start

# Browser:
1. Open http://localhost:3000
2. Register as customer, place order
3. Login as admin (admin@ccmart.com / admin123)
4. Add delivery agent
5. Approve order, assign agent
6. Verify customer sees agent info
```

**Expected Time**: 15-20 minutes for complete verification

---

**Last Updated**: October 19, 2025  
**Status**: ✅ Ready for Testing
