const express = require('express');
const router = express.Router();
const StatutController = require('../controllers/statutAPI');

// Routes
router.get('/statutP', StatutController.getStatutProjet);
router.get('/satatutM', StatutController.getStatutMsg);
router.get('/statut', StatutController.getStatutById);
router.post('/statuts', StatutController.getStatutIdByEtat);
router.get('/statuts/ids', StatutController.getList);
router.get('/status', StatutController.getStatuts);

module.exports = router;
