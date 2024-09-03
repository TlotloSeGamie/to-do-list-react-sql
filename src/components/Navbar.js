import React from "react";
import "./Navbar.css"

function Navbar({ onFormSwitch }) {
  return (
    <div className="nav-top">
      <div className="logo">
        <h1>To Do Task Master</h1>
      </div>
      <div className="ama-links">
        <a href="#" onClick={() => onFormSwitch('login')} className="login-link">Login</a>
        <a href="#" onClick={() => onFormSwitch('register')} className="register-link">Register</a>
      </div>
    </div>
  );
}

export default Navbar;
