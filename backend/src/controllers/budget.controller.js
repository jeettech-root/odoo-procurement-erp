import {
  getTripExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getTripBudget,
} from '../services/budget.service.js';
import { getUserTrip } from '../services/trip.service.js';

const getUserId = (req) => req.user?.userId;

const validateExpenseInput = (body, { partial = false } = {}) => {
  const input = {};

  if (!partial || body.category !== undefined) {
    if (!body.category || typeof body.category !== 'string') {
      return { error: 'Category is required and must be a string.' };
    }
    const validCategories = ['TRANSPORT', 'STAY', 'ACTIVITY', 'MEAL', 'OTHER'];
    if (!validCategories.includes(body.category.toUpperCase())) {
      return { error: `Category must be one of: ${validCategories.join(', ')}` };
    }
    input.category = body.category.toUpperCase();
  }

  if (!partial || body.amount !== undefined) {
    const amount = parseFloat(body.amount);
    if (isNaN(amount) || amount <= 0) {
      return { error: 'Amount must be a positive number.' };
    }
    input.amount = amount;
  }

  if (body.description !== undefined) {
    if (body.description !== null && typeof body.description !== 'string') {
      return { error: 'Description must be a string or null.' };
    }
    input.description = body.description?.trim() || null;
  }

  if (body.date !== undefined) {
    if (body.date !== null && typeof body.date !== 'string') {
      return { error: 'Date must be a valid ISO date string or null.' };
    }
    if (body.date) {
      const date = new Date(body.date);
      if (Number.isNaN(date.getTime())) {
        return { error: 'Date must be a valid ISO date string.' };
      }
      input.date = body.date;
    }
  }

  return { input };
};

export const getBudget = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    const tripId = req.params.tripId;
    const trip = await getUserTrip(userId, tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    const budget = await getTripBudget(tripId);
    return res.status(200).json(budget);
  } catch (error) {
    console.error('Get budget error:', error);
    return res.status(500).json({ message: 'Something went wrong while fetching the budget.' });
  }
};

export const listExpenses = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    const tripId = req.params.tripId;
    const trip = await getUserTrip(userId, tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    const expenses = await getTripExpenses(tripId);
    return res.status(200).json(expenses);
  } catch (error) {
    console.error('List expenses error:', error);
    return res.status(500).json({ message: 'Something went wrong while fetching expenses.' });
  }
};

export const addExpense = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    const tripId = req.params.tripId;
    const trip = await getUserTrip(userId, tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    const { input, error } = validateExpenseInput(req.body || {});
    if (error) {
      return res.status(400).json({ message: error });
    }

    const expense = await createExpense(tripId, input);
    return res.status(201).json(expense);
  } catch (error) {
    console.error('Add expense error:', error);
    return res.status(500).json({ message: 'Something went wrong while adding the expense.' });
  }
};

export const updateTripExpense = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    const tripId = req.params.tripId;
    const expenseId = req.params.expenseId;

    const trip = await getUserTrip(userId, tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    const expense = await getTripExpenses(tripId).then((expenses) =>
      expenses.find((e) => e.id === expenseId)
    );
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found.' });
    }

    const { input, error } = validateExpenseInput(req.body || {}, { partial: true });
    if (error) {
      return res.status(400).json({ message: error });
    }

    if (!Object.keys(input).length) {
      return res.status(400).json({ message: 'At least one field is required to update.' });
    }

    const updatedExpense = await updateExpense(expenseId, input);
    return res.status(200).json(updatedExpense);
  } catch (error) {
    console.error('Update expense error:', error);
    return res.status(500).json({ message: 'Something went wrong while updating the expense.' });
  }
};

export const removeTripExpense = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    const tripId = req.params.tripId;
    const expenseId = req.params.expenseId;

    const trip = await getUserTrip(userId, tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    const expense = await getTripExpenses(tripId).then((expenses) =>
      expenses.find((e) => e.id === expenseId)
    );
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found.' });
    }

    await deleteExpense(expenseId);
    return res.status(204).send();
  } catch (error) {
    console.error('Delete expense error:', error);
    return res.status(500).json({ message: 'Something went wrong while deleting the expense.' });
  }
};
