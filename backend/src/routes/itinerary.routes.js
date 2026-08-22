import { Router } from 'express';
import * as itineraryController from '../controllers/itinerary.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Cities
router.get('/cities', itineraryController.listCities);
router.get('/search/cities', itineraryController.searchCities);
router.post('/cities', authenticate, itineraryController.createCity);
router.get('/cities/:id', itineraryController.getCity);
router.delete('/cities/:id', itineraryController.deleteCity);

// Activities
router.get('/activities', itineraryController.listActivities);
router.get('/search/activities', itineraryController.searchActivities);
router.post('/activities', itineraryController.createActivity);
router.get('/activities/:id', itineraryController.getActivity);
router.delete('/activities/:id', itineraryController.deleteActivity);

// Trip Stops
router.get('/stops', itineraryController.listStops); // optional: list all or by tripId
router.get('/trips/:tripId/stops', itineraryController.getItineraryForTrip);
router.post('/stops', itineraryController.createStop);
router.get('/stops/:id', itineraryController.getStop);
router.put('/stops/:id', itineraryController.updateStop);
router.delete('/stops/:id', itineraryController.deleteStop);
router.put('/trips/:tripId/stops/reorder', itineraryController.reorderStops);

// Activity assignments to a stop
router.get('/stops/:id/activities', itineraryController.getActivitiesForStop);
router.post('/stops/:id/activities', itineraryController.assignActivityToStop);
router.delete('/stops/:id/activities/:assignmentId', itineraryController.removeActivityFromStop);

export default router;
