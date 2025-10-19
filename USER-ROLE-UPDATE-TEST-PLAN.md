# User Role Update - Test Plan

## Summary of Fix Applied

### Problem Identified
The admin panel was failing to save user data when the UPDATE button was clicked. The error was caused by a data format mismatch:

**Frontend (Form Data):**
- `role: 'ADMIN'` or `'CUSTOMER'` (UPPERCASE)
- `is_active: true` or `false` (snake_case)

**Backend (Expected):**
- `role: 'admin'` or `'customer'` (lowercase)
- `isActive: true` or `false` (camelCase)

### Solution Implemented
Added a data transformation layer in the `handleSubmit` function of `UserManagement.js`:

```javascript
const userData = {
  name: formData.name,
  email: formData.email,
  role: formData.role?.toLowerCase(), // Converts ADMIN → admin
  isActive: formData.is_active, // Converts is_active → isActive
};
await usersAPI.updateUser(editingUser.id, userData);
```

## Test Cases

### Test Case 1: Update User Role (Customer → Admin)
**Steps:**
1. Navigate to Admin Panel → User Management
2. Find a user with "Customer" role
3. Click the "Edit" icon (pencil) for that user
4. In the dialog, change Role dropdown from "Customer" to "Admin"
5. Click "UPDATE" button

**Expected Results:**
- ✅ Green toast message: "User updated successfully!"
- ✅ Dialog closes automatically
- ✅ User list refreshes
- ✅ User's role badge now shows "ADMIN" in red
- ✅ No errors in browser console

### Test Case 2: Update User Role (Admin → Customer)
**Steps:**
1. Find a user with "Admin" role
2. Click "Edit"
3. Change Role from "Admin" to "Customer"
4. Click "UPDATE"

**Expected Results:**
- ✅ Success toast appears
- ✅ User's role badge changes to "CUSTOMER" in blue
- ✅ User can still login but without admin privileges

### Test Case 3: Toggle User Status (Active → Inactive)
**Steps:**
1. Edit any active user
2. Change Status dropdown from "Active" to "Inactive"
3. Click "UPDATE"

**Expected Results:**
- ✅ Success toast appears
- ✅ User's status chip shows "INACTIVE" in red
- ✅ User cannot login when status is inactive

### Test Case 4: Toggle User Status (Inactive → Active)
**Steps:**
1. Edit an inactive user
2. Change Status from "Inactive" to "Active"
3. Click "UPDATE"

**Expected Results:**
- ✅ Success toast appears
- ✅ User's status chip shows "ACTIVE" in green
- ✅ User can now login successfully

### Test Case 5: Update User Name and Email
**Steps:**
1. Edit a user
2. Change the "Full Name" field
3. Keep role and status unchanged
4. Click "UPDATE"

**Expected Results:**
- ✅ Success toast appears
- ✅ Name updates in the user list
- ✅ Email field should be disabled (not editable after creation)

### Test Case 6: Error Handling - Duplicate Email
**Steps:**
1. Edit a user
2. Try to change email to one that already exists in the system
3. Click "UPDATE"

**Expected Results:**
- ❌ Error toast: "Email is already in use"
- ❌ Dialog stays open
- ❌ Changes not saved

### Test Case 7: Update Multiple Fields
**Steps:**
1. Edit a user
2. Change Name, Role, and Status all at once
3. Click "UPDATE"

**Expected Results:**
- ✅ All changes saved successfully
- ✅ User list reflects all changes

## Browser Console Checks

### Before Testing
Open browser DevTools (F12) and check:
1. **Console Tab:** No errors present
2. **Network Tab:** Keep open to monitor API calls

