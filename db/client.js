const registerUser = async (username, email, password) => {
    try {
      const response = await fetch('http://localhost:3005/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('User registered successfully:', data);
        return data;
      } else {
        console.error('Error registering user:', data.error);
        return null;
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };
  
  const loginUser = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3005/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token); // Store token in localStorage
        console.log('User logged in successfully:', data);
        return data.token;
      } else {
        console.error('Error logging in:', data.error);
        return null;
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };
  
  const addTask = async (description, priority) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found. Please login.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3005/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ description, priority }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Task added successfully:', data);
        return data;
      } else {
        console.error('Error adding task:', data.error);
        return null;
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };
  
  const getTasks = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found. Please login.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3005/tasks', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Tasks fetched successfully:', data);
        return data;
      } else {
        console.error('Error fetching tasks:', data.error);
        return null;
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };