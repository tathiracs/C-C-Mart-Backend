# Products Not Showing - Troubleshooting Guide

## Issue
Products are visible in Admin Dashboard but not showing on the Products page (http://localhost:3000/products)

## Possible Causes & Solutions

### 1. Backend Server Not Running
**Check:**
- Is the backend running on port 8081?
- Open a terminal and run:
```bash
curl http://localhost:8081/api/products
```

**Solution:**
```bash
cd backend
mvn spring-boot:run
```
or
```bash
cd backend
java -jar target/*.jar
```

### 2. Database Connection Issue
**Check:**
- Are products actually saved in the database?
- Check the backend terminal for any database errors

**Solution:**
- Verify database is running
- Check `backend/src/main/resources/application.properties`
- Verify connection settings

### 3. CORS Configuration Issue
**Check:**
- Browser Console (F12) for CORS errors
- Look for red error messages about "Access-Control-Allow-Origin"

**Solution:**
- Verify `backend/src/main/java/com/ccmart/backend/config/CorsConfig.java`
- Should allow http://localhost:3000

### 4. Products Have isActive = false
**Check:**
- In Admin Dashboard, are the products marked as active?
- The code filters out products where `isActive === false`

**Solution:**
- Make sure `isActive` is true or null (defaults to active)

### 5. Authentication Issue
**Check:**
- Are you logged in?
- Products endpoint should not require auth, but check console for 401 errors

**Solution:**
- Try logging out and back in
- Check if token is valid

## Debug Steps

### Step 1: Open Browser Console
1. Go to http://localhost:3000/products
2. Press **F12** to open DevTools
3. Click the **Console** tab
4. Look for these log messages:
   - "Fetching products from API..."
   - "API Response:"
   - "Product list:"
   - "Product count: X"
   - "Active products: X"

### Step 2: Check Network Tab
1. In DevTools, click the **Network** tab
2. Refresh the page
3. Look for a request to `http://localhost:8081/api/products`
4. Click on it to see:
   - **Status**: Should be 200 (green)
   - **Response**: Should show JSON array of products
   - If Status is red (404, 500, etc.), there's a backend issue

### Step 3: Check Backend Terminal
1. Look at the backend terminal window
2. Check for errors when the products API is called
3. Look for database connection errors

### Step 4: Verify Data in Database
If using H2 (in-memory):
- Go to http://localhost:8081/h2-console
- Login with credentials from application.properties
- Run query:
```sql
SELECT * FROM products;
```

## Common Console Errors & Fixes

### Error: "Failed to load products"
**Cause**: API call failed
**Fix**: 
1. Check if backend is running
2. Check network tab for details
3. Verify API URL in `frontend/src/services/api.js`

### Error: "Network Error" or "ERR_CONNECTION_REFUSED"
**Cause**: Backend not running or wrong port
**Fix**:
1. Start backend server
2. Verify it's on port 8081
3. Check `application.properties` for server.port

### Error: CORS policy blocked
**Cause**: CORS not configured properly
**Fix**:
1. Check CorsConfig.java allows localhost:3000
2. Restart backend after changes

### Products count is 0
**Cause**: 
- Products not in database
- Products have isActive = false
- Wrong database being queried

**Fix**:
1. Verify products exist in database
2. Check isActive field
3. Verify database connection settings

## What Changed in the Code

Added extensive logging to `Products.js`:
```javascript
console.log('Fetching products from API...');
console.log('API Response:', response);
console.log('Product count:', productList.length);
console.log('Active products:', activeProducts.length);
```

This will help identify exactly where the issue is.

## Quick Test

Run this in browser console on the Products page:
```javascript
fetch('http://localhost:8081/api/products')
  .then(r => r.json())
  .then(data => console.log('Products from backend:', data))
  .catch(err => console.error('Error:', err));
```

This directly calls the backend API and shows the response.

## Next Steps

1. ✅ Check browser console for log messages
2. ✅ Check Network tab for API call
3. ✅ Verify backend is running
4. ✅ Check backend terminal for errors
5. ✅ Verify products exist in database
6. ✅ Check if products have isActive set correctly

Once you see the console logs, we can identify the exact issue!
