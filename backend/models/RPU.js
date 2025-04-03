const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const rpuSchema = new Schema({
  role_id: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'UserNormal',
    required: true
  },
  projet_id: {
    type: Schema.Types.ObjectId,
    ref: 'Projet',
    required: true
  }
});
const RPU = model('RPU', rpuSchema);
module.exports = RPU;
