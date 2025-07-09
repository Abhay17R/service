import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import cookie from 'cookie';

let io;
const userSocketMap = {}; // { userId: socketId }

export const initializeSocketServer = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    io.use(async (socket, next) => {
        try {
            const cookieString = socket.request.headers.cookie || "";
            const cookies = cookie.parse(cookieString);
            const token = cookies.token;
            if (!token) return next(new Error('Authentication Error: Token not found.'));
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            if (!user) return next(new Error('Authentication Error: User not found.'));

            socket.user = user;
            next();
        } catch (error) {
            console.error("Socket Auth Error:", error.message);
            next(new Error('Authentication Error'));
        }
    });

    io.on('connection', (socket) => {
        const userId = socket.user._id.toString();
        console.log(`✅ User Connected: ${socket.user.name} (Socket ID: ${socket.id})`);
        
        userSocketMap[userId] = socket.id;

        // Sabhi clients ko online users ki nayi list bhejo
        io.emit("getOnlineUsers", Object.keys(userSocketMap));

        socket.on('disconnect', () => {
            console.log(`❌ User Disconnected: ${socket.user.name}`);
            delete userSocketMap[userId];
            // Sabhi clients ko online users ki updated list bhejo
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        });
    });

    return io;
};

// Yeh function controllers se io instance aur user map ko access karne ke liye hai
export const getIO = () => io;
export const getUserSocketId = (receiverId) => userSocketMap[receiverId];