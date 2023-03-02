// Import packages
const express = require('express');
var multer = require('multer');
var cors = require('cors');
const path = require('path');
const fs = require('fs');

const home = require('./routes/home');
const check = require('./routes/check');

const extract = require('./extract');
const core = require('./core');

// Middleware
const app = express();
app.use(express.json());

app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'file') {
      cb(null, '../../tmp');
    } else {
      cb(null, '../../tmp');
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
app.use('/api/check', check);

// Routes
app.get('/api/download', function (req, res) {
  try {
    const folderPath = __dirname + '../../../tmp/res.zip';
    res.download(folderPath, () => {
      fs.unlinkSync(path.join(__dirname, '../../tmp/file.docx'));
      fs.unlinkSync(path.join(__dirname, '../../tmp/data.xlsx'));
      fs.rmdirSync(path.join(__dirname + '../../../tmp/output'), {
        recursive: true,
        force: true,
      });
      fs.unlinkSync(path.join(__dirname, '../../tmp/res.zip'));
    });
    // res.send(`This is the downloaded`);
  } catch (err) {
    console.log(err);
    res.send(`This is the error ${err}`);
  }
});

app.post('/api/upload', upload, async (req, res) => {
  try {
    res.send('Uploaded Successfully');
    const data = await extract('data.xlsx');
    core('file.docx', data);
  } catch (err) {
    res.send(`This is the error ${err}`);
  }
});
// comment
// connection
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server Running On PORT: ${port}`));
