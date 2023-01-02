const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please provide your name'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});
