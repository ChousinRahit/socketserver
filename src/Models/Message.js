const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
  text: {
    type: String,
  },
  user: {
    type: String,
  },
  time: {
    type: String,
  },
  id: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Message', MessageSchema);
