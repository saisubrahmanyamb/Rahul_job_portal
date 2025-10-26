const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobTitle: String,
  company: String, 
  description: String,
  position: String, 
  requirements: String,
  location: String,
  salary: String,
  jobType: String,
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;


