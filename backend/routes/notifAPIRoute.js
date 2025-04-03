const express = require('express');
const router = express.Router();
const notifController = require('../controllers/notificationAPI');
const {menu} = require('../middleware/auth')

router.put('/notif',menu, notifController.updateNotification);
router.delete('/notif',menu, notifController.deleteNotification);
router.get('/notif',menu, notifController.getNotifications);
router.get('/notifNon',menu, notifController.getNotificationsNon);
router.get('/notif/:id', notifController.getNotificationById);
router.get('/unread/count/',menu, notifController.countUnread);

module.exports = router;
