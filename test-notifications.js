// Test Notification API
// Open browser console and paste this to test

// Test 1: Get unread count
fetch('http://localhost:8081/api/notifications/unread/count', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(data => console.log('Unread count:', data))
.catch(err => console.error('Error getting count:', err));

// Test 2: Get all notifications
fetch('http://localhost:8081/api/notifications', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(data => console.log('All notifications:', data))
.catch(err => console.error('Error getting notifications:', err));
