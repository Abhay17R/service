// src/OtpVerificationPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';
import './Auth.css'; // Wahi CSS file use karein jo aapne di thi

const OtpVerificationPage = () => {
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [countdown, setCountdown] = useState(30); // 30 second ka timer

  const navigate = useNavigate();
  const location = useLocation();

  // Pichle page se email ya phone number haasil karein
  // Agar data nahi milta to ek default message dikhayein
 const identifier = location.state?.identifier || '';


  // Countdown timer ke liye
  useEffect(() => {
    const timer = setTimeout(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // OTP Verification Submit Handler
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    // 5-digit OTP ke liye validation
    if (!otp || !/^\d{5}$/.test(otp)) {
      setErrors({ otp: 'Please enter a valid 5-digit OTP.' });
      return;
    }
    setErrors({});
    setApiError('');
    setLoading(true);

    // API call simulate karein (Asli API se replace karein)
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (otp === '12345') { // Maan lijiye sahi OTP '12345' hai
            resolve({ success: true });
          } else {
            reject(new Error('Invalid OTP. Please try again.'));
          }
        }, 1500);
      });
      // Safal hone par dashboard par bhejein
      console.log('OTP Verified Successfully!');
      navigate('/dashboard');
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // OTP Resend Handler
  const handleResendOtp = () => {
    if (countdown > 0) return;
    console.log(`Resending OTP to ${identifier}`);
    setCountdown(30); // Timer ko reset karein
    setApiError('');
    setErrors({});
    // Yahan par OTP resend karne ka API call hoga
  };

  // Email/Phone ko mask karne ke liye function
  const getMaskedIdentifier = () => {
    if (identifier.includes('@')) {
      const [name, domain] = identifier.split('@');
      return `${name.slice(0, 2)}***@${domain}`;
    } else {
      // Assuming it's a 10-digit phone number
      return `******${identifier.slice(6)}`;
    }
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
            <div className="auth-logo">
              <span>ServiceLink</span><span className="logo-tag">Pro</span>
            </div>
            <h1>Verify Your Account</h1>
            <p>A 5-digit code has been sent to <strong>{getMaskedIdentifier()}</strong>.</p>
          </div>

          <form onSubmit={handleOtpSubmit} className="auth-form" noValidate>
            {apiError && <div className="api-error">{apiError}</div>}
            
            <div className="form-group">
              <label htmlFor="otp">Enter 5-Digit OTP</label>
              <input 
                type="tel"
                inputMode="numeric"
                id="otp"
                className={`otp-input ${errors.otp ? 'input-error' : ''}`}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength="5"
                autoComplete="one-time-code"
                autoFocus
              />
              {errors.otp && <p className="error-message">{errors.otp}</p>}
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <FaSpinner className="spinner" /> : 'Verify Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Didn't receive the code?{' '}
              <button onClick={handleResendOtp} disabled={countdown > 0} className="resend-btn">
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
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