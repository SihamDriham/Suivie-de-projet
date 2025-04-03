// const express = require('express');
// const router = express.Router();
// const UserController = require('../controllers/userAPI');
// const { protect, menu } = require('../middleware/auth');

// // Routes
// router.post('/login', UserController.login);
// router.post('/users', UserController.addUser);
// router.put('/users/:id', UserController.updateUser);
// router.delete('/users/:id', UserController.deleteUser);
// router.get('/users' , protect('Admin'), UserController.getUsers);
// router.get('/user',menu , UserController.getUser);
// router.get('/menu',menu, UserController.menuType);

// module.exports = router;

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userAPI');
const { protect, menu } = require('../middleware/auth');

const multer = require('multer');
const path = require('path');

// Configuration de multer pour gérer les fichiers avec leur nom d'origine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname); // Obtenir l'extension du fichier d'origine
    cb(null, file.originalname);}});

const upload = multer({ storage: storage });
router.post('/users', upload.single('image'), UserController.addUser);
router.put('/users/:userId', upload.single('image'),UserController.updateUser);

// Routes
router.post('/login', UserController.login);
router.put('/users/:id', UserController.updateUser);
router.patch('/activation/:id', UserController.activation);
router.patch('/change-password',menu, UserController.updatePassword);
router.patch('/change-photo',menu, UserController.updatePhoto);
router.delete('/users/:id', UserController.deleteUser);
router.get('/usersChat', menu,UserController.getUsersChat);
router.get('/users', protect('Admin'), UserController.getAllUsers);
router.get('/user',menu, UserController.getUser);
router.get('/users/:id', UserController.getUserId);
// router.get('/users/:userId', UserController.getUser);
router.get('/menu',menu, UserController.menuType);
router.get('/friend',menu, UserController.friend);
router.get('/actif', protect('Admin'), UserController.getActifUsers); // Route pour obtenir les utilisateurs connectés, accessible uniquement aux admins
router.post('/logout', menu, UserController.logout); // Utiliser le middleware pour protéger la route de déconnexion
router.get('/searchUser/:searchTerm', UserController.searchUser);

module.exports = router;

