import Review from '../models/reviewModel.js';
import Appointment from '../models/appointmentModel.js';
import { catchAsyncError } from '../middleware/catchAsyncError.js';
import ErrorHandler from '../middleware/error.js';

export const createReview = catchAsyncError(async (req, res, next) => {
    const { appointmentId, rating, comment } = req.body;
    
    const appointment = await Appointment.findById(appointmentId);
    if(!appointment) {
        return next(new ErrorHandler('Appointment not found.', 404));
    }
    // Check: Sirf completed appointment par hi review de sakte hain
    if(appointment.status !== 'completed') {
        return next(new ErrorHandler('You can only review a completed appointment.', 400));
    }
    // Check: User aekdam sahi hai
    if(appointment.client.toString() !== req.user.id) {
        return next(new ErrorHandler('You are not authorized to review this appointment.', 403));
    }

    const review = await Review.create({
        appointment: appointmentId,
        user: req.user.id,
        professional: appointment.professional,
        rating,
        comment
    });

    res.status(201).json({ success: true, message: "Review submitted successfully!", review });
});