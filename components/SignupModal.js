import React, { useState } from 'react';
import { toast } from 'react-toastify';

const SignupModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const signupData = {
      username: formData.username,
      email: formData.email,
      password: formData.password
    };

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      if (response.ok) {
        toast.success('Sign up successful!');
        onClose();
      } else {
        const errorData = await response.json();
        toast.error(`Sign up failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error during sign up:', error);
      toast.error('An error occurred during sign up.');
    }
  };

  return (
    <div className="modal fade show" id="signup-modal" tabIndex="-1" aria-labelledby="signup-modal-label" aria-hidden="true" style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="signup-modal-label">Sign Up</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form id="signup-form" onSubmit={handleSubmit}>
              <label htmlFor="signup-username">Username</label>
              <input type="text" id="signup-username" name="username" required className="form-control" value={formData.username} onChange={handleChange} />
              <label htmlFor="signup-email">Email</label>
              <input type="email" id="signup-email" name="email" required className="form-control" value={formData.email} onChange={handleChange} />
              <label htmlFor="signup-password">Password</label>
              <input type="password" id="signup-password" name="password" required className="form-control" value={formData.password} onChange={handleChange} />
              <button type="submit" id="signup-submit" className="btn btn-primary mt-2">Sign Up</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;