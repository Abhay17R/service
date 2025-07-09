// src/pages/ProfilePage.jsx (Final version with 100+ occupations)

import React, { useState, useEffect } from 'react';
import {
  FaUser, FaBriefcase, FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock,
  FaDollarSign, FaLink, FaEdit, FaSpinner
} from 'react-icons/fa';
import '../styles/profile.css';

const dummyProfessionalData = {
  name: 'John Doe',
  occupation: 'Software Engineer',
  bio: 'Experienced software engineer specializing in web development.',
  experience: 5,
  hourlyRate: 50,
  availability: 'Mon-Fri | 9AM - 5PM',
  email: 'john@example.com',
  phone: '9876543210',
  location: 'Mumbai, Maharashtra',
  portfolioUrl: 'https://johndoe.dev',
  profileImage: 'https://via.placeholder.com/150'
};

const allOccupations = [
  // Tech & Engineering
  'Software Engineer', 'Web Developer', 'UI/UX Designer', 'Data Scientist', 'IT Support Specialist',
  'DevOps Engineer', 'Cybersecurity Analyst', 'Mobile App Developer', 'QA Tester / QA Engineer',
  'IT Consultant', 'Game Developer', 'Engineering Consultant',
  'Computer Science Engineer (CSE)', 'Information Technology Engineer (IT)',
  'Electronics and Communication Engineer (ECE)', 'Electrical Engineer (EE)',
  'Mechanical Engineer', 'Civil Engineer', 'Chemical Engineer', 'Biomedical Engineer',
  'Environmental Engineer', 'Industrial Engineer', 'Aerospace Engineer',
  'Automobile Engineer', 'Metallurgical Engineer', 'Petroleum Engineer', 'Marine Engineer',
  'Robotics Engineer', 'Mechatronics Engineer', 'Structural Engineer', 'Instrumentation Engineer',
  'Mining Engineer', 'Agricultural Engineer', 'Nanotechnology Engineer',

  // Healthcare
  'Doctor', 'Nurse', 'Dentist', 'Pharmacist', 'Physiotherapist', 'Veterinarian',
  'Psychiatrist', 'Nutritionist / Dietitian', 'Speech Therapist', 'Occupational Therapist', 'Chiropractor',

  // Creative & Media
  'Graphic Designer', 'Content Writer', 'Photographer', 'Video Editor', 'Musician', 'Interior Designer',
  'Animator / Motion Designer', 'Art Director', 'Voice Over Artist', '3D Modeler',
  'Podcast Editor', 'Influencer / Content Creator', 'Brand Strategist',

  // Business & Marketing
  'Accountant', 'Financial Advisor', 'Marketing Manager', 'Human Resources (HR)', 'Project Manager',
  'Business Consultant', 'SEO Specialist', 'Social Media Manager', 'E-commerce Specialist',
  'Virtual Assistant',

  // Legal
  'Lawyer', 'Paralegal',

  // Skilled Trades & Home Services
  'Electrician', 'Plumber', 'Carpenter', 'Mechanic', 'Chef', 'Hair Stylist', 'Fitness Trainer',
  'Yoga Instructor', 'HVAC Technician', 'Pest Control Specialist', 'Roofer', 'Painter',
  'Handyman', 'House Cleaner', 'Gardener / Landscaper', 'Home Organizer / Decluttering Specialist',
  'Pool Cleaner / Maintenance Technician', 'Window Cleaner', 'Appliance Repair Technician',
  'Locksmith', 'Carpet Cleaner', 'Furniture Assembler', 'Water Tank Cleaner',

  // Education
  'Teacher', 'Tutor', 'Professor', 'Academic Coach', 'Special Education Teacher',
  'Curriculum Developer', 'Career Counselor',

  // Coaching & Consulting
  'Life Coach', 'Career Coach', 'Business Coach', 'Public Speaking Coach',

  // Events & Lifestyle
  'Real Estate Agent', 'Event Planner', 'Wedding Planner', 'Travel Agent',
  'Personal Stylist', 'Makeup Artist', 'Driver / Chauffeur', 'Language Translator',
  'Personal Chef', 'Travel Blogger', 'Tour Guide', 'Bartender'
];

const occupationsList = [...new Set(allOccupations)].sort();

