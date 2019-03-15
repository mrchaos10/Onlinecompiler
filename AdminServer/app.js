const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

// Mongo URI
const mongoURI = 'mongodb://localhost/mongouploads';

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

mongoose.connect('mongodb://localhost/mongotest');

var db = mongoose.connection;

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  // console.log('we are connected!');
  //Init stream
   //gfs=grid(db.db,mongoose.mongo);
   //gfs.collection('testcases');
});
var nameSchema = new mongoose.Schema({
  title: String,
  description: String,
  testcase: String,

});
var User = mongoose.model("welcome", nameSchema); 

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });
var hi;
// @route GET /
// @desc Loads form
app.get('/', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      res.render('index', { files: false });
    } else {
      files.map(file => {
        if (
          file.contentType === 'image/jpeg' ||
          file.contentType === 'image/png'
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      //Find all documents in the customers collection:
  db.collection("welcomes").find({}).toArray(function(err, result) {
    if (err) throw err;
    /*var str1 = result.testcase;
    var str2 = files.filename;
    var n = str1.localeCompare(str2);
    if (n == 0)
    {
    }*/
     console.log(files.filename);  
     
     const str2 = files.filename;
      
     var response = JSON.stringify(result);
     //var k = JSON.parse(response);
    // var k = result.length();
     //console.log(result);
     var count = Object.keys(result).length;
     var i;

     for( i=0 ; i<count ; i++)
     {
      var str1 = result[i].testcase;
      var n = str1.localeCompare(str2);
      console.log(str1 + '' +str2);
      console.log(n); 
      if (n == 0)
       {
        console.log('HELLO WORLD');    
       }
    }
    // console.log(result[0].testcase);
    console.log(result + 'i am the result');  
    res.render('index', { files: files , result : result});
     hi = { files: files , result : result};
  });
      }

  });
});

app.get('/programs',(req, res) => {
  if(hi === 'undefined')
  {
    res.send("Try reloading the page");
  }
  else
  {
    gfs.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        res.render('index', { files: false });
      } else {
        files.map(file => {
          if (
            file.contentType === 'image/jpeg' ||
            file.contentType === 'image/png'
          ) {
            file.isImage = true;
          } else {
            file.isImage = false;
          }
        });
        //Find all documents in the customers collection:
    db.collection("welcomes").find({}).toArray(function(err, result) {
      if (err) throw err;
      /*var str1 = result.testcase;
      var str2 = files.filename;
      var n = str1.localeCompare(str2);
      if (n == 0)
      {
      }*/
       console.log(files.filename);  
       
       const str2 = files.filename;
        
       var response = JSON.stringify(result);
       //var k = JSON.parse(response);
      // var k = result.length();
       //console.log(result);
       var count = Object.keys(result).length;
       var i;
  
       for( i=0 ; i<count ; i++)
       {
        var str1 = result[i].testcase;
        var n = str1.localeCompare(str2);
        console.log(str1 + '' +str2);
        console.log(n); 
        if (n == 0)
         {
          console.log('HELLO WORLD');    
         }
      }
      // console.log(result[0].testcase);
      console.log(result + 'i am the result');  
      res.render('programs', { files: files , result : result});
       hi = { files: files , result : result};
    });
        }
  
    });
  }
});
// @route POST /upload
// @desc  Uploads file to DB
app.post('/upload', upload.single('file'), (req, res) => {
   //res.json({ file: req.file.filename });
  var fileee =req.file.filename;
  console.log(fileee);
  req.body.testcase=fileee;
  var myData = new User(req.body);
  myData.save()
      .then(item => {
          res.send("Details saved to the server");
      })
      .catch(err => {
          res.status(400).send("Unable to save to database");
      });
  //res.redirect('/');
});


// @route GET /files
// @desc  Display all files in JSON
app.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }

    // Files exist
    return res.json(files);
  });
});

// @route GET /files/:filename
// @desc  Display single file object
app.get('/files/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    // File exists
    const readstream = gfs.createReadStream(file.filename);
    readstream.pipe(res);
   // return res.json(file);
  });
});

// @route GET /image/:filename
// @desc Display Image
app.get('/image/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});

// @route DELETE /files/:id
// @desc  Delete file
app.delete('/files/:id', (req, res) => {
  gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }

    res.redirect('/');
  });
});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
