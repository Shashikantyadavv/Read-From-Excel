const multer = require('multer');
const XLSX = require('xlsx');
const Candidate = require('../models/candidate');
const async = require('async');

const upload = multer({ dest: 'uploads/' }).single('file');

const processExcel = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  return sheet;
};

const excelDateToJSDate = (serial) => {
    const excelStartDate = new Date(1900, 0, 1); 
    return new Date(excelStartDate.getTime() + (serial - 2) * 86400000); 
};

const addCandidates = (req, res) => {
  upload(req, res, (err) => {
    if (err) return res.status(500).send('File upload failed');

    const filePath = req.file.path;
    const candidates = processExcel(filePath);

    async.eachSeries(candidates, (candidate, callback) => {
      Candidate.findOne({ email: candidate.Email })
        .then(foundCandidate => {
          if (foundCandidate) {
            console.log(`Duplicate entry skipped: ${candidate.Email}`);
            return callback(); 
          } else {
            const normalizedCandidate = {
              email: candidate.Email,
              name: candidate['Name of the Candidate'],
              mobileNo: candidate['Mobile No.'],
              dob: excelDateToJSDate(candidate['Date of Birth']),
              workExperience: candidate['Work Experience'],
              resumeTitle: candidate['Resume Title'],
              currentLocation: candidate['Current Location'],
              postalAddress: candidate['Postal Address'],
              currentEmployer: candidate['Current Employer'],
              currentDesignation: candidate['Current Designation'],
            };

            const newCandidate = new Candidate(normalizedCandidate);
            return newCandidate.save()
              .then(() => {
                console.log(`Added: ${candidate.Email}`);
                callback();
              });
          }
        })
        .catch(error => {
          console.error(`Error processing candidate ${candidate.Email}:`, error);
          callback(error);
        });
    }, (err) => {
      if (err) {
        console.error('Error processing records:', err);
        return res.status(500).send('Error processing records');
      }
      res.send('All records processed successfully');
    });
  });
};

module.exports = { addCandidates };
