const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const multer = require('multer');
const upload = multer();


/**
 * -------------- GENERAL SETUP ----------------
 */

//Gives us access to the .env variables
require('dotenv').config();

//Creates an instance of our express app
const app = express();
const port = 4000;

// Configures the database and opens a global connection that can be used in any module with `mongoose.connection`
require('./config/database');

// Must first load the models
require('./models/userSchema');

// Pass the global passport object into the configuration function
require('./config/passport')(passport);



// This will initialize the passport object on every request
app.use(passport.initialize());

// Instead of using body-parser middleware, use the new Express implementation of the same thing
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Allow the front-end to make HTTp requests to express app
app.use(cors());

//Import all routes from 
app.use(require('./routes'));

//Configures express to take multipart or form-data
app.use(upload.array());
app.use('user/', express.static('storage/images'))

//Multer error file handling 
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(418).json({
        err_code: err.code,
        err_message: err.message
      });
  } 
  //else {
  //  return res.status(500).json({
  //    err_code: 409,
  //    err_message: 'Something went wrong'
//    });}
  });

//Server will listen on specified PORT
app.listen(port, () =>
  console.log(`Your tennis server is running on server ${port}`)
)

module.exports = app;