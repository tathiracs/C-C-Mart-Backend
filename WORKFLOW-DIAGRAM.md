# Order Management Workflow - Visual Guide

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ORDER MANAGEMENT WORKFLOW                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   CUSTOMER   │
└──────┬───────┘
       │
       │ 1. Browse Products
       │ 2. Add to Cart
       │ 3. Checkout
       │
       ▼
┌─────────────────┐
│  ORDER PLACED   │
│  Status: PENDING│◄─────────────┐
└────────┬────────┘              │
         │                       │
         │                       │ Database
         │                       │ Persistence
         │                       │
         ▼                       │
┌─────────────────────────────────────────┐
│          ADMIN DASHBOARD                │
│      (Order Management Page)            │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  TAB: PENDING ORDERS            │   │
│  │  ┌─────────────────────────┐    │   │
│  │  │ Order #123              │    │   │
│  │  │ Customer: John Doe      │    │   │
│  │  │ Total: Rs. 5,250        │    │   │
│  │  │ [✓ Approve]             │◄───┼───┼── Admin clicks "Approve"
│  │  └─────────────────────────┘    │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
         │
         │ Status → APPROVED
         │ approvedAt timestamp set
         │
         ▼
┌─────────────────────────────────────────┐
│          ADMIN DASHBOARD                │
│      (Order Management Page)            │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  TAB: APPROVED ORDERS           │   │
│  │  ┌─────────────────────────┐    │   │
│  │  │ Order #123              │    │   │
│  │  │ Customer: John Doe      │    │   │
│  │  │ Total: Rs. 5,250        │    │   │
│  │  │ [👤 Assign Agent]       │◄───┼───┼── Admin clicks "Assign Agent"
│  │  └─────────────────────────┘    │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
         │
         │ Opens Dialog
         │
         ▼
┌────────────────────────────────────────────┐
│    ASSIGN DELIVERY AGENT DIALOG            │
│                                            │
│  Order: #123                               │
│  Customer: John Doe                        │
│  Total: Rs. 5,250                          │
│  ──────────────────────────────────        │
│  Select Delivery Agent: ▼                  │
│  ┌────────────────────────────────┐        │
│  │ ○ John Doe                     │        │
│  │   0771234567 - Bike (ABC-1234) │◄───────┼── Admin selects agent
│  │ ○ Jane Smith                   │        │
│  │   0779876543 - Car (XYZ-5678)  │        │
│  └────────────────────────────────┘        │
│                                            │
│  [Cancel]  [Assign]                        │◄─── Admin clicks "Assign"
└────────────────────────────────────────────┘
         │
         │ Status → ASSIGNED
         │ assignedAt timestamp set
         │ deliveryAgent linked
         │
         ▼
┌─────────────────────────────────────────┐
│          ADMIN DASHBOARD                │
│      (Order Management Page)            │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  TAB: ASSIGNED ORDERS           │   │
│  │  ┌─────────────────────────┐    │   │
│  │  │ Order #123              │    │   │
│  │  │ Customer: John Doe      │    │   │
│  │  │ Agent: John Doe         │    │   │
│  │  │ Phone: 0771234567       │    │   │
│  │  │ [🚚 Start Delivery]     │◄───┼───┼── Admin clicks "Start Delivery"
│  │  └─────────────────────────┘    │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
         │
         │ Status → IN_DELIVERY
         │
         ▼
┌──────────────────────────────────────────────────┐
│               CUSTOMER VIEW                      │
│            (Order Details Page)                  │
│                                                  │
│  ┌────────────────────────────────────────┐     │
│  │ Order #123                             │     │
│  │ Status: [🚚 IN DELIVERY]               │     │
│  │                                        │     │
│  │ ┌────────────────────────────────────┐ │     │
│  │ │  🚚 DELIVERY AGENT                 │ │     │
│  │ │  ──────────────────────────────    │ │     │
│  │ │  👤 John Doe                       │ │◄────┼── Customer sees agent info
│  │ │  📞 0771234567                     │ │     │
│  │ │  🚗 Bike - ABC-1234                │ │     │
│  │ │                                    │ │     │
│  │ │  [ℹ On the way]                    │ │     │
│  │ └────────────────────────────────────┘ │     │
│  │                                        │     │
│  │ Delivery Address:                      │     │
│  │ 123 Main St, Colombo                   │     │
│  └────────────────────────────────────────┘     │
└──────────────────────────────────────────────────┘
         │
         │ Delivery in progress...
         │
         ▼
