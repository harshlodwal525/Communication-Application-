const { promiseImpl } = require('ejs');
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");
const { MongoClient, ObjectId } = require('mongodb'); // include mongodb library 
const url = 'mongodb://localhost:27017'; // Connection URL
const client = new MongoClient(url);
let findResult = "";
let collection = "";
let salt = 10;
const JWT_SECRET = process.env.jwt;

//Create Connection here------------------------------------------------//
async function main() {
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db('communication');
  collection = db.collection('users'); // collection name
  findResult = await collection.find({}).toArray();
  return 'done.';
}

main();

/* GET users Api call here-------------. */
router.get('/', async function (req, res, next) { // GET API, user list
  try {
    await collection.find({}).toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
      res.json(result);
    });
  } catch (error) {
    console.log(error);
    return false;
  }

});

/* GET Individual users listing. here-------------------- */
router.get('/:id', function (req, res, next) {
  collection.findOne({
    _id: new ObjectId(req.params.id)
  },
    function (err, result) {
      if (err) throw err;
      res.send(result);
      console.log(result)
    });
});

/* POST users intothe database-------------------------------------------------Api. */

router.post('/', async function (req, res, next) { // POST API, add user
  const [password] = await Promise.all([bcrypt.hash(req.body.password, salt)]);
  try {
    await collection.insertOne({
      username: req.body.username,
      email: req.body.email,
      password: password,
    },
      function (err, result) {
        if (err) throw err;
        res.json(result);
      });
  } catch (error) {
    console.log(error);
    return false;
  }

});

//DELETE users.----------------------------------------------------------------- */
router.delete('/:id', function (req, res, next) {
  collection.deleteOne({
    _id: new ObjectId(req.params.id)
  },
    function (err, result) {
      if (err) throw err;
      res.send(result);
    });
});

/* UPDATE users put Api call here--------------------------------------------------------\\ */

router.put('/', function (req, res) { // PUT API, update user
  collection.findOneAndUpdate(
    { _id: new ObjectId(req.body._id) },
    {
      $set: {
        username: req.body.username,
        email: req.body.email
      }
    },
    {
      upsert: true
    }
  )
    .then(result => res.json(result))
    .catch(error => console.error(error))
})
module.exports = router;