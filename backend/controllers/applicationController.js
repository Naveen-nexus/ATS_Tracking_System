const Application = require('../models/Application');
const Job = require('../models/Job');
const Resume = require('../models/Resume');
const Notification = require('../models/Notification');
const { calculateMatchScore } = require('../utils/matchScorer');
const sendEmail = require('../utils/emailService');

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
    const job = await Job.findById(jobId).populate('postedBy', 'email name');
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

    // Calculate match score
    let matchScore = 0;
    try {
      const resume = await Resume.findOne({ candidateId });
      if (resume) {
        const result = calculateMatchScore(resume.skillsExtracted, job.skillsRequired);
        matchScore = result.score;
      }
    } catch (metricError) {
      console.error('Error calculating match score on apply:', metricError);
      // Proceed with 0 score if calculation fails
    }

    // Create application
    const application = await Application.create({
      candidateId,
      jobId,
      matchScore,
      status: 'Applied',
      appliedAt: Date.now(),
    });

    // Notify Recruiter (In-App)
    try {
      await Notification.create({
        recipientId: job.postedBy._id,
        senderId: candidateId,
        type: 'NEW_APPLICATION',
        message: `New application for position: ${job.title}`,
        relatedId: application._id,
        onModel: 'Application',
      });
      
      // Send Email Notification to Recruiter
      if (job.postedBy && job.postedBy.email) {
        const emailSubject = `New Application for ${job.title}`;
        const emailText = `Dear ${job.postedBy.name},\n\nYou have received a new application for the position of ${job.title}.\n\nView details in your dashboard.\n\nBest regards,\nATS Team`;
        
        await sendEmail(job.postedBy.email, emailSubject, emailText);
      }

    } catch (notifError) {
      console.error('Notification failed:', notifError);
    }
    
    // Notify Candidate (We can skip separate email for application received unless desired, let's keep it simple for now or maybe send confirmation email)
    // Sending confirmation to candidate
     try {
         const candidate = req.user; // We have user in req
         if (candidate && candidate.email) {
            const emailSubject = `Application Received: ${job.title}`;
            const emailText = `Dear ${candidate.name},\n\nYour application for ${job.title} at ${job.companyName} has been received successfully.\n\nBest regards,\nATS Team`;
            await sendEmail(candidate.email, emailSubject, emailText);
         }
     } catch (candidateEmailError) {
          console.error('Candidate email notification failed', candidateEmailError);
     }


    res.status(201).json(application);
  } catch (error) {
    console.error('Apply Job Error:', error);
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get candidate's applications
// @route   GET /api/applications/mine
// @access  Private (Candidate only)
const getCandidateApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidateId: req.user._id })
      .populate({
        path: 'jobId',
        select: 'title companyName companyLogo location jobType salaryMin salaryMax',
        populate: {
          path: 'postedBy',
          select: 'name email',
        }
      })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter only)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can update application status' });
    }

    const application = await Application.findById(applicationId)
      .populate('jobId')
      .populate('candidateId', 'email name');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Verify recruiter owns the job
    if (application.jobId.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();

    // Notify Candidate (In-App)
    try {
      if (application.candidateId) {
        await Notification.create({
          recipientId: application.candidateId._id,
          senderId: req.user._id,
          type: 'STATUS_UPDATE',
          message: `Your application status for ${application.jobId.title} has been updated to: ${status}`,
          relatedId: application._id,
          onModel: 'Application',
        });

        // Send Email Notification to Candidate
        if (application.candidateId.email) {
           const emailSubject = `Application Status Update: ${application.jobId.title}`;
           const emailText = `Dear ${application.candidateId.name},\n\nYour application status for the position of ${application.jobId.title} at ${application.jobId.companyName} has been updated to: ${status}.\n\nLog in to your dashboard for more details.\n\nBest regards,\nATS Team`;
           await sendEmail(application.candidateId.email, emailSubject, emailText);
        }
      }
    } catch (notifError) {
      console.error('Notification failed:', notifError);
    }

    res.json(application);
  } catch (error) {
    console.error('Update Application Status Error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyJob,
  getCandidateApplications,
  updateApplicationStatus,
};
