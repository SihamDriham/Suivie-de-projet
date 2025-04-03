const mongoose = require('mongoose')
const {model,Schema} = mongoose

const tache = new Schema({

 // _id: {
 //  type: Schema.Types.ObjectId,
 //  default: new mongoose.Types.ObjectId()
 // },

 nomT: {
  type: String,
  required: true
 },

 descriptionT: {
  type: String,
  required: true
 },

 dateDebutT: {
  type: Date,
  required: true
 },

 dateFinT: {
  type: Date,
  required: true
 },

 statut_id: {
  type: Schema.Types.ObjectId,
  ref: 'Statut',
  required: true
 },

 phase_id: {
  type: Schema.Types.ObjectId,
  ref: 'Phase',
  required: true
 },

 user_id: { 
  type: Schema.Types.ObjectId,
  ref: 'User', 
  required: true
 }

})

const Tache = model('tache',tache)
module.exports = Tache