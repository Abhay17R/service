import axios from 'axios';

// Ek naya axios instance banate hain
const API = axios.create({
  // Vite ke tareeke se environment variable ko access karein
  baseURL: import.meta.env.VITE_API_URL, 
  
  withCredentials: true, 
});

export default API;