import express from 'express';
import multer from 'multer';
import {
  register,
  verifyOTP,
  login,
  logout,
  resendOTP,
  getMyProfile,
  updateMyProfile,
  updateProfileImage,
  getAllProfessionals,
  getProfessionalById,
  getDashboardProfessionals,
  getUniqueOccupations,
  forgotPassword,
  resetPassword,
  
} from '../controllers/userController.js';
import { isAuthenticated } from '../middleware/auth.js'; // Maan ke chal raha hoon ki tumhari auth middleware yahan hai

const router = express.Router();

// --- MULTER SETUP FOR IMAGE UPLOAD ---
// Yeh image ko સીધા buffer (memory) mein store karega, taaki usko Cloudinary par bheja ja sake.
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
}).single('file');

//====================================================//
//              AUTHENTICATION ROUTES                 //
//====================================================//

// Step 1: User details submit karke OTP mangwayegaa
router.route("/register").post(register);

// Step 2: OTP enter karke account verify karega
router.route("/verify").post(verifyOTP);

// Login
router.route("/login").post(login);

// Logout (Authenticated user hi logout kar sakta hai)
router.route("/logout").get(isAuthenticated, logout);


//====================================================//
//          PROFILE & USER MANAGEMENT ROUTES          //
//====================================================//

router.route("/me").get(isAuthenticated, getMyProfile);


router.route("/me/update").put(isAuthenticated, updateMyProfile);

// Apni profile image update karna (file upload)
// 'upload' middleware pehle chalega, phir controller
router.route("/resend-otp").post(resendOTP);
router.route("/me/image/update").put(isAuthenticated, upload, updateProfileImage);


//====================================================//
//         PUBLIC ROUTES (PROFESSIONALS)              //
//====================================================//



router.route("/professionals").get(getAllProfessionals);

// Kisi ek professional ki detail profile dekhna (ID se)
router.route("/professional/:id").get(getProfessionalById);


//====================================================//
//              PASSWORD MANAGEMENT ROUTES            //
//====================================================//

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);



router.route("/professional/:id").get(getProfessionalById);
router.route("/dashboard/professionals").get(getDashboardProfessionals);
router.route("/dashboard/occupations").get(getUniqueOccupations);



export default router;