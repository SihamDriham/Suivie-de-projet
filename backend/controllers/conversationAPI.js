const Chat = require('../models/conversation');
const user = require('../models/user');

exports.accessChats = async (req, res) => {
    const { user_Id } = req.body;
    const userId = req.userId;
    if (!user_Id) res.send({ message: "Provide User's Id" });
    let chatExists = await Chat.find({
      $and: [
        { users: { $elemMatch: { $eq: user_Id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate('users', '-password')
      .populate('latestMessage');
    chatExists = await user.populate(chatExists, {
      path: 'latestMessage.user',
      select: 'nomU email image',
    });
    if (chatExists.length > 0) {
      res.status(200).send(chatExists[0]);
    } else {
      let data = {
        nomC: 'user',
        users: [user_Id,userId],
      };
      try {
        const newChat = await Chat.create(data);
        const chat = await Chat.find({ _id: newChat._id }).populate(
          'users',
          '-password'
        );
        res.status(200).json(chat);
      } catch (error) {
        res.status(500).send(error);
      }
    }
};

exports.fetchAllChats = async (req, res) => {
    try {
      const userId = req.userId;
      const chats = await Chat.find({
        users: { $elemMatch: { $eq: userId } },
      })
        .populate('users')
        .populate('latestMessage')
        .sort({ updatedAt: -1 });
      const finalChats = await user.populate(chats, {
        path: 'latestMessage.user',
        select: 'nomU email image',
      });
      res.status(200).json(finalChats);
    } catch (error) {
      res.status(500).send(error);
      console.log(error);
    }
};