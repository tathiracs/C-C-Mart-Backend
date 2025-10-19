# Cart Badge Fix Guide

## Issue
The cart icon always shows "3" even when cart is empty.

## Root Cause
Old cart data is stored in browser's localStorage from previous sessions.

## Quick Fix

### Option 1: Clear from Browser Console
1. Open your browser (while on http://localhost:3000)
2. Press F12 to open Developer Tools
3. Go to "Console" tab
4. Type and press Enter:
   ```javascript
   localStorage.removeItem('cart')
   ```
5. Refresh the page
6. Cart badge should now show correct count

### Option 2: Clear All localStorage
In the browser console:
```javascript
localStorage.clear()
```
Then refresh the page. You'll need to login again.

### Option 3: Add Clear Cart Button (Temporary Debug)
Add this to your Header or Cart page temporarily:
```javascript
<Button onClick={() => {
  localStorage.removeItem('cart');
  window.location.reload();
}}>
  Clear Cart Data
</Button>
```

## Verification
After clearing:
1. Cart badge should show "0" (or no badge)
2. Add a product to cart
3. Badge should increment correctly
4. Remove product from cart
5. Badge should decrement correctly

## Prevention
The cart context already saves to localStorage correctly. The "3" is just leftover data from testing.

## Automated Fix
I'll add a button to the cart page to make clearing easier during development.
