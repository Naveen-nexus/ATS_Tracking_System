const express = require('express');
const router = express.Router();
const { applyJob, getCandidateApplications, updateApplicationStatus } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, applyJob);
router.get('/mine', protect, getCandidateApplications);
router.put('/:id/status', protect, updateApplicationStatus);

module.exports = router;
