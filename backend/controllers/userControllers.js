const passport = require('passport');
const mongoose = require('mongoose');
const utils = require('../lib/utils');
const userSchema = require('../models/userSchema');
const User = mongoose.model("User", userSchema);


const addNewUser = async (req, res) => {
  let newUser = new User(req.body);

  try {
    await newUser.save();
    res.json(newUser);
  } catch (err) {
    res.send(err);
  }
};

const getUsers = async (req, res) => {

  try{
    const allUsers = await User.find({});
    res.json(allUsers);
  } catch(err) {
    res.send(err);
  }
};

const getUserById = async (req, res) => {

  try{
  const thisUser =  await User.findById(req.params.UserId);
    res.json(thisUser);
  } catch(err) {
    res.send(err);
  }
};

//Update this so all user fields auto filled unless changed in req
const updateUser = async (req, res) => {
  let updatedUser = new User(req.body);

  try{
    await User.findById(req.user._id ,function(err, user) {
      if (!user) {
        req.flash('Error', 'User not logged in');
        return res.redirect('users/editProfile');
      }

      //Trim resposnses
      var email = req.body.email.trim();
      var firstname = req.body.firstname.trim();
      var lastname = req.body.lastname.trim();
      var phone = req.body.phone.trim();
      var genderName = req.body.gender.genderName.trim();
      var preferedMatch = req.body.gender.preferedMatch.trim();


      //Ensure any empty fields do not get passed into DB
      
      if (typeof email !== 'undefined') {
          user.email = email;
      }
      if (typeof firstname !== 'undefined') {
          user.firstname = firstname;
      }
      if (typeof lastname !== 'undefined') {
          user.lastname = lastname;
      }
      if (typeof phone !== 'undefined') {
        user.phone = phone;
      }
      if (typeof preferedMatch !== 'undefined') {
        user.preferedMatch = preferedMatch;
      }
      if (typeof genderName !== 'undefined') {
        user.genderName  = genderName ;
      }

      user.save(function (err, resolve) {
        if(err)
          console.log('db error', err)
           // saved!
         });
    });

  } catch(err) {
    res.send(err);
  }
};

const deleteUser = async (req,res) => {
  try{
    await User.findOneAndDelete({_id: req.data.UserId});
    res.json('User deleted')
  } catch (err){
    res.send(err);
  }
};

const loginUser = function(req, res, next){
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

const registerUser = function(req, res, next){
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

module.exports = addNewUser,getUsers,getUserById, updateUser, loginUser, registerUser;