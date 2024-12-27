import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginModal = ({ onClose, showSignupModal }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { setCurrentUser, setIsLoginModalOpen } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setCurrentUser(data.user); // Ensure 'user' contains username and other details
        setIsLoginModalOpen(false); // Close the login modal
        onClose(); // Close the modal
      } else {
        setError(data.message || 'An error occurred during login.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred during login.');
    }
  };

  return (
    <div className="modal fade show" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true" style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h5 className="modal-title" id="loginModalLabel">Log In</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <form id="loginForm" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-control"
                  placeholder="Enter Username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter Password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="text-center">
                <button type="submit" id="submitLoginBtn" className="btn btn-primary">Log In</button>
              </div>
            </form>
            <div className="text-center mt-3">
              <button
                type="button"
                className="btn btn-link text-decoration-none"
                onClick={showSignupModal}
                style={{ padding: 0, border: 'none', background: 'none', color: 'inherit' }}
              >
                Don`&apos;`t have an account? <strong>Sign up now!</strong>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