### During Testing
Monitor for:
- **API Request:** `PUT http://localhost:8081/api/users/{id}`
- **Request Payload:** Should show lowercase role and camelCase isActive
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "isActive": true
  }
  ```
- **Response Status:** `200 OK`
- **Response Body:** Updated user object

### Expected Network Flow
1. **Request Method:** PUT
2. **Request URL:** `/api/users/11` (or appropriate user ID)
3. **Request Headers:** 
   - `Authorization: Bearer {token}`
   - `Content-Type: application/json`
4. **Request Payload:**
   ```json
   {
     "name": "gee sara",
     "email": "chamicooln55@gmail.com",
     "role": "admin",
     "isActive": true
   }
   ```
5. **Response Status:** 200
6. **Response Body:**
   ```json
   {
     "id": 11,
     "name": "gee sara",
     "email": "chamicooln55@gmail.com",
     "phone": "1234567890",
     "address": "...",
     "role": "admin",
     "isActive": true,
     "password": null
   }
   ```

## Troubleshooting Guide

### Issue: "Failed to save user" Error
**Possible Causes:**
1. Backend server not running
2. Authentication token expired
3. User doesn't have admin role
4. Network connection issue

**Check:**
- Browser console for detailed error
- Network tab for request status code
- Backend terminal for server logs

### Issue: Changes Not Reflected
**Possible Causes:**
1. Cache issue
2. fetchUsers() not being called
3. State not updating

**Solution:**
- Hard refresh page (Ctrl+F5)
- Check browser console for JavaScript errors
- Verify fetchUsers() is called after successful update

### Issue: Backend Validation Error
**Possible Causes:**
1. Invalid role value (not 'admin' or 'customer')
2. Missing required fields
3. Data type mismatch

**Solution:**
- Check request payload in Network tab
- Verify data transformation is applied
- Ensure all required fields are present

## Verification Checklist

Before marking as complete, verify:
- [ ] User role can be changed from Customer to Admin
- [ ] User role can be changed from Admin to Customer
- [ ] User status can be toggled between Active and Inactive
- [ ] User name can be updated
- [ ] Email field is disabled (not editable)
- [ ] Success messages appear on successful update
- [ ] Error messages appear on validation failures
- [ ] User list refreshes after successful update
- [ ] Dialog closes after successful update
- [ ] No console errors during operations
- [ ] Network requests show correct data format
- [ ] Backend responds with 200 status code

## Backend Endpoint Details

**Endpoint:** `PUT /api/users/{id}`

**Authorization:** Admin only (JWT token required)

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string (optional)",
  "address": "string (optional)",
  "role": "admin" | "customer",
  "isActive": boolean
}
```

**Response (Success - 200):**
```json
{
  "id": number,
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "role": "string (lowercase)",
  "isActive": boolean,
  "password": null
}
```

**Response (Error - 400):**
```
"Invalid role. Must be 'admin' or 'customer'"
"Email is already in use"
```

**Response (Error - 401):**
```
"Unauthorized"
```

**Response (Error - 403):**
```
"Only admins can update users"
```

**Response (Error - 404):**
```
"User not found"
```

## Key Code Changes

### File: `frontend/src/pages/Admin/UserManagement.js`

**Function: `handleSubmit` (Lines 130-156)**

**Before:**
```javascript
await usersAPI.updateUser(editingUser.id, formData);
```

**After:**
```javascript
const userData = {
  name: formData.name,
  email: formData.email,
  role: formData.role?.toLowerCase(),
  isActive: formData.is_active,
};
await usersAPI.updateUser(editingUser.id, userData);
```

**Error Handling Enhanced:**
```javascript
catch (error) {
  console.error('Error saving user:', error);
  const errorMessage = error.response?.data || 'Failed to save user';
  toast.error(errorMessage);
}
```

## Next Steps After Testing

Once all tests pass:
1. ✅ Mark user role update feature as complete
2. ✅ Test user deletion functionality
3. ✅ Test order placement workflow (customer perspective)
4. ✅ Test order management workflow (admin perspective)
5. ✅ Perform full end-to-end system test

## Notes

- The fix was applied without restarting the backend server
- Frontend will need to be refreshed to load the updated JavaScript
- The data transformation is applied client-side before sending to API
- Backend validation ensures only 'admin' or 'customer' roles are accepted
- Backend automatically converts role to lowercase for consistency
