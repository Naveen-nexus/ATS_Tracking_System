const mongoose = require('mongoose');

const savedJobSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

savedJobSchema.index({ candidateId: 1, jobId: 1 }, { unique: true });

const SavedJob = mongoose.model('SavedJob', savedJobSchema);

module.exports = SavedJob;
