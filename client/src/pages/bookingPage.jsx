import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../styles/bookingPge.css'; // Iske liye CSS neeche hai

const BookingPage = () => {
  const { professionalId } = useParams(); // URL se professional ki ID
  const navigate = useNavigate();

  const [professional, setProfessional] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Professional ki details fetch karein taaki unka naam dikha sakein
  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        const { data } = await api.get(`/professional/${professionalId}`);
        setProfessional(data.professional);
      } catch (err) {
        setError('Could not load professional details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfessional();
  }, [professionalId]);

  // Form submit hone par
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Backend ko booking request bhej rahe hain
      await api.post('/appointments/book', {
        professionalId,
        date,
        time,
        notes: message, // 'notes' field mein message bhej rahe hain
      });

      alert('Appointment request sent successfully! You will be notified upon confirmation.');
      navigate('/my-appointments'); // User ko uske appointments page par bhej do

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send appointment request.');
    } finally {
      setLoading(false);
    }
  };
  
  // Future dates ko disable karne ke liye aaj ki date
  const today = new Date().toISOString().split('T')[0];

  if (loading && !professional) return <div className="loader"></div>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="booking-page">
      <div className="booking-form-container">
        <div className="professional-header">
          <img src={professional?.profileImage?.url} alt={professional?.name} />
          <h2>Book an Appointment with</h2>
          <h1>{professional?.name}</h1>
          <p>{professional?.professionalDetails?.occupation}</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="date">Select a Date</label>
            <input 
              type="date" 
              id="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              min={today} // User pichli date select nahi kar sakta
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Select a Time</label>
            <input 
              type="time" 
              id="time" 
              value={time} 
              onChange={(e) => setTime(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message (Optional)</label>
            <textarea
              id="message"
              rows="4"
              placeholder="Provide any specific details for the professional..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
          
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Sending Request...' : 'Send Appointment Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;