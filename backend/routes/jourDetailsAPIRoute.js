const express = require('express');
const router = express.Router();
const detailJourController = require('../controllers/jourDetailsAPI');

router.post('/detailsJour', detailJourController.addMultipleDetails);
router.get('/events/:eventId/details', detailJourController.getEventDetails);
router.put('/detailsJour/:id', detailJourController.updateDetailJour);
router.get('/detailsJour/:id', detailJourController.getDetailJourById);
router.delete('/detailsJour/:id', detailJourController.deleteDetailJour);

module.exports = router;
