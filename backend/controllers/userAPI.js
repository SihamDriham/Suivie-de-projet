const User = require('../models/user')
const bcrypt = require('bcrypt')
const { JWT_SECRET } = process.env;
const activeTokens = {};
const Conversation = require('../models/conversation')
const Tache = require('../models/tache')
const Message = require('../models/message')
const RPU = require('../models/RPU')
const Notification = require('../models/notification')
const List = require('../models/list')

//LOGIN
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

      if (user && password == user.password && user.activation == true) {

      const token = generateToken(user._id, user.__t)
      activeTokens[token] = user; 
       console.log(`token login: ${token}`);


      res.status(200).json({ message: 'Login successful',  token: token}); // Envoyer le token dans la réponse
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const generateToken = (id, type) => {
  return jwt.sign({ id, type }, JWT_SECRET, {
    expiresIn: '30d',
  })
}

exports.getActifUsers = (req, res) => {
  const users = Object.values(activeTokens);
  res.status(200).json(users);
};

exports.logout = (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (token && activeTokens[token]) {
    delete activeTokens[token];
    res.status(200).json({ message: 'Logout successful' });
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

exports.addUser = async (req, res) => {
  try {
    const { cin, nomU, prenom, email, password, telephone } = req.body;
    const image = req.file ? req.file.path : null;

    const newUser = new User({
      cin,
      nomU,
      prenom,
      telephone,
      email,
      password,
      image
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    if (error.code === 11000) { // MongoDB duplicate key error code
      res.status(400).json({ field: 'cin', message: 'CIN déjà existant' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { cin, nomU, prenom, email, password, telephone } = req.body;
    let image = req.file ? req.file.path : null;

    let user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // Check if the new CIN is already in use by another user
    if (cin && cin !== user.cin) {
      const existingUser = await User.findOne({ cin });
      if (existingUser) {
        return res.status(400).json({ message: "CIN déjà utilisé" });
      }
    }

    user.cin = cin || user.cin;
    user.nomU = nomU || user.nomU;
    user.prenom = prenom || user.prenom;
    user.email = email || user.email;
    user.password = password || user.password;
    user.telephone = telephone || user.telephone;

    if (image) {
      user.image = image;
    }

    const updatedUser = await user.save();

    res.json(updatedUser); // Envoyer la réponse avec l'utilisateur mis à jour
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Delete
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(401).json({ message: 'User not found' });
    }
    await RPU.deleteMany({ user_id: userId });

    await Tache.deleteMany({ user_id: userId });

    const conversations = await Conversation.find({ users: userId });
    const conversationIds = conversations.map(conversation => conversation._id);

    await Conversation.deleteMany({ _id: { $in: conversationIds } });

    await Message.deleteMany({ conversation: { $in: conversationIds } });

    await Notification.deleteMany({ user_id: userId });

    await List.deleteMany({ user_id: userId });

    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); 
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUsersChat = async (req, res) => {
  try {
    const userId = req.userId;

    const conversations = await Conversation.find({ users: userId })
      .populate({
        path: 'latestMessage',
        select: 'createdAt',
      })
      .populate('users', 'nomU prenom image') // Récupérer les informations des utilisateurs

    // Récupérer les utilisateurs de chaque conversation et leurs derniers messages
    let usersWithMessages = [];
    conversations.forEach(conversation => {
      const otherUsers = conversation.users.filter(user => user._id.toString() !== userId);
      otherUsers.forEach(user => {
        const latestMessage = conversation.latestMessage ? conversation.latestMessage.createdAt : null;
        usersWithMessages.push({
          _id: user._id,
          nomU: user.nomU,
          prenom: user.prenom,
          image: user.image,
          latestMessage: latestMessage
        });
      });
    });

    // Trier les utilisateurs ayant des messages par la date du dernier message
    usersWithMessages.sort((a, b) => (b.latestMessage || 0) - (a.latestMessage || 0));

    // Récupérer tous les utilisateurs
    const allUsers = await User.find({ _id: { $ne: userId } }, 'nomU prenom image');

    // Fusionner les utilisateurs avec et sans messages, en éliminant les doublons
    const usersMap = new Map();
    usersWithMessages.forEach(user => usersMap.set(user._id.toString(), user));
    allUsers.forEach(user => {
      if (!usersMap.has(user._id.toString())) {
        usersMap.set(user._id.toString(), {
          _id: user._id,
          nomU: user.nomU,
          prenom: user.prenom,
          image: user.image,
          latestMessage: null
        });
      }
    });

    // Convertir la map en tableau
    const users = Array.from(usersMap.values());

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUser = async(req,res)=>{
 const id = req.userId; 
 const user = await User.findById(id)
 res.json(user)
}

exports.getUserId = async(req,res)=>{
  const id = req.params.id; 
  const user = await User.findById(id)
  res.json(user)
}


exports.menuType = async(req,res)=>{
  const userType = req.userType
  res.json(userType)
}

exports.friend = async(req,res)=>{
  const userId = req.userId
  res.json(userId)
}

exports.activation = async (req, res) => {
  try {
    const {activation} = req.body
    // Recherche de l'utilisateur par son ID
    await User.findByIdAndUpdate(req.params.id,{
      activation: activation
    });

    res.json({ message: 'updated successful' })
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse avec le statut 500 (Internal Server Error)
    console.error('Erreur lors de la désactivation de l\'utilisateur:', error);
    res.status(500).json({ error: "Une erreur s'est produite lors de la désactivation de l'utilisateur" });
  }
}

//Search
exports.searchUser = async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;

    const usersTrouvees = await User.aggregate([
      {
        $match: {
          $or: [
            { nomU: { $regex: searchTerm, $options: 'i' } },
            { prenom: { $regex: searchTerm, $options: 'i' } },
            { cin: { $regex: searchTerm, $options: 'i' } },
            { email: { $regex: searchTerm, $options: 'i' } },
            { password: { $regex: searchTerm, $options: 'i' } },
            { telephone: { $regex: searchTerm, $options: 'i' } }
          ]
        }
      }
    ]);

    const usersFormatted = usersTrouvees.map(user => ({
      _id: user._id,
      nomU: user.nomU,
      prenom: user.prenom,
      email: user.email,
      telephone:user.telephone,
      cin: user.cin,
      image: user.image,
      __t: user.__t,
      activation: user.activation,
      password: user.password
    }));

    res.json(usersFormatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la recherche des utilisateurs.' });
  }
};

//Password change
exports.updatePassword = async (req, res) => {
  try {
    const { password } = req.body;

    let user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    user.password = password || user.password;

    const updatedUser = await user.save();

    res.json(updatedUser); // Envoyer la réponse avec l'utilisateur mis à jour
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updatePhoto = async (req, res) => {
  try {

    let image = req.file ? req.file.path : null;

    let user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    if (image) {
      user.image = image;
    }

    const updatedUser = await user.save();

    res.json(updatedUser); // Envoyer la réponse avec l'utilisateur mis à jour
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
