// Import packages
const express = require('express');
var multer = require('multer');
var cors = require('cors');
const path = require('path');
const fs = require('fs');

const home = require('./routes/home');
const extract = require('./extract');
const core = require('./core');
const zip = require('./zip');

// Middleware
const app = express();
app.use(express.json());

app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'file') {
      cb(null, './file');
    } else {
      cb(null, './data');
    }
  },
  filename: function (req, file, cb) {
    if (file.fieldname === 'file') cb(null, 'file.docx');
    if (file.fieldname === 'data') cb(null, 'data.xlsx');
  },
});

const upload = multer({ storage: storage }).fields([
  {
    name: 'file',
  },
  {
    name: 'data',
  },
]);

app.use('/api', home);

// Routes
app.get('/api/download', function (req, res) {
  const folderPath = __dirname + '/res.zip';
  res.download(folderPath, () => {
    fs.unlinkSync(path.join(__dirname, '/file/file.docx'));

    fs.unlinkSync(path.join(__dirname, '/data/data.xlsx'));

    fs.readdir(path.join(__dirname, '/output/'), (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlinkSync(path.join(__dirname, '/output/') + file, (err) => {
          if (err) throw err;
        });
      }
    });

    fs.unlinkSync(path.join(__dirname, '/res.zip'));
  });
});

app.post('/api/upload', upload, async (req, res) => {
  try {
    res.send('Uploaded Successfully');
    const data = await extract('data.xlsx');
    core('file.docx', data);
    zip();
  } catch (err) {
    res.send(err);
  }
});

// connection
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server Running On PORT: ${port}`));
