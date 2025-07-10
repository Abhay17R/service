import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/landing';
import Layout from './components/layout';
import LoginPage from './pages/Login';
import RegisterPage from './pages/register';
import Otpverify from './pages/otpverify';
import DashboardPage from './pages/dashboard';
import MyAppointmentsPage from './pages/appointment';
import Chat from './pages/chat'
import ProfilePage from './pages/profile';
import ViewProfile from './pages/viewProfile';
import BookingPage from './pages/bookingPage';
import AppointmentReceived from './pages/appointmentReq'; 

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
              <Route path="/my-appointments" element={<MyAppointmentsPage />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/profile" element={<ProfilePage />} />
             <Route path="/professional/:id"  element={<ViewProfile />} />
              <Route path="/book-appointment/:professionalId" element={<BookingPage />} />
              <Route path="/appointmentReceived" element={< AppointmentReceived  />} />
         </Route>
        
      </Routes>
    </Router>
  );
}

export default App;
