// Debug authentication flow
console.log('🔍 DEBUG: Testing authentication flow');

// Check current user data
const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
console.log('📱 Current user in localStorage:', currentUser);

// Check token
const token = localStorage.getItem('token');
console.log('🔑 Token exists:', !!token);

// Check if user role is correct
if (currentUser) {
  console.log('👤 User role:', currentUser.role);
  console.log('👤 Is admin:', currentUser.role === 'admin');
  console.log('👤 Is agent:', currentUser.role === 'agent');
}

// Test API call
fetch('http://localhost:8000/api/profile/', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  console.log('🌐 Profile API response:', data);
})
.catch(error => {
  console.error('❌ Profile API error:', error);
});

// Test login API
fetch('http://localhost:8000/api/login/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@gmail.com',
    password: 'admin123'
  })
})
.then(response => response.json())
.then(data => {
  console.log('🔑 Login API response:', data);
})
.catch(error => {
  console.error('❌ Login API error:', error);
});
