const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String, // Cloudinary public ID
    },
    originalName: {
      type: String,
    },
    skillsExtracted: {
      type: [String],
      default: [],
    },
    parsedContent: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;
