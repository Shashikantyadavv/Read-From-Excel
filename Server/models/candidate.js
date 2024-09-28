const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  dob: String,
  workExperience: String,
  resumeTitle: String,
  currentLocation: String,
  postalAddress: String,
  currentEmployer: String,
  currentDesignation: String,
});

module.exports = mongoose.model('Candidate', candidateSchema);
