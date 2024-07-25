import React, { useState } from "react";

function Login({ onFormSwitch, onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!formData.username.trim()) {
      validationErrors.username = "Username is required";
    }

    if (!formData.password.trim()) {
      validationErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      validationErrors.password = "Password should be at least 8 characters";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onLogin(); 
  };

  return (
    <div>
      <form className="form-container" onSubmit={handleSubmit}>
        <h4>Sign In</h4>
        <label htmlFor="username"><b>Username</b></label>
        <input
          type="text"
          placeholder="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && <span>{errors.username}</span>}
        <label htmlFor="password"><b>Password</b></label>
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <span>{errors.password}</span>}
        <button type="submit" className="btn">Log In</button>
        <button type="button" onClick={() => onFormSwitch('register')} className="btn">Don't have an account? Register</button>
      </form>
    </div>
  );
}

export default Login;