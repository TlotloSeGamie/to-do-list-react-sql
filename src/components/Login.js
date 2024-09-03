import React, { useState } from "react";
import axios from 'axios';
import "./Login.css"

function Login({ onFormSwitch, onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!formData.email.trim()) {
      validationErrors.email = "Email is required";
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

    try {
      const response = await axios.post('http://localhost:3001/login', {
        email: formData.email,
        password: formData.password
      });

      onLogin(response.data.user);
    } catch (error) {
      setErrors({ form: 'Invalid email or password' });
    }
  };

  return (
    <div>
      <form className="form-container" onSubmit={handleSubmit}>
        <h4>Sign In</h4>
        {errors.form && <span>{errors.form}</span>}
        <label htmlFor="email"><b>Email</b></label>
        <input
          type="text"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span>{errors.email}</span>}
        <label htmlFor="password"><b>Password</b></label>
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <span>{errors.password}</span>}
        <div className="logs">
        <button type="submit" className="btn">Login</button>
        <a href="#" className="registers-link" onClick={() => onFormSwitch('register')}>Don't have an account? Register here.</a>
        </div>
      </form>
    </div>
  );
}

export default Login;