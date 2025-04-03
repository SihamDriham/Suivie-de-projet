const Notification = require('../models/notification');
const Statut = require('../models/statut')
const { io } = require('../app'); // Importer io depuis le module principal

exports.updateNotification = async (req, res) => {
  try {
    const defaultStatut = await Statut.findOne({ etat: 'Lu' });

    if (!defaultStatut) {
      return res.status(404).json({ message: 'Statut par défaut non trouvé' });
    }

    const user_id = req.userId; // Assurez-vous que req.userId est la propriété correcte

    await Notification.updateMany(
      { user_id: user_id }, 
      { $set: { statut_id: defaultStatut._id } } 
    );

    res.json({ message: 'Mise à jour réussie' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};


//Delete
exports.deleteNotification = async (req, res) => {
  try {

    const deletedNotification = await Notification.deleteMany({ user_id: req.userId });

    if (deletedNotification.deletedCount === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Deletion successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//Afficher
exports.getNotifications = async (req, res) => {

  try {
    const userId = req.userId

    const notifications = await Notification.find({ user_id: userId })
      .populate('statut_id', 'etat')

    if (!notifications || notifications.length === 0) {
        return res.status(404).json({ message: 'Aucune notif trouvée pour cet utilisateur' });
    }

    const notificationFormatted = notifications.map(notif => ({
        _id: notif._id,
        contenuN: notif.contenuN,
        dateHeure: notif.dateHeure,
        statut: notif.statut_id.etat,
        user_id: notif.user_id
    }));
    
    res.json(notificationFormatted);
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
}
};

exports.getNotificationsNon = async (req, res) => {
  const userId = req.userId; 
  const defaultStatut = await Statut.findOne({ etat: 'No lu' });
  try {
      const notifications = await Notification.find({ user_id: userId, statut_id: defaultStatut._id })
        .populate('statut_id', 'etat')

      if (!notifications || notifications.length === 0) {
          return res.status(404).json({ message: 'Aucune notif trouvée pour cet utilisateur dans ce projet' });
      }

      // Formater les données pour inclure les noms des phases, projets, statuts et utilisateurs
      const notificationFormatted = notifications.map(notif => ({
          _id: notif._id,
          contenuN: notif.contenuN,
          dateHeure: notif.dateHeure,
          statut: notif.statut_id.etat,
          user_id: notif.user_id
      }));
      
      res.json(notificationFormatted);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

exports.getNotificationById = async (req, res) => {
  try {
    const id = req.params.id; 
    const notif = await Notification.findById(id).populate('statut_id', 'etat');
    if (!notif) {
      return res.status(404).json({ message: 'Notif non trouvé' });
    }
    // Formater les données avant de les renvoyer
    const Notification = {
     _id: notif._id,
     contenuN: notif.contenuN, 
     dateHeure: notif.dateHeure,
     typeN: notif.typeN,
     statut: notif.statut_id.etat 
    };
    res.json(Notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

exports.countUnread = async (req, res) => {
  try {
    const userId = req.userId;
    const defaultStatutN = await Statut.findOne({ etat: 'No lu' });

    if (!defaultStatutN) {
      return res.status(404).json({ message: 'Statut not found' });
    }

    const notifications = await Notification.find({ statut_id: defaultStatutN._id });

    const notificationIds = notifications.map(notification => notification._id);

    const unreadNotifications = await NotifUser.find({
      user_id: userId,
      notif_id: { $in: notificationIds }
    });
    console.log('notifiUser', unreadNotifications) 
    const unreadCount = unreadNotifications.length;

    res.json({ unreadCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

