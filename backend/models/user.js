const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const userSchema = new Schema({

  cin: {
    type: String,
    required: true,
    unique: true,
  },
  nomU: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  telephone:{
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String
  },
  activation: {
    type: Boolean,
    default: true
  }
});

const User = model('User', userSchema);
module.exports = User;
