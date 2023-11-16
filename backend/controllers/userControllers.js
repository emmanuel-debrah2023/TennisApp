const passport = require('passport');
const mongoose = require('mongoose');
const utils = require('../lib/utils');
const User = require('../models/userSchema').User;
const multer = require('multer');



//comment this func out as its deprecated
const addNewUser = async (req, res) => {
//let newUser = new User(req.body);
  let payload = req.body;
  // Check if image included
  console.log(req.body);
  if (req.body.profileImage) {
  let imgUrl = `storage/images/${req.body.profileImage}`;

  } else {
    let imgUrl = '';
  }

  payload.profileImage = imgUrl;
  let newUser = new User(req.body);
  try {
    console.log(req.body);
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
    res.status(200).json(thisUser);
  } catch(err) {
    res.send(err);
  }
};

const getUserMatches = async (req, res) => {
  try{
    const id = req.params.id ; 
    const user = await User.findById(id);

    //Find every match associated with id
    const matches = await Promise.all(
      user.matches.map((id) => User.findById(id))
    );


    const formattedMatches = matches.map(
      ({_id, firstName, lastName, profileImage}) => {
        return {_id, firstName, lastName, profileImage};
      }
    ); 
    res.status(200).json(formattedMatches); 
    
  } catch (err) {
    res.status(404).json({ message: err.message});
  }
}

const addRemoveFriend = async (req, res) => {
  try {
    //Take both id's from query params
    const {id, friendId} = req.params;

    //Fetch user objects associated with ids
    const user = await User.findById(id);
    const match = await User.findById(friendId);

    //If one user unmatches the other remove from list
    if (user.matches.includes(friendId)) {
      user.matches = user.matches.filter((id) => id !== friendId);
      match.matches = match.matches.filter((id) => id !== id);

    } else {
      //Add them as each others match
      user.matches.push(friendId);
      match.matches.push(id);

    }

    await user.save();
    await match.save();

    //Find every match associated with id
    const matches = await Promise.all(
      user.matches.map((id) => User.findById(id))
    );


    const formattedMatches = matches.map(
      ({_id, firstName, lastName, profileImage}) => {
        return {_id, firstName, lastName, profileImage};
      }
    ); 


    res.status(200).json(formattedMatches);
  } catch(err){
    res.status(404).json({message: err.message})
  }
}

//Update this so all user fields auto filled unless changed in req
const updateUser = async (req, res) => {
  
  let updatedUser = new User(req.body);

  try{
    await User.findById(req.user._id ,function(err, user) {
      if (!user) {
        req.flash('Error', 'User not logged in');
        console.log('Not logged in')
        return res.redirect('users/login');
      } else {
        console.log(user)
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

const updateThisUser = async (req,res) => {
  const payload = JSON.parse(JSON.stringify(req.body))

  const update = {};
  for (const key of Object.keys(payload)){
    if (payload[key] !== '') {
      update[key] = payload[key];
    }
  }

  let imgUrl = ''
  if (req.file) {
    imgUrl = `./storage/images/${req.file.filename}`;
    update.profileImage = imgUrl
    }
    

  console.log(update);

  try {
    await User.findOneAndUpdate({_id: payload._id}, {$set: update}, {new: true}).then((updated) => {
      console.log('sucess');
      res.status(200).json(updated);
    });
    
  }catch (err) {
    console.log('err', err);
    res.send(err); 
  }

}

const postCodeTest = async(req,res) => {
  try{
    const {postcode} = req.params;

  } catch(err){

  }
}

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
  
  
  let imgUrl = ''
  if (req.file) {
    imgUrl = `./storage/images/${req.file.filename}`;
    } else {
      imgUrl = 'default'
    }

  const payload = JSON.parse(JSON.stringify(req.body))

  console.log(payload)

  const saltHash = utils.genPassword(payload.password);

  
  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = User({
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    hash: hash,
    salt: salt,
    phone: payload.phone,
    profileImage: imgUrl
  });
  try {
    
    newUser.save()
        .then((user) => {
          const id = user._id;

          //Get rid of this and issue upon login 
          //const jwt = utils.issueJWT(user)
          //  res.json({ success: true, user: user, token: jwt.token, expiresIn: jwt.expires });
        });

} catch (err) {
    
    res.json({ success: false, msg: err });

}
};

module.exports = {updateThisUser,getUsers,getUserById, updateUser, loginUser, registerUser};