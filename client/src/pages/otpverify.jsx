// src/OtpVerificationPage.js (CORRECTED FOR 5-DIGIT OTP)

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';
import './Auth.css';
import api from '../api/axios';

const OtpVerificationPage = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [countdown, setCountdown] = useState(30);

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const verificationMethod = location.state?.verificationMethod;

  useEffect(() => {
    if (!email) {
      console.error("Email not found in location state. Redirecting to register.");
      navigate('/register');
    }
  }, [email, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    // CHANGE #1: Validation ko 5-digit ke liye update kiya
    if (!otp || otp.length < 5) {
      setApiError('Please enter a valid 5-digit OTP.');
      return;
    }
    setApiError('');
    setLoading(true);

    try {
      const payload = { email: email, otp: otp };
      await api.post('/verify', payload);

      console.log('OTP Verified Successfully!');
      navigate('/dashboard');

    } catch (error) {
      setApiError(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || loading) return;
    
    setLoading(true);
    setApiError('');

    try {
        const payload = { email: email, verificationMethod: verificationMethod };
        await api.post('/resend-otp', payload);
        console.log(`Resending OTP to ${email}`);
        setCountdown(30);
    } catch(error) {
        setApiError(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  const getMaskedIdentifier = () => {
    if (!email) return 'your contact';
    const [name, domain] = email.split('@');
    return `${name.slice(0, 2)}***@${domain}`;
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-wrapper">
          
          <div className="auth-back">
            <Link to="/register" className="btn-back">
              <FaArrowLeft /> Back to Registration
            </Link>
          </div>

          <div className="auth-header">
            <div className="auth-logo"><span>ServiceLink</span><span className="logo-tag">Pro</span></div>
            <h1>Verify Your Account</h1>
            {/* CHANGE #2: UI text ko 5-digit ke liye update kiya */}
            <p>A 5-digit code has been sent to <strong>{getMaskedIdentifier()}</strong>.</p>
          </div>

          <form onSubmit={handleOtpSubmit} className="auth-form" noValidate>
            {apiError && <div className="api-error">{apiError}</div>}
            
            <div className="form-group">
              {/* CHANGE #3: Label ko 5-digit ke liye update kiya */}
              <label htmlFor="otp">Enter 5-Digit OTP</label>
              <input 
                type="tel"
                inputMode="numeric"
                id="otp"
                className={`otp-input ${apiError ? 'input-error' : ''}`}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                // CHANGE #4: maxLength ko 5 kiya
                maxLength="5"
                autoComplete="one-time-code"
                autoFocus
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <FaSpinner className="spinner" /> : 'Verify Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Didn't receive the code?{' '}
              <button onClick={handleResendOtp} disabled={countdown > 0 || loading} className="resend-btn">
                {loading && 'Sending...' }
                {!loading && countdown > 0 && `Resend in ${countdown}s`}
                {!loading && countdown === 0 && 'Resend Code'}
              </button>
            </p>
          </div>
        </div>
      </div>
      
      <div className="auth-image">
        <div className="image-overlay"></div>
        <div className="image-content">
          <h2>One Final Step</h2>
          <p>Secure your account by verifying your contact information. You're almost there!</p>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationPage;