const express = require('express');
const router = express.Router();
const projetController = require('../controllers/projetAPI');
const { protect } = require('../middleware/auth');

router.post('/projets', protect('Admin'), projetController.addProjet);
router.put('/projets/:id', projetController.updateProjet);
router.delete('/projets/:id', projetController.deleteProjet);
router.get('/projets', protect('Admin'), projetController.getProjects);
router.get('/projets/:id', protect('Admin'), projetController.getProjetById);
router.post('/projetStatut', projetController.statutNombre);
router.get('/budget', projetController.budgetTotal);
router.get('/budget2', projetController.budgetTotal2);
router.get('/searchProject/:searchTerm', projetController.searchProject);
router.get('/searchProjet/:searchTerm', protect('UserNormal'), projetController.searchProject);

module.exports = router;
