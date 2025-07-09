import Conversation from '../models/conversationModel.js';
import Message from '../models/messageModel.js';
import { getIO, getUserSocketId } from '../socket/socket.js';
import { catchAsyncError } from '../middleware/catchAsyncError.js';
import ErrorHandler from '../middleware/error.js';

// Controller 1: Message Bhejna
export const sendMessage = catchAsyncError(async (req, res, next) => {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Conversation dhundho ya banao
    let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
        conversation = await Conversation.create({
            participants: [senderId, receiverId],
        });
    }

    const newMessage = new Message({
        senderId,
        receiverId,
        message,
    });
    
    // Message ko conversation mein add karo
    conversation.messages.push(newMessage._id);
    
    // Dono ko ek saath save karo
    await Promise.all([conversation.save(), newMessage.save()]);
    
    // REAL-TIME: Socket.IO se naya message bhejo
    const receiverSocketId = getUserSocketId(receiverId);
    if (receiverSocketId) {
        getIO().to(receiverSocketId).emit("newMessage", newMessage);
    }
    
    res.status(201).json(newMessage);
});

// Controller 2: Do users ke beech ke messages fetch karna
export const getMessages = catchAsyncError(async (req, res, next) => {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;
    
    const conversation = await Conversation.findOne({
        participants: { $all: [senderId, userToChatId] },
    }).populate("messages"); // messages ke poore objects fetch karega
    
    if (!conversation) return res.status(200).json([]);
    
    res.status(200).json(conversation.messages);
});


// Controller 3: Logged-in user ki saari conversations fetch karna
export const getConversations = catchAsyncError(async (req, res, next) => {
    const loggedInUserId = req.user._id;
    
    // Saari conversations dhundho jismein user hai
    const conversations = await Conversation.find({ participants: loggedInUserId }).populate({
        path: 'participants',
        select: 'name profileImage.url'
    });
    
    // Har conversation se doosre user ki detail nikalo
    const formattedConversations = conversations.map(conv => {
        const otherParticipant = conv.participants.find(p => p._id.toString() !== loggedInUserId.toString());
        return {
            id: otherParticipant._id, // This is the other user's ID
            name: otherParticipant.name,
            imageUrl: otherParticipant.profileImage.url,
            // (lastMessage, timestamp, etc. can be added here with more logic)
        };
    });

    res.status(200).json(formattedConversations);
});