const express = require('express');
const router = express.Router();
const converController = require('../controllers/conversationAPI');
const { menu } = require('../middleware/auth');

router.post('/chat', menu, converController.accessChats);
router.get('/chat', menu, converController.fetchAllChats);

module.exports = router;
