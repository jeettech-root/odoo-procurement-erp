import { getTripTimeline } from '../services/timeline.service.js';
import { getUserTrip } from '../services/trip.service.js';

const getUserId = (req) => req.user?.userId;

export const getTimeline = async (req, res) => {
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

    const timeline = await getTripTimeline(tripId);
    return res.status(200).json(timeline);
  } catch (error) {
    console.error('Get timeline error:', error);
    return res.status(500).json({ message: 'Something went wrong while fetching the timeline.' });
  }
};
