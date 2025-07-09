// src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaMapMarkerAlt, FaStar, FaFilter } from 'react-icons/fa';
import '../styles/dashboard.css';

// Dummy data for demonstration. In a real app, this would come from an API.
const dummyProfessionals = [
  { id: 1, name: 'Dr. Ananya Sharma', occupation: 'Doctor', location: 'Mumbai, MH', rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16e?w=500' },
  { id: 2, name: 'Adv. Rohan Verma', occupation: 'Lawyer', location: 'Delhi, DL', rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1594744806549-5a76173d35b4?w=500' },
  { id: 3, name: 'Priya Singh', occupation: 'Tutor', location: 'Bengaluru, KA', rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500' },
  { id: 4, name: 'Sameer Khan', occupation: 'Plumber', location: 'Pune, MH', rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1558213823-8b5e2a392848?w=500' },
  { id: 5, name: 'Dr. Vikram Rathore', occupation: 'Doctor', location: 'Hyderabad, TS', rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500' },
  { id: 6, name: 'Isha Gupta', occupation: 'Web Developer', location: 'Noida, UP', rating: 5.0, imageUrl: 'https://images.unsplash.com/photo-1554744512-d6c603f27c64?w=500' },
];

const ProfessionalCard = ({ id, name, occupation, location, rating, imageUrl }) => (
  <div className="professional-card">
    <div className="card-image-container">
      <img src={imageUrl} alt={name} className="card-image" />
    </div>
    <div className="card-content">
      <h3 className="card-name">{name}</h3>
      <p className="card-occupation">{occupation}</p>
      <div className="card-info">
        <span><FaMapMarkerAlt className="icon" /> {location}</span>
        <span><FaStar className="icon star" /> {rating.toFixed(1)}</span>
      </div>
      <Link to={`/professional/${id}`} className="view-profile-btn">
        View Profile →
      </Link>
    </div>
  </div>
);

const DashboardPage = () => {
  const [professionals, setProfessionals] = useState([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);
  const [occupations, setOccupations] = useState([]);
  const [selectedOccupation, setSelectedOccupation] = useState('All');
  const [loading, setLoading] = useState(true);

  // Simulate API call on component mount
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setProfessionals(dummyProfessionals);
      setFilteredProfessionals(dummyProfessionals);
      
      // Get unique occupations for the filter dropdown
      const uniqueOccupations = ['All', ...new Set(dummyProfessionals.map(p => p.occupation))];
      setOccupations(uniqueOccupations);
      
      setLoading(false);
    }, 1000); // Simulate 1-second loading time
  }, []);

  // Filter professionals when selectedOccupation changes
  useEffect(() => {
    if (selectedOccupation === 'All') {
      setFilteredProfessionals(professionals);
    } else {
      const filtered = professionals.filter(p => p.occupation === selectedOccupation);
      setFilteredProfessionals(filtered);
    }
  }, [selectedOccupation, professionals]);

  // TODO: Fetch real user name from context or auth state
  const userName = "Abhay";

  return (
    <div className="dashboard-page">
      {/* Assume Header and Footer are rendered in a parent Layout component */}
      {/* For standalone, you can import and render them here */}
      
      <main className="dashboard-content">
        <section className="welcome-section">
          <h1>👋 Welcome, {userName}!</h1>
          <p>Find and connect with top-rated professionals.</p>
        </section>

        <section className="filter-section">
          <FaFilter className="filter-icon" />
          <label htmlFor="occupation-filter">Filter by Occupation:</label>
          <select 
            id="occupation-filter" 
            value={selectedOccupation} 
            onChange={(e) => setSelectedOccupation(e.target.value)}
          >
            {occupations.map(occ => <option key={occ} value={occ}>{occ}</option>)}
          </select>
        </section>

        <section className="professionals-grid-section">
          <h2>Available Professionals</h2>
          {loading ? (
            <div className="loader"></div>
          ) : (
            <div className="professionals-grid">
              {filteredProfessionals.length > 0 ? (
                filteredProfessionals.map(prof => <ProfessionalCard key={prof.id} {...prof} />)
              ) : (
                <p className="no-results">No professionals found for this occupation.</p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;