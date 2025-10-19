# 🚀 Quick Start Guide - Order Management System

## ✅ What's Been Implemented

### Backend (Spring Boot) - ✅ COMPLETE
- ✅ `DeliveryAgent` entity model
- ✅ `DeliveryAgentRepository` with query methods
- ✅ `DeliveryAgentController` with 8 REST endpoints
- ✅ `DeliveryAgentDTO` for data transfer
- ✅ `Order` model updated with delivery agent relationship
- ✅ `OrderRepository` enhanced with status queries
- ✅ `OrderController` with approval & assignment endpoints
- ✅ **BUILD STATUS**: ✅ Compiled successfully, no errors

### Frontend (React) - ✅ COMPLETE  
- ✅ `AdminDeliveryAgents` page - Full CRUD for delivery agents
- ✅ `AdminOrderManagement` page - Approve orders & assign agents
- ✅ `OrderDetails` page - Shows delivery agent info to customers
- ✅ Navigation routes added to App.js
- ✅ Sidebar menu updated in AdminLayout

---

## 🔄 Complete Workflow

```
1. 👤 Customer
   └─> Places Order → Status: pending

2. 👨‍💼 Admin (Order Management page)
   └─> Reviews Order
   └─> Clicks "Approve" → Status: approved

3. 👨‍💼 Admin (Order Management page)
   └─> Selects Available Delivery Agent
   └─> Clicks "Assign" → Status: assigned
   └─> Agent details linked to order

4. 👨‍💼 Admin (Order Management page)  
   └─> Clicks "Start Delivery" → Status: in_delivery

5. 👤 Customer (My Orders page)
   └─> Views Order Details
   └─> Sees Delivery Agent Card with:
       • Agent Name
       • Phone Number
       • Vehicle Type & Number

6. 👨‍💼 Admin (Order Management page)
   └─> Clicks "Mark Delivered" → Status: delivered
```

---

## 🎯 How to Test

### Step 1: Start the Application

**Terminal 1 - Backend:**
```powershell
cd "c:\Users\imax.computer\OneDrive\Desktop\OOAD Project - Copy\Chamika\C-C_Mart\backend"
mvn spring-boot:run
```

**Terminal 2 - Frontend:**
```powershell
cd "c:\Users\imax.computer\OneDrive\Desktop\OOAD Project - Copy\Chamika\C-C_Mart\frontend"
npm start
```

### Step 2: Login as Admin

1. Open: http://localhost:3000/login
2. Login with admin credentials
3. Navigate to Admin Dashboard

### Step 3: Add Delivery Agents

1. Click **"Delivery Agents"** in sidebar
2. Click **"Add Delivery Agent"** button
3. Fill in the form:
   - **Name**: John Doe
   - **Phone**: 0771234567
   - **Email**: john@example.com (optional)
   - **Address**: 123 Main St, Colombo (optional)
   - **Vehicle Type**: Bike
   - **Vehicle Number**: ABC-1234
4. Click **"Add"**
5. Repeat to add 2-3 more agents

**Example Agents to Add:**
```
Agent 1:
  Name: John Doe
  Phone: 0771234567
  Vehicle: Bike - ABC-1234

Agent 2:
  Name: Jane Smith  
  Phone: 0779876543
  Vehicle: Car - XYZ-5678

Agent 3:
  Name: Mike Wilson
  Phone: 0765551234
  Vehicle: Van - DEF-9999
```

### Step 4: Place Test Order (as Customer)

1. Logout from admin
2. Register/Login as customer
3. Add products to cart
4. Go to Checkout
5. Click **"Proceed to Checkout"**
6. Order is created with status: **pending**

### Step 5: Approve the Order (as Admin)

1. Login as admin
2. Click **"Order Management"** in sidebar
3. You'll see the order under **"Pending"** tab
4. Click **"Approve"** button
5. Order moves to **"Approved"** tab
6. Status changes to: **approved**

### Step 6: Assign Delivery Agent (as Admin)

1. In **"Approved"** tab, find the order
2. Click **"Assign Agent"** button
3. A dialog opens with dropdown of **available agents**
4. Select an agent (e.g., "John Doe")
5. Click **"Assign"**
6. Order moves to **"Assigned"** tab
7. Status changes to: **assigned**

### Step 7: Start Delivery (as Admin)

1. In **"Assigned"** tab, find the order
2. Click **"Start Delivery"** button
3. Order moves to **"In Delivery"** tab
4. Status changes to: **in_delivery**

### Step 8: View Delivery Agent (as Customer)

1. Logout from admin
2. Login as the customer who placed the order
3. Go to **"My Orders"**
4. Click on the order to view details
5. You should see **"Delivery Agent"** card showing:
   - 👤 Agent Name: John Doe
   - 📞 Phone: 0771234567
   - 🚗 Vehicle: Bike - ABC-1234
   - Status chip: "On the way"

### Step 9: Mark as Delivered (as Admin)

1. Login as admin
2. Go to **"Order Management"**
3. In **"In Delivery"** tab, find the order
4. Click **"Mark Delivered"** button
5. Status changes to: **delivered**
6. Workflow complete! ✅

---

## 🔍 What to Look For

### ✅ Admin Features Working:

**Delivery Agents Page (`/admin/delivery-agents`)**:
- [ ] Statistics cards show correct counts
- [ ] Table lists all delivery agents
- [ ] "Add Delivery Agent" opens form dialog
- [ ] Form validates required fields (name, phone)
- [ ] New agent appears in table after adding
- [ ] "Edit" button opens form with existing data
- [ ] "Delete" button deactivates agent
- [ ] Availability chip can be clicked to toggle
- [ ] Active agents show green "Available" or orange "Busy"
- [ ] Inactive agents show gray "Inactive"

