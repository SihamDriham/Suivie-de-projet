const mongoose = require('mongoose');
const {model,Schema} = mongoose

const JourEvenementSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  evenement: {
    type: Schema.Types.ObjectId,
    ref: 'event',
    required: true
  }
});

const JourEvent = model('JourEvenement',JourEvenementSchema)
module.exports = JourEvent