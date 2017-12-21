const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('../models/user')

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
        console.log(user)
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { error : 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { error: 'Incorrect password.' });
      }

      // test a matching password
      // user.validPassword(password, function(err, isMatch) {
      //       if (err) throw err;
      //       console.log('Password:', isMatch); // -> Password123: true
      //   });
      return done(null, user);
    });
  }
))


module.exports = passport
