import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import ToDoApp from "./ToDo";

function Home() {
  const [currentForm, setCurrentForm] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentForm('login');
  };

  return (
    <div className="home-container">
        <div className="navbar">
            <h1>To Do Task Master</h1>
        {isLoggedIn && <button className="btn" onClick={handleLogout}>Logout</button>}
      </div>
      {!isLoggedIn ? (
        currentForm === 'login' ? (
          <Login onFormSwitch={setCurrentForm} onLogin={handleLogin} />
        ) : (
          <Register onFormSwitch={setCurrentForm} />
        )
      ) : (<div className="home-content">
                <ToDoApp />
            </div>
      )}
    </div>
            

  );
}

export default Home;