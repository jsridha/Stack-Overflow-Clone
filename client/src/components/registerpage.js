import React, { useState } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;
import '../stylesheets/registerpage.css';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    repeatPassword: ''
  });

  const [error, setError] = useState('');
  const [registered, setRegistered] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.repeatPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        repeatPassword: formData.repeatPassword
      });

      console.log('User registered successfully:', response.data);
      setRegistered(true);
      setError(''); // Reset error state upon successful registration
    } catch (error) {
      console.error('Error registering user:', error.response.data);
      setError(error.response.data.error);
    }
  };

  if (registered) {
    navigate('/login');
  }

  return (
    <div className="register-container"> {/* Add class name for styling */}
      <h2>Register User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange} // Attach handleChange here
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange} // Attach handleChange here
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange} // Attach handleChange here
            required
          />
        </div>
        <div>
          <label>Repeat Password:</label>
          <input
            type="password"
            name="repeatPassword"
            value={formData.repeatPassword}
            onChange={handleChange}
            required
          />
        </div>
        {/* Other form fields */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
