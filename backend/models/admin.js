const mongoose = require('mongoose');
const User = require('./user');

// Définir le schéma pour l'utilisateur admin
const adminSchema = new mongoose.Schema({}, { discriminatorKey: 'type' });

adminSchema.add(User.schema.obj);

const Admin = User.discriminator('Admin', adminSchema);

module.exports = Admin;
