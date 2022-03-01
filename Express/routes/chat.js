var express = require('express');
var router = express.Router();
const { MongoClient, ObjectId } = require('mongodb'); // include mongodb library 
const url = 'mongodb://localhost:27017'; // Connection URL
const client = new MongoClient(url);
let collection = "";

// For creating Connection
async function main() {
  await client.connect();  // Use connect method to connect to the server
  console.log('Connected successfully to server 4');
  const db = client.db('communication');
  collection = db.collection('chat'); // collection name
  findResult = await collection.find({}).toArray();
  return 'done.';
}

main();

/* GET users Api----------------------------------------------------------------- */
router.get('/', function (req, res, next) {
  try {
    collection.find({}).toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
  } catch (error) {
    console.log(error);
    return false;
  }
});

/* POST Api Of Chat ----------------------------------------------------------------- */
router.post('/', function (req, res, next) {
  collection.insertOne({
    time: req.body.time,
    name: req.body.name,
    msg: req.body.msg,
  },
    function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

module.exports = router;