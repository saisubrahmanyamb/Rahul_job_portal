const User = require('../models/User');
const bcrypt = require('bcryptjs');
const AppliedJob = require('../models/AppliedJob');
const Job = require('../models/Job');
exports.createAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if an admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      return res.status(400).json({ message: 'An admin already exists' });
    }

    // Create new admin
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllUserApplications = async (req, res) => {
  
  try {
    const applications = await AppliedJob.find()
      .populate('user', 'name email')  // Populate user name and email
      .populate('job', 'jobTitle'); 
       // Populate job title

    res.json(applications);
  } catch (error) {
    console.error('Error fetching user applications:', error);
    res.status(500).json({ error: 'Failed to fetch user applications' });
  }
};

exports.getApplication = async (req, res) => {
    
  try {
    const application = await AppliedJob.findById(req.params.id).populate('job user'); // Populating related job and user details
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching application details' });
  }
};

exports.acceptApplication = async (req, res) => {
  
  try {
    const application = await AppliedJob.findById(req.params.id); // Use 'id' instead of 'Jobid'
   

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = 'Accepted';
    
    
    await application.save();
    
    
    res.json({ message: 'Application accepted successfully' });
  } catch (error) {
    console.error('Error accepting application:', error);
    res.status(500).json({ message: 'Error accepting application' });
  }
};


exports.rejectApplication = async (req, res) => {
  
  try {
    const application = await AppliedJob.findById(req.params.id); 
    

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = 'Rejected';
    

    await application.save();
   

    res.json({ message: 'Application rejected successfully' });
  } catch (error) {
    console.error('Error rejecting application:', error);
    res.status(500).json({ message: 'Error rejecting application' });
  }
};


exports.getDashboardStats = async (req, res) => {
  try {
    // Total Jobs
    const totalJobs = await Job.countDocuments();

    // Total Applications
    const totalApplications = await AppliedJob.countDocuments();

    // Active Jobs (assuming all jobs are active in your current model)
    const activeJobs = totalJobs;

    // Pending Applications
    const pendingApplications = await AppliedJob.countDocuments({ status: 'Pending' });

    res.json({
      totalJobs,
      totalApplications,
      activeJobs,
      pendingApplications
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard statistics', error });
  }
};