// app.js (CORRECTED & COMPLETE CODE)

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv'; // <<-- Sirf import yahan rahega

// Apne routes import karo
import userRouter from './routes/userRoutes.js';
import { errorMiddleware } from './middleware/error.js';
import appointmentRouter from './routes/appointmentRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import chatRouter  from './routes/chatRoutes.js'


// *** YAHAN PAR FIX HAI ***
// cors middleware use hone se pehle .env file ko load karna zaroori hai.
dotenv.config({ path: './.env' });

const app = express();

// --- ZAROORI MIDDLEWARE ---

// Cross-Origin Resource Sharing (CORS) setup
// Ab isko process.env.FRONTEND_URL ki value hamesha milegi.
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Request body (JSON data) ko parse karne ke liye
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// --- API ROUTES ---
app.use("/api/v1", userRouter);
app.use("/api/v1/appointments", appointmentRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/chat", chatRouter); 

// --- HEALTH CHECK ROUTE ---
app.get("/", (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: "✅ ServiceLink Server is up and running!" 
    });
});

// --- ERROR HANDLING MIDDLEWARE ---
app.use(errorMiddleware);

// app ko export karo taaki server.js isko import karke use kar sake
export default app;