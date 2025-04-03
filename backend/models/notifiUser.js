const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const notifUser = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'UserNormal'
  },
  notif_id: {
    type: Schema.Types.ObjectId,
    ref: 'Notification'
  }
});

const NotifUser = model("notifUser", notifUser);

module.exports = NotifUser;
