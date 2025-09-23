// Simple test to check if the API is working
const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing API endpoints...');
    
    // Test health endpoint
    const healthResponse = await axios.get('http://localhost:8080/health');
    console.log('✅ Health check:', healthResponse.data);
    
    // Test categories endpoint
    const categoriesResponse = await axios.get('http://localhost:8080/api/categories');
    console.log('✅ Categories API:', categoriesResponse.data);
    
    // Test products endpoint
    const productsResponse = await axios.get('http://localhost:8080/api/products');
    console.log('✅ Products API:', productsResponse.data);
    
  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAPI();
