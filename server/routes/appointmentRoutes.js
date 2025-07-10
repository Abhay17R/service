import express from 'express';
import { createAppointment, getMyAppointments, cancelAppointment,rescheduleAppointment, acceptAppointment,
    rejectAppointment,
    getProfessionalAppointments } from '../controllers/appointmentController.js';
import { isAuthenticated } from '../middleware/auth.js';


const router = express.Router();

// Saare routes protected hain, isliye user ka logged-in hona zaroori hai
router.use(isAuthenticated);

// Route 1: Naya appointment book karne ke liye
// POST /api/v1/appointments/book
router.route('/book').post(createAppointment);

// Route 2: Apne saare appointments dekhne ke liye
// GET /api/v1/appointments/my
router.route('/my').get(getMyAppointments);

// Route 3: Ek specific appointment cancel karne ke liye
// PUT /api/v1/appointments/:id/cancel
router.route('/:id/cancel').put(cancelAppointment);
router.route('/:id/reschedule').put(rescheduleAppointment);
router.route('/professional/my').get(getProfessionalAppointments); // Get all appointments for a professional
router.route('/:id/accept').put(acceptAppointment); // Professional accepts a request
router.route('/:id/reject').put(rejectAppointment); 



export default router;