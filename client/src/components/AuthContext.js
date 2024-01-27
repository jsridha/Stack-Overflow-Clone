// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userID, setUserID] = useState(null);

    // useEffect hook to grab session state from server on page refresh
    useEffect(() => {
        const fetchSessionInfo = async () => {
            try {
                // Fetch session info from the server endpoint /sessionInfo
                const response = await axios.get('http://localhost:8000/sessionInfo');
                const data = await response.data;

                // Set isLoggedIn and userID based on the fetched data
                if (data.isLoggedIn && data.userID) {
                    setIsLoggedIn(true);
                    setUserID(data.userID);
                }
            } catch (error) {
                console.error('Error fetching session info:', error);
            }
        };

        fetchSessionInfo();
    }, []);

    const login = (userID) => {
        setIsLoggedIn(true);
        setUserID(userID);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUserID(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userID, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Add prop validation for AuthProvider
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired, // Ensure that 'children' is a valid React node
};

export const useAuth = () => useContext(AuthContext);
