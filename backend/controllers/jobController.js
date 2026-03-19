const Job = require('../models/Job');
const Resume = require('../models/Resume');
const { calculateMatchScore } = require('../utils/matchScorer');

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

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const { title, location, jobType, skills, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    if (jobType) {
      query.jobType = jobType;
    }
    
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      query.skillsRequired = { $in: skillsArray.map(s => new RegExp(s, 'i')) };
    }

    const count = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    res.json({
      jobs,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalJobs: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email companyLogo');

    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get match score for a job
// @route   GET /api/jobs/:id/match
// @access  Private (Candidate only)
const getJobMatch = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const resume = await Resume.findOne({ candidateId: req.user.id });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found. Please upload a resume first.' });
    }

    const matchResult = calculateMatchScore(resume.skillsExtracted, job.skillsRequired);

    res.json({
      jobId: job._id,
      matchScore: matchResult.score,
      matchedSkills: matchResult.matchedSkills,
      missingSkills: matchResult.missingSkills,
    });
  } catch (error) {
    console.error('Match calculation error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  getJobMatch,
};

