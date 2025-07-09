import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/landing';
import LoginPage from './pages/Login';
import RegisterPage from './pages/register';
import Otpverify from './pages/otpverify';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/otpverify" element={<Otpverify />} />
      </Routes>
    </Router>
  );
}

export default App;
