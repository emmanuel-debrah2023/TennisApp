import {userSchema} from '../models/userModel';

const passport = require('passport');
const mongoose = require('mongoose');
const utils = require('../lib/utils');
const User = mongoose.model('User', userSchema)

export const addNewUser = async (req, res) => {
  let newUser = new User(req.body);

  try {
    await newUser.save();
    res.json(newUser);
  } catch (err) {
    res.send(err);
  }
};

export const getUsers = async (req, res) => {

  try{
    const allUsers = await User.find({});
    res.json(allUsers);
  } catch(err) {
    res.send(err);
  }
};

export const getUserById = async (req, res) => {

  try{
  const thisUser =  await User.findById(req.params.UserId);
    res.json(thisUser);
  } catch(err) {
    res.send(err);
  }
};

//Update this so all user fields auto filled unless changed in req
export const updateUser = async (req, res) => {
  let updatedUser = new User(req.body);

  try{
    await User.findOneAndUpdate({_id: req.body._id},{new: true},req.body);
    res.json(User);
  } catch(err) {
    res.send(err);
  }
};

export const deleteUser = async (req,res) => {
  try{
    await User.findOneAndDelete({_id: req.data.UserId});
    res.json('User deleted')
  } catch (err){
    res.send(err);
  }
};

export const loginUser = function(req, res, next){
  User.findOne({ email: req.body.email})
    .then((user) => {
      if (!user) {
        res.status(401).json({ success: false, msg: "Could not find user"})
      }

      const isValid = utils.validPassword(req.body.password, user.hash, user.salt)

      if (isValid) {
        const tokenObject = utils.issueJWT(user);

        res.status(200).json({ success: true, token: tokenObject.token, expiresIn: tokenObject.expires})
      } else {

        res.status(401).json({ success: false, msg: "You entered the wrong password or email"})

      }

    })
    .catch((err) => {
        next(err);
    });
};

export const registerUser = function(req, res, next){
  const saltHash = utils.genPassword(req.body.password);

  
  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = User({
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    email: req.body.email,
    hash: hash,
    salt: salt,
    phone: req.body.phone
  });
  try {
    
    newUser.save()
        .then((user) => {
          const id = user._id;

          const jwt = utils.issueJWT(user)
            res.json({ success: true, user: user, token: jwt.token, expiresIn: jwt.expires });
        });

} catch (err) {
    
    res.json({ success: false, msg: err });

}
};