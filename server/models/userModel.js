import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Phone number zaroori hai verification ke liye
    phone: {
      type: String,
      required: [true, 'Please provide your phone number'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'professional'],
      default: 'user',
    },
    profileImage: {
      public_id: {
        type: String,
        default: 'default_profile_image_public_id',
      },
      url: {
        type: String,
        default: 'https://i.ibb.co/4pDNDk1/avatar.png',
      },
    },
    location: {
      type: String,
      trim: true,
    },
    professionalDetails: {
      occupation: { type: String, trim: true },
      bio: { type: String, maxlength: 500 },
      experience: { type: Number },
      hourlyRate: { type: Number },
      availability: { type: String },
    },
    reviews: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    }],
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    notifications: [{
      message: { type: String, required: true },
      read: { type: Boolean, default: false },
      link: String,
      createdAt: { type: Date, default: Date.now },
    }],

    // --- OTP & Verification Fields ---
    accountVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: Number,
    verificationCodeExpire: Date,

    // --- Password Reset Fields ---
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// --- MIDDLEWARE & METHODS ---

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Naya method: OTP generate karne ke liye
userSchema.methods.generateVerificationCode = function () {
    const verificationCode = Math.floor(10000 + Math.random() * 90000).toString(); // 5 digit OTP
    this.verificationCode = verificationCode;
    this.verificationCodeExpire = Date.now() + 10 * 60 * 1000; // 10 minute expiry
    return verificationCode;
};

userSchema.methods.generateResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);
export default User;