const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const Resume = require('../models/Resume');
const { parseResume, extractSkills } = require('../utils/resumeParser');

// @desc    Upload resume
// @route   POST /api/resumes/upload
// @access  Private (Candidate only)
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (req.user.role !== 'candidate') {
      return res.status(403).json({ message: 'Only candidates can upload resumes' });
    }

    // 1. Upload to Cloudinary
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'raw', folder: 'ats_resumes' },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req);

    // 2. Parse Resume Content
    let extractedText = '';
    let extractedSkills = [];
    
    try {
      extractedText = await parseResume(req.file.buffer, req.file.mimetype);
      extractedSkills = extractSkills(extractedText);
    } catch (parseError) {
      console.error('Resume parsing failed:', parseError);
      // We continue even if parsing fails, storing raw file is still valuable
    }

    // 3. Save or Update Resume in Database
    let resume = await Resume.findOne({ candidateId: req.user.id });

    if (resume) {
      // If resume exists, delete the old file from Cloudinary
      if (resume.publicId) {
        try {
          // Note: resource_type 'raw' is needed for non-image files like PDF/DOCX
          await cloudinary.uploader.destroy(resume.publicId, { resource_type: 'raw' });
        } catch (cloudinaryError) {
          console.error('Failed to delete old resume from Cloudinary:', cloudinaryError);
          // Continue with update even if delete fails
        }
      }

      // Update existing resume
      resume.fileUrl = result.secure_url;
      resume.publicId = result.public_id;
      resume.originalName = req.file.originalname;
      resume.skillsExtracted = extractedSkills;
      resume.parsedContent = { text: extractedText }; // Store structured object
      await resume.save();
    } else {
      // Create new resume
      resume = await Resume.create({
        candidateId: req.user.id,
        fileUrl: result.secure_url,
        publicId: result.public_id,
        originalName: req.file.originalname,
        skillsExtracted: extractedSkills,
        parsedContent: {
          text: extractedText,
        },
      });
    }

    res.status(201).json(resume);

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadResume,
};

