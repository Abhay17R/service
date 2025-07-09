import express from 'express';
import { createReview } from '../controllers/reviewController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();
router.use(isAuthenticated);

router.route('/').post(createReview);

export default router;