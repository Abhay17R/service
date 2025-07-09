// src/OtpVerificationPage.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';
import './Auth.css'; // Aapki CSS file
import api from '../api/axios'; // API client import karein

const OtpVerificationPage = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [countdown, setCountdown] = useState(30);

  const navigate = useNavigate();
  const location = useLocation();

  // Register page se email aur verification method haasil karein
  const email = location.state?.email;
  const verificationMethod = location.state?.verificationMethod; // 'email' ya 'phone'

  // Agar pichle page se email nahi mila, to user ko wapas bhej do
  useEffect(() => {
    if (!email) {
      console.error("Email not found in location state. Redirecting to register.");
      navigate('/register');
    }
  }, [email, navigate]);


  // Countdown timer ke liye
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // --- API CALL: OTP VERIFY KARNE KE LIYE ---
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) { // 4-digit OTP ke liye validation
      setApiError('Please enter a valid 4-digit OTP.');
      return;
    }
    setApiError('');
    setLoading(true);

    try {
      const payload = {
        email: email, // Backend ko email chahiye
        otp: otp,
      };
      
      // Aapka route /verify hai, isliye /verify use karein
      await api.post('/verify', payload);

      console.log('OTP Verified Successfully!');
      navigate('/dashboard'); // Safal hone par dashboard par bhejein

    } catch (error) {
      setApiError(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- API CALL: OTP RESEND KARNE KE LIYE ---
  const handleResendOtp = async () => {
    if (countdown > 0 || loading) return;
    
    setLoading(true);
    setApiError('');

    try {
        // Sirf OTP resend karne ke liye ek alag/sada endpoint behtar hai
        // Hum yahan register endpoint ko dobara call kar sakte hain
        // NOTE: Iske liye Register page se saara data pass karna padega, jo theek nahi hai
        // Best approach: Ek naya '/resend-otp' endpoint banayein (niche bataya hai)

        const payload = {
            email: email,
            verificationMethod: verificationMethod,
        };

        // Yahan ek naya endpoint '/resend-otp' call karenge
        await api.post('/resend-otp', payload);

        console.log(`Resending OTP to ${email}`);
        setCountdown(30); // Timer ko reset karein

    } catch(error) {
        setApiError(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  // Email/Phone ko chhipane ke liye function
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
            <p>A 4-digit code has been sent to <strong>{getMaskedIdentifier()}</strong>.</p>
          </div>

          <form onSubmit={handleOtpSubmit} className="auth-form" noValidate>
            {apiError && <div className="api-error">{apiError}</div>}
            
            <div className="form-group">
              <label htmlFor="otp">Enter 4-Digit OTP</label>
              <input 
                type="tel"
                inputMode="numeric"
                id="otp"
                className={`otp-input ${apiError ? 'input-error' : ''}`}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength="4"
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