const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const projetPhase = new Schema({
  projet_id: {
    type: Schema.Types.ObjectId,
    ref: 'Projet'
  },
  phase_id: {
    type: Schema.Types.ObjectId,
    ref: 'Phase'
  }
});

const ProjetPhase = model("projetPhase", projetPhase);

module.exports = ProjetPhase;
