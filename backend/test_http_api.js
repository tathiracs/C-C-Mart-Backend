const http = require('http');

function testAPI(endpoint, description) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8081,
      path: endpoint,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (res.statusCode === 200 && response.success) {
            console.log(`✅ ${description}: ${response.data?.length || response.count || 0} items`);
            resolve(response);
          } else {
            console.log(`❌ ${description}: Status ${res.statusCode}, ${response.message || 'Unknown error'}`);
            reject(new Error(`HTTP ${res.statusCode}: ${response.message}`));
          }
        } catch (error) {
          console.log(`❌ ${description}: Invalid JSON response`);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${description}: Connection failed - ${error.message}`);
      reject(error);
    });

    req.setTimeout(5000, () => {
      console.log(`❌ ${description}: Request timeout`);
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function testAllAPIs() {
  console.log('🔍 Testing HTTP API endpoints...\n');
  
  try {
    // Test health endpoint
    await testAPI('/health', 'Health Check');
    
    // Test categories API
    await testAPI('/api/categories', 'Categories API');
    
    // Test products API
    await testAPI('/api/products', 'Products API');
    
    // Test products with pagination
    await testAPI('/api/products?page=1&limit=5', 'Products API (Paginated)');
    
    console.log('\n🎉 All HTTP API endpoints working correctly!');
    
  } catch (error) {
    console.log(`\n❌ API test failed: ${error.message}`);
  }
  
  process.exit();
}

testAllAPIs();
