const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get recruiter dashboard statistics
// @route   GET /api/analytics/dashboard
// @access  Private (Recruiter only)
const getDashboardStats = async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const recruiterId = req.user._id;

    // 1. Get total jobs posted by recruiter
    const totalJobs = await Job.countDocuments({ postedBy: recruiterId });

    // 2. Get all job IDs posted by recruiter
    const jobs = await Job.find({ postedBy: recruiterId }).select('_id');
    const jobIds = jobs.map(job => job._id);

    // 3. Get total applications for these jobs
    const totalApplications = await Application.countDocuments({ jobId: { $in: jobIds } });

    // 4. Get application status distribution
    const statusDistribution = await Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Format status distribution for frontend (e.g., { Applied: 10, Interview: 2 })
    const statusStats = statusDistribution.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    // 5. Get recent applications (limit 5)
    const recentApplications = await Application.find({ jobId: { $in: jobIds } })
      .sort({ appliedAt: -1 })
      .limit(5)
      .populate('candidateId', 'name email')
      .populate('jobId', 'title');

    res.json({
      totalJobs,
      totalApplications,
      statusStats,
      recentApplications
    });

  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getDashboardStats
};
