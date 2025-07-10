import Appointment from '../models/appointmentModel.js';
import Conversation from '../models/conversationModel.js';
import Message from '../models/messageModel.js';
import { catchAsyncError } from '../middleware/catchAsyncError.js';
import ErrorHandler from '../middleware/error.js';
import { getIO as getIo, getUserSocketId as getReceiverSocketId } from '../socket/socket.js';


// ===================================================================================
// CONTROLLER 1: CLIENT BOOKS AN APPOINTMENT (APPOINTMENT BANAO + CHAT MEIN MSG BHEJO)
// ===================================================================================
export const createAppointmentAndNotify = catchAsyncError(async (req, res, next) => {
  const { professionalId, date, time, notes } = req.body;
  const clientId = req.user.id;

  if (!professionalId || !date || !time) {
    return next(new ErrorHandler('Professional, date, and time are required.', 400));
  }

  const appointment = await Appointment.create({
    client: clientId,
    professional: professionalId,
    date,
    time,
    notes,
    status: 'pending',
  });

  let conversation = await Conversation.findOne({
    participants: { $all: [clientId, professionalId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [clientId, professionalId],
    });
  }

  const chatMessage = `Hi! I've just sent an appointment request for ${new Date(date).toLocaleDateString()} at ${time}. Please check your appointments to confirm.`;
  
  const newMessage = new Message({
    senderId: clientId,
    receiverId: professionalId,
    message: chatMessage,
  });

  if (newMessage) {
    conversation.messages.push(newMessage._id);
    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(professionalId);
    if (receiverSocketId) {
      getIo().to(receiverSocketId).emit('newMessage', newMessage);
    }
  }

  res.status(201).json({
    success: true,
    message: 'Appointment request sent successfully! You will be notified upon confirmation.',
    appointment,
  });
});

// ================================================================
// CONTROLLER 2: CLIENT GETS THEIR OWN APPOINTMENTS
// ================================================================
export const getMyAppointments = catchAsyncError(async (req, res, next) => {
  const appointments = await Appointment.find({ client: req.user.id })
    .populate('professional', 'name professionalDetails.occupation profileImage.url')
    .sort({ date: -1 });

  const formattedAppointments = appointments.map(app => ({
    id: app._id,
    professionalId: app.professional._id,
    professionalName: app.professional.name,
    professionalOccupation: app.professional.professionalDetails?.occupation,
    imageUrl: app.professional.profileImage?.url,
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

// ================================================================
// CONTROLLER 3: PROFESSIONAL GETS THEIR APPOINTMENTS
// ================================================================
export const getProfessionalAppointments = catchAsyncError(async (req, res, next) => {
    const appointments = await Appointment.find({ professional: req.user.id })
      .populate('client', 'name profileImage.url')
      .sort({ createdAt: -1 });
  
    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
});

// ================================================================
// CONTROLLER 4: PROFESSIONAL ACCEPTS AN APPOINTMENT
// ================================================================
export const acceptAppointment = catchAsyncError(async (req, res, next) => {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return next(new ErrorHandler('Appointment not found.', 404));
    if (appointment.professional.toString() !== req.user.id) return next(new ErrorHandler('Not authorized.', 403));
    if (appointment.status !== 'pending') return next(new ErrorHandler('Appointment is no longer pending.', 400));
    
    appointment.status = 'upcoming';
    await appointment.save();
    res.status(200).json({ success: true, message: 'Appointment accepted.' });
});

// ================================================================
// CONTROLLER 5: PROFESSIONAL REJECTS AN APPOINTMENT
// ================================================================
export const rejectAppointment = catchAsyncError(async (req, res, next) => {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return next(new ErrorHandler('Appointment not found.', 404));
    if (appointment.professional.toString() !== req.user.id) return next(new ErrorHandler('Not authorized.', 403));
    if (appointment.status !== 'pending') return next(new ErrorHandler('Appointment is no longer pending.', 400));
    
    appointment.status = 'rejected';
    await appointment.save();
    res.status(200).json({ success: true, message: 'Appointment rejected.' });
});

// ================================================================
// CONTROLLER 6: CLIENT CANCELS AN APPOINTMENT
// ================================================================
export const cancelAppointment = catchAsyncError(async (req, res, next) => {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return next(new ErrorHandler('Appointment not found.', 404));
    if (appointment.client.toString() !== req.user.id) return next(new ErrorHandler('Not authorized.', 403));
    if (!['upcoming', 'pending'].includes(appointment.status)) return next(new ErrorHandler(`Cannot cancel a ${appointment.status} appointment.`, 400));
    
    appointment.status = 'cancelled';
    await appointment.save();
    res.status(200).json({ success: true, message: 'Appointment cancelled.' });
});

// ================================================================
// CONTROLLER 7: CLIENT RESCHEDULES AN APPOINTMENT
// ================================================================
export const rescheduleAppointment = catchAsyncError(async (req, res, next) => {
    const { date, time } = req.body;
    if(!date || !time) return next(new ErrorHandler('Please provide new date and time.', 400));

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return next(new ErrorHandler('Appointment not found.', 404));
    if (appointment.client.toString() !== req.user.id) return next(new ErrorHandler('Not authorized.', 403));
    if (appointment.status !== 'upcoming') return next(new ErrorHandler(`Cannot reschedule a ${appointment.status} appointment.`, 400));
    
    appointment.date = date;
    appointment.time = time;
    await appointment.save();
    res.status(200).json({ success: true, message: 'Appointment rescheduled.', appointment });
});