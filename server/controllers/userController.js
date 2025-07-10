  import User from '../models/userModel.js';
  import { catchAsyncError } from '../middleware/catchAsyncError.js';
  import ErrorHandler from '../middleware/error.js';
  import { sendToken } from '../utils/sendToken.js';
  import { sendEmail } from '../utils/sendEmail.js';
  import twilio from 'twilio';
  import dotenv from 'dotenv';
  import cloudinary from '../utils/cloudinary.js';
  import streamifier from 'streamifier';
  import crypto from 'crypto';


  // Initialize Twilio Client
  const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

  // --- HELPER FUNCTIONS FOR VERIFICATION ---

  function generateEmailTemplate(code) {
    return `
      <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
        <h2>Your Verification Code</h2>
        <p>Please use the code below to complete your registration.</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 5px; background: #f0f0f0; padding: 10px 20px; border-radius: 5px; display: inline-block;">
          ${code}
        </p>
        <p>This code is valid for 10 minutes.</p>
      </div>
    `;
  }

  async function sendVerificationCode(method, code, email, phone) {
    try {
      if (method === "email") {
        await sendEmail({
          email,
          subject: "ServiceLink Verification Code",
          message: generateEmailTemplate(code)
        });
      } else if (method === "phone") {
        const spacedCode = code.toString().split("").join(" ");
        await client.messages.create({
          body: `Your ServiceLink verification code is: ${code}`,
          from: process.env.TWILIO_NUM,
          to: phone,
        });
      } else {
        throw new ErrorHandler("Invalid verification method", 400);
      }
    } catch (error) {
      console.error("Verification sending error:", error);
      // User ko generic message bhejo
      throw new ErrorHandler("Failed to send verification code. Please check your contact details or try again later.", 500);
    }
  }

  // --- AUTHENTICATION CONTROLLERS ---

  // 1. REGISTER (Step 1: Get details and send OTP)
  export const register = catchAsyncError(async (req, res, next) => {
    const { name, email, phone, password, role, verificationMethod, occupation, location, bio } = req.body;

    if (!name || !email || !phone || !password || !role || !verificationMethod) {
      return next(new ErrorHandler("Please provide all required fields: name, email, phone, password, role, and verification method.", 400));
    }

    const existingVerifiedUser = await User.findOne({
      $or: [{ email, accountVerified: true }, { phone, accountVerified: true }],
    });
    if (existingVerifiedUser) {
      return next(new ErrorHandler("This email or phone number is already registered and verified.", 400));
    }

    // Purane unverified user ko dhundho ya naya banao
    let user = await User.findOne({ $or: [{ email }, { phone }] });

    const userData = { name, email, password, phone, role, location };
    if (role === 'professional') {
      if (!occupation) return next(new ErrorHandler("Occupation is required for professionals.", 400));
      userData.professionalDetails = { occupation, bio: bio || '' };
    }

    if (user) { // Agar unverified user hai toh update karo
      Object.assign(user, userData);
    } else { // Warna naya banao
      user = new User(userData);
    }
    
    const otp = user.generateVerificationCode();
    await user.save();

    await sendVerificationCode(verificationMethod, otp, user.email, user.phone);

    res.status(200).json({
      success: true,
      message: `Verification code sent to your ${verificationMethod}. Please verify to continue.`,
    });
  });

  // 2. VERIFY OTP (Step 2: Verify and complete registration)
  export const verifyOTP = catchAsyncError(async (req, res, next) => {
      const { email, otp } = req.body;
      if (!email || !otp) {
          return next(new ErrorHandler("Please provide email and OTP.", 400));
      }

    const user = await User.findOne({ email, accountVerified: false }).select('+verificationCode +verificationCodeExpire');
      if (!user) {
          return next(new ErrorHandler("User not found or already verified.", 404));
      }
      if (user.verificationCode !== otp || user.verificationCodeExpire < Date.now()) {
          return next(new ErrorHandler("Invalid or expired OTP.", 400));
      }

      user.accountVerified = true;
      user.verificationCode = undefined;
      user.verificationCodeExpire = undefined;
      await user.save();
      
      sendToken(user, 200, "Account verified successfully! You are now logged in.", res);
  });


  // 3. LOGIN
  export const login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler("Please provide email and password.", 400));
    }
    // Login ke liye account verified hona zaroori hai
    const user = await User.findOne({ email, accountVerified: true }).select('+password');
    if (!user) {
      return next(new ErrorHandler("Invalid credentials or account not verified.", 401));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid credentials.", 401));
    }
    sendToken(user, 200, "Logged in successfully!", res);
  });


  // 4. LOGOUT
  export const logout = catchAsyncError(async (req, res, next) => {
    const cookieOptions = {
      expires: new Date(Date.now()),
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
    };
    res.status(200).cookie("token", null, cookieOptions).json({
      success: true,
      message: "Logged out successfully.",
    });
  });

  // --- PROFILE & USER MANAGEMENT ---

  export const getMyProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
  });

