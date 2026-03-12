const Job = require('../models/Job');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Recruiter only)
const createJob = async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Not authorized to post jobs' });
    }

    const {
      title,
      companyName,
      companyLogo,
      location,
      salaryMin,
      salaryMax,
      experienceMin,
      experienceMax,
      jobType,
      skillsRequired,
      description,
    } = req.body;

    const job = await Job.create({
      title,
      companyName,
      companyLogo,
      location,
      salaryMin,
      salaryMax,
      experienceMin,
      experienceMax,
      jobType,
      skillsRequired,
      description,
      postedBy: req.user._id,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createJob,
};
