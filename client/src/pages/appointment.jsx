import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// ==> UPDATED: Added FaPaperPlane for the 'pending' status
import { FaCalendarAlt, FaClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaStar, FaPaperPlane } from 'react-icons/fa';
import api from '../api/axios';
import '../styles/appointment.css'; // Make sure to add styles for .pending and .rejected (or reuse .cancelled)

// ==========================================================
//               APPOINTMENT CARD COMPONENT
// ==========================================================
const AppointmentCard = ({ appointment, onCancel, onOpenReviewModal, onOpenRescheduleModal }) => {
  const { id, professionalName, professionalOccupation, date, time, status, imageUrl } = appointment;
  const navigate = useNavigate();

  // ==> UPDATED: This function now handles the new 'pending' and 'rejected' statuses
  const getStatusInfo = () => {
    switch (status) {
      case 'pending':
        return { icon: <FaPaperPlane />, text: 'Pending Approval', className: 'pending' };
      case 'upcoming':
        return { icon: <FaHourglassHalf />, text: 'Upcoming', className: 'upcoming' };
      case 'completed':
        return { icon: <FaCheckCircle />, text: 'Completed', className: 'completed' };
      case 'rejected':
        return { icon: <FaTimesCircle />, text: 'Rejected', className: 'cancelled' }; // Re-using 'cancelled' style
      case 'cancelled':
        return { icon: <FaTimesCircle />, text: 'Cancelled', className: 'cancelled' };
      default:
        return { icon: <FaHourglassHalf />, text: status, className: 'default' };
    }
  };

  const handleBookAgain = () => {
    // This logic can navigate the user back to the professional's profile page.
    // This assumes you have the professional's ID available in the appointment object.
    // e.g., navigate(`/professional/${appointment.professionalId}`);
    console.log("Booking again with:", professionalName);
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
        {/* ==> UPDATED: User can cancel a request that is either 'pending' or 'upcoming' */}
        {(status === 'upcoming' || status === 'pending') && (
          <button onClick={() => onCancel(id)} className="btn-danger">Cancel</button>
        )}
        {status === 'upcoming' && (
          <button onClick={() => onOpenRescheduleModal(appointment)} className="btn-secondary">Reschedule</button>
        )}
        {status === 'completed' && (
          <button onClick={() => onOpenReviewModal(appointment)} className="btn-primary">Leave a Review</button>
        )}
        {/* ==> UPDATED: User can book again if appointment was 'cancelled' or 'rejected' */}
        {(status === 'cancelled' || status === 'rejected') && (
          <button onClick={handleBookAgain} className="btn-primary">Book Again</button>
        )}
      </div>
    </div>
  );
};


