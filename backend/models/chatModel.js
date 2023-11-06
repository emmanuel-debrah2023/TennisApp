const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  participants:[{type: ObjectId, ref: 'User'}],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports ={userSchema};