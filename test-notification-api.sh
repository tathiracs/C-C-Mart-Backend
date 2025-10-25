#!/bin/bash

# Get the token from localStorage (you need to copy this from browser console first)
# In browser console, run: console.log(localStorage.getItem('token'))

echo "Testing Notifications API..."
echo ""

# Replace YOUR_TOKEN_HERE with actual token from localStorage
TOKEN="YOUR_TOKEN_HERE"

echo "1. Testing unread count:"
curl -X GET "http://localhost:8081/api/notifications/unread/count" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
echo ""
echo ""

echo "2. Testing get all notifications:"
curl -X GET "http://localhost:8081/api/notifications" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
echo ""
echo ""

echo "3. Testing get unread notifications:"
curl -X GET "http://localhost:8081/api/notifications/unread" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
echo ""
