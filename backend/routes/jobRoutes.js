const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById, getJobMatch, getMyPostedJobs, updateJob, deleteJob, getSavedJobs, saveJob, unsaveJob } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createJob);
router.get('/', getJobs);
router.get('/recruiter', protect, getMyPostedJobs);
router.get('/saved', protect, getSavedJobs);

router.get('/:id', getJobById);
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);
router.get('/:id/match', protect, getJobMatch); // New route for job score matching

router.post('/:id/save', protect, saveJob);
router.delete('/:id/save', protect, unsaveJob);

module.exports = router;
