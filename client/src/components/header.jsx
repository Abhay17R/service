// src/components/Header.jsx (UPDATED)

import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
// ==> STEP 1: Naye icons import kiye gaye hain
import { FaTh, FaCalendarCheck, FaSignOutAlt, FaComments, FaUserCircle } from 'react-icons/fa';
import './header.css';

const Header = () => {
  const navigate = useNavigate();

  // TODO: Isko aapki real logout API call se replace karein
  const handleLogout = () => {
    console.log("Logging out...");
    // Yahan API call karke cookie clear karein aur user ko redirect karein
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/dashboard" className="logo">
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