import React, { useState } from "react";
import axios from 'axios';
import "./Login.css"

function Register({ onFormSwitch }) {
  const [formData, setFormData] = useState({
    username: '',
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

    if (!formData.username.trim()) {
      validationErrors.username = "Username is required";
    }

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
      await axios.post('http://localhost:3005/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      onFormSwitch('login');
    } catch (error) {
      if (error.response && error.response.data.error) {
        setErrors({ form: error.response.data.error });
      } else {
        setErrors({ form: 'An error occurred' });
      }
    }
  };

  return (
    <div>
      <form className="form-container" onSubmit={handleSubmit}>
        <h4>Register</h4>
        {errors.form && <span>{errors.form}</span>}
        <label htmlFor="username"><b>Username</b></label>
        <input
          type="text"
          placeholder="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && <span>{errors.username}</span>}
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
          <button type="submit" className="btn">Register</button>
        <a href="#" className="logins-link" onClick={() => onFormSwitch('login')}>Already have an account? Login here.</a>
        </div>
        
      </form>
    </div>
  );
}

export default Register;