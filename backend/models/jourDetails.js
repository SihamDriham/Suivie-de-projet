const mongoose = require('mongoose');
const {model,Schema} = mongoose

// Définition du schéma pour DétailJour
const DetailJourSchema = new Schema({
  heureDebut: {
    type: String,
    required: true
  },
  heureFin: {
    type: String,
    required: true
  },
  titre: {
    type: String,
    required: true
  },
  jourEvenement: {
    type: Schema.Types.ObjectId,
    ref: 'JourEvenement',
    required: true
  }
});


const DetailsJour = model('DetailJour',DetailJourSchema)
module.exports = DetailsJour
