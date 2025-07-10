import express from 'express';
import {
    createAppointmentAndNotify,
    getMyAppointments,
    cancelAppointment,
    rescheduleAppointment,
    acceptAppointment,
    rejectAppointment,
    getProfessionalAppointments
} from '../controllers/appointmentController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Saare appointment routes ke liye user ka logged-in hona zaroori hai.
router.use(isAuthenticated);


// ==================================================
//               CLIENT-FACING ROUTES
// ==================================================

// Client ek naya appointment book karta hai
router.route('/book').post(createAppointmentAndNotify);

// Client apne saare appointments dekhta hai
router.route('/my').get(getMyAppointments);

// Client ek 'pending' ya 'upcoming' appointment cancel karta hai
router.route('/:id/cancel').put(cancelAppointment);

// Client ek 'upcoming' appointment reschedule karta hai
router.route('/:id/reschedule').put(rescheduleAppointment);


// ==================================================
//             PROFESSIONAL-FACING ROUTES
// ==================================================

// Professional apne saare appointments dekhta hai
router.route('/professional/my').get(getProfessionalAppointments);

// Professional ek 'pending' request ko accept karta hai
router.route('/:id/accept').put(acceptAppointment);

// Professional ek 'pending' request ko reject karta hai
router.route('/:id/reject').put(rejectAppointment);


export default router;