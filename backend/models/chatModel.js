import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const userSchema = new Schema({
  participants:[{type: ObjectId, ref: 'User'}],
  createdAt: {
    type: Date,
    default: Date.now
  }
});