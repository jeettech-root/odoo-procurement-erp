import { Router } from 'express';
import {
  getSharing,
  enableTripSharing,
  disableTripSharing,
  getPublicItinerary,
} from '../controllers/sharing.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Protected routes - require authentication
router.get('/trips/:tripId/sharing', authenticate, getSharing);
router.post('/trips/:tripId/sharing', authenticate, enableTripSharing);
router.delete('/trips/:tripId/sharing', authenticate, disableTripSharing);

// Public routes - no authentication required
router.get('/public/trips/:shareToken', getPublicItinerary);

export default router;
