const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminAPI');

router.post('/convert-to-admin', adminController.insererAdmin);
router.get('/nombreAdmin', adminController.AdminNombre);

module.exports = router;