// server.js (CORRECTED & COMPLETE CODE)

import app from './app.js';
import { connection as connectDatabase } from './database/dbConnection.js'; 
import { initializeSocketServer } from './socket/socket.js';
import cloudinary from 'cloudinary';

// dotenv.config() ko yahan se hata diya gaya hai kyunki app.js ab isko handle kar raha hai.

// Uncaught Exception ko handle karna
process.on('uncaughtException', (err) => {
  console.log(`❌ ERROR: ${err.stack}`);
  console.log('Shutting down the server due to Uncaught Exception');
  process.exit(1);
});

// Database se connect karo
connectDatabase();

// Cloudinary ko configure karo
// Yeh ab sahi se kaam karega kyunki app.js ne variables pehle hi load kar diye hain.
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Server ko start karo
const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server is listening on http://localhost:${PORT} in ${process.env.NODE_ENV} mode.`);
});

initializeSocketServer(server);

// Unhandled Promise Rejection ko handle karna
process.on('unhandledRejection', (err) => {
  console.log(`❌ ERROR: ${err.message}`);
  console.log('Shutting down the server due to Unhandled Promise Rejection');
  
  server.close(() => {
    process.exit(1);
  });
});