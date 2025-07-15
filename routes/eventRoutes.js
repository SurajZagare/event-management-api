const express = require('express');
const router = express.Router();
const controller = require('../controllers/eventController');

router.post('/events', controller.createEvent);
router.get('/events/:id', controller.getEventDetails);
router.post('/events/:id/register', controller.registerUser);
router.delete('/events/:id/cancel/:userId', controller.cancelRegistration);
router.get('/events/upcoming', controller.listUpcomingEvents);
router.get('/events/:id/stats', controller.getEventStats);

module.exports = router;
