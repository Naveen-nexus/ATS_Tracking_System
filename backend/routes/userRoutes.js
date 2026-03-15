const express = require('express');
const router = express.Router();
const { saveJob } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/saved-jobs', protect, saveJob);

module.exports = router;
