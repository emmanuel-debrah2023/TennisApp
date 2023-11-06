const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  fromUserId: {
    type: ObjectId,
    required: true
  },
  toChatId: {
    type: ObjectId,
    required: true
  },
  messageBody: {
    type: ObjectId,
    required: true 

  },
  timeSent: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = {messageSchema};