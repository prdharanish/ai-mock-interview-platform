const express = require('express');
const router = express.Router();
const ac = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

router.get('/sessions', auth, ac.getSessionHistory);
router.get('/trends', auth, ac.getScoreTrends);
router.get('/weak-areas', auth, ac.getWeakAreas);

module.exports = router;
