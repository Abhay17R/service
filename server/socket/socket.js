// backend/socket/socket.js

import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import  User  from '../models/userModel.js';
import cookie from 'cookie';

let io;

export const initializeSocketServer = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL, // .env se aayega
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    // --- SOCKET AUTHENTICATION MIDDLEWARE ---
    io.use(async (socket, next) => {
        try {
            const cookieString = socket.request.headers.cookie || "";
            const cookies = cookie.parse(cookieString);
            const token = cookies.token;
            if (!token) {
                return next(new Error('Authentication Error: Token not found.'));
            }
            
            // ⚠️ FIX #1: JWT_KEY ko JWT_SECRET kiya
            const decoded = jwt.verify(token, process.env.JWT_SECRET); 
            const user = await User.findById(decoded.id).select('-password');
            if (!user) {
                return next(new Error('Authentication Error: User not found.'));
            }

            socket.user = user;
            next();
        } catch (error) {
            console.error("Socket Auth Error:", error.message);
            next(new Error('Authentication Error'));
        }
    });

    // --- MAIN CONNECTION LOGIC ---
    io.on('connection', (socket) => {
        console.log(`✅ User Connected: ${socket.user.name} (ID: ${socket.user._id})`);
        
        // 💡 FIX #2: Har user ko uske apne ID ke room me join karwaya
        // Isse personal notifications bhejna aasan ho jayega.
        socket.join(socket.user._id.toString());

        // Example: Ek welcome event bhejo sirf usi user ko
        socket.emit('welcome', `Welcome to ServiceLink, ${socket.user.name}!`);

        // --- DISCONNECT LOGIC ---
        socket.on('disconnect', () => {
            console.log(`❌ User Disconnected: ${socket.user.name}`);
            // 💡 FIX #3: isOnline/lastSeen wala logic hata diya kyunki woh model me nahi hai.
            // Agar future me zaroorat padi, to model me field add karke yahan logic daal sakte hain.
        });

        // (Future) Yahan tum aur custom events (like 'sendMessage', 'startTyping') handle kar sakte ho.
        // socket.on('sendMessage', (data) => {
        //   io.to(data.receiverId).emit('receiveMessage', data.message);
        // });
    });

    return io;
};

// Yeh function controllers se io instance ko access karne ke liye hai
export const getSocketServerInstance = () => {
    if (!io) {
        throw new Error('Socket.IO is not initialized!');
    }
    return io;
};