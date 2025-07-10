import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // User model ko refer karega
      required: true,
    },
    professional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Yeh bhi User model ko refer karega
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Please provide an appointment date.'],
    },
    time: {
      type: String,
      required: [true, 'Please provide an appointment time.'],
    },
    status: {
      type: String,
       // ==> CHANGE: Added 'pending' and 'rejected'.
      enum: ['pending', 'upcoming', 'completed', 'cancelled', 'rejected'],
      // ==> CHANGE: Default status is now 'pending'.
      default: 'pending',
    },
  },
  {
    timestamps: true, // createdAt aur updatedAt fields automatically add karega
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;