// src/RegisterPage.js

import React, { useState } from 'react'; // useEffect ki zaroorat nahi hai ab
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import './Auth.css'; // Aapki CSS file
import api from '../api/axios'; // API client

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [otpMethod, setOtpMethod] = useState('email');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
        setErrors(prev => ({...prev, [name]: null}));
    }
  };

  const validateDetailsForm = () => {
    const newErrors = {};
    const { fullName, email, phone, password, confirmPassword } = formData;
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!email.trim()) newErrors.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email address is invalid';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(phone)) newErrors.phone = 'Phone number must be 10 digits';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- User Details Submit Handler ---
  // Ab ye sirf details submit karega aur OTP page par navigate karega
  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validateDetailsForm()) return;

    setLoading(true);
    try {
      const payload = {
        name: formData.fullName,
        email: formData.email,
        phone: `+91${formData.phone}`,
        password: formData.password,
        verificationMethod: otpMethod,
        role: 'client',
      };
      
      await api.post('/register', payload);
      
      // *** YAHAN PAR MAIN CHANGE HAI ***
      // Safal hone par, OTP page par navigate karo aur state pass karo
      navigate('/verify-otp', {
        state: {
          email: formData.email,
          verificationMethod: otpMethod
        }
      });

    } catch (error) {
      setApiError(error.response?.data?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // renderStepTwo, handleOtpSubmit, handleResendOtp, getMaskedIdentifier
  // ye sab functions yahan se hata diye gaye hain kyunki ye ab OtpVerificationPage me hain.

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-back">
          {/* Back button ab hamesha Home par jayega */}
          <Link to="/" className="btn-back"><FaArrowLeft /> Back to Home</Link>
        </div>
        
        {/* Ab yahan sirf registration form render hoga */}
        <>
          <div className="auth-header">
            <div className="auth-logo"><span>ServiceLink</span><span className="logo-tag">Pro</span></div>
            <h1>Create Your Account</h1>
            <p>Join us to connect with professionals.</p>
          </div>

          <form onSubmit={handleDetailsSubmit} className="auth-form" noValidate>
            {apiError && <div className="api-error">{apiError}</div>}
            <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <div className="input-with-icon">
                    <FaUser className="input-icon" />
                    <input type="text" id="fullName" name="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleChange} className={errors.fullName ? 'input-error' : ''}/>
                </div>
                {errors.fullName && <p className="error-message">{errors.fullName}</p>}
            </div>
            
            <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-with-icon">
                    <FaEnvelope className="input-icon" />
                    <input type="email" id="email" name="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} className={errors.email ? 'input-error' : ''}/>
                </div>
                {errors.email && <p className="error-message">{errors.email}</p>}
            </div>

            <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <div className="input-with-icon">
                    <FaPhone className="input-icon" />
                    <input type="tel" id="phone" name="phone" placeholder="9876543210" value={formData.phone} onChange={handleChange} className={errors.phone ? 'input-error' : ''}/>
                </div>
                {errors.phone && <p className="error-message">{errors.phone}</p>}
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-with-icon">
                    <FaLock className="input-icon" />
                    <input type="password" id="password" name="password" placeholder="Create a strong password" value={formData.password} onChange={handleChange} className={errors.password ? 'input-error' : ''}/>
                </div>
                {errors.password && <p className="error-message">{errors.password}</p>}
            </div>

            <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-with-icon">
                    <FaLock className="input-icon" />
                    <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Re-enter your password" value={formData.confirmPassword} onChange={handleChange} className={errors.confirmPassword ? 'input-error' : ''}/>
                </div>
                {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
            </div>

            <div className="form-group">
                <label>Verify using:</label>
                <div className="otp-choice-container">
                    <label className="radio-container"> Email
                        <input type="radio" name="otpMethod" value="email" checked={otpMethod === 'email'} onChange={(e) => setOtpMethod(e.target.value)} />
                        <span className="radio-checkmark"></span>
                    </label>
                    <label className="radio-container"> Phone (SMS)
                        <input type="radio" name="otpMethod" value="phone" checked={otpMethod === 'phone'} onChange={(e) => setOtpMethod(e.target.value)} />
                        <span className="radio-checkmark"></span>
                    </label>
                </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? <FaSpinner className="spinner" /> : 'Continue'}
            </button>
          </form>

          <div className="auth-footer"><p>Already have an account? <Link to="/login">Sign In</Link></p></div>
        </>

      </div>
      <div className="auth-image">
        <div className="image-overlay"></div>
        <div className="image-content">
          <h2>Find Opportunities, Get Hired</h2>
          <p>Create your professional profile and get discovered by top clients looking for your skills.</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;