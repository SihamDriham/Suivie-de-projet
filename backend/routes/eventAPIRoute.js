const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventAPI');
const { protect } = require('../middleware/auth')

router.post('/events/:projetId', eventController.addEvent);
router.delete('/events/:id', eventController.deleteEvent);
router.get('/events',protect('Admin'), eventController.getEvents);
router.get('/events/:id', eventController.getEventById);
router.put('/events/:evenementId', eventController.updateEvent);
router.get('/events/user/id', protect('UserNormal'), eventController.getEventsByUser);

module.exports = router;
