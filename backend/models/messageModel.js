import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const messageSchema = new Schema({
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