const ProfilePage = () => {
  const [formData, setFormData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiSuccess, setApiSuccess] = useState('');

  useEffect(() => {
    setFormData(dummyProfessionalData);
    setImagePreview(dummyProfessionalData.profileImage);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiSuccess('');

    const finalOccupation = formData.occupation === 'Other' && formData.customOccupation
      ? formData.customOccupation
      : formData.occupation;

    console.log("Final occupation:", finalOccupation);
    console.log("Submitting:", formData);
    if (profileImage) console.log("New image:", profileImage.name);

    setTimeout(() => {
      setLoading(false);
      setApiSuccess("Profile updated successfully!");
      setTimeout(() => setApiSuccess(''), 3000);
    }, 2000);
  };

  return (
    <div className="profile-page">
      <div className="profile-content">
        <h1>Edit Your Professional Profile</h1>
        <p>Keep your profile up-to-date to attract more clients.</p>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile-layout">

            <aside className="profile-sidebar">
              <div className="profile-picture-container">
                <img src={imagePreview} alt="Profile" className="profile-picture" />
                <label htmlFor="file-upload" className="edit-picture-label">
                  <FaEdit /> Change Picture
                </label>
                <input id="file-upload" type="file" onChange={handleFileChange} accept="image/*" />
              </div>
              <div className="profile-tip"><p>A professional photo helps you build trust with clients.</p></div>
            </aside>

            <main className="profile-form-content">
              {apiSuccess && <div className="api-success-message">{apiSuccess}</div>}

              <div className="form-section">
                <h2>Basic Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name"><FaUser /> Full Name</label>
                    <input type="text" id="name" name="name" value={formData.name || ''} onChange={handleInputChange} required />
                  </div>

                  <div className="form-group">
                    <label htmlFor="occupation"><FaBriefcase /> Occupation</label>
                    <select
                      id="occupation"
                      name="occupation"
                      value={formData.occupation || ''}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>-- Select an Occupation --</option>
                      {occupationsList.map(occ => (
                        <option key={occ} value={occ}>{occ}</option>
                      ))}
                      <option value="Other">Other (Please specify below)</option>
                    </select>
                  </div>
                </div>

                {formData.occupation === 'Other' && (
                  <div className="form-group">
                    <label htmlFor="customOccupation">Custom Occupation</label>
                    <input
                      type="text"
                      id="customOccupation"
                      name="customOccupation"
                      value={formData.customOccupation || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="bio">About / Bio</label>
                  <textarea id="bio" name="bio" value={formData.bio || ''} onChange={handleInputChange} rows="5" placeholder="Tell clients about your experience and what makes you great."></textarea>
                </div>
              </div>

              <div className="form-section">
                <h2>Professional Details</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="experience"><FaClock /> Years of Experience</label>
                    <input type="number" min="0" id="experience" name="experience" value={formData.experience || ''} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="hourlyRate"><FaDollarSign /> Hourly Rate</label>
                    <input type="number" min="0" id="hourlyRate" name="hourlyRate" value={formData.hourlyRate || ''} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="availability">Availability</label>
                  <input type="text" id="availability" name="availability" value={formData.availability || ''} onChange={handleInputChange} placeholder="e.g., Mon-Fri | 9AM - 5PM" />
                </div>
              </div>

              <div className="form-section">
                <h2>Contact & Location</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="email"><FaEnvelope /> Email Address</label>
                    <input type="email" id="email" name="email" value={formData.email || ''} disabled />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone"><FaPhone /> Phone Number</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone || ''} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="location"><FaMapMarkerAlt /> Your Location</label>
                  <input type="text" id="location" name="location" value={formData.location || ''} onChange={handleInputChange} placeholder="e.g., Mumbai, Maharashtra" />
                </div>
              </div>

              <div className="form-section">
                <h2>Online Presence</h2>
                <div className="form-group">
                  <label htmlFor="portfolioUrl"><FaLink /> Portfolio or Website URL</label>
                  <input type="url" id="portfolioUrl" name="portfolioUrl" value={formData.portfolioUrl || ''} onChange={handleInputChange} placeholder="https://yourwebsite.com" />
                </div>
              </div>

              <button type="submit" className="btn-save-profile" disabled={loading}>
                {loading ? <FaSpinner className="spinner" /> : 'Save Changes'}
              </button>
            </main>

          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;