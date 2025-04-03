const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleAPI');
const { protect } = require('../middleware/auth');

router.get('/roles', protect('Admin'), roleController.getAllRoles);
module.exports = router;