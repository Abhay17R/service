import Appointment from '../models/appointmentModel.js';
import { catchAsyncError } from '../middleware/catchAsyncError.js';
import ErrorHandler from '../middleware/error.js';

// Controller 1: Naya Appointment Book Karna
export const createAppointment = catchAsyncError(async (req, res, next) => {
  const { professionalId, date, time } = req.body;
  const clientId = req.user.id;

  if (!professionalId || !date || !time) {
    return next(new ErrorHandler('Please provide professional, date, and time.', 400));
  }

  // ==> CHANGE: The model now defaults status to 'pending', so no change in logic is needed here.
  // We just update the success message to be more accurate.
  const appointment = await Appointment.create({
    client: clientId,
    professional: professionalId,
    date,
    time,
  });

  res.status(201).json({
    success: true,
    // ==> CHANGE: Updated message reflects the new flow.
    message: 'Appointment request sent successfully! You will be notified upon confirmation.',
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
// ==> CHANGE: Allow cancellation for 'pending' appointments as well.
export const cancelAppointment = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
        return next(new ErrorHandler('Appointment not found.', 404));
    }
    
    // Security check: Only client or professional can cancel.
    if (appointment.client.toString() !== req.user.id && appointment.professional.toString() !== req.user.id) {
        return next(new ErrorHandler('You are not authorized to perform this action.', 403));
    }

    // ==> CHANGE: A client can cancel 'upcoming' or 'pending' requests.
    if (!['upcoming', 'pending'].includes(appointment.status)) {
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
export const acceptAppointment = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
        return next(new ErrorHandler('Appointment not found.', 404));
    }

    // Security Check: Only the assigned professional can accept.
    if (appointment.professional.toString() !== req.user.id) {
        return next(new ErrorHandler('You are not authorized to accept this appointment.', 403));
    }

    if (appointment.status !== 'pending') {
        return next(new ErrorHandler('This appointment is no longer pending and cannot be accepted.', 400));
    }

    appointment.status = 'upcoming';
    await appointment.save();

    // You can also add a notification system here to inform the client.

    res.status(200).json({
        success: true,
        message: 'Appointment accepted successfully.'
    });
});

// Controller 6: Professional rejects an appointment request
export const rejectAppointment = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
        return next(new ErrorHandler('Appointment not found.', 404));
    }

    // Security Check: Only the assigned professional can reject.
    if (appointment.professional.toString() !== req.user.id) {
        return next(new ErrorHandler('You are not authorized to reject this appointment.', 403));
    }

    if (appointment.status !== 'pending') {
        return next(new ErrorHandler('This appointment is no longer pending and cannot be rejected.', 400));
    }

    appointment.status = 'rejected';
    await appointment.save();
    
    // You can also add a notification system here to inform the client.

    res.status(200).json({
        success: true,
        message: 'Appointment rejected successfully.'
    });
});

// Controller 7: Professional gets their appointments (to see pending requests)
export const getProfessionalAppointments = catchAsyncError(async (req, res, next) => {
  const appointments = await Appointment.find({ professional: req.user.id })
    .populate('client', 'name profileImage.url') // Populate client's details
    .sort({ date: -1, time: -1 });

  // This would be used in the professional's dashboard UI
  res.status(200).json({
    success: true,
    count: appointments.length,
    appointments,
  });
});