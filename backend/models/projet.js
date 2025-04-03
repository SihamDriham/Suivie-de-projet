const mongoose = require('mongoose')
const {model,Schema} = mongoose

const projetSchema = new Schema({
    // _id: {
    //  type: Schema.Types.ObjectId,
    //  default: new mongoose.Types.ObjectId()
    // },
    nomP: {
     type: String,
     required: true
    },
    descriptionP: {
     type: String,
     default: ''
    },
    dateDebutP: {
     type: Date,
     default: Date.now
    },
    dateFinEst: {
     type: Date,
     default: function() {
      return new Date(this.dateDebutP.getTime() + 7 * 24 * 60 * 60 * 1000); 
     }
    },
    dateFinP: {
     type: Date,

    },
    budget: {
     type: Number,
     default: 0
    },
    statut_id: {
     type: Schema.Types.ObjectId,
     ref: 'Statut',
     required: true
    }
});

const Projet = model("Projet", projetSchema);
module.exports = Projet;