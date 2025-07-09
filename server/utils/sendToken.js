// This function generates a token, sets it in an HTTP-only cookie, and sends a JSON response.

export const sendToken = async (user, statusCode, message, res) => {
  // 1. Generate a JWT token for the user instance.
  const token = await user.generateToken();

  // 2. Define the options for the cookie.
  const cookieOptions = {
    // The cookie will expire in the number of days specified in the .env file.
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    
    // httpOnly: true prevents the cookie from being accessed by client-side JavaScript.
    // This is a crucial security measure to prevent XSS attacks.
    httpOnly: true,

    // secure: true ensures the cookie is only sent over HTTPS.
    // This should only be true in a production environment.
    secure: process.env.NODE_ENV === "production",

    // sameSite: 'Lax' is good for development. 'None' is needed for cross-site cookies in production
    // and requires secure: true.
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",

    // ===> THIS IS THE KEY FIX <===
    // domain: 'localhost' explicitly tells the browser that this cookie is valid for any
    // request to any port on the 'localhost' domain (e.g., from :5173 to :4000).
    // In production, you would change this to your actual domain (e.g., "yourwebsite.com").
    domain: process.env.NODE_ENV === "production" ? ".your-production-domain.com" : "localhost",
  };

  // 3. Destructure the user object to send only the necessary data to the frontend.
  const { _id, name, email, phone, role } = user;

  // 4. Send the response.
  res
    .status(statusCode)
    // Set the cookie on the response with the generated token and options.
    .cookie("token", token, cookieOptions) 
    // Send the final JSON response to the client.
    .json({
      success: true,
      message,
      // It's good practice not to send the token in the body if it's already in a cookie.
      user: { _id, name, email, phone, role },
    });
};