// src/pages/ProfilePage.jsx (Fully Integrated)

import React, { useState, useEffect, useCallback } from 'react';
import {
  FaUser, FaBriefcase, FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock,
  FaDollarSign, FaLink, FaEdit, FaSpinner
} from 'react-icons/fa';
import api from '../api/axios'; // Apne configured axios instance ko import karein
import '../styles/profile.css';

// ... (occupationsList array remains the same)
const allOccupations = [
  "Accountant",
  "Actor",
  "Architect",
  "Artist",
  "Astrologer",
  "Attorney",
  "Baker",
  "Barber",
  "Beautician",
  "Carpenter",
  "Chef",
  "Coach",
  "Consultant",
  "Content Writer",
  "Counselor",
  "Data Analyst",
  "Dentist",
  "Dietitian",
  "Doctor",
  "Electrician",
  "Engineer",
  "Event Planner",
  "Fashion Designer",
  "Financial Advisor",
  "Fitness Trainer",
  "Freelancer",
  "Graphic Designer",
  "Interior Designer",
  "Journalist",
  "Lawyer",
  "Makeup Artist",
  "Marketing Specialist",
  "Mechanic",
  "Mobile Repair Technician",
  "Model",
  "Musician",
  "Nutritionist",
  "Online Tutor",
  "Painter",
  "Personal Assistant",
  "Personal Trainer",
  "Pet Groomer",
  "Pharmacist",
  "Photographer",
  "Physiotherapist",
  "Plumber",
  "Professor",
  "Psychologist",
  "Real Estate Agent",
  "Software Developer",
  "Tattoo Artist",
  "Teacher",
  "Therapist",
  "Translator",
  "Tutor",
  "UX/UI Designer",
  "Videographer",
  "Virtual Assistant",
  "Web Developer",
  "Wedding Planner",
  "Writer",
   "Aerospace Engineer",
  "Agricultural Engineer",
  "Automobile Engineer",
  "Biomedical Engineer",
  "Chemical Engineer",
  "Civil Engineer",
  "Computer Engineer",
  "Data Engineer",
  "Design Engineer",
  "Electrical Engineer",
  "Electronics Engineer",
  "Embedded Systems Engineer",
  "Environmental Engineer",
  "Geotechnical Engineer",
  "Hardware Engineer",
  "Industrial Engineer",
  "Instrumentation Engineer",
  "Manufacturing Engineer",
  "Marine Engineer",
  "Materials Engineer",
  "Mechanical Engineer",
  "Mechatronics Engineer",
  "Mining Engineer",
  "Network Engineer",
  "Petroleum Engineer",
  "Computer Science Engineer"
 
];


const occupationsList = [...new Set(allOccupations)].sort();


