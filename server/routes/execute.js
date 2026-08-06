const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const rateLimit = require('express-rate-limit');
const { execute } = require('../controllers/executeController');

// Rate-limit code execution: max 30 requests per 15 minutes per IP
const executeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: true, status: { description: 'Rate Limited' }, stderr: 'Too many execution requests. Please wait 15 minutes before trying again.' },
});

router.post('/', auth, executeLimiter, execute);

module.exports = router;
