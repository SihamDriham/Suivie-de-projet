const mongoose = require('mongoose')
const {model,Schema} = mongoose

const phase = new Schema({

 libelle: {
  type: String,
  required: true
 },

 desc: {
  type: String,
  required: true
 },

 statut_id: {
  type: Schema.Types.ObjectId,
  ref: 'Statut',
  required: true
 },

 projet_id: {
    type: Schema.Types.ObjectId,
    ref: 'Projet'
  }

})

const Phase = model("Phase",phase)
module.exports = Phase