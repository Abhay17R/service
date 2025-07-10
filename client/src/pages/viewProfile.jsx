import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaEnvelope, FaPhone, FaBriefcase, FaClock, FaDollarSign } from 'react-icons/fa';
import api from '../api/axios'; // Aapka configured axios instance
import '../styles/viewProfile.css'; // Hum neeche CSS banayenge

// Chhota helper component taaki star rating dikha sakein
const StarRating = ({ rating, totalReviews }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div className="star-rating">
      {[...Array(fullStars)].map((_, i) => <FaStar key={`full-${i}`} className="star filled" />)}
      {halfStar && <FaStar key="half" className="star filled" /> /* Simple half star for now */}
      {[...Array(emptyStars)].map((_, i) => <FaStar key={`empty-${i}`} className="star" />)}
      <span className="rating-text">{rating.toFixed(1)} ({totalReviews} reviews)</span>
    </div>
  );
};

// Ek review card
const ReviewCard = ({ review }) => (
    <div className="review-card">
        <div className="review-header">
            <img src={review.user.profileImage?.url} alt={review.user.name} className="reviewer-image" />
            <div className="reviewer-info">
                <h4>{review.user.name}</h4>
                <StarRating rating={review.rating} totalReviews={0} />
            </div>
        </div>
        <p className="review-comment">"{review.comment}"</p>
    </div>
);


const ProfessionalProfilePage = () => {
  const { id } = useParams(); // URL se professional ki ID nikalega
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfessional = async () => {
      setLoading(true);
      setError(null);
      try {
        // Backend API ko call karein (userRoutes.js se)
        const { data } = await api.get(`/professional/${id}`);
        setProfessional(data.professional);
      } catch (err) {
        setError('Could not fetch professional details. Please try again.');
        console.error("Error fetching professional:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessional();
  }, [id]); // id badalne par data dobara fetch hoga

  if (loading) {
    return <div className="loader-container"><div className="loader"></div></div>;
  }

  if (error) {
    return <div className="error-container"><p className="error-message">{error}</p></div>;
  }

  if (!professional) {
    return <div className="error-container"><p>Professional not found.</p></div>;
  }

  // Optional chaining (?.) ka istemal taaki code crash na ho agar professionalDetails na ho
  const details = professional.professionalDetails || {};

  return (
    <div className="profile-page">
      <header className="profile-header">
        <img src={professional.profileImage?.url} alt={professional.name} className="profile-picture" />
        <div className="profile-summary">
          <h1>{professional.name}</h1>
          <p className="profile-occupation">{details.occupation}</p>
          <StarRating rating={professional.averageRating} totalReviews={professional.totalReviews} />
          <div className="profile-actions">
            <Link to={`/book-appointment/${id}`} className="btn btn-primary">Book Appointment</Link>
            <Link to={`/leave-review/${id}`} className="btn btn-secondary">Leave a Review</Link>
          </div>
        </div>
      </header>

      <main className="profile-body">
        <div className="profile-details-left">
          <div className="profile-card">
            <h3>About Me</h3>
            <p>{details.bio || 'No biography provided.'}</p>
          </div>
          <div className="profile-card">
            <h3>Details</h3>
            <ul className="details-list">
              <li><FaBriefcase className="icon" /> <strong>Experience:</strong> {details.experience ? `${details.experience} years` : 'N/A'}</li>
              <li><FaDollarSign className="icon" /> <strong>Hourly Rate:</strong> {details.hourlyRate ? `₹${details.hourlyRate}/hr` : 'N/A'}</li>
              <li><FaClock className="icon" /> <strong>Availability:</strong> {details.availability || 'Not Specified'}</li>
            </ul>
          </div>
           <div className="profile-card">
            <h3>Contact Information</h3>
             <ul className="details-list">
              <li><FaMapMarkerAlt className="icon" /> <strong>Location:</strong> {professional.location || 'Not Specified'}</li>
              <li><FaEnvelope className="icon" /> <strong>Email:</strong> {professional.email}</li>
               <li><FaPhone className="icon" /> <strong>Phone:</strong> {professional.phone || 'Not available'}</li>
            </ul>
          </div>
        </div>
        <div className="profile-reviews-right">
          <h2>Reviews</h2>
          <div className="reviews-container">
            {professional.reviews && professional.reviews.length > 0 ? (
              professional.reviews.map(review => <ReviewCard key={review._id} review={review} />)
            ) : (
              <p>No reviews yet. Be the first one to leave a review!</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfessionalProfilePage;