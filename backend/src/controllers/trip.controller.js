import {
  createTrip as createTripRecord,
  deleteUserTrip,
  getUserTrip,
  getUserTrips,
  updateUserTrip,
} from '../services/trip.service.js';

const getDate = (value) => {
  if (typeof value !== 'string' || !value.trim()) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getTripInput = (body, { partial = false } = {}) => {
  const input = {};

  if (!partial || body.title !== undefined) {
    if (typeof body.title !== 'string' || !body.title.trim()) {
      return { error: 'Title is required.' };
    }
    input.title = body.title.trim();
  }

  if (body.description !== undefined) {
    if (body.description !== null && typeof body.description !== 'string') {
      return { error: 'Description must be a string.' };
    }
    input.description = body.description?.trim() || null;
  }

  if (!partial || body.startDate !== undefined) {
    const startDate = getDate(body.startDate);
    if (!startDate) {
      return { error: 'A valid start date is required.' };
    }
    input.startDate = startDate;
  }

  if (!partial || body.endDate !== undefined) {
    const endDate = getDate(body.endDate);
    if (!endDate) {
      return { error: 'A valid end date is required.' };
    }
    input.endDate = endDate;
  }

  if (input.startDate && input.endDate && input.endDate < input.startDate) {
    return { error: 'End date must be on or after start date.' };
  }

  return { input };
};

const getUserId = (req) => req.user?.userId;

export const createTrip = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    const { input, error } = getTripInput(req.body || {});
    if (error) {
      return res.status(400).json({ message: error });
    }

    const trip = await createTripRecord(userId, input);
    return res.status(201).json(trip);
  } catch (error) {
    console.error('Create trip error:', error);
    return res.status(500).json({ message: 'Something went wrong while creating the trip.' });
  }
};

export const listTrips = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    const trips = await getUserTrips(userId);
    return res.status(200).json(trips);
  } catch (error) {
    console.error('List trips error:', error);
    return res.status(500).json({ message: 'Something went wrong while fetching trips.' });
  }
};

export const getTrip = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    const trip = await getUserTrip(userId, req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    return res.status(200).json(trip);
  } catch (error) {
    console.error('Get trip error:', error);
    return res.status(500).json({ message: 'Something went wrong while fetching the trip.' });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    const { input, error } = getTripInput(req.body || {}, { partial: true });
    if (error) {
      return res.status(400).json({ message: error });
    }

    if (!Object.keys(input).length) {
      return res.status(400).json({ message: 'At least one trip field is required.' });
    }

    const existingTrip = await getUserTrip(userId, req.params.id);
    if (!existingTrip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    const startDate = input.startDate || existingTrip.startDate;
    const endDate = input.endDate || existingTrip.endDate;
    if (endDate < startDate) {
      return res.status(400).json({ message: 'End date must be on or after start date.' });
    }

    const result = await updateUserTrip(userId, req.params.id, input);
    if (!result.count) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    const trip = await getUserTrip(userId, req.params.id);
    return res.status(200).json(trip);
  } catch (error) {
    console.error('Update trip error:', error);
    return res.status(500).json({ message: 'Something went wrong while updating the trip.' });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    const result = await deleteUserTrip(userId, req.params.id);
    if (!result.count) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Delete trip error:', error);
    return res.status(500).json({ message: 'Something went wrong while deleting the trip.' });
  }
};
