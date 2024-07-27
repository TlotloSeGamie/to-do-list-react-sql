import React, { useState, useEffect } from 'react';
import './App.css'
import Register from './components/Register';
import Login from './components/Login';
import ToDoApp from './components/ToDo';

function App() {
  const [currentForm, setCurrentForm] = useState('login');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const handleFormSwitch = (formName) => {
    setCurrentForm(formName);
  };

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCurrentForm('login');
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <div className="App">
      {!user ? (
        currentForm === 'login' ? (
          <Login onFormSwitch={handleFormSwitch} onLogin={handleLogin} />
        ) : (
          <Register onFormSwitch={handleFormSwitch} />
        )
      ) : (
        <ToDoApp user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;