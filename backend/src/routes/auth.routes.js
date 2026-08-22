import { Router } from 'express';
import { getCurrentUser, login, signup } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/auth/signup', signup);
router.post('/auth/login', login);
router.get('/auth/me', authenticate, getCurrentUser);

export default router;
