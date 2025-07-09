import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/landing';
import Layout from './components/layout';
import LoginPage from './pages/Login';
import RegisterPage from './pages/register';
import Otpverify from './pages/otpverify';
import DashboardPage from './pages/dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<Otpverify />} />
         <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
         </Route>
        
      </Routes>
    </Router>
  );
}

export default App;
