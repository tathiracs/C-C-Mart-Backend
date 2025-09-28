// Server Status Checker and Auto-Restarter
// Run this script to check if the backend is running and restart if needed

const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

const SERVER_URL = 'http://localhost:8081';
const HEALTH_ENDPOINT = `${SERVER_URL}/health`;
const API_LOGIN_ENDPOINT = `${SERVER_URL}/api/auth/login`;

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bright: '\x1b[1m'
};

function log(message, color = colors.reset) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${color}[${timestamp}] ${message}${colors.reset}`);
}

// Check if server is responding
function checkServerHealth() {
  return new Promise((resolve) => {
    const req = http.get(HEALTH_ENDPOINT, (res) => {
      if (res.statusCode === 200) {
        resolve(true);
      } else {
        resolve(false);
      }
    });

    req.on('error', () => {
      resolve(false);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Test login endpoint specifically
function testLoginEndpoint() {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      email: 'admin@ccmart.lk',
      password: 'admin123'
    });

    const options = {
      hostname: 'localhost',
      port: 8081,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
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
          if (response.success) {
            resolve({ success: true, message: 'Login endpoint working' });
          } else if (response.message && response.message.includes('Too many requests')) {
            resolve({ success: false, message: 'Rate limited', rateLimited: true });
          } else {
            resolve({ success: false, message: response.message || 'Login failed' });
          }
        } catch (error) {
          resolve({ success: false, message: 'Invalid response from server' });
        }
      });
    });

    req.on('error', () => {
      resolve({ success: false, message: 'Connection failed' });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ success: false, message: 'Request timeout' });
    });

    req.write(postData);
    req.end();
  });
}

// Kill existing server processes
function killExistingServer() {
  return new Promise((resolve) => {
    const { exec } = require('child_process');
    
    // Find processes using port 8081
    exec('netstat -ano | findstr :8081', (error, stdout) => {
      if (error || !stdout) {
        resolve();
        return;
      }

      const lines = stdout.split('\n');
      const pids = new Set();
      
      lines.forEach(line => {
        const match = line.match(/LISTENING\s+(\d+)/);
        if (match) {
          pids.add(match[1]);
        }
      });

      if (pids.size === 0) {
        resolve();
        return;
      }

      let killed = 0;
      pids.forEach(pid => {
        exec(`taskkill /PID ${pid} /F`, (killError) => {
          killed++;
          if (killed === pids.size) {
            log(`Killed ${pids.size} existing server process(es)`, colors.yellow);
            // Wait a moment for ports to be released
            setTimeout(resolve, 2000);
          }
        });
      });
    });
  });
}

// Start the server
function startServer() {
  return new Promise((resolve, reject) => {
    log('Starting backend server...', colors.blue);
    
    const serverProcess = spawn('npm', ['start'], {
      cwd: __dirname,
      stdio: 'pipe',
      shell: true
    });

    let startupOutput = '';
    let serverStarted = false;

    serverProcess.stdout.on('data', (data) => {
      const output = data.toString();
      startupOutput += output;
      
      // Check for successful startup messages
      if (output.includes('C&C Mart API Server running on port 8081')) {
        if (!serverStarted) {
          serverStarted = true;
          log('✅ Backend server started successfully!', colors.green);
          resolve(serverProcess);
        }
      }
    });

    serverProcess.stderr.on('data', (data) => {
      const error = data.toString();
      if (error.includes('EADDRINUSE')) {
        log('❌ Port 8081 is already in use', colors.red);
        reject(new Error('Port already in use'));
      }
    });

    serverProcess.on('error', (error) => {
      log(`❌ Failed to start server: ${error.message}`, colors.red);
      reject(error);
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!serverStarted) {
        serverProcess.kill();
        reject(new Error('Server startup timeout'));
      }
    }, 30000);
  });
}

// Main diagnostic and repair function
async function diagnoseAndFix() {
  log('🔍 C&C Mart Backend Server Diagnostics', colors.bright + colors.blue);
  log('==========================================', colors.blue);

  // Step 1: Check if server is responding
  log('1. Checking server health...', colors.yellow);
  const isHealthy = await checkServerHealth();
  
  if (isHealthy) {
    log('✅ Server is responding to health checks', colors.green);
    
    // Step 2: Test login endpoint
    log('2. Testing login endpoint...', colors.yellow);
    const loginTest = await testLoginEndpoint();
    
    if (loginTest.success) {
      log('✅ Login endpoint is working perfectly!', colors.green);
      log('🎉 Your server is fully functional', colors.bright + colors.green);
      return;
    } else if (loginTest.rateLimited) {
      log('⚠️  Server is rate limited - too many requests', colors.yellow);
      log('💡 Solution: Wait 15 minutes or restart the server', colors.blue);
      
      const answer = await askUser('Do you want to restart the server to clear rate limits? (y/n): ');
      if (answer.toLowerCase() === 'y') {
        await killExistingServer();
        await startServer();
        log('✅ Server restarted! Rate limits cleared.', colors.green);
      }
      return;
    } else {
      log(`❌ Login endpoint issue: ${loginTest.message}`, colors.red);
    }
  } else {
    log('❌ Server is not responding', colors.red);
  }

  // Step 3: Restart the server
  log('3. Restarting the server...', colors.yellow);
  try {
    await killExistingServer();
    await startServer();
    
    // Wait a moment and test again
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const finalTest = await testLoginEndpoint();
    if (finalTest.success) {
      log('✅ Server restart successful! Login is now working.', colors.green);
    } else {
      log('❌ Server restart completed but login still has issues', colors.red);
      log(`Issue: ${finalTest.message}`, colors.red);
    }
  } catch (error) {
    log(`❌ Failed to restart server: ${error.message}`, colors.red);
  }
}

// Simple user input function
function askUser(question) {
  return new Promise((resolve) => {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Quick fix function - just restart everything
async function quickFix() {
  log('🚀 Quick Fix: Restarting backend server...', colors.bright + colors.yellow);
  try {
    await killExistingServer();
    await startServer();
    log('✅ Quick fix completed!', colors.green);
  } catch (error) {
    log(`❌ Quick fix failed: ${error.message}`, colors.red);
  }
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--quick') || args.includes('-q')) {
    quickFix();
  } else {
    diagnoseAndFix();
  }
}

module.exports = { checkServerHealth, testLoginEndpoint, quickFix, diagnoseAndFix };

