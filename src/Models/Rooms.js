const mongoose = require('mongoose');

const RommSchema = mongoose.Schema({
  id: {
    type: String,
  },
  name: {
    type: String,
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ChatRoom', RommSchema);
