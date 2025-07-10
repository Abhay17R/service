import React, { useState, useEffect, useCallback } from 'react';
import { FaCalendarAlt, FaClock, FaCheck, FaTimes } from 'react-icons/fa';
import api from '../api/axios';
import '../styles/appointmentReq.css'; // Iske liye CSS neeche hai

// Ek card jo professional ko dikhega
const AppointmentRequestCard = ({ appointment, onAccept, onReject }) => {
  const { _id, client, date, time, status, notes } = appointment;

  return (
    <div className={`request-card status-${status}`}>
      <div className="client-info">
        <img src={client.profileImage?.url} alt={client.name} className="client-avatar" />
        <div>
          <h4>{client.name}</h4>
          <p className="request-notes">Notes: "{notes || 'No specific notes'}"</p>
        </div>
      </div>
      <div className="request-details">
        <span><FaCalendarAlt /> {new Date(date).toLocaleDateString()}</span>
        <span><FaClock /> {time}</span>
      </div>
      {/* Action buttons sirf 'pending' status mein dikhenge */}
      {status === 'pending' && (
        <div className="request-actions">
          <button onClick={() => onReject(_id)} className="reject-btn"><FaTimes /> Reject</button>
          <button onClick={() => onAccept(_id)} className="accept-btn"><FaCheck /> Accept</button>
        </div>
      )}
    </div>
  );
};

const ProfessionalDashboardPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Backend se professional ke appointments fetch karein
      const { data } = await api.get('/appointments/professional/my');
      setAppointments(data.appointments || []);
    } catch (err) {
      setError('Failed to fetch appointment requests.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Accept handler
  const handleAccept = async (appointmentId) => {
    try {
      await api.put(`/appointments/${appointmentId}/accept`);
      // UI update karne ke liye list ko refresh karein
      fetchAppointments();
    } catch (err) {
      alert('Failed to accept appointment.');
    }
  };

  // Reject handler
  const handleReject = async (appointmentId) => {
    try {
      await api.put(`/appointments/${appointmentId}/reject`);
      // UI update karne ke liye list ko refresh karein
      fetchAppointments();
    } catch (err) {
      alert('Failed to reject appointment.');
    }
  };

  const filteredAppointments = appointments.filter(app => app.status === activeTab);

  const renderContent = () => {
    if (loading) return <div className="loader"></div>;
    if (error) return <p className="error-message">{error}</p>;
    if (filteredAppointments.length === 0) {
      return <div className="empty-state"><h3>No {activeTab} appointments.</h3></div>;
    }
    return (
      <div className="requests-list">
        {filteredAppointments.map(app => (
          <AppointmentRequestCard 
            key={app._id} 
            appointment={app} 
            onAccept={handleAccept} 
            onReject={handleReject} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="professional-dashboard-page">
      <header>
        <h1>My Dashboard</h1>
        <p>Manage your incoming appointment requests and schedule.</p>
      </header>
      <nav className="tabs">
        <button onClick={() => setActiveTab('pending')} className={activeTab === 'pending' ? 'active' : ''}>Pending</button>
        <button onClick={() => setActiveTab('upcoming')} className={activeTab === 'upcoming' ? 'active' : ''}>Upcoming</button>
        <button onClick={() => setActiveTab('completed')} className={activeTab === 'completed' ? 'active' : ''}>Completed</button>
        <button onClick={() => setActiveTab('rejected')} className={activeTab === 'rejected' ? 'active' : ''}>Rejected</button>
      </nav>
      {renderContent()}
    </div>
  );
};

export default ProfessionalDashboardPage;