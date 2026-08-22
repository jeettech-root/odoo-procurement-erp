import { Router } from 'express';
import {
  createTrip,
  deleteTrip,
  getTrip,
  listTrips,
  updateTrip,
} from '../controllers/trip.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use('/trips', authenticate);
router.post('/trips', createTrip);
router.get('/trips', listTrips);
router.get('/trips/:id', getTrip);
router.patch('/trips/:id', updateTrip);
router.delete('/trips/:id', deleteTrip);

export default router;
