const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageAPI');
const { menu } = require('../middleware/auth');

router.post("/massages", menu, messageController.sendMessage);
router.get("/messages/:conversation",menu, messageController.getMessages);
router.get("/msgNoLu",menu, messageController.getMsgNoLu);
router.get("/conver",menu, messageController.getUserConversations);
router.get("/messages-lu",menu, messageController.messagesLu);
router.get('/unread-messages',menu, messageController.countUnreadMessages);

module.exports = router;
