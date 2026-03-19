const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById, getJobMatch } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createJob);
router.get('/', getJobs);
router.get('/:id', getJobById);
router.get('/:id/match', protect, getJobMatch); // New route for job score matching

module.exports = router;
