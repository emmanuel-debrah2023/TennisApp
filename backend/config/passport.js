const fs = require('fs');
const { ExtractJwt } = require('passport-jwt');
const path = require('path');
const User = require('mongoose').model('User');

const jwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

// Verification of id
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'] // Used to isssue and verify
};

const strategy = new jwtStrategy(options, (payload, done) => {
  User.findOne({ _id: payload.sub })
    .then((user) => {
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }

    }).catch(err => done(err,null));
  
});
// TODO
module.exports = (passport) => {
  passport.use(strategy);
}