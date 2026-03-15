const express = require('express');
const router = express.Router();
const { saveJob, getSavedJobs, unsaveJob } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/saved-jobs', protect, saveJob);
router.get('/saved-jobs', protect, getSavedJobs);
router.delete('/saved-jobs/:jobId', protect, unsaveJob);

module.exports = router;
