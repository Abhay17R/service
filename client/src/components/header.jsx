// src/components/Header.jsx (UPDATED)

import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
// ==> STEP 1: Naye icons import kiye gaye hain
import { FaTh, FaCalendarCheck, FaSignOutAlt, FaComments, FaUserCircle } from 'react-icons/fa';
import './header.css';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const navigate = useNavigate();
   const { user, logout } = useAuth();  

  // TODO: Isko aapki real logout API call se replace karein
  const handleLogout = () => {
    // This will now call the logout function defined in AuthContext.jsx
    logout(); 
  };


  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/" className="logo">
          ServiceLink<span>Pro</span>
        </Link>
        <nav className="main-nav">
          <NavLink to="/dashboard" className="nav-link">
            <FaTh /> Profiles
          </NavLink>
          <NavLink to="/my-appointments" className="nav-link">
            <FaCalendarCheck /> My Appointments
          </NavLink>
          
          {/* ==> STEP 2: Naye links add kiye gaye hain ==> */}
          <NavLink to="/chat" className="nav-link">
            <FaComments /> Chat
          </NavLink>
          <NavLink to="/profile" className="nav-link">
            <FaUserCircle /> My Profile
          </NavLink>
          {/* <== Naye links yahan khatm hote hain <== */}

        </nav>
        <div className="header-actions">
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;