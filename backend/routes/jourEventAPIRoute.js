const express = require('express');
const router = express.Router();
const jourEvenementController = require('../controllers/jourEventAPI');

router.get('/evenements/:evenementId', jourEvenementController.getJourEvenementByEvenementId);
router.get('/jours/:jourId', jourEvenementController.getJour)
module.exports = router;
