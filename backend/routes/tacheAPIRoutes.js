const express = require('express');
const router = express.Router();
const tacheController = require('../controllers/tacheAPI');
const { protect, menu } = require('../middleware/auth');

router.put('/tacheStatut/:id/:projetId', tacheController.updateTacheStatut);
router.get('/task', tacheController.getStatutIdByLabel);
router.get('/retard/:id', tacheController.getTaskEnRetard);
router.get('/projects/:projetId/tasks', protect('UserNormal'), tacheController.getTasksByUser);
router.post('/tache/:phaseId/:projetId', tacheController.addTache);
router.put('/tache/:id/:phaseId/:projetId', tacheController.updateTache);
router.delete('/tache/:id', tacheController.deleteTache);
router.get('/taches', tacheController.getTasksWithNames);
router.get('/taches/:phaseId/:projetId', menu, tacheController.getTasksWithNames2);
router.get('/tasks/:id', menu, tacheController.getTasksById);
router.get('/statistiqueTask', tacheController.getStatistique);
router.get('/searchTask/:searchTerm/:phaseId/:projetId', tacheController.searchTask);
router.get('/searchTache/:searchTerm/:projetId', protect('UserNormal'), tacheController.searchTache);

module.exports = router;
