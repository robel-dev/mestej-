const url = 'https://oyadmezhfodmozpacsgq.supabase.co/auth/v1/token?grant_type=password';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95YWRtZXpoZm9kbW96cGFjc2dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwOTE2NzgsImV4cCI6MjA3NzY2NzY3OH0.-Lx4aRWyA-T3pVhYMQ6WaDNppq-pB2BUHBaE_mjEY-M';

fetch(url, {
  method: 'POST',
  headers: {
    'apikey': key,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'robelamare20@gmail.com',
    password: 'password123'
  })
})
.then(res => res.json())
.then(data => console.log('Response:', JSON.stringify(data, null, 2)))
.catch(err => console.error('Error:', err));
