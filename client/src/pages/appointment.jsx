// src/pages/MyAppointmentsPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';
import '../styles/appointment.css'; // Iske liye CSS neeche hai

// Dummy data for demonstration. In a real app, this would come from an API.
const dummyAppointments = [
  { id: 1, professionalName: 'Dr. Ananya Sharma', professionalOccupation: 'Doctor', date: '2024-10-25', time: '11:00 AM', status: 'upcoming', imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16e?w=500' },
  { id: 2, professionalName: 'Priya Singh', professionalOccupation: 'Tutor', date: '2024-09-15', time: '02:30 PM', status: 'completed', imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500' },
  { id: 3, professionalName: 'Adv. Rohan Verma', professionalOccupation: 'Lawyer', date: '2024-10-28', time: '04:00 PM', status: 'upcoming', imageUrl: 'https://images.unsplash.com/photo-1594744806549-5a76173d35b4?w=500' },
  { id: 4, professionalName: 'Isha Gupta', professionalOccupation: 'Web Developer', date: '2024-08-20', time: '10:00 AM', status: 'cancelled', imageUrl: 'https://images.unsplash.com/photo-1554744512-d6c603f27c64?w=500' },
  { id: 5, professionalName: 'Dr. Vikram Rathore', professionalOccupation: 'Doctor', date: '2024-09-01', time: '09:00 AM', status: 'completed', imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500' },
];

const AppointmentCard = ({ appointment }) => {
  const { professionalName, professionalOccupation, date, time, status, imageUrl } = appointment;

  const getStatusInfo = () => {
    switch (status) {
      case 'upcoming': return { icon: <FaHourglassHalf />, text: 'Upcoming', className: 'upcoming' };
      case 'completed': return { icon: <FaCheckCircle />, text: 'Completed', className: 'completed' };
      case 'cancelled': return { icon: <FaTimesCircle />, text: 'Cancelled', className: 'cancelled' };
      default: return {};
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="appointment-card">
      <img src={imageUrl} alt={professionalName} className="professional-avatar" />
      <div className="appointment-details">
        <h3>{professionalName}</h3>
        <p className="occupation">{professionalOccupation}</p>
        <div className="datetime">
          <span><FaCalendarAlt /> {new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span><FaClock /> {time}</span>
        </div>
        <div className={`status-badge ${statusInfo.className}`}>
          {statusInfo.icon} {statusInfo.text}
        </div>
      </div>
      <div className="appointment-actions">
        {status === 'upcoming' && (
          <>
            <button className="btn-secondary">Reschedule</button>
            <button className="btn-danger">Cancel</button>
          </>
        )}
        {status === 'completed' && (
          <button className="btn-primary">Leave a Review</button>
        )}
        {status === 'cancelled' && (
          <button className="btn-primary">Book Again</button>
        )}
      </div>
    </div>
  );
};


const MyAppointmentsPage = () => {
  const [allAppointments, setAllAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'completed', 'cancelled'
  const [loading, setLoading] = useState(true);

  // Simulate API call
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setAllAppointments(dummyAppointments);
      setLoading(false);
    }, 500);
  }, []);

  const filteredAppointments = allAppointments.filter(app => app.status === activeTab);

  const renderContent = () => {
    if (loading) {
      return <div className="loader"></div>;
    }
    if (filteredAppointments.length === 0) {
      return (
        <div className="empty-state">
          <FaCalendarAlt className="empty-icon" />
          <h2>No {activeTab} appointments</h2>
          <p>You don't have any appointments in this category.</p>
          <Link to="/dashboard" className="btn-primary">Find Professionals</Link>
        </div>
      );
    }
    return (
      <div className="appointments-list">
        {filteredAppointments.map(app => <AppointmentCard key={app.id} appointment={app} />)}
      </div>
    );
  };

  return (
    <div className="appointments-page">
      <main className="appointments-content">
        <header className="page-header">
          <h1>My Appointments</h1>
          <p>View and manage all your scheduled appointments.</p>
        </header>

        <nav className="tabs">
          <button onClick={() => setActiveTab('upcoming')} className={activeTab === 'upcoming' ? 'active' : ''}>Upcoming</button>
          <button onClick={() => setActiveTab('completed')} className={activeTab === 'completed' ? 'active' : ''}>Completed</button>
          <button onClick={() => setActiveTab('cancelled')} className={activeTab === 'cancelled' ? 'active' : ''}>Cancelled</button>
        </nav>

        {renderContent()}
      </main>
    </div>
  );
};

export default MyAppointmentsPage;