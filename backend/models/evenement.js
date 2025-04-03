const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const event = new Schema({
  // _id: {
  //   type: Schema.Types.ObjectId,
  //   default: new mongoose.Types.ObjectId()
  // },
  titre: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  lieu: {
    type: String,
    required: true
  },
  typeE: {
    type: String,
    required: true
  },
  dateDebut: {
    type: Date,
    required: true
  },
  dateFin: {
    type: Date,
    required: true
  },
  projet_id: {
    type: Schema.Types.ObjectId,
    ref: 'Projet',
    required: true
  }
});

const Event = model('event', event);
module.exports = Event;
