const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');

// @desc    Save a job
// @route   POST /api/users/saved-jobs
// @access  Private (Candidate only)
const saveJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (req.user.role !== 'candidate') {
      return res.status(403).json({ message: 'Only candidates can save jobs' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already saved
    const existingSave = await SavedJob.findOne({
      candidateId: req.user._id,
      jobId,
    });

    if (existingSave) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    const savedJob = await SavedJob.create({
      candidateId: req.user._id,
      jobId,
    });

    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ candidateId: req.user._id })
      .populate('jobId')
      .sort({ createdAt: -1 });

    res.json(savedJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unsaveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const savedJob = await SavedJob.findOneAndDelete({
      candidateId: req.user._id,
      jobId,
    });

    if (savedJob) {
      res.json({ message: 'Job removed from saved list' });
    } else {
      res.status(404).json({ message: 'Saved job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  saveJob,
  getSavedJobs,
  unsaveJob,
};
