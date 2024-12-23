import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (token && user && user !== 'undefined') {
        try {
          const parsedUser = JSON.parse(user);
          setCurrentUser(parsedUser);
          console.log('User loaded from localStorage:', parsedUser);
        } catch (error) {
          console.error('Error parsing user from localStorage:', error);
          localStorage.removeItem('user');
          setCurrentUser(null);
        }
      } else {
        console.log('No valid token or user found, showing login modal');
        setIsLoginModalOpen(true);
      }
    };

    initializeAuth();
  }, []);

  const login = async (token) => {
    localStorage.setItem('token', token);
    try {
      const response = await axios.get('/api/check-login', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.loggedIn) {
        const userData = response.data.user;
        setCurrentUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('User logged in:', userData);
        setIsLoginModalOpen(false);
      } else {
        localStorage.removeItem('token');
        setIsLoginModalOpen(true);
      }
    } catch (error) {
      console.error('Error during login:', error);
      localStorage.removeItem('token');
      setIsLoginModalOpen(true);
    }
  };

  const logout = async () => {
    try {
      const response = await axios.post('/api/logout');
      if (response.data.message === 'Logout successful') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setCurrentUser(null);
        alert('Logged out successfully.');
        setIsLoginModalOpen(true);
      } else {
        alert('Error during logout.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Error during logout: ' + error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, login, logout, isLoginModalOpen, setIsLoginModalOpen }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);