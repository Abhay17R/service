import Appointment from '../models/appointmentModel.js';
import { catchAsyncError } from '../middleware/catchAsyncError.js';
import ErrorHandler from '../middleware/error.js';

// Controller 1: Naya Appointment Book Karna
export const createAppointment = catchAsyncError(async (req, res, next) => {
  const { professionalId, date, time } = req.body;
  const clientId = req.user.id; // Yeh isAuthenticated middleware se aayega

  if (!professionalId || !date || !time) {
    return next(new ErrorHandler('Please provide professional, date, and time.', 400));
  }

  const appointment = await Appointment.create({
    client: clientId,
    professional: professionalId,
    date,
    time,
  });

  res.status(201).json({
    success: true,
    message: 'Appointment booked successfully!',
    appointment,
  });
});

// Controller 2: Logged-in User ke Saare Appointments Fetch Karna
export const getMyAppointments = catchAsyncError(async (req, res, next) => {
  const appointments = await Appointment.find({ client: req.user.id })
    .populate('professional', 'name professionalDetails.occupation profileImage.url') // Professional ki details fetch karega
    .sort({ date: -1 }); // Naye appointments pehle dikhayega

  // Frontend ke format se match karne ke liye data ko format karein
  const formattedAppointments = appointments.map(app => ({
    id: app._id,
    professionalName: app.professional.name,
    professionalOccupation: app.professional.professionalDetails.occupation,
    imageUrl: app.professional.profileImage.url,
    date: app.date,
    time: app.time,
    status: app.status
  }));

  res.status(200).json({
    success: true,
    count: formattedAppointments.length,
    appointments: formattedAppointments,
  });
});

// Controller 3: Appointment Cancel Karna
export const cancelAppointment = catchAsyncError(async (req, res, next) => {
    const { id } = req.params; // URL se appointment ki ID
    
    const appointment = await Appointment.findById(id);

    if (!appointment) {
        return next(new ErrorHandler('Appointment not found.', 404));
    }

    // Security Check: Sirf wahi user cancel kar sakta hai jisne book kiya hai
    if (appointment.client.toString() !== req.user.id) {
        return next(new ErrorHandler('You are not authorized to cancel this appointment.', 403));
    }

    // Sirf 'upcoming' appointment hi cancel ho sakta hai
    if (appointment.status !== 'upcoming') {
        return next(new ErrorHandler(`Cannot cancel a ${appointment.status} appointment.`, 400));
    }
    
    appointment.status = 'cancelled';
    await appointment.save();

    res.status(200).json({
        success: true,
        message: 'Appointment cancelled successfully.'
    });
});
// ... baaki ke imports
// ... createAppointment, getMyAppointments, cancelAppointment functions waise hi rahenge

// ==> Yahan naya controller add karein
export const rescheduleAppointment = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const { date, time } = req.body;

    if(!date || !time) {
        return next(new ErrorHandler('Please provide new date and time.', 400));
    }

    let appointment = await Appointment.findById(id);
    if (!appointment) {
        return next(new ErrorHandler('Appointment not found.', 404));
    }
    if (appointment.client.toString() !== req.user.id) {
        return next(new ErrorHandler('You are not authorized to reschedule this appointment.', 403));
    }
    if (appointment.status !== 'upcoming') {
        return next(new ErrorHandler(`Cannot reschedule a ${appointment.status} appointment.`, 400));
    }
    
    appointment.date = date;
    appointment.time = time;
    await appointment.save();

    res.status(200).json({ success: true, message: 'Appointment rescheduled successfully.', appointment });
});