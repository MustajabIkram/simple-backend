const AdmZip = require('adm-zip');
const path = require('path');
module.exports = async function createZipArchive() {
  const zip = new AdmZip();
  const outputFile = '../../tmp/res.zip';
  zip.addLocalFile(path.join(__dirname, '../../tmp/output-1.docx'));
  const data = zip.toBuffer();
  zip.writeZip(path.join(__dirname, outputFile));
  return data;
};
