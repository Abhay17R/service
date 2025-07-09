import React, { useState } from 'react';
import '../styles/landing.css';

// Using react-icons for all icons for consistency
import { 
  FaSearch, FaComments, FaCalendarCheck, FaUserTie, FaTools, 
  FaStar, FaUserCircle, FaArrowRight, FaFacebookF, FaTwitter, FaLinkedinIn 
} from 'react-icons/fa';

const LandingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for: ${searchTerm}`);
  };

  return (
    <div className="landing-page">
      {/* Navbar */}
      <header className="navbar">
        <div className="container">
          <div className="logo-container">
            <h1 className="logo">ServiceLink</h1>
            <span className="logo-tag">Pro</span>
          </div>
          <nav>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><a href="#cta" className="btn btn-outline">Login</a></li>
              <li><a href="#cta" className="btn btn-primary">Register</a></li>
            </ul>
          </nav>
          <div className="mobile-menu-btn">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>
              <span className="highlight">The Right Professional,</span>
              <br />
              At The <span className="highlight">Right Time.</span>
            </h1>
            <p>Find top-rated professionals, chat instantly, and book appointments seamlessly - all in one place.</p>
            <form onSubmit={handleSearch} className="search-bar">
              <div className="search-input-container">
                <FaSearch className="search-icon" />
                <input 
                  type="text" 
                  placeholder="e.g., 'Plumber', 'Electrician', 'Web Developer'..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Find Experts <FaArrowRight className="arrow-icon" />
              </button>
            </form>
            <div className="stats-container">
              <div className="stat">
                <div className="stat-value">15K+</div>
                <div className="stat-label">Professionals</div>
              </div>
              <div className="stat">
                <div className="stat-value">98%</div>
                <div className="stat-label">Satisfaction Rate</div>
              </div>
              <div className="stat">
                <div className="stat-value">4.9/5</div>
                <div className="stat-label">Average Rating</div>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="service-card">
              <div className="service-image"></div>
              <div className="service-info">
                <div className="service-rating">
                  <FaStar className="star" />
                  <span>4.9 (128 reviews)</span>
                </div>
                <h3>David Martinez</h3>
                <p>Senior Home Renovation Expert</p>
                <div className="service-tags">
                  <span>Renovation</span>
                  <span>Interior Design</span>
                  <span>Construction</span>
                </div>
                <button className="btn btn-small">View Profile</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <div className="section-subtitle">Simple Process</div>
            <h2>How ServiceLink Works</h2>
            <p>Find and hire the perfect professional in three simple steps</p>
          </div>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-icon">
                <FaSearch />
                <div className="icon-bg"></div>
              </div>
              <h3>Search & Discover</h3>
              <p>Find professionals based on skills, location, availability, and ratings</p>
            </div>
            <div className="connector-line"></div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-icon">
                <FaComments />
                <div className="icon-bg"></div>
              </div>
              <h3>Connect & Discuss</h3>
              <p>Chat directly with professionals to discuss project details</p>
            </div>
            <div className="connector-line"></div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-icon">
                <FaCalendarCheck />
                <div className="icon-bg"></div>
              </div>
              <h3>Book & Review</h3>
              <p>Schedule appointments and leave reviews after service completion</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <div className="section-subtitle">Why Choose Us</div>
            <h2>Powerful Platform Features</h2>
            <p>Everything you need to find and manage professional services</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaUserTie />
              </div>
              <h3>Verified Professionals</h3>
              <p>All professionals undergo rigorous background checks and verification processes</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaTools />
              </div>
              <h3>Diverse Experts</h3>
              <p>From home services to tech experts, find professionals for every need</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaComments />
              </div>
              <h3>Real-time Chat</h3>
              <p>Instant messaging with professionals to clarify all details</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaCalendarCheck />
              </div>
              <h3>Smart Booking</h3>
              <p>Integrated calendar system for seamless appointment scheduling</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaStar />
              </div>
              <h3>Transparent Reviews</h3>
              <p>Authentic ratings and reviews from verified customers</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaUserCircle />
              </div>
              <h3>Personal Dashboard</h3>
              <p>Manage all your appointments and messages in one place</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <div className="section-subtitle">Success Stories</div>
            <h2>What Our Clients Say</h2>
            <p>Hear from people who found the perfect professional through ServiceLink</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="rating">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
                <p>"ServiceLink saved me when my plumbing emergency happened at 10 PM. Found a professional within 20 minutes who fixed everything!"</p>
              </div>
              <div className="client-info">
                <div className="client-avatar avatar1"></div>
                <div>
                  <h4>Sarah Johnson</h4>
                  <p>Homeowner, Seattle</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="rating">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
                <p>"As a small business owner, ServiceLink has been invaluable for finding reliable tech support and marketing experts."</p>
              </div>
              <div className="client-info">
                <div className="client-avatar avatar2"></div>
                <div>
                  <h4>Michael Chen</h4>
                  <p>Business Owner, NYC</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="rating">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
                <p>"The platform is so easy to use. I found a web developer who completely transformed my online store in just 2 weeks!"</p>
              </div>
              <div className="client-info">
                <div className="client-avatar avatar3"></div>
                <div>
                  <h4>Emma Rodriguez</h4>
                  <p>E-commerce Entrepreneur</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of satisfied users and professionals on ServiceLink</p>
            <div className="cta-buttons">
              <a href="#" className="btn btn-light">
                I Need a Service
              </a>
              <a href="#" className="btn btn-primary">
                I'm a Professional
              </a>
            </div>
          </div>
          <div className="cta-image"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-about">
              <div className="logo-container">
                <h3 className="logo">ServiceLink</h3>
                <span className="logo-tag">Pro</span>
              </div>
              <p>Connecting you with the best professionals for any job, any time.</p>
              <div className="social-icons">
                <a href="#"><FaFacebookF /></a>
                <a href="#"><FaTwitter /></a>
                <a href="#"><FaLinkedinIn /></a>
              </div>
            </div>
            <div className="footer-links">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Press</a></li>
                <li><a href="#">Blog</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Resources</h4>
              <ul>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Community</a></li>
                <li><a href="#">Partners</a></li>
                <li><a href="#">Events</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Cookie Policy</a></li>
                <li><a href="#">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} ServiceLink Pro. All Rights Reserved.</p>
            <div className="footer-apps">
              <button className="app-store">App Store</button>
              <button className="google-play">Google Play</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;