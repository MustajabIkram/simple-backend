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
    const folderPath = path.join(
      __dirname + '../../../tmp/output/output-1.docx'
    );
    const docxPath = path.join(__dirname, '../../tmp/file.docx');
    const dataPath = path.join(__dirname, '../../tmp/data.xlsx');
    const outputDir = path.join(__dirname + '../../../tmp/output');
    console.log(folderPath, docxPath, dataPath, outputDir);
    res.download(folderPath)
    // res.download(folderPath, () => {
    //   fs.unlinkSync(docxPath);
    //   fs.unlinkSync(dataPath);
    //   fs.rmdirSync(outputDir, {
    //     recursive: true,
    //     force: true,
    //   });
      // fs.unlinkSync(folderPath);
    });
  } catch (err) {
    console.log(err);
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
