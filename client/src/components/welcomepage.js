import React from 'react';
import { Link } from 'react-router-dom';
import '../stylesheets/welcomepage.css';

const WelcomePage = () => {
  return (
    <div className="welcome-container">
      <h1>Welcome to Fake Stack Overflow!</h1>
      <div className="button-container">
        <Link to="/login">
          <button>
            Login
          </button>
        </Link>
      </div>
      <div className="button-container">
        <Link to="/register">
          <button>
            Register
          </button>
        </Link>
      </div>
      <div className="button-container">
        <Link to="/home">
          <button>
            Continue as a guest
          </button>
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;
