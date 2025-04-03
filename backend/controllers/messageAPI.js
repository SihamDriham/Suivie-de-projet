const Message = require('../models/message');
const Chat = require( '../models/conversation');
const Statut = require('../models/statut')
const Conversation = require('../models/conversation')
exports.sendMessage = async (req, res) => {
  const { conversation, contenuM } = req.body;
  const defaultStatutN = await Statut.findOne({ etat: 'No lu' });
  const statut = defaultStatutN._id
  const userId = req.userId;
  console.log(userId);
  try {
    let msg = await Message.create({ user: userId, contenuM, conversation, statut });
    msg = await (
      await msg.populate('user', 'nomU image email')
    ).populate({
      path: 'conversation',
      select: 'nomC users',
      model: 'conversation',
      populate: {
        path: 'users',
        select: 'nomU email image',
        model: 'User',
      },
    });
    await Chat.findByIdAndUpdate(conversation, {
      latestMessage: msg,
    });
    res.status(200).send(msg);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

exports.getMessages = async (req, res) => {
  const conversation = req.params.conversation;
  const defaultStatut = await Statut.findOne({ etat: 'Lu' });
  const userId = req.userId;

  try {
    let messages = await Message.find({ conversation })
      .populate({
        path: 'user',
        model: 'User',
        select: 'nomU image email',
      })
      .populate({
        path: 'conversation',
        model: 'conversation',
      });

    // Mettre à jour le statut des messages envoyés par les autres utilisateurs
    const messagesNotByUser = messages.filter(msg => msg.user._id.toString() !== userId.toString());
    if (messagesNotByUser.length > 0) {
      await Message.updateMany(
        { _id: { $in: messagesNotByUser.map(msg => msg._id) } },
        { $set: { statut: defaultStatut._id } }
      );
    }

    // Récupérer à nouveau les messages pour avoir les statuts mis à jour
    messages = await Message.find({ conversation })
      .populate({
        path: 'user',
        model: 'User',
        select: 'nomU image email',
      })
      .populate({
        path: 'conversation',
        model: 'conversation',
      });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error });
    console.log(error);
  }
};

exports.countmessages = async (req, res) => {
  try {
    const statut = await Statut.findOne({ etat: 'No lu' });
    const userId = req.userId;

    if (!statut) {
      return res.status(404).json({ message: "Statut non trouvé" });
    }

    const messages = await Message.find({
      statut: statut._id,
      user: userId
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ error: "Une erreur s'est produite lors du traitement de la demande" });
  }
};

exports.getMsgNoLu = async (req, res) => {
  const defaultStatutN = await Statut.findOne({ etat: 'No lu' });
  const userId = req.userId;

  try {
    let messages = await Message.find({
      statut: defaultStatutN._id ,
      user: { $ne: userId }
    })
      .populate({
        path: 'user',
        model: 'User',
        select: 'nomU image email',
      })
      .populate({
        path: 'conversation',
        model: 'conversation',
      });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error });
    console.log(error);
  }
};

exports.getUserConversations = async (req, res) => {
  try {
    const userId = req.userId;
    const defaultStatutN = await Statut.findOne({ etat: 'No lu' });

    if (!userId) {
      return res.status(400).json({ message: 'ID utilisateur manquant.' });
    }

    const conversations = await Conversation.find({ users: userId }).select('_id').exec();

    const conversationIds = conversations.map(conversation => conversation._id);

    const messages = await Message.find({
      conversation: { $in: conversationIds },
      user: { $ne: userId },
      statut: defaultStatutN._id
    })
    .populate('user', 'nom email')
    .populate('conversation')
    .exec();
// Compter le nombre de messages correspondant aux critères
    const messageCount = await Message.countDocuments({
      conversation: { $in: conversationIds },
      user: { $ne: userId },
      statut: defaultStatutN._id
    });

    // Retourner les messages et leur nombre
    res.status(200).json({
      messages,
      count: messageCount
    });
  } catch (error) {
    // Gérez les erreurs
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des messages.' });
  }
};

exports.messagesLu = async (req, res) => {
  const defaultStatut = await Statut.findOne({ etat: 'Lu' });
  const userId = req.userId;

  try {
    let messages = await Message.find({ statut: defaultStatut._id, user: userId })
      .populate({
        path: 'user',
        model: 'User',
        select: 'nomU image email',
      })
      .populate({
        path: 'conversation',
        model: 'conversation',
      });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error });
    console.log(error);
  }
};

exports.countUnreadMessages = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is set in req (e.g., from middleware authentication)
    const defaultStatutN = await Statut.findOne({ etat: 'No lu' });

    if (!userId) {
      return res.status(400).json({ message: 'ID utilisateur manquant.' });
    }

    const userConversations = await Conversation.find({ users: userId }).select('_id users').exec();

    let result = [];

    for (const conversation of userConversations) {
      const unreadMessagesCount = await Message.countDocuments({
        conversation: conversation._id,
        user: { $ne: userId }, // Messages not sent by the connected user
        statut: defaultStatutN._id // Only count messages with statut 'No lu'
      });

      if (unreadMessagesCount > 0) {
        // Find the other user in the conversation
        const otherUserId = conversation.users.find(user => user.toString() !== userId.toString());

        result.push({
          conversationId: conversation._id,
          unreadMessagesCount,
          otherUserId
        });
      }
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error counting unread messages:", error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