┌─────────────────────────────────────────┐
│          ADMIN DASHBOARD                │
│      (Order Management Page)            │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  TAB: IN DELIVERY               │   │
│  │  ┌─────────────────────────┐    │   │
│  │  │ Order #123              │    │   │
│  │  │ Customer: John Doe      │    │   │
│  │  │ Agent: John Doe         │    │   │
│  │  │ [✓ Mark Delivered]      │◄───┼───┼── Admin clicks "Mark Delivered"
│  │  └─────────────────────────┘    │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
         │
         │ Status → DELIVERED
         │
         ▼
┌──────────────────────────────────────────────────┐
│               CUSTOMER VIEW                      │
│            (Order Details Page)                  │
│                                                  │
│  ┌────────────────────────────────────────┐     │
│  │ Order #123                             │     │
│  │ Status: [✓ DELIVERED]                  │     │
│  │                                        │     │
│  │ ┌────────────────────────────────────┐ │     │
│  │ │  🚚 DELIVERY AGENT                 │ │     │
│  │ │  ──────────────────────────────    │ │     │
│  │ │  👤 John Doe                       │ │     │
│  │ │  📞 0771234567                     │ │     │
│  │ │  🚗 Bike - ABC-1234                │ │◄────┼── Order complete!
│  │ │                                    │ │     │
│  │ │  [✓ Delivered]                     │ │     │
│  │ └────────────────────────────────────┘ │     │
│  └────────────────────────────────────────┘     │
└──────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════

                          DATABASE RELATIONSHIPS

┌─────────────┐                    ┌──────────────────┐
│   USERS     │                    │ DELIVERY_AGENTS  │
├─────────────┤                    ├──────────────────┤
│ id          │                    │ id               │
│ name        │                    │ name             │
│ email       │                    │ phone            │
│ role        │                    │ email            │
└──────┬──────┘                    │ address          │
       │                           │ vehicleType      │
       │                           │ vehicleNumber    │
       │                           │ isAvailable      │
       │ 1                         │ isActive         │
       │                           └────────┬─────────┘
       │                                    │
       │                                    │ 1
       │                                    │
       │  creates                    is assigned to   │
       │                                    │
       │                                    │
       │  N                                 │ 1
       └────────────────┐                   │
                        │                   │
                        ▼                   │
                ┌───────────────┐           │
                │    ORDERS     │◄──────────┘
                ├───────────────┤
                │ id            │
                │ user_id       │ ──┐
                │ status        │   │ Foreign Keys
                │ totalAmount   │   │
                │ approvedAt    │   │
                │ assignedAt    │   │
                │ delivery_     │ ──┘
                │   agent_id    │
                └───────┬───────┘
                        │
                        │ 1
                        │
                        │ has
                        │
                        │ N
                        ▼
                ┌───────────────┐
                │  ORDER_ITEMS  │
                ├───────────────┤
                │ id            │
                │ order_id      │
                │ product_id    │
                │ quantity      │
                │ price         │
                └───────────────┘

═══════════════════════════════════════════════════════════════════════════════

                            API ENDPOINTS FLOW

ADMIN CREATES DELIVERY AGENT:
┌────────────────────────────────────────────────────────────────┐
│ POST /api/delivery-agents                                      │
│ Authorization: Bearer <admin-token>                            │
│ {                                                              │
│   "name": "John Doe",                                          │
│   "phone": "0771234567",                                       │
│   "vehicleType": "Bike",                                       │
│   "vehicleNumber": "ABC-1234"                                  │
│ }                                                              │
└────────────────────────────────────────────────────────────────┘
                              ↓
                    ✅ Agent Created
                    isAvailable = true
                    isActive = true


CUSTOMER PLACES ORDER:
┌────────────────────────────────────────────────────────────────┐
│ POST /api/orders                                               │
│ Authorization: Bearer <customer-token>                         │
│ {                                                              │
│   "deliveryAddress": "123 Main St",                            │
│   "paymentMethod": "cash",                                     │
│   "notes": "Call before delivery"                              │
│ }                                                              │
└────────────────────────────────────────────────────────────────┘
                              ↓
                    ✅ Order Created
                    status = "pending"


ADMIN APPROVES ORDER:
┌────────────────────────────────────────────────────────────────┐
│ PUT /api/orders/123/approve                                    │
│ Authorization: Bearer <admin-token>                            │
└────────────────────────────────────────────────────────────────┘
                              ↓
                    ✅ Order Approved
                    status = "approved"
                    approvedAt = "2024-01-17T10:30:00"


ADMIN GETS AVAILABLE AGENTS:
┌────────────────────────────────────────────────────────────────┐
│ GET /api/delivery-agents/available                             │
│ Authorization: Bearer <admin-token>                            │
└────────────────────────────────────────────────────────────────┘
                              ↓
                    ✅ Returns List:
                    [ { id: 1, name: "John Doe", ... } ]


