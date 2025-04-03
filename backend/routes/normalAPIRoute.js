const express = require('express');
const router = express.Router();
const UserNormalController = require('../controllers/userNormalAPI');
const { protect } = require('../middleware/auth');

router.post('/usersNormal', UserNormalController.insererUserNormal);
router.get('/usersNormal', protect('Admin'), UserNormalController.getUsersOfTypeUserNormal)
router.get('/nombreUser', UserNormalController.UserNormalNombre);

module.exports = router;

