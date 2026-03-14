const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
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
    matchScore: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: [
        'Applied',
        'Under Review',
        'Shortlisted',
        'Interview Scheduled',
        'Rejected',
        'Selected',
      ],
      default: 'Applied',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        updatedAt: { type: Date, default: Date.now }
      }
    ],
  },
  {
    timestamps: true,
  }
);

applicationSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      updatedAt: Date.now(),
    });
  }
  next();
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
