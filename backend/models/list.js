const mongoose = require('mongoose')
const {model,Schema} = mongoose

const list = new Schema({

 // _id: {
 //  type: Schema.Types.ObjectId,
 //  default: new mongoose.Types.ObjectId()
 // },

 contenuL: {
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
  ref: 'UserNormal', 
  required: true
 }

})

const List = model('List',list)
module.exports = List