**Order Management Page (`/admin/order-management`)**:
- [ ] Statistics cards show order counts by status
- [ ] Tabs filter orders correctly (Pending, Approved, etc.)
- [ ] "Approve" button appears for pending orders
- [ ] "Assign Agent" button appears for approved orders
- [ ] Dropdown shows only available agents
- [ ] "Start Delivery" button appears for assigned orders
- [ ] "Mark Delivered" button appears for in-delivery orders
- [ ] Status changes happen instantly with success message
- [ ] Delivery agent info shows in table when assigned

### ✅ Customer Features Working:

**Order Details Page (`/orders/:id`)**:
- [ ] Order summary shows correct total
- [ ] Order items table displays products
- [ ] Delivery address shows correctly
- [ ] "Delivery Agent" card appears when status is assigned/in_delivery/delivered
- [ ] Agent name displays correctly
- [ ] Agent phone number displays correctly
- [ ] Vehicle information shows (if provided)
- [ ] Status chip shows "On the way" for in_delivery
- [ ] Status chip shows "Delivered" for delivered status

### ✅ Navigation Working:
- [ ] Admin sidebar shows new menu items
- [ ] "Order Management" link works
- [ ] "Delivery Agents" link works
- [ ] All pages load without errors
- [ ] No console errors in browser

---

## 🐛 Troubleshooting

### Backend won't start?
```powershell
# Clean and rebuild
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend won't start?
```powershell
# Reinstall dependencies
cd frontend
rm -rf node_modules
npm install
npm start
```

### Can't see Delivery Agents page?
- ✅ Make sure you're logged in as ADMIN
- ✅ Check sidebar for "Delivery Agents" menu item
- ✅ Navigate to: http://localhost:3000/admin/delivery-agents

### "Assign Agent" dropdown is empty?
- ✅ Add delivery agents first via "Delivery Agents" page
- ✅ Make sure agents are marked as "Available"
- ✅ Check agent is not already assigned to another active order

### Order not showing in tabs?
- ✅ Check you're in the correct tab (Pending/Approved/etc.)
- ✅ Try "All Orders" tab to see all statuses
- ✅ Refresh the page

### Customer can't see delivery agent?
- ✅ Order must be in "assigned", "in_delivery", or "delivered" status
- ✅ Delivery agent must be assigned by admin first
- ✅ Check OrderDetails page (click on order from Orders list)

---

## 📊 Test Data Template

### Delivery Agents
```
1. John Doe - 0771234567 - Bike - ABC-1234
2. Jane Smith - 0779876543 - Car - XYZ-5678
3. Mike Wilson - 0765551234 - Van - DEF-9999
4. Sarah Johnson - 0764445555 - Bike - LMN-4444
5. Tom Brown - 0773332222 - Car - PQR-7777
```

### Test Scenarios

**Scenario 1: Happy Path**
1. Create order as customer → pending
2. Approve as admin → approved  
3. Assign John Doe → assigned
4. Start delivery → in_delivery
5. Check customer sees John's info ✅
6. Mark delivered → delivered

**Scenario 2: Multiple Orders**
1. Create 3 orders as customer
2. Approve all 3 as admin
3. Assign different agents to each
4. Check all show correct agent info ✅

**Scenario 3: Agent Availability**
1. Create order, approve it
2. Assign John Doe
3. Create another order, approve it
4. Try to assign John Doe again
5. Check John appears as "Busy" ✅

**Scenario 4: Agent Management**
1. Add new agent
2. Edit agent details
3. Toggle availability
4. Deactivate agent
5. Check deactivated agent not in dropdown ✅

---

## 📝 Admin Credentials

**Email**: admin@ccmart.com  
**Password**: admin123

*(Or use your existing admin account)*

---

## 🎨 UI Screenshots Expectations

### Admin - Delivery Agents Page:
- Clean table layout
- Green "Available" and orange "Busy" chips
- Statistics cards at top
- Add button in top-right
- Edit and Delete icons for each row

### Admin - Order Management Page:
- Tabs for different statuses
- Statistics cards showing counts
- Action buttons per status (Approve/Assign/Start/Delivered)
- Assign dialog with dropdown selector

### Customer - Order Details:
- Order summary on right
- Items table on left
- Delivery Agent card (when assigned)
  - Card has shipping icon header
  - Name with person icon
  - Phone with phone icon  
  - Vehicle with car icon
  - Status chip at bottom

---

## ✅ Success Criteria

The implementation is successful if:

1. ✅ Admin can add/edit/delete delivery agents
2. ✅ Admin can approve pending orders
3. ✅ Admin can assign available agents to approved orders
4. ✅ Admin can progress order through all statuses
5. ✅ Customer can see delivery agent info once assigned
6. ✅ All navigation links work correctly
7. ✅ No console errors during normal workflow
8. ✅ Data persists across page refreshes
9. ✅ Status validations work (can't skip steps)
10. ✅ Only available agents appear in assignment dropdown

---

## 🚀 Ready to Test!

Everything is implemented and the backend compiled successfully. Follow the steps above to test the complete order management workflow.

**Start here**: Step 3 (Add Delivery Agents) since backend and frontend should already be running.

---

## 📞 Need Help?

Check the detailed documentation:
- **ORDER-MANAGEMENT-SUMMARY.md** - Complete technical documentation
- **API endpoints** - Listed in summary document
- **Database schema** - Included in summary document

**Happy Testing! 🎉**
