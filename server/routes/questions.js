const express = require('express');
const router = express.Router();
const qc = require('../controllers/questionController');
const auth = require('../middleware/auth');

router.get('/', qc.getQuestions);
router.get('/:id', qc.getQuestion);
router.post('/', auth, qc.createQuestion);
router.put('/:id', auth, qc.updateQuestion);
router.delete('/:id', auth, qc.deleteQuestion);

module.exports = router;
