const { promiseImpl } = require('ejs');
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");
router.use(cookieParser());
const { MongoClient, ObjectId } = require('mongodb'); // include mongodb library 
const url = 'mongodb://localhost:27017'; // Connection URL
const client = new MongoClient(url);
let findResult = "";
let collection = "";
const JWT_SECRET = process.env.jwt;

// For creating Connection
async function main() {
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db('communication');
  collection = db.collection('users'); // collection name
  findResult = await collection.find({}).toArray();
  return 'done.';
}

main();

// user login verifyuserLogin  function-------------------------------------------//
const verifyUserLogin = async (email, password) => {
  try {
    const user = await collection.findOne({ email })
    console.log(user)
    if (!user) {
      return { status: 'error', error: 'user not found' }
    }
    const isValid = await bcrypt.compare(password, user.password)
    if (isValid) {
      // creating a JWT token
      token = jwt.sign({ id: user._id, email: user.email, username: user.username, type: 'user' }, JWT_SECRET)
      return { status: 'OK', data: token };
    }
    return { status: 'error', error: 'invalid password' }
  } catch (error) {
    console.log(error);
    return { status: 'error', error: 'timed out' }
  }
}

// post Api for Login user to check user --------------------------------------------//
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const response = await verifyUserLogin(email, password);
  if (response.status === 'OK') {
    // JWT token as a cookie in browser
    console.log("Token", token)
    res.json({ token, status: 201 });
  } else {
    res.json(response.status);
  }
})

module.exports = router;