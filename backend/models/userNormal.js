const mongoose = require('mongoose');
const User = require('./user');

const userNormalSchema = new mongoose.Schema({}, { discriminatorKey: 'type' });

userNormalSchema.add(User.schema.obj);

const UserNormal = User.discriminator('UserNormal', userNormalSchema);

module.exports = UserNormal;
