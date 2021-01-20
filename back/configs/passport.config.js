const User = require("../models/user.model");
const bcrypt = require("bcrypt");

const localStrategy = require("passport-local").Strategy;

module.exports = (passport) => {
  passport.use(
    new localStrategy(
      // when you using different username, password input fields than the default ones
      {
        usernameField: "name",
        passwordField: "password",
      }, //
      (name, password, done) => {
        User.findOne({ name: name }, (error, user) => {
          if (error) throw error;

          if (!user) return done(null, false);
          bcrypt.compare(password, user.password, (error, result) => {
            if (error) throw error;
            if (result === true) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          });
        });
      }
    )
  );
  // serializeUser guarda una cookie en el navegador
  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });
  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id }, (error, user) => {
      const name = { userName: user.name };
      cb(error, name);
    });
  });
};
