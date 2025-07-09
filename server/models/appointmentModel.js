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
      enum: ['upcoming', 'completed', 'cancelled'],
      default: 'upcoming',
    },
  },
  {
    timestamps: true, // createdAt aur updatedAt fields automatically add karega
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;