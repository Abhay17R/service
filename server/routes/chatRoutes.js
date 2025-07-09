import express from 'express';
import { sendMessage, getMessages, getConversations } from '../controllers/chatController.js';
import { isAuthenticated } from '../middleware/auth.js';
// import { sendMessage, getMessages, getConversations } from '../controllers/chatController.js';

const router = express.Router();
router.use(isAuthenticated);

router.get('/conversations', getConversations); // Saari conversations laane ke liye
router.get('/messages/:id', getMessages); // Ek user ke saath saare messages laane ke liye
router.post('/send/:id', sendMessage); 
// Message bhejne ke liye

export default router;