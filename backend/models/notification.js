const mongoose = require('mongoose')
const {model,Schema} = mongoose

const notification = new Schema({

 // _id: {
 //  type: Schema.Types.ObjectId,
 //  default: new mongoose.Types.ObjectId()
 // },

 contenuN: {
  type: String,
  required: true
 },

 dateHeure: {
  type: Date,
  default: Date.now,
  required: true
 },

 typeN: {
  type: String,
  required: true
 },

 statut_id: {
  type: Schema.Types.ObjectId,
  ref: 'Statut',
  required: true
 },

 user_id: {
  type: Schema.Types.ObjectId,
  ref: 'UserNormal'
 }

})

const Notification = model('Notification',notification)
module.exports = Notification