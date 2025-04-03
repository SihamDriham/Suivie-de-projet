const express = require("express");
require('dotenv').config();
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const { MONGO_URL, MONGO_DB_NAME } = process.env;
const bcrypt = require('bcrypt');
const Admin = require('./models/admin');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

// Initialisation de l'application Express et du serveur HTTP
const app = express();

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, dbName: MONGO_DB_NAME });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Erreur de connexion à MongoDB :'));
db.once('open', () => {
    console.log(`Connecté à MongoDB Atlas ! Base de données : ${MONGO_DB_NAME}`);
});

app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// const user = db.collection('users');
//     const password = '12345678';
//     const salt = bcrypt.genSaltSync(10);
//     const hashedPassword = bcrypt.hashSync(password, salt);
//     user.insertMany([
//       { cin: 'HH123', nomU: 'Driham', prenom: 'Siham', email: 'siham@gmail.com', password: hashedPassword }
//     ]);

  // const admin = db.collection('admin')
  // const userId = '662935d9178ddff9729700ba'
  // admin.insertMany([
  //   {user:userId}
  // ])
 /*
      const userId = '6626996eb58722fa065ef1d0'; 
        const newAdmin = new Admin({
            user: userId 
        });
        newAdmin.save()
*/
       
//Insertion d'un statut
// const statut = db.collection('statuts');
//     const i =  statut.insertMany([
//       {etat: 'En cours' },
//       {etat: 'En attente' },
//       {etat: 'Terminé' },
//       {etat: 'Annulé' },
//       {etat: 'Bloqué' },
//       {etat: 'À faire' },
//       {etat: 'No lu' },
//       {etat: 'Lu' },
//       {etat: 'Ignoré' }
//     ]);


//Insertion Role
// const role = db.collection('roles');
//     const j = role.insertMany([
//       { nomR: 'Responsable' },
//       {nomR: 'Membre' }
//     ]);

const userRoutes = require('./routes/userAPIRoute');
app.use(userRoutes);

const adminRoutes = require('./routes/adminAPIRoute');
app.use(adminRoutes);

const projetRoutes = require('./routes/projetAPIRoute');
app.use(projetRoutes);

const statutRoutes = require('./routes/statutAPIRoute');
app.use(statutRoutes);

const phaseRoutes = require('./routes/phaseAPIRoute');
app.use(phaseRoutes);

const tacheRoutes = require('./routes/tacheAPIRoutes');
app.use(tacheRoutes);

const normalRoutes = require('./routes/normalAPIRoute');
app.use(normalRoutes);

const connverRoutes = require('./routes/converAPIRoute');
app.use(connverRoutes);

const msgRoutes = require('./routes/msgAPIRoute');
app.use(msgRoutes);

const notifRoutes = require('./routes/notifAPIRoute');
app.use(notifRoutes);

const participerRoutes = require('./routes/RPUAPIRoute');
app.use(participerRoutes);

const listRoutes = require('./routes/listAPIRoute');
app.use(listRoutes);

const roleRoutes = require('./routes/roleAPIRoute');
app.use(roleRoutes);

const eventRoutes = require('./routes/eventAPIRoute');
app.use(eventRoutes);

const jourRoutes = require('./routes/jourEventAPIRoute');
app.use(jourRoutes);

const detailsRoutes = require('./routes/jourDetailsAPIRoute');
app.use(detailsRoutes);

const port = process.env.PORT || 2023;
const server = app.listen(port, () => {
    console.log(`Le serveur est en cours d'exécution sur le port ${port}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Sockets are in action");

  socket.on("setup", (userData) => {
    socket.join(userData);
    console.log(userData, "connected");
    socket.emit("connected");
  });

  socket.on("sendNotification", () => {
      io.emit("newNotification");
  });

  socket.on("sendMessage", () => {
      io.emit("newMessage");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room: " + room);
  });

  socket.on("new message", (newMessage) => {
    var chat = newMessage.chatId;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessage.sender._id) return;
      socket.in(user._id).emit("message received", newMessage);
    });
    socket.on("typing", (room) => {
      socket.in(room).emit("typing");
    });
    socket.on("stop typing", (room) => {
      socket.in(room).emit("stop typing");
    });
  });
  
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData);
  });
});