// ==> YEH NAYA CODE APNI userController.js FILE MEIN PASTE KAREIN <==
// Purane 'updateMyProfile' function ko isse replace karein

export const updateMyProfile = catchAsyncError(async (req, res, next) => {
  // Saare possible fields ko request body se lein
  const { 
    name, 
    location, 
    bio, 
    experience, 
    hourlyRate, 
    availability,
    portfolioUrl,
    occupation, // Sabse important field
    customOccupation
  } = req.body;

  const user = await User.findById(req.user.id);

  // Common fields jo client aur professional dono ke liye hain
  if (name) user.name = name;
  if (location) user.location = location;

  // ==> NAYA LOGIC YAHAN HAI <==
  const finalOccupation = occupation === 'Other' ? customOccupation : occupation;

  // Agar user ne koi occupation select kiya hai (bhale hi woh client ho)
  if (finalOccupation && finalOccupation.trim() !== '') {
    
    // Step 1: User ka role 'professional' set kar do
    user.role = 'professional';

    // Step 2: Check karo ki 'professionalDetails' object hai ya nahi.
    // Agar nahi hai, toh ek khali object bana do taaki crash na ho.
    if (!user.professionalDetails) {
      user.professionalDetails = {};
    }

    // Step 3: Ab saari professional details save karo
    user.professionalDetails.occupation = finalOccupation;
    if (bio) user.professionalDetails.bio = bio;
    if (experience) user.professionalDetails.experience = experience;
    if (hourlyRate) user.professionalDetails.hourlyRate = hourlyRate;
    if (availability) user.professionalDetails.availability = availability;
    if (portfolioUrl) user.professionalDetails.portfolioUrl = portfolioUrl;
  }
  
  // User document ko database mein save karo
  await user.save();
  
  res.status(200).json({ 
    success: true, 
    message: "Profile updated successfully.", 
    user // Updated user ko response mein bhejo
  });
});

  export const updateProfileImage = catchAsyncError(async (req, res, next) => {
    if (!req.file) return next(new ErrorHandler('Please upload an image.', 400));

    const user = await User.findById(req.user.id);
    if (user.profileImage && user.profileImage.public_id !== 'default_profile_image_public_id') {
      await cloudinary.uploader.destroy(user.profileImage.public_id);
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "servicelink_profiles", width: 250, crop: "fill", gravity: "face" },
        (error, result) => result ? resolve(result) : reject(error)
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });

    user.profileImage = { public_id: result.public_id, url: result.secure_url };
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully.",
      profileImage: user.profileImage,
    });
  });

  // --- PROFESSIONAL-SPECIFIC CONTROLLERS ---

  export const getAllProfessionals = catchAsyncError(async (req, res, next) => {
    const { occupation } = req.query;
    const query = { role: 'professional', accountVerified: true };

    if (occupation) {
      query['professionalDetails.occupation'] = new RegExp(occupation, 'i');
    }
    const professionals = await User.find(query).select('-password -notifications');
    res.status(200).json({ success: true, count: professionals.length, professionals });
  });

  // ==> YEH NAYA FUNCTION APNI userController.js FILE MEIN PASTE KAREIN <==

 // Ensure ErrorHandler is imported

