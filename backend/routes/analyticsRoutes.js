const express = require('express');
const router = express.Router();
const { getDashboardStats, getJobPerformance } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, getDashboardStats);
router.get('/jobs', protect, getJobPerformance);

module.exports = router;
