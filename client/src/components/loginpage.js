import React, { useState } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;
import '../stylesheets/loginpage.css';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const { isLoggedIn, login } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/login', {
        username: formData.username,
        password: formData.password
      });

      login(response.data.userID);
      setFormData({
        username: '',
        password: ''
      });
      setError('');
      navigate('/home');
    } catch (error) {
      console.error('Error during login:', error.response.data);
      setError(error.response.data.error || 'Login failed. Please try again.');
    }
  };

  if (!isLoggedIn) {
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        {/* Input fields for username and password */}
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
  }
};

export default LoginPage;
