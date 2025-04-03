const express = require('express');
const router = express.Router();
const rpuController = require('../controllers/RPUAPI');
const { protect, menu } = require('../middleware/auth');

router.post('/rpu', rpuController.addRPU);
router.get('/rpu/:projetId', menu, rpuController.getRPUListByProjet);
router.delete('/rpu/:rpuId', rpuController.deleteRPU);
router.put('/rpu/:rpuId', rpuController.updateUserAndRole);
router.get('/userProjet/:id', rpuController.getUserByProjet);
router.get('/projetUser', protect('UserNormal'), rpuController.getProjetByUser);
router.get('/userRPU/:rpuId', rpuController.getRPUById);
router.get('/roleType/:projetId', menu, rpuController.roleType);

module.exports = router;