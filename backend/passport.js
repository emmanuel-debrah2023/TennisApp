import userModel from './models';

const passport = require('passport');
const localStrategy= require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;


//LOCAL STRATEGY
passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function (email, password, cb){
    return userModel.findOne({email, password})
      .then(user => {
        if (!user) {
          return cb(null, false, {message:
          'Incorrect email or password.'});
        }

        return cb(null, user, {message: 'Logged in succesfuly!'});
      })
      .catch(err => cb(err));
  }
));

//JWT STRATEGY
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey   : 'your_jwt_secret'
},
function (jwtPayload, cb) {

  //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
  return UserModel.findOneById(jwtPayload.id)
      .then(user => {
          return cb(null, user);
      })
      .catch(err => {
          return cb(err);
      });
}
));
