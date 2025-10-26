# Testing Order Items Endpoints

## Available Endpoints to Test

### 1. Get Order (Standard)
```http
GET http://localhost:8080/api/orders/8
Authorization: Bearer YOUR_JWT_TOKEN
```

### 2. Get Order Details (Enhanced with guaranteed items)
```http
GET http://localhost:8080/api/orders/8/details
Authorization: Bearer YOUR_JWT_TOKEN
```

### 3. Get Order Items Only
```http
GET http://localhost:8080/api/orders/8/items
Authorization: Bearer YOUR_JWT_TOKEN
```

### 4. Debug Order Items (Raw Database Query)
```http
GET http://localhost:8080/api/orders/8/items-debug
Authorization: Bearer YOUR_JWT_TOKEN
```

## Expected Response from `/api/orders/8/details`

```json
{
  "id": 8,
  "orderNumber": "ORD...",
  "totalAmount": 350.00,
  "status": "pending",
  "paymentStatus": "pending",
  "paymentMethod": "cash_on_delivery",
  "deliveryAddress": "991/1 stage 2, Anuradhapura, 50000",
  "deliveryPhone": "N/A",
  "createdAt": "2025-10-26T...",
  "items": [
    {
      "id": 1,
      "product": {
        "id": 1,
        "name": "Product Name",
        "price": 350.00,
        "imageUrl": "..."
      },
      "quantity": 1,
      "price": 350.00
    }
  ],
  "itemsCount": 1,
  "user": {
    "id": 2,
    "name": "Geesara adhithya",
    "email": "geesaadii09@gmail.com"
  }
}
```

## Frontend Update Required

### Option 1: Update the API call to use the new endpoint

```javascript
// Change from:
fetch(`/api/orders/${orderId}`)

// To:
fetch(`/api/orders/${orderId}/details`)
```

### Option 2: Use the items endpoint separately

```javascript
// Get order
const order = await fetch(`/api/orders/${orderId}`).then(r => r.json());

// Get items separately
const itemsData = await fetch(`/api/orders/${orderId}/items`).then(r => r.json());

// Combine
order.items = itemsData.items;
```

## Debugging Steps

1. **Start the backend server**
2. **Check console output** when you call the endpoints
3. **Verify database** has order_items data:
   ```sql
   SELECT * FROM order_items WHERE order_id = 8;
   ```
4. **Test with Postman/Thunder Client** before testing with frontend

## Common Issues

### Issue: "No items found for this order"

**Possible Causes:**
1. Order was created without items (database issue)
2. Items not being fetched from database (JPA issue)
3. JSON serialization removing items (circular reference)

**Solution:**
- Use `/api/orders/{id}/items-debug` to check if items exist in database
- Use `/api/orders/{id}/details` which explicitly fetches items
- Check console logs for debugging information

### Issue: Items exist but not showing in response

**Solution:**
- The new `/details` endpoint explicitly fetches items using repository
- Returns a clean JSON structure with guaranteed items field
- No circular reference issues
