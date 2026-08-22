import {
  enableSharing,
  disableSharing,
  getShareByToken,
  getShareStatus,
} from '../services/sharing.service.js';
import { getUserTrip } from '../services/trip.service.js';

const getUserId = (req) => req.user?.userId;

export const getSharing = async (req, res) => {
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

    const share = await getShareStatus(tripId);
    if (!share) {
      return res.status(200).json({ isPublic: false, shareToken: null, publicUrl: null });
    }

    const publicUrl = share.isPublic ? `${process.env.PUBLIC_BASE_URL}/share/${share.shareToken}` : null;

    return res.status(200).json({
      isPublic: share.isPublic,
      shareToken: share.shareToken,
      publicUrl,
    });
  } catch (error) {
    console.error('Get sharing error:', error);
    return res.status(500).json({ message: 'Something went wrong while fetching sharing status.' });
  }
};

export const enableTripSharing = async (req, res) => {
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

    const share = await enableSharing(tripId);
    const publicUrl = `${process.env.PUBLIC_BASE_URL}/share/${share.shareToken}`;

    return res.status(200).json({
      isPublic: share.isPublic,
      shareToken: share.shareToken,
      publicUrl,
    });
  } catch (error) {
    console.error('Enable sharing error:', error);
    return res.status(500).json({ message: 'Something went wrong while enabling sharing.' });
  }
};

export const disableTripSharing = async (req, res) => {
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

    const share = await disableSharing(tripId);
    if (!share) {
      return res.status(404).json({ message: 'Share not found.' });
    }

    return res.status(200).json({ isPublic: share.isPublic });
  } catch (error) {
    console.error('Disable sharing error:', error);
    return res.status(500).json({ message: 'Something went wrong while disabling sharing.' });
  }
};

export const getPublicItinerary = async (req, res) => {
  try {
    const shareToken = req.params.shareToken;

    const share = await getShareByToken(shareToken);
    if (!share || !share.isPublic) {
      return res.status(404).json({ message: 'This itinerary is not publicly available.' });
    }

    const trip = share.trip;
    const stops = trip.TripStop || [];

    return res.status(200).json({
      trip: {
        id: trip.id,
        title: trip.title,
        description: trip.description,
        startDate: trip.startDate,
        endDate: trip.endDate,
      },
      itinerary: stops,
    });
  } catch (error) {
    console.error('Get public itinerary error:', error);
    return res.status(500).json({ message: 'Something went wrong while fetching the itinerary.' });
  }
};
