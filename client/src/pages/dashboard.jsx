// src/pages/DashboardPage.jsx (Fully Integrated Final Code)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaFilter } from 'react-icons/fa';
// Apne configured axios instance ko import karein
import api from '../api/axios'; 
import '../styles/dashboard.css';

// ProfessionalCard component bilkul sahi hai, ismein koi change nahi
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
  const [occupations, setOccupations] = useState([]);
  const [selectedOccupation, setSelectedOccupation] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Yeh useEffect API se professionals laayega jab bhi filter change hoga
  useEffect(() => {
    const fetchProfessionals = async () => {
      setLoading(true);
      setError(null);
      try {
        // Humari nayi, safe API route ko call karein
        const { data } = await api.get(`/dashboard/professionals?occupation=${selectedOccupation}`);
        setProfessionals(data.professionals);
      } catch (err) {
        setError('Failed to fetch professionals. Please try again later.');
        console.error("Error fetching professionals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, [selectedOccupation]); // Yeh tab chalega jab component load hoga aur jab 'selectedOccupation' badlega

  // Yeh useEffect sirf ek baar chalega aur filter ke liye occupations laayega
  useEffect(() => {
    const fetchOccupations = async () => {
      try {
        // Humari dusri nayi API route ko call karein
        const { data } = await api.get('/dashboard/occupations');
        setOccupations(['All', ...data.occupations]);
      } catch (err) {
        console.error("Failed to fetch occupations:", err);
        setOccupations(['All']); // Error ke case mein sirf 'All' dikhega
      }
    };
    
    fetchOccupations();
  }, []); // Khali array ka matlab hai ki yeh sirf ek baar component load hone par chalega


  // TODO: Asli user ka naam auth context se laana hai
  const userName = "Abhay";

  return (
    <div className="dashboard-page">
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
            disabled={loading} // Jab loading ho rahi ho toh dropdown disable rahega
          >
            {occupations.map(occ => <option key={occ} value={occ}>{occ}</option>)}
          </select>
        </section>

        <section className="professionals-grid-section">
          <h2>Available Professionals</h2>
          {/* Loading, Error aur Success states ko handle karna */}
          {loading ? (
            <div className="loader"></div>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="professionals-grid">
              {professionals.length > 0 ? (
                professionals.map(prof => <ProfessionalCard key={prof.id} {...prof} />)
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