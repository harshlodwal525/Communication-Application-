var express = require('express');
const formidable = require('formidable');
var router = express.Router();
const fs = require('fs');
const path = require("path")
const { MongoClient, ObjectId } = require('mongodb');
const { fileLoader } = require('ejs');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
let collection = "";

//Create mongodb Collection
async function main() {
  await client.connect();
  console.log('Connected successfully to server 4');
  const db = client.db('communication');
  collection = db.collection('myuploads'); // collection name
  findResult = await collection.find({}).toArray();
  return 'done.';
}

main();
/* GET users Data Api. ---------------------------------------------------------*/
router.get('/', function (req, res, next) { // GET API, user list
  collection.find({}).toArray(function (err, result) {
    if (err) throw err;
    console.log(result);
    res.json(result);
  });
});

// To edit Document Put Api -----------------------------------------------------------//
router.put('/', function (req, res) {
  collection.findOneAndUpdate(
    { _id: new ObjectId(req.body._id) },
    {
      $set: {
        Label: req.body.Label
      }
    },
    {
      upsert: true
    }
  )
    .then(result => res.json(result))
    .catch(error => console.error(error))
})

/* GET Individual Document listing. here-------------------- */
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

/* POST Document Api------------------------------------------------------------------------ */
router.post('/', function (req, res, next) {
  collection.insertOne({
    Label: req.body.nameLable,
    FileName: req.body.fileName,

  },
    function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// upload file Api post----------------------------------------------------------------------//

router.post("/files", function (req, res, next) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    var oldpath = files.File.filepath;
    var newpath = `uploads/${files.File.originalFilename}`;
    console.log(files.File.originalFilename)

    fs.copyFile(oldpath, newpath, function (err) {
      if (err) throw err;
     // res.send({ file_uploaded: `${files.File.originalFilename}` });
    });
  });
});


//* GET Individual document listing. */
router.delete('/:id&:fileName', function (req, res) { // DELETE API, delete user
  if (fs.existsSync(`uploads/${req.params.fileName}`)) {
    fs.unlinkSync(`uploads/${req.params.fileName}`);
  }
  collection.deleteOne(
    { _id: new ObjectId(req.params.id) }

  ).then(result => {
    res.json(result);
  }).catch(error => console.error(error))

})


module.exports = router;
