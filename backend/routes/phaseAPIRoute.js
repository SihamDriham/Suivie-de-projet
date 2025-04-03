const express = require('express');
const router = express.Router();
const { protect, menu } = require('../middleware/auth');
const phaseController = require('../controllers/phaseAPI');

router.post('/phase/:projetId', phaseController.ajouterPhase);
router.put('/phase/:id', phaseController.updatePhase);
router.delete('/phase/:phaseId', phaseController.deletePhase);
router.get('/phases/:projetId', menu, phaseController.getPhasesByProjetId);
router.get('/phase/:id', protect('Admin'), phaseController.getPhase);
router.get('/searchPhase/:searchTerm/:projetId', phaseController.searchPhase);

module.exports = router;
