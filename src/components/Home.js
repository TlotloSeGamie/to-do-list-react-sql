import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import ToDoApp from "./ToDo";

function Home() {
  const [currentForm, setCurrentForm] = useState('login');
  const [user, setUser] = useState(null);

  const handleLogin = (user) => {
    setUser(user);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentForm('login');
  };

  return (
    <div className="home-container">
      <div className="navbar">
        <h1>To Do Task Master</h1>
        {user && <button className="btn" onClick={handleLogout}>Logout</button>}
      </div>
      {!user ? (
        currentForm === 'login' ? (
          <Login onFormSwitch={setCurrentForm} onLogin={handleLogin} />
        ) : (
          <Register onFormSwitch={setCurrentForm} />
        )
      ) : (
        <div className="home-content">
          <ToDoApp user={user} />
        </div>
      )}
    </div>
  );
}

export default Home;