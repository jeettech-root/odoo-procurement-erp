import { Router } from 'express';
import { getTimeline } from '../controllers/timeline.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/trips/:tripId/timeline', getTimeline);

export default router;
