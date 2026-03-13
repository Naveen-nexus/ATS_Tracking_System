const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Candidate only)
const applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const candidateId = req.user._id;

    // Ensure only candidates can apply
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ message: 'Only candidates can apply to jobs' });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check for existing application
    const existingApplication = await Application.findOne({
      candidateId,
      jobId,
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Create application
    const application = await Application.create({
      candidateId,
      jobId,
      status: 'Applied',
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyJob,
};
