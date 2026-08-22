import { Router } from 'express';
import * as itineraryController from '../controllers/itinerary.controller.js';

const router = Router();

// Cities
router.get('/cities', itineraryController.listCities);
router.post('/cities', itineraryController.createCity);
router.get('/cities/:id', itineraryController.getCity);
router.delete('/cities/:id', itineraryController.deleteCity);

// Activities
router.get('/activities', itineraryController.listActivities);
router.post('/activities', itineraryController.createActivity);
router.get('/activities/:id', itineraryController.getActivity);
router.delete('/activities/:id', itineraryController.deleteActivity);

// Trip Stops
router.get('/stops', itineraryController.listStops);
router.post('/stops', itineraryController.createStop);
router.get('/stops/:id', itineraryController.getStop);
router.put('/stops/:id', itineraryController.updateStop);
router.delete('/stops/:id', itineraryController.deleteStop);

// Activity assignments to a stop
router.post('/stops/:id/activities', itineraryController.assignActivityToStop);
router.delete('/stops/:id/activities/:assignmentId', itineraryController.removeActivityFromStop);

export default router;
