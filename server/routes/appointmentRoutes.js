import express from 'express';
import { createAppointment, getMyAppointments, cancelAppointment } from '../controllers/appointmentController.js';
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



export default router;