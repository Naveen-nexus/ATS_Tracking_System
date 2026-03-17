const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

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

    res.status(201).json({
      url: result.secure_url,
      public_id: result.public_id,
      originalName: req.file.originalname,
      uploadedAt: new Date(),
    });

    // In next commits, we will extract skills and save to DB
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadResume,
};