// ==========================================================
//               MAIN APPOINTMENTS PAGE COMPONENT
// ==========================================================
const MyAppointmentsPage = () => {
  const [allAppointments, setAllAppointments] = useState([]);
  // ==> UPDATED: 'pending' is now the default active tab for better user experience.
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal States (No changes here)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewingAppointment, setReviewingAppointment] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [reschedulingAppointment, setReschedulingAppointment] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');


  // Fetch appointments from backend (No changes here)
  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/appointments/my');
      setAllAppointments(data.appointments || []);
    } catch (err) {
      setError('Failed to fetch appointments. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);


  // Handler to cancel an appointment
  const handleCancelAppointment = async (appointmentId) => {
    // ==> UPDATED: Confirmation message is more specific now.
    if (!window.confirm('Are you sure you want to cancel this appointment request?')) return;
    try {
      await api.put(`/appointments/${appointmentId}/cancel`);
      setAllAppointments(prev =>
        prev.map(app => app.id === appointmentId ? { ...app, status: 'cancelled' } : app)
      );
      alert('Appointment cancelled successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel appointment.');
    }
  };

  // Handlers for Review Modal (No changes here)
  const handleOpenReviewModal = (appointment) => {
    setReviewingAppointment(appointment);
    setIsReviewModalOpen(true);
  };
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating.');
      return;
    }
    try {
        await api.post('/reviews', {
            appointmentId: reviewingAppointment.id,
            rating,
            comment,
        });
        alert('Review submitted successfully!');
        setIsReviewModalOpen(false);
        setRating(0);
        setComment('');
    } catch(err) {
        alert(err.response?.data?.message || 'Failed to submit review.');
    }
  };

  // Handlers for Reschedule Modal (No changes here)
  const handleOpenRescheduleModal = (appointment) => {
    setReschedulingAppointment(appointment);
    setNewDate(appointment.date.split('T')[0]);
    setNewTime(appointment.time);
    setIsRescheduleModalOpen(true);
  };

  const handleRescheduleSubmit = async (e) => {
      e.preventDefault();
      try {
          await api.put(`/appointments/${reschedulingAppointment.id}/reschedule`, {
              date: newDate,
              time: newTime,
          });
          alert('Appointment rescheduled successfully!');
          fetchAppointments(); 
          setIsRescheduleModalOpen(false);
      } catch (err) {
          alert(err.response?.data?.message || 'Failed to reschedule appointment.');
      }
  };

  // ==> UPDATED: Filtering logic now groups 'rejected' appointments under the 'cancelled' tab.
  const filteredAppointments = allAppointments.filter(app => {
    if (activeTab === 'cancelled') {
      return app.status === 'cancelled' || app.status === 'rejected';
    }
    return app.status === activeTab;
  });

  const renderContent = () => {
    if (loading) return <div className="loader"></div>;
    if (error) return <div className="empty-state"><p>{error}</p></div>;
    if (filteredAppointments.length === 0) {
      // ==> UPDATED: Empty state message is now dynamic based on the active tab.
      const emptyStateText = {
        pending: 'pending requests',
        upcoming: 'upcoming appointments',
        completed: 'completed appointments',
        cancelled: 'cancelled or rejected appointments',
      };
      
      return (
        <div className="empty-state">
          <FaCalendarAlt className="empty-icon" />
          <h2>No {emptyStateText[activeTab]}</h2>
          <p>You don't have any appointments in this category yet.</p>
          <Link to="/dashboard" className="btn-primary">Find Professionals</Link>
        </div>
      );
    }
    return (
      <div className="appointments-list">
        {filteredAppointments.map(app => (
          <AppointmentCard
            key={app.id}
            appointment={app}
            onCancel={handleCancelAppointment}
            onOpenReviewModal={handleOpenReviewModal}
            onOpenRescheduleModal={handleOpenRescheduleModal}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="appointments-page">
        <main className="appointments-content">
          <header className="page-header">
            <h1>My Appointments</h1>
            <p>View and manage all your scheduled appointments and requests.</p>
          </header>
          {/* ==> UPDATED: Tab navigation now includes 'Pending' and groups 'Cancelled/Rejected'. */}
          <nav className="tabs">
            <button onClick={() => setActiveTab('pending')} className={activeTab === 'pending' ? 'active' : ''}>Pending</button>
            <button onClick={() => setActiveTab('upcoming')} className={activeTab === 'upcoming' ? 'active' : ''}>Upcoming</button>
            <button onClick={() => setActiveTab('completed')} className={activeTab === 'completed' ? 'active' : ''}>Completed</button>
            <button onClick={() => setActiveTab('cancelled')} className={activeTab === 'cancelled' ? 'active' : ''}>Cancelled/Rejected</button>
          </nav>
          {renderContent()}
        </main>
      </div>

      {/* Review Modal (No changes here) */}
      {isReviewModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={() => setIsReviewModalOpen(false)} className="close-modal">×</button>
            <h2>Leave a Review for {reviewingAppointment.professionalName}</h2>
            <form onSubmit={handleReviewSubmit}>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map(star => (
                  <FaStar key={star} className={`star ${rating >= star ? 'selected' : ''}`} onClick={() => setRating(star)} />
                ))}
              </div>
              <textarea
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="5"
              ></textarea>
              <button type="submit" className="btn-primary">Submit Review</button>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal (No changes here) */}
      {isRescheduleModalOpen && (
          <div className="modal-overlay">
              <div className="modal-content">
                  <button onClick={() => setIsRescheduleModalOpen(false)} className="close-modal">×</button>
                  <h2>Reschedule Appointment with {reschedulingAppointment.professionalName}</h2>
                  <form onSubmit={handleRescheduleSubmit}>
                    <div className="form-group">
                        <label htmlFor="newDate">New Date</label>
                        <input type="date" id="newDate" value={newDate} onChange={(e) => setNewDate(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newTime">New Time</label>
                        <input type="time" id="newTime" value={newTime} onChange={(e) => setNewTime(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn-primary">Confirm Reschedule</button>
                  </form>
              </div>
          </div>
      )}
    </>
  );
};

export default MyAppointmentsPage;