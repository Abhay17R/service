// src/LoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaLock, FaEnvelope, FaGoogle, FaFacebook, FaTwitter, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import './Auth.css'; // <-- CSS file ko yahan import karein

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  // Form validation function
  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(''); // Clear previous API errors

    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    setLoading(true);

    // Simulate API call
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Mock success/error
          if (email === "admin@test.com" && password === "password123") {
            console.log('Login successful with:', { email, password, rememberMe });
            resolve();
          } else {
            reject(new Error('Invalid email or password.'));
          }
        }, 2000); // 2-second delay
      });
      
      // After successful login, redirect to dashboard
      navigate('/dashboard');

    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-back">
          <Link to="/" className="btn-back">
            <FaArrowLeft /> Back to Home
          </Link>
        </div>
        
        <div className="auth-header">
          <div className="auth-logo">
            <span>ServiceLink</span>
            <span className="logo-tag">Pro</span>
          </div>
          <h1>Welcome Back!</h1>
          <p>Sign in to access your professional dashboard.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {apiError && <div className="api-error">{apiError}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                id="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? 'input-error' : ''}
              />
            </div>
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
          
          <div className="form-group">
            <div className="label-container">
              <label htmlFor="password">Password</label>
              <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
            </div>
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? 'input-error' : ''}
              />
            </div>
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>
          
          <div className="form-options">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="checkmark"></span>
              Remember me
            </label>
          </div>
          
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? <FaSpinner className="spinner" /> : 'Sign In'}
          </button>
        </form>
        
        <div className="auth-divider">
          <span>or continue with</span>
        </div>
        
        <div className="social-login">
          <button className="social-btn google"><FaGoogle /> Google</button>
          <button className="social-btn facebook"><FaFacebook /> Facebook</button>
          <button className="social-btn twitter"><FaTwitter /> Twitter</button>
        </div>
        
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Create one now</Link></p>
        </div>
      </div>
      
      <div className="auth-image">
        <div className="image-overlay"></div>
        <div className="image-content">
          <h2>Connect with Top Professionals</h2>
          <p>Join thousands of satisfied users who found the perfect service provider through ServiceLink Pro.</p>
          <div className="testimonial">
            <div className="testimonial-content">
              "ServiceLink saved me hours of searching and helped me find an amazing web developer for my business. Highly recommended!"
            </div>
            <div className="testimonial-author">
              <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Author Avatar" className="author-avatar" />
              <div className="author-info">
                <strong>Sarah Johnson</strong>
                <span>Business Owner</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;