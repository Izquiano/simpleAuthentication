const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();
const User = require("./models/user.model");

mongoose
  .connect("mongodb://127.0.0.1:27017/simple-authentication", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.info("Successfully conect to data base"))
  .catch((error) =>
    console.error("An error ocurred trying to connect to database: ", err)
  );

// Middlewares

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require("./configs/passport.config")(passport);

// Routes

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) throw error;

    if (!user) res.send("No user Exists");
    else {
      req.logIn(user, (error) => {
        if (error) throw error;
        res.send("Successfully authenticated");
        console.log("req.user: ", req.user);
      });
    }
  })(req, res, next);
});

app.post("/register", (req, res, next) => {
  User.findOne({ name: req.body.name }, async (error, document) => {
    if (error) throw error;
    if (document) res.send("User already exist");
    if (!document) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        name: req.body.name,
        password: hashedPassword,
      });
      await newUser.save();
      res.send("User Created");
    }
  });
});
app.get("/user", (req, res, next) => {
  // una vez autenticado, el usuario se guarda en req.user y se puede acceder desde cualquier sitio de la aplicación
  res.send(req.user);
});

// Start Server

app.listen(4000, () => console.log("Server listening at port 4000"));
