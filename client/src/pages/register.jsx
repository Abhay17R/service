    // src/RegisterPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import './Auth.css'; // Wahi CSS file use karein

const RegisterPage = () => {
  const [step, setStep] = useState(1); // 1 for details, 2 for OTP
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [otp, setOtp] = useState('');
  const [otpMethod, setOtpMethod] = useState('email'); // 'email' or 'phone'
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);


  // --- Step 1: User Details Validation and Submission ---
  const validateDetailsForm = () => {
    const newErrors = {};
    const { fullName, email, phone, password, confirmPassword } = formData;
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!email.trim()) {
        newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Email address is invalid';
    }
    if (!phone.trim()) {
        newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phone)) {
        newErrors.phone = 'Phone number must be 10 digits';
    }
    if (!password) {
        newErrors.password = 'Password is required';
    } else if (password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
    }
    if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validateDetailsForm()) return;

    setLoading(true);
    // Simulate API call to check if user exists and send OTP
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);

    // On success, move to OTP step
    setStep(2);
    setCountdown(30); // Start 30-second timer
    console.log('OTP sent to:', otpMethod);
  };
  

  // --- Step 2: OTP Validation and Final Registration ---
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
        setErrors({ otp: 'Please enter a valid 4-digit OTP.' });
        return;
    }
    setErrors({});
    setLoading(true);
    setApiError('');

    // Simulate OTP verification
    try {
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                if (otp === '1234') { // Mock correct OTP
                    resolve();
                } else {
                    reject(new Error('Invalid OTP. Please try again.'));
                }
            }, 1500);
        });
        // On successful registration
        navigate('/dashboard');
    } catch (error) {
        setApiError(error.message);
    } finally {
        setLoading(false);
    }
  };
  
  const handleResendOtp = () => {
      if (countdown > 0) return;
      console.log('Resending OTP to:', otpMethod);
      setCountdown(30); // Restart timer
      setApiError(''); // Clear previous errors
      setErrors({});
  };

  // Function to mask email/phone for display
  const getMaskedIdentifier = () => {
    if (otpMethod === 'email') {
      const [name, domain] = formData.email.split('@');
      return `${name.slice(0, 2)}****@${domain}`;
    } else {
      return `+91 ******${formData.phone.slice(6)}`;
    }
  };


  const renderStepOne = () => (
    <>
      <div className="auth-header">
        <div className="auth-logo">
          <span>ServiceLink</span><span className="logo-tag">Pro</span>
        </div>
        <h1>Create Your Account</h1>
        <p>Join us to connect with professionals.</p>
      </div>

      <form onSubmit={handleDetailsSubmit} className="auth-form" noValidate>
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
                <label className="radio-container">
                    Email
                    <input type="radio" name="otpMethod" value="email" checked={otpMethod === 'email'} onChange={(e) => setOtpMethod(e.target.value)} />
                    <span className="radio-checkmark"></span>
                </label>
                <label className="radio-container">
                    Phone (SMS)
                    <input type="radio" name="otpMethod" value="phone" checked={otpMethod === 'phone'} onChange={(e) => setOtpMethod(e.target.value)} />
                    <span className="radio-checkmark"></span>
                </label>
            </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? <FaSpinner className="spinner" /> : 'Continue'}
        </button>
      </form>

      <div className="auth-footer">
        <p>Already have an account? <Link to="/login">Sign In</Link></p>
      </div>
    </>
  );

  const renderStepTwo = () => (
      <>
        <div className="auth-header">
            <div className="auth-logo">
                <span>ServiceLink</span><span className="logo-tag">Pro</span>
            </div>
            <h1>Verify Your Account</h1>
            <p>An OTP has been sent to <strong>{getMaskedIdentifier()}</strong>.</p>
        </div>

        <form onSubmit={handleOtpSubmit} className="auth-form" noValidate>
            {apiError && <div className="api-error">{apiError}</div>}
            <div className="form-group">
                <label htmlFor="otp">Enter 4-Digit OTP</label>
                <input 
                    type="text" 
                    id="otp" 
                    className={`otp-input ${errors.otp ? 'input-error' : ''}`}
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    maxLength="4"
                />
                 {errors.otp && <p className="error-message">{errors.otp}</p>}
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? <FaSpinner className="spinner" /> : 'Verify Account'}
            </button>
        </form>

        <div className="auth-footer">
            <p>
                Didn't receive the code?{' '}
                <button onClick={handleResendOtp} disabled={countdown > 0} className="resend-btn">
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                </button>
            </p>
        </div>
      </>
  );

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-back">
          {step === 1 ? (
            <Link to="/" className="btn-back">
              <FaArrowLeft /> Back to Home
            </Link>
          ) : (
            <button onClick={() => setStep(1)} className="btn-back" style={{background: 'none', border: 'none', cursor: 'pointer', padding: 0}}>
              <FaArrowLeft /> Back to Details
            </button>
          )}
        </div>
        
        {step === 1 ? renderStepOne() : renderStepTwo()}
      </div>
      
      <div className="auth-image">
        {/* Same image section as LoginPage */}
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