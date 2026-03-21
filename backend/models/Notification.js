const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId, // Optional (e.g., system notification)
      ref: 'User',
    },
    type: {
      type: String,
      enum: ['STATUS_UPDATE', 'NEW_APPLICATION', 'JOB_ALERT', 'GENERAL'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId, // ID of related Apply/Job
      refPath: 'onModel',
    },
    onModel: {
      type: String,
      enum: ['Application', 'Job'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
