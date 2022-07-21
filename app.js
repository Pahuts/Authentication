//jshint esversion:6
require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')

const app = express()

app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
  extended: true
}))

// connect to mongodb
mongoose.connect("mongodb://localhost:27017/userDB")

// Create Schema and Model
const userSchema = new mongoose.Schema ({
  email: String,
  password: String
})



userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] })

const User = new mongoose.model("User", userSchema)


// home page
app.get("/", (req,res) => {
  res.render("home")
})

//login page
app.get("/login", (req,res) => {
  res.render("login")
})

//register page
app.get("/register", (req,res) => {
  res.render("register")
})

// register post

app.post("/register", (req,res) => {
  const email = req.body.username
  const password = req.body.password

  const newUser = new User({
    email: email,
    password: password
  })

  newUser.save(function(err) {
    if(err) {
      console.log(err)
    } else {
      res.render("secrets")
    }
  })
})

// login post

app.post('/login', (req,res) => {
  const username = req.body.username
  const password = req.body.password

  User.findOne({email: username}, function(err, foundUser) {
    if(err) {
      console.log(err)
    } else {
      if(foundUser) {
        if(foundUser.password === password) {
          res.render('secrets')
        } else {
          console.log("invalid user")
        }
      }
    }
  })
})

app.listen(3000, function(req,res) {
  console.log("Server started on port 3000")
})