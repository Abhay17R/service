// utils/sendToken.js (CORRECTED & COMPLETE CODE)

export const sendToken = async (user, statusCode, message, res) => {
  const token = await user.generateToken();

  // Sirf zaruri fields frontend ko bhejo
  const { _id, name, email, phone, role } = user; // Irrelevant fields hata diye

  // *** YAHAN PAR FIX HAI ***
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Prevents client-side JS from accessing the cookie
    secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Required for cross-site cookies
  };

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions) // Updated options
    .json({
      success: true,
      message,
      // token, // Security ke liye, token ko body me na bhejkar sirf cookie me bhejein
      user: { _id, name, email, phone, role },
    });
};