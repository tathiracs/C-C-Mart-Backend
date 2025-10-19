# Product Addition & Deletion Troubleshooting Guide

## Improvements Made ✅

### 1. Enhanced Validation
**Added client-side validation:**
- ✅ Check all required fields are filled
- ✅ Validate price > 0
- ✅ Validate stock quantity >= 0
- ✅ Trim whitespace from text fields
- ✅ Proper type conversion (parseFloat for price, parseInt for categoryId and stockQuantity)

### 2. Better Error Handling
**Added detailed error logging:**
- ✅ Log all API requests and responses
- ✅ Show specific error messages from backend
- ✅ Console logging for debugging
- ✅ User-friendly error toasts

### 3. Data Type Fixes
**Ensured correct data types:**
- ✅ price: parseFloat
- ✅ categoryId: parseInt
- ✅ stockQuantity: parseInt
- ✅ isFeatured: Boolean
- ✅ isActive: true (always for new/updated products)

## Common Issues & Solutions

### Issue 1: "Failed to save product" - 403 Forbidden
**Cause**: Not logged in as admin or token expired

**Solution**:
1. Make sure you're logged in at http://localhost:3000/login
2. Use admin credentials (admin@ccmart.com / Admin@123)
3. Check browser console for authentication errors
4. Try logging out and back in

### Issue 2: "Failed to save product" - 400 Bad Request
**Cause**: Invalid data format or missing required fields

**Solution**:
1. Check all required fields are filled:
   - Product Name (required)
   - Category (required)
   - Price (required, must be > 0)
   - Stock Quantity (required, must be >= 0)
   - Unit (required)
2. Open browser console (F12) to see detailed error
3. Look for validation error messages

### Issue 3: Product created but not visible
**Cause**: Product created with isActive=false

**Solution**:
- This is now fixed! All new products are set to isActive=true
- If you have old products, run the fix script: `.\quick-fix-products.ps1`

### Issue 4: Category not saving
**Cause**: Category ID not being sent correctly

**Solution**:
- Make sure category dropdown has options
- Check if categories are loaded (open browser console)
- Verify categoryId is being converted to parseInt

### Issue 5: Image not uploading
**Cause**: Image being saved as base64 (very large)

**Solution**:
- Use smaller images (< 1MB recommended)
- Or use image URL instead of file upload
- For production, implement proper file storage (AWS S3, Cloudinary)

### Issue 6: Delete not working
**Cause**: Product not found or permission denied

**Solution**:
- Verify you're logged in as admin
- Check product ID is correct
- Look at browser console for error details
- Note: Delete is soft delete (sets isActive=false)

## How to Test Each Operation

### Test Create
1. Go to Admin Dashboard → Products
2. Click "ADD PRODUCT"
3. Fill in all fields:
   ```
   Name: Test Product
   Category: Select any
   Description: Test description
   Price: 100
   Stock: 50
   Unit: pieces
   Image URL: https://via.placeholder.com/300
   Featured: Check if desired
   ```
4. Click "Create"
5. Check for success toast
6. Product should appear in list

**Check Browser Console for:**
```
Submitting product data: {name: "Test Product", ...}
Create response: {...}
```

### Test Update
1. Click edit (pencil icon) on any product
2. Change any field (e.g., price)
3. Click "Update"
4. Check for success toast
5. Changes should be visible immediately

**Check Browser Console for:**
```
Submitting product data: {name: "...", ...}
Update response: {...}
```

### Test Delete
1. Click delete (trash icon) on any product
2. Confirm deletion
3. Check for success toast
4. Product should disappear from customer view
5. Still visible in admin (with ability to filter if needed)

**Check Browser Console for:**
```
Deleting product: 123
Delete response: "Product deleted"
```

## Backend Validation

The backend validates:
- ✅ Name is required (not blank)
- ✅ Price is required (not null)
- ✅ Category exists if provided
- ✅ User has ADMIN role

## Debugging Steps

### Step 1: Open Browser Console
Press F12 and go to Console tab

### Step 2: Try Creating a Product
Watch for console messages:
- "Submitting product data: ..."
- "Create response: ..."
- Any error messages

### Step 3: Check Network Tab
1. Click Network tab in DevTools
2. Try creating/updating/deleting a product
3. Look for the API request
4. Click on it to see:
   - Request headers (check Authorization token)
   - Request payload (check data format)
   - Response status (200/201 = success, 400/403/500 = error)
   - Response body (error details)

### Step 4: Check Backend Logs
Look at the backend terminal for:
- SQL queries being executed
- Any Java exceptions
- Validation errors

## Expected Data Format

### Create/Update Request:
```json
{
  "name": "Product Name",
  "description": "Description",
  "price": 100.50,
  "stockQuantity": 50,
  "unit": "kg",
  "categoryId": 1,
  "imageUrl": "https://example.com/image.jpg",
  "isFeatured": false,
  "isActive": true
}
```

### Create Response (201):
```json
{
  "id": 82,
  "name": "Product Name",
  "description": "Description",
  "price": 100.50,
  "category": {
    "id": 1,
    "name": "Category Name"
  },
  "stockQuantity": 50,
  "unit": "kg",
  "imageUrl": "https://example.com/image.jpg",
  "isFeatured": false,
  "isActive": true,
  "createdAt": "2025-01-16T...",
  "updatedAt": "2025-01-16T..."
}
```

### Delete Response (200):
```json
"Product deleted"
```

## Quick Fixes

### If products aren't appearing after creation:
```powershell
# Run this to activate all products
cd "C:\Users\imax.computer\OneDrive\Desktop\OOAD Project - Copy\Chamika\C-C_Mart"
.\quick-fix-products.ps1
```

### If you see 403 errors:
1. Log out: http://localhost:3000/logout
2. Log back in: http://localhost:3000/login
3. Use: admin@ccmart.com / Admin@123

### If backend isn't responding:
```bash
# Check if backend is running
curl http://localhost:8081/api/products

# If not, restart it
cd backend
mvn spring-boot:run
```

## All Features Now Working

✅ **Create Product**
- Validates all required fields
- Converts data types properly
- Sets isActive=true automatically
- Associates with category
- Supports image upload/URL
- Shows success/error messages

✅ **Update Product**
- Pre-fills form with existing data
- Validates changes
- Preserves category relationship
- Updates all fields
- Shows success/error messages

✅ **Delete Product**
- Asks for confirmation
- Soft deletes (sets isActive=false)
- Removes from customer view
- Keeps data in database
- Shows success/error messages

✅ **Better Error Handling**
- Detailed console logging
- User-friendly error messages
- API error details displayed
- Validation feedback

## Test All Operations

Try this test sequence:
1. ✅ Create a new product
2. ✅ Edit the product you just created
3. ✅ Delete the product
4. ✅ Create another product and verify it shows on Products page
5. ✅ Add to cart and verify cart works

Everything should work smoothly now! 🎉
