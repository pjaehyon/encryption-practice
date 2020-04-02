//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
const md5 = require("md5");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});

// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields:['password'] });

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home")
})

app.get("/login", function(req, res) {
  res.render("login")
});

app.get("/register", function(req, res) {
  res.render("register")
})

app.get("/secrets", function(req, res) {
  res.render("secrets")
})

app.get("/submit", function(req, res) {
  res.render("submit")
})


app.post("/register",function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password)
  });
  newUser.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});


app.post("/login", function(req, res) {
  const typedEmail = req.body.username;
  const typedPassword = md5(req.body.password);
  User.findOne({email: typedEmail}, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      if (result) {
        if (result.password === typedPassword) {
          console.log(result.password);
          console.log(typedPassword);
          res.render("secrets");
        } else {
          res.send("Invalid username or password. Try again.");
        }
      } else {
        res.send("Invalid username or password. Try again.");
      }
    }
  });
});



app.listen(3000, function() {
  console.log("Server started on port 3000.")
})