ADMIN ASSIGNS AGENT:
┌────────────────────────────────────────────────────────────────┐
│ PUT /api/orders/123/assign                                     │
│ Authorization: Bearer <admin-token>                            │
│ { "agentId": 1 }                                               │
└────────────────────────────────────────────────────────────────┘
                              ↓
                    ✅ Agent Assigned
                    status = "assigned"
                    assignedAt = "2024-01-17T10:35:00"
                    delivery_agent_id = 1


ADMIN UPDATES STATUS:
┌────────────────────────────────────────────────────────────────┐
│ PUT /api/orders/123/status                                     │
│ Authorization: Bearer <admin-token>                            │
│ { "status": "in_delivery" }                                    │
└────────────────────────────────────────────────────────────────┘
                              ↓
                    ✅ Status Updated
                    status = "in_delivery"


CUSTOMER VIEWS ORDER:
┌────────────────────────────────────────────────────────────────┐
│ GET /api/orders/123                                            │
│ Authorization: Bearer <customer-token>                         │
└────────────────────────────────────────────────────────────────┘
                              ↓
                    ✅ Returns Order with:
                    {
                      id: 123,
                      status: "in_delivery",
                      deliveryAgent: {
                        name: "John Doe",
                        phone: "0771234567",
                        vehicleType: "Bike",
                        vehicleNumber: "ABC-1234"
                      }
                    }


CUSTOMER VIEWS AGENT DETAILS:
┌────────────────────────────────────────────────────────────────┐
│ GET /api/delivery-agents/1                                     │
│ Authorization: Bearer <customer-token>                         │
└────────────────────────────────────────────────────────────────┘
                              ↓
                    ✅ Returns Agent Info
                    (Public endpoint for customer view)

═══════════════════════════════════════════════════════════════════════════════

                        FRONTEND COMPONENT STRUCTURE

┌────────────────────────────────────────────────────────────────────┐
│                         App.js (Root)                              │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ Routes:                                                       │ │
│  │  /admin/delivery-agents → AdminDeliveryAgents                │ │
│  │  /admin/order-management → AdminOrderManagement              │ │
│  │  /orders/:id → OrderDetails                                  │ │
│  └──────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
                                  │
                 ┌────────────────┼────────────────┐
                 │                │                │
                 ▼                ▼                ▼
    ┌────────────────┐  ┌────────────────┐  ┌──────────────┐
    │ AdminDelivery  │  │ AdminOrder     │  │ OrderDetails │
    │ Agents         │  │ Management     │  │ (Customer)   │
    └────────────────┘  └────────────────┘  └──────────────┘
            │                    │                    │
            │                    │                    │
    ┌───────┴──────┐    ┌───────┴──────┐    ┌────────┴────────┐
    │              │    │              │    │                 │
    ▼              ▼    ▼              ▼    ▼                 ▼
[Agent Table] [Add Form] [Order Tabs] [Assign Dialog] [Agent Card] [Status]

═══════════════════════════════════════════════════════════════════════════════

                            STATUS PROGRESSION

    PENDING ──────> APPROVED ──────> ASSIGNED ──────> IN_DELIVERY ──────> DELIVERED
       │                                                                       ▲
       │                                                                       │
       └────────────────────────────> CANCELLED ◄────────────────────────────┘

    Actions:
    • pending → approved: Admin clicks "Approve"
    • approved → assigned: Admin assigns delivery agent
    • assigned → in_delivery: Admin clicks "Start Delivery"
    • in_delivery → delivered: Admin clicks "Mark Delivered"
    • Any status → cancelled: Admin/Customer cancels order (if allowed)

═══════════════════════════════════════════════════════════════════════════════

                         VALIDATION RULES

    ✅ Can Approve Order:
       • Order status MUST be "pending"
       • User MUST have ADMIN role

    ✅ Can Assign Agent:
       • Order status MUST be "approved"
       • Agent MUST be isActive = true
       • Agent MUST be isAvailable = true
       • User MUST have ADMIN role

    ✅ Can Start Delivery:
       • Order status MUST be "assigned"
       • User MUST have ADMIN role

    ✅ Can Mark Delivered:
       • Order status MUST be "in_delivery"
       • User MUST have ADMIN role

    ✅ Customer Can View Agent:
       • Order status MUST be "assigned", "in_delivery", or "delivered"
       • User MUST be the order owner OR have ADMIN role

═══════════════════════════════════════════════════════════════════════════════
```
