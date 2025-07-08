// ServiceLinkLanding.jsx
import React, { useState } from 'react';
import { FaCheck, FaUser, FaTools, FaSearch, FaCalendar, FaStar, FaChartBar, FaCog, FaGlobe, FaMobile, FaComments, FaMapMarker, FaCreditCard } from 'react-icons/fa';
import '../styles/landing.css';

const ServiceLinkLanding = () => {
  const [checkedItems, setCheckedItems] = useState({});
  const [email, setEmail] = useState('');
  
  const handleCheck = (id) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you! We'll notify you when we launch. Email: ${email}`);
    setEmail('');
  };

  // Feature categoriess
  const features = [
    {
      id: 'auth',
      title: '🔐 Authentication & Authorization',
      items: [
        'User Signup (email, password, name, location)',
        'User Login (JWT-based)',
        'Role selection (Customer / Professional / Both)',
        'Logout',
        'Forgot Password (optional)'
      ]
    },
    {
      id: 'profile',
      title: '👤 User Profile Management',
      items: [
        'View personal profile',
        'Edit profile info (name, phone, location)',
        'Change password (optional)'
      ]
    },
    {
      id: 'proProfile',
      title: '🧑‍🔧 Professional Profile Setup',
      items: [
        'Create professional profile (occupation, skills, bio)',
        'Set availability (days/times)',
        'Edit professional profile',
        'Upload profile picture (optional)'
      ]
    },
    {
      id: 'discovery',
      title: '🔍 Service Discovery (for Customers)',
      items: [
        'Browse professionals by occupation',
        'Filter by location',
        'Search by name/skill',
        'View professional details (profile page)'
      ]
    },
    {
      id: 'booking',
      title: '📅 Appointment Booking System',
      items: [
        'Select a professional',
        'Choose date/time from their availability',
        'Send booking request',
        'View customer\'s appointment list (status: pending, accepted, rejected)',
        'Cancel appointment'
      ]
    },
    {
      id: 'appointment',
      title: '📬 Appointment Management (for Professionals)',
      items: [
        'View incoming appointment requests',
        'Accept or Reject requests',
        'View upcoming appointments',
        'Mark appointments as completed (optional)'
      ]
    },
    {
      id: 'reviews',
      title: '⭐ Reviews & Ratings',
      items: [
        'Customer can leave review after completed appointment',
        'Professional can see list of received reviews',
        'Average rating display on profile'
      ]
    },
    {
      id: 'dashboard',
      title: '📊 Dashboard (Role-based)',
      items: [
        'Show key stats (total appointments, reviews)',
        'Link to view/edit profile',
        'Links to explore or manage appointments',
        'Role-switch toggle (if user is both)'
      ]
    },
    {
      id: 'admin',
      title: '🛠️ Admin Panel (Optional)',
      items: [
        'View all users',
        'Verify or delete professional profiles',
        'View reported reviews or abuse (optional)'
      ]
    },
    {
      id: 'general',
      title: '🌍 General Pages',
      items: [
        'Home Page',
        'About Us Page (optional)',
        'Contact Us Page (optional)',
        '404 Not Found Page'
      ]
    },
    {
      id: 'future',
      title: '💡 Optional / Advanced Features (Future Scope)',
      items: [
        'Real-time chat (Socket.io)',
        'Email notifications',
        'Google Maps integration',
        'Online payments (Razorpay, Stripe)',
        'Mobile app (React Native)'
      ]
    }
  ];

  // Tech stack
  const techStack = [
    { name: 'React.js', icon: <FaMobile /> },
    { name: 'React Router', icon: <FaGlobe /> },
    { name: 'Axios', icon: <FaComments /> },
    { name: 'Manual CSS', icon: <FaCog /> },
    { name: 'Node.js', icon: <FaCog /> },
    { name: 'Express.js', icon: <FaCog /> },
    { name: 'MongoDB', icon: <FaCog /> },
    { name: 'JWT', icon: <FaUser /> },
    { name: 'Bcrypt', icon: <FaTools /> }
  ];

  return (
    <div className="servicelink-app">
      {/* Hero Section */}
      <header className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Connecting You With Trusted Professionals</h1>
            <p>ServiceLink makes finding and booking local professionals simple, fast, and reliable</p>
            
            <div className="cta-buttons">
              <button className="btn btn-primary">Join as Customer</button>
              <button className="btn btn-secondary">Join as Professional</button>
            </div>
          </div>
          
          <div className="hero-image">
            <div className="image-placeholder">
              <div className="tech-icons">
                {techStack.slice(0, 4).map((tech, index) => (
                  <div key={index} className="tech-icon">
                    {tech.icon}
                    <span>{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Checklist */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Complete Platform Features</h2>
          <p className="section-subtitle">Everything we're building for ServiceLink:</p>
          
          <div className="features-container">
            {features.map((category) => (
              <div className="feature-category" key={category.id}>
                <h3 className="category-title">{category.title}</h3>
                <ul className="feature-list">
                  {category.items.map((item, index) => {
                    const itemId = `${category.id}-${index}`;
                    return (
                      <li 
                        key={itemId} 
                        className={`feature-item ${checkedItems[itemId] ? 'checked' : ''}`}
                        onClick={() => handleCheck(itemId)}
                      >
                        <div className="checkmark">
                          {checkedItems[itemId] ? <FaCheck /> : <span></span>}
                        </div>
                        <span>{item}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="tech-section">
        <div className="container">
          <h2 className="section-title">Technology Stack</h2>
          
          <div className="tech-grid">
            {techStack.map((tech, index) => (
              <div className="tech-card" key={index}>
                <div className="tech-icon">
                  {tech.icon}
                </div>
                <h3>{tech.name}</h3>
              </div>
            ))}
          </div>
          
          <div className="database-info">
            <div className="db-icon">MongoDB</div>
            <p>NoSQL database for flexible data modeling and scalability</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Get Early Access</h2>
            <p>Be the first to know when ServiceLink launches</p>
            
            <form onSubmit={handleSubmit} className="email-form">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">Notify Me</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">ServiceLink</div>
              <p>Connecting professionals and customers seamlessly</p>
            </div>
            
            <div className="footer-links">
              <h4>Development Status</h4>
              <div className="progress-bar">
                <div className="progress" style={{ width: '65%' }}></div>
                <span>65% Complete</span>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} ServiceLink. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ServiceLinkLanding;