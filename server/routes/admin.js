const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// All admin routes are protected by auth and isAdmin middlewares
router.use(auth, isAdmin);

// User routes
router.get('/users', adminController.getAllUsers);

// Question routes
router.get('/questions', adminController.getAllQuestions);
router.post('/questions', adminController.createQuestion);
router.put('/questions/:id', adminController.updateQuestion);
router.delete('/questions/:id', adminController.deleteQuestion);

// Analytics route
router.get('/analytics', adminController.getAnalytics);

module.exports = router;
