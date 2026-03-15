const express = require('express');
const router = express.Router();
const { saveJob, getSavedJobs } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/saved-jobs', protect, saveJob);
router.get('/saved-jobs', protect, getSavedJobs);

module.exports = router;
