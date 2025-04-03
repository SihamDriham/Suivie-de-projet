const mongoose = require('mongoose')
const {model,Schema} = mongoose

const role = new Schema({

 // _id: {
 //  type: Schema.Types.ObjectId,
 //  default: new mongoose.Types.ObjectId()
 // },

 nomR: {
  type: String,
  required: true
 }

})

const Role = model('Role',role)
module.exports = Role