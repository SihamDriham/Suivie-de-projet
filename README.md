<div align="center">

# 📋 Suivi de Projet & Communication en Temps Réel
### Application web MERN — gestion de projets, tâches, événements et chat instantané

*Projet de Fin d'Études réalisé au sein de **OCP Safi***

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)
![React](https://img.shields.io/badge/React.js-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?logo=socket.io&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?logo=bootstrap&logoColor=white)

**Projet de Fin d'Études — Ingénierie des Systèmes d'Information et Logiciel**
École Supérieure de Technologie Essaouira — Université Cadi Ayyad

</div>

---

## ⚡ En un coup d'œil

| | |
|---|---|
| 🧱 **Stack MERN complète** (MongoDB, Express, React, Node.js) | 🔌 **Socket.io** pour le temps réel (chat, notifications) |
| 🔐 **JWT** pour l'authentification et la gestion des rôles | 👥 **2 interfaces** : Administrateur & Utilisateur |
| 📁 Gestion de projets, phases, tâches, événements | 💬 Messagerie instantanée + notifications live |
| ✅ Todo-list personnelle par utilisateur | 📊 Tableau de bord avec statistiques en direct |

---

## Sommaire
- [Description](#-description)
- [L'entreprise d'accueil](#-lentreprise-daccueil)
- [Problématique et objectifs](#-problématique-et-objectifs)
- [Architecture de l'application](#️-architecture-de-lapplication)
- [Pipeline REST API](#-pipeline-rest-api)
- [Pipeline Socket.io — temps réel](#-pipeline-socketio--temps-réel)
- [Diagramme de classe](#-diagramme-de-classe)
- [Conception UML](#-conception-uml)
- [Démonstration vidéo](#-démonstration-vidéo)
- [Aperçu des interfaces](#-aperçu-des-interfaces)
- [Stack technique](#️-stack-technique)
- [Prérequis & installation](#-prérequis--installation)
- [Structure du projet](#-structure-du-projet)
- [Auteur](#-auteur)

---

## 🧩 Description

Cette application web permet de **centraliser le suivi de projets** au sein d'une équipe : gestion des utilisateurs et de leurs rôles, création et suivi de projets/phases/tâches, planification d'événements, notifications en temps réel, et un système de **chat intégré** pour fluidifier la communication entre les membres.

Elle repose sur la stack **MERN** (MongoDB, Express.js, React.js, Node.js) associée à **Socket.io** pour les fonctionnalités temps réel, suivant le motif de conception **MVC** (Modèle-Vue-Contrôleur). Deux interfaces distinctes sont proposées :

- **Interface Administrateur** : gestion complète des utilisateurs, projets, phases, tâches, événements, et tableau de bord avec statistiques et utilisateurs connectés.
- **Interface Utilisateur** : suivi des projets et tâches assignés, consultation des événements, todo-list personnelle, chat instantané.

---

## Problématique et objectifs

**Problématiques identifiées :**
- Manque de centralisation des informations de projet
- Difficulté à gérer les rôles et permissions de manière granulaire
- Absence de notifications en temps réel pour les événements critiques
- Communication inefficace entre les membres d'un projet
- Interface peu intuitive et non réactive

**Objectifs de l'application :**
- Gérer les utilisateurs et l'attribution des rôles
- Fournir des notifications en temps réel et une gestion des événements
- Intégrer un tableau de bord professionnel pour les administrateurs
- Afficher aux utilisateurs leurs projets et tâches assignés
- Permettre la communication instantanée via un chat intégré
- Offrir une todo-list pour l'organisation personnelle

---

## Architecture de l'application

L'architecture MERN sépare clairement trois couches : le **front-end React**, le **back-end Node.js/Express**, et la base de données **MongoDB**, avec un canal **Socket.io** dédié au temps réel qui vient s'ajouter au flux HTTP classique.

<img width="1492" height="821" alt="image" src="https://github.com/user-attachments/assets/f1df1a7d-3765-4e35-8b97-78a4f446b6a1" />

Le flux type : les interactions utilisateur sur l'interface React envoient des requêtes HTTP au serveur Node.js. Express traite ces requêtes, effectue des opérations CRUD sur MongoDB via Mongoose, puis renvoie une réponse qui met à jour l'interface React. En parallèle, Socket.io maintient une connexion persistante pour pousser instantanément messages, notifications et mises à jour de statut, sans rechargement de page.

---

## 🔄 Pipeline REST API

Détail du cycle complet d'une requête HTTP classique (ex. créer une tâche, lister les projets, modifier un utilisateur) :

<img width="1867" height="742" alt="image" src="https://github.com/user-attachments/assets/75fe00db-3cb5-43a9-87c4-f92b817867f3" />

1. **React** envoie une requête via **Axios**, avec le token JWT dans l'en-tête `Authorization`.
2. **Express Router** fait correspondre l'URL et la méthode HTTP à une route définie.
3. Le **middleware** vérifie le token JWT et le rôle de l'utilisateur (admin / employé).
4. Le **contrôleur** applique la logique métier (validation, règles de gestion).
5. **Mongoose** exécute l'opération (find / create / update / delete) sur le modèle concerné.
6. **MongoDB** lit ou écrit le document.
7. La réponse remonte la même chaîne jusqu'au client, qui met à jour son état (Context API) puis re-rend l'interface.

---

## 📡 Pipeline Socket.io — temps réel

Détail du flux pour la messagerie instantanée et les notifications (le même mécanisme sert aussi aux mises à jour de statut de tâche en direct) :

<img width="1580" height="893" alt="image" src="https://github.com/user-attachments/assets/0f4144cd-8c10-43f7-ad60-8c8f2ceae5d3" />

1. Le client se connecte via `socket.io-client` en passant le token JWT lors du handshake.
2. Un middleware serveur valide ce token avant d'accepter la connexion.
3. Le serveur fait rejoindre au socket une **room** (salle) correspondant au projet ou à la conversation.
4. Un client émet un événement, ex. `socket.emit("sendMessage", ...)`.
5. Le serveur reçoit l'événement via `socket.on("sendMessage", ...)`.
6. Le message est persisté en base via Mongoose (`Message.create(...)`).
7. Le serveur diffuse l'événement à tous les membres de la room : `io.to(roomId).emit("newMessage", ...)`.
8. Les autres clients connectés écoutent (`socket.on("newMessage", ...)`) et mettent à jour leur interface **instantanément**, sans rechargement de page.

---

## 🗂 Diagramme de classe

Modélisation des entités principales du système : employés (administrateurs et normaux), rôles, projets, phases, tâches, statuts, notifications, conversations, messages, événements et todo-lists — avec leurs relations (associations, agrégations, compositions).

<img width="907" height="620" alt="class_Diagramm" src="https://github.com/user-attachments/assets/65e0de06-cdf2-4b9a-9e86-291522493a48" />

---

## 📐 Conception UML

La conception s'appuie sur UML pour visualiser, spécifier et documenter le système avant son implémentation :

- **Diagrammes de cas d'utilisation** : détaillent les actions possibles pour l'Employé (connexion, chat, notifications, événements, todo-list) et l'Administrateur (gestion des utilisateurs, projets, phases, tâches, événements).
- **Diagrammes de séquence** : illustrent notamment le processus de connexion (vérification des identifiants, génération du token, gestion des comptes désactivés) et l'ajout d'un nouvel employé par l'administrateur.

---

## 🎬 Démonstration vidéo


---

## 🖥️ Aperçu des interfaces

| Page de connexion | Tableau de bord |
|---|---|
| Formulaire email/mot de passe, vérification du compte (activé/désactivé), redirection selon le rôle | Statistiques projets/utilisateurs, liste des utilisateurs connectés |

| Liste des projets | Événements |
|---|---|
| Statuts colorés, recherche, ajout/modification/suppression | Calendrier interactif, détails par jour |

| Liste des tâches (Kanban) | Messagerie |
|---|---|
| Glisser-déposer pour changer l'état, recherche, notifications | Chat en temps réel, indicateur de messages lus |


---

## 🛠️ Stack technique

| Domaine | Technologies |
|---|---|
| **Front-end** | React.js, HTML, CSS, JavaScript, Bootstrap |
| **Back-end** | Node.js, Express.js |
| **Base de données** | MongoDB (via MongoDB Atlas), Mongoose (ODM) |
| **Temps réel** | Socket.io |
| **Authentification** | JWT (JSON Web Token) |
| **Outils de développement** | Visual Studio Code, Postman |
| **Conception** | UML (Wondershare EdrawMax), GanttProject |

---

## 🚀 Prérequis & installation

**Prérequis :**
- Node.js et npm installés
- Un compte MongoDB Atlas (ou une instance MongoDB locale)
- Postman (optionnel, pour tester l'API)

**Installation :**

```bash
git clone https://github.com/SihamDriham/Suivie-de-projet.git
cd Suivie-de-projet

# Backend
cd backend
npm install
cp .env.example .env     # renseigner MONGODB_URI, JWT_SECRET, PORT
npm run dev

# Frontend (dans un autre terminal)
cd frontend
npm install
npm start
```

L'application front-end tourne par défaut sur `http://localhost:3000` et l'API sur le port défini dans `.env` (ex. `http://localhost:5000`).

---

## 📁 Structure du projet

```
suivi-projet-mern/
├── backend/
│   ├── middlewares/         # auth JWT, gestion des rôles
│   ├── models/               # schémas Mongoose (Employe, Projet, Tache, Message...)
│   ├── controllers/          # logique métier (CRUD)
│   ├── routes/                # définition des routes REST
│   ├── uploads/              
│   └── app.js              # point d'entrée Express + socket.io
│
├── frontend/
│   ├── src/
│   │   ├── components/        # composants réutilisables
│   │   ├── pages/              # Dashboard, Projets, Taches, Messagerie...
│   │   ├── context/             # Context API (auth, notifications)
│   │   └── services/             # appels Axios vers l'API
│   └── public/
│
│
└── README.md
```

---

## Auteur

<div align="center">

**DRIHAM Siham**
Ingénieure d'État en Big Data — ENSA El Jadida
🔗 [LinkedIn](https://www.linkedin.com/in/siham-driham-955838238/) · 📧 [sihamdriham@gmail.com]

---

</div>
