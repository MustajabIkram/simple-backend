const AdmZip = require('adm-zip');
const path = require('path');
module.exports = async function createZipArchive() {
  const zip = new AdmZip();
  const outputFile = '../../tmp/res.zip';
  zip.addLocalFolder(path.join(__dirname, '../../tmp/output'));
  const data = zip.toBuffer();
  zip.writeZip(path.join(__dirname, outputFile));
  return data;
};