export const getProfessionalById = catchAsyncError(async (req, res, next) => {
  // Step 1: URL se professional ki ID nikalo
  const professionalId = req.params.id;

  // Step 2: Database se professional ko dhoondo
  // .populate() bahut zaroori hai. Yeh reviews ke saath-saath,
  // review dene wale user ka naam aur profile image bhi laayega.
  const professional = await User.findById(professionalId).populate({
    path: 'reviews', // User model ke 'reviews' array ko populate karo
    populate: {
      path: 'user', // Har review ke andar 'user' field ko populate karo
      select: 'name profileImage.url' // User se sirf naam aur image URL lao
    }
  });

  // Step 3: Agar professional nahi mila, ya woh client hai, toh error bhejo
  if (!professional || professional.role !== 'professional') {
    return next(new ErrorHandler("Professional not found.", 404));
  }

  // Step 4: Sab sahi hai, toh professional ka data response mein bhej do
  res.status(200).json({
    success: true,
    professional,
  });
});


  // --- PASSWORD MANAGEMENT ---

  export const forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email, accountVerified: true });
    if (!user) return next(new ErrorHandler("User with this email not found or is not verified.", 404));

    const resetToken = user.generateResetToken();
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const message = `Click this link to reset your password: \n\n${resetPasswordUrl}`;
    try {
      await sendEmail({ email: user.email, subject: 'Password Reset', message });
      res.status(200).json({ success: true, message: `Email sent to ${user.email}.` });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new ErrorHandler(error.message, 500));
    }
  });

  export const resetPassword = catchAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) return next(new ErrorHandler("Reset token is invalid or has expired.", 400));
    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler("Passwords do not match.", 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, "Password updated successfully!", res);
  });
  // userController.js ke andar baaki functions ke saath isko add karein

  export const resendOTP = catchAsyncError(async (req, res, next) => {
      const { email, verificationMethod } = req.body;

      if (!email || !verificationMethod) {
          return next(new ErrorHandler("Please provide email and verification method.", 400));
      }

      const user = await User.findOne({ email, accountVerified: false });
      if (!user) {
          return next(new ErrorHandler("User not found or is already verified.", 404));
      }
      
      // Naya OTP generate karein
      const otp = user.generateVerificationCode();
      await user.save();

      // OTP bhej dein
      await sendVerificationCode(verificationMethod, otp, user.email, user.phone);

      res.status(200).json({
          success: true,
          message: `A new verification code has been sent to your ${verificationMethod}.`,
      });
  });
  // ==> YEH NAYA CODE APNI userController.js FILE KE END MEIN ADD KAREIN <==

/// ==> YEH DONO NAYE FUNCTIONS APNI userController.js FILE MEIN PASTE KAREIN <==
// Purane 'getDashboardProfessionals' aur 'getUniqueOccupations' ko isse replace karein

// 1. DASHBOARD KE LIYE BULLETPROOF FUNCTION
// ==> FINAL BULLETPROOF CODE - isse purane functions ko replace karein <==

// 1. FINAL DASHBOARD PROFESSIONALS FUNCTION
// Purane getDashboardProfessionals function ko isse replace karein

export const getDashboardProfessionals = async (req, res, next) => {
  try {
    const { occupation } = req.query;

    const query = { 
      role: 'professional', 
      accountVerified: true,
      'professionalDetails.occupation': { $exists: true, $ne: "" } 
    };

    if (occupation && occupation.toLowerCase() !== 'all') {
      query['professionalDetails.occupation'] = new RegExp(occupation, 'i');
    }
    
    const professionals = await User.find(query).select('-password -notifications');
    
    const formattedProfessionals = professionals.map(p => ({
        id: p._id,
        name: p.name,
        occupation: p.professionalDetails?.occupation || 'N/A',
        location: p.location || 'Not Specified',
        rating: p.averageRating || 0,
        // ==> FIX YAHAN HAI <==
        // Ab yeh crash nahi hoga agar profileImage null hai. Ek default image dikhayega.
        imageUrl: p.profileImage?.url || 'https://i.ibb.co/4pDNDk1/avatar.png', 
    }));

    res.status(200).json({ 
      success: true, 
      count: formattedProfessionals.length, 
      professionals: formattedProfessionals 
    });

  } catch (error) {
    // Agar koi aur anjaan error aaye, toh server crash nahi hoga
    console.error("ERROR IN getDashboardProfessionals:", error);
    return next(new ErrorHandler("Server error while fetching professionals.", 500));
  }
};

// 2. FINAL UNIQUE OCCUPATIONS FUNCTION
export const getUniqueOccupations = async (req, res, next) => {
  try {
    const occupations = await User.distinct('professionalDetails.occupation', { 
      role: 'professional', 
      accountVerified: true,
      'professionalDetails.occupation': { $exists: true, $ne: "" }
    });

    res.status(200).json({
        success: true,
        occupations,
    });

  } catch (error) {
    // Agar phir bhi koi error aaye, toh server crash nahi hoga
    console.error("CRASH IN getUniqueOccupations:", error);
    return next(new ErrorHandler("Server error while fetching occupations.", 500));
  }
};