const ProfilePage = () => {
  const [formData, setFormData] = useState({});
  const [profileImage, setProfileImage] = useState(null); // For new file upload
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiSuccess, setApiSuccess] = useState('');
  const [apiError, setApiError] = useState('');

  // 1. FETCH USER PROFILE DATA FROM BACKEND
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/me');
      
      // Backend se aaye data ko state mein set karein
      // Professional details ko flatten karein taaki form fields se match ho
      const profileData = {
          ...data.user,
          ...data.user.professionalDetails,
      };
      delete profileData.professionalDetails; // Redundant object ko hata dein

      setFormData(profileData);
      setImagePreview(data.user.profileImage.url);

    } catch (err) {
      setApiError('Failed to load profile data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);


  // 2. FORM INPUT HANDLERS (no change needed)
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


  // 3. HANDLE FORM SUBMISSION TO BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiSuccess('');
    setApiError('');

    try {
      // Step A: Update text-based data
      const textUpdatePayload = { ...formData };
      
      // Agar occupation 'Other' hai, to 'customOccupation' ko 'occupation' mein set karein
      if (textUpdatePayload.occupation === 'Other' && textUpdatePayload.customOccupation) {
          textUpdatePayload.occupation = textUpdatePayload.customOccupation;
      }
      delete textUpdatePayload.customOccupation; // Is extra field ko backend par nahi bhejna

      await api.put('/me/update', textUpdatePayload);

      // Step B: Agar nayi profile image select ki gayi hai, to usko upload karein
      if (profileImage) {
        const imageFormData = new FormData();
        imageFormData.append('file', profileImage); // 'file' naam backend ke multer se match hona chahiye

        await api.put('/me/image/update', imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setApiSuccess("Profile updated successfully!");
      // Optionally, refetch profile to see all changes reflected
      fetchProfile();

    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred while updating the profile.";
      setApiError(errorMessage);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setApiSuccess('');
        setApiError('');
      }, 4000);
    }
  };

  if (loading && !formData.name) {
      return <div className="loader"></div>; // Initial loading state
  }

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
                <label htmlFor="file-upload" className="edit-picture-label"><FaEdit /> Change Picture</label>
                <input id="file-upload" type="file" onChange={handleFileChange} accept="image/*" />
              </div>
              <div className="profile-tip"><p>A professional photo helps you build trust with clients.</p></div>
            </aside>

            <main className="profile-form-content">
              {apiSuccess && <div className="api-success-message">{apiSuccess}</div>}
              {apiError && <div className="api-error-message">{apiError}</div>}

              {/* All form sections will now be populated with data from the `formData` state */}
              
              <div className="form-section">
                <h2>Basic Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name"><FaUser /> Full Name</label>
                    <input type="text" id="name" name="name" value={formData.name || ''} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="occupation"><FaBriefcase /> Occupation</label>
                    <select id="occupation" name="occupation" value={formData.occupation || ''} onChange={handleInputChange} required>
                      <option value="" disabled>-- Select an Occupation --</option>
                      {occupationsList.map(occ => (<option key={occ} value={occ}>{occ}</option>))}
                      <option value="Other">Other (Please specify below)</option>
                    </select>
                  </div>
                </div>
                {formData.occupation === 'Other' && (
                  <div className="form-group"><label htmlFor="customOccupation">Custom Occupation</label><input type="text" id="customOccupation" name="customOccupation" value={formData.customOccupation || ''} onChange={handleInputChange} required /></div>
                )}
                <div className="form-group"><label htmlFor="bio">About / Bio</label><textarea id="bio" name="bio" value={formData.bio || ''} onChange={handleInputChange} rows="5" placeholder="Tell clients about your experience..."></textarea></div>
              </div>

              <div className="form-section">
                <h2>Professional Details</h2>
                <div className="form-grid">
                  <div className="form-group"><label htmlFor="experience"><FaClock /> Years of Experience</label><input type="number" min="0" id="experience" name="experience" value={formData.experience || ''} onChange={handleInputChange} /></div>
                  <div className="form-group"><label htmlFor="hourlyRate"><FaDollarSign /> Hourly Rate</label><input type="number" min="0" id="hourlyRate" name="hourlyRate" value={formData.hourlyRate || ''} onChange={handleInputChange} /></div>
                </div>
                <div className="form-group"><label htmlFor="availability">Availability</label><input type="text" id="availability" name="availability" value={formData.availability || ''} onChange={handleInputChange} placeholder="e.g., Mon-Fri | 9AM - 5PM" /></div>
              </div>

              <div className="form-section">
                <h2>Contact & Location</h2>
                <div className="form-grid">
                  <div className="form-group"><label htmlFor="email"><FaEnvelope /> Email Address</label><input type="email" id="email" name="email" value={formData.email || ''} disabled /></div>
                  <div className="form-group"><label htmlFor="phone"><FaPhone /> Phone Number</label><input type="tel" id="phone" name="phone" value={formData.phone || ''} onChange={handleInputChange} /></div>
                </div>
                <div className="form-group"><label htmlFor="location"><FaMapMarkerAlt /> Your Location</label><input type="text" id="location" name="location" value={formData.location || ''} onChange={handleInputChange} placeholder="e.g., Mumbai, Maharashtra" /></div>
              </div>
              
              <div className="form-section">
                <h2>Online Presence</h2>
                <div className="form-group"><label htmlFor="portfolioUrl"><FaLink /> Portfolio or Website URL</label><input type="url" id="portfolioUrl" name="portfolioUrl" value={formData.portfolioUrl || ''} onChange={handleInputChange} placeholder="https://yourwebsite.com" /></div>
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