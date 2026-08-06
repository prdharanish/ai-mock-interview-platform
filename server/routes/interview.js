const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const auth = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Basic rate limiting to prevent LLM abuse
const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 submissions per windowMs
  message: { msg: 'Too many submissions created from this IP, please try again after 15 minutes' }
});

router.post('/start', auth, interviewController.startSession);
router.get('/:sessionId/question', auth, interviewController.getNextQuestion);
router.post('/submit', [auth, submitLimiter], interviewController.submitAnswer);

module.exports = router;
