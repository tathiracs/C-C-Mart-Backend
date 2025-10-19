// TEST: Copy and paste this into your browser console (F12) on the admin page

async function testOrdersAPI() {
  console.log('='.repeat(50));
  console.log('🧪 TESTING ORDERS API');
  console.log('='.repeat(50));
  
  const token = localStorage.getItem('token');
  console.log('1️⃣ Token exists:', !!token);
  
  try {
    // Test 1: Call /api/orders (should return only user's orders)
    console.log('\n📋 TEST 1: GET /api/orders (user\'s orders only)');
    const response1 = await fetch('http://localhost:8081/api/orders', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data1 = await response1.json();
    console.log('Status:', response1.status);
    console.log('Number of orders:', data1.length);
    console.log('Orders:', data1);
    
    // Test 2: Call /api/orders/all (should return ALL orders - admin only)
    console.log('\n📋 TEST 2: GET /api/orders/all (ALL orders - admin only)');
    const response2 = await fetch('http://localhost:8081/api/orders/all', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data2 = await response2.json();
    console.log('Status:', response2.status);
    console.log('Number of orders:', Array.isArray(data2) ? data2.length : 'NOT AN ARRAY');
    console.log('Orders:', data2);
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ SUMMARY:');
    console.log('/api/orders returned:', data1.length, 'orders');
    console.log('/api/orders/all returned:', Array.isArray(data2) ? data2.length : 'ERROR', 'orders');
    console.log('='.repeat(50));
    
    return { userOrders: data1, allOrders: data2 };
  } catch (error) {
    console.error('❌ ERROR:', error);
  }
}

// Run the test
testOrdersAPI();
