const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Job routes');
});

module.exports = router;
