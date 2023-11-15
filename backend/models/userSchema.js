const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 20 
  },
  lastName: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true 
  },
  hash: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true,
    unique: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  profileImage: {
    type: String,
    //required: true
  },
  matches: {
    type: Array,
    default: []

  },
  gender: {
    genderName: {
      type: String,
      //required: true,
    },
    preferedMatch: {
      type: String
    }
  },
  userRating: {
    type: Number, // May change to enum with 5 options ?
    required: false,
    min: 1,
    max: 5,
  },
  reported: {
    userIdReported: {
      type: Array,
      default: []

      //required: true
    }
  },
  blocked: {
    userIdBlocked: {
      type: Array,
      default: []
      //required: true 
    }
  },
  createdDate: {
    type: Date,
    default: Date.now
  }

});

const User = mongoose.model('User', userSchema);
module.exports = {User};