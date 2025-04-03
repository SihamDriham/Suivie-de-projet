const mongoose = require('mongoose')
const {model,Schema} = mongoose

const conversation = new Schema({

  nomC: {
   type: String,
   required: true
  },

  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  latestMessage: {
    type: Schema.Types.ObjectId,
    ref: "Message",
  },

},
{
  timestamps: true,
}
);

const Conversation = model('conversation',conversation)
module.exports = Conversation