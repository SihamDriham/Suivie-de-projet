const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const statutSchema = new Schema({
    // _id: {
    //     type: Schema.Types.ObjectId,
    //     default: new mongoose.Types.ObjectId()
    // },
    etat: {
        type: String,
        required: true
    }
});

const Statut = model('Statut', statutSchema); // Assurez-vous d'utiliser 'Statut' comme nom du modèle ici
module.exports = Statut;