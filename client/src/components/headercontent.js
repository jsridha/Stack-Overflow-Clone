import React from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function HeaderContent() {

  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:8000/logout');
      console.log('Logout successful:', response.data);
      logout();
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error.response.data);
    }
  };

  return (
    <div className="header-content">
      <h1>
        Fake Stack Overflow
      </h1>
      
      {isLoggedIn && (
        <div id="logoutBtn">
        <button onClick={handleLogout}>
          Logout
        </button>
        </div>
      )}

      <div className="search">
        <input type="text" id="searchBar" placeholder="Search..." />
      </div>
    </div>
  );
}

export default HeaderContent;
