import { Router } from 'express';
import {
  getBudget,
  listExpenses,
  addExpense,
  updateTripExpense,
  removeTripExpense,
} from '../controllers/budget.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/trips/:tripId/budget', getBudget);
router.get('/trips/:tripId/expenses', listExpenses);
router.post('/trips/:tripId/expenses', addExpense);
router.put('/trips/:tripId/expenses/:expenseId', updateTripExpense);
router.delete('/trips/:tripId/expenses/:expenseId', removeTripExpense);

export default router;
