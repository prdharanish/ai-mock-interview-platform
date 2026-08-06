const User = require('../models/User');
const Question = require('../models/Question');
const InterviewSession = require('../models/InterviewSession');

// Get all users (excluding passwords)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ lastLogin: -1, createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all questions
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a new question
exports.createQuestion = async (req, res) => {
  try {
    const { title, content, category, role, company, difficulty } = req.body;
    
    const newQuestion = new Question({
      title,
      content,
      category,
      role,
      company,
      difficulty
    });
    
    const question = await newQuestion.save();
    res.json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update an existing question
exports.updateQuestion = async (req, res) => {
  try {
    const { title, content, category, role, company, difficulty } = req.body;
    
    let question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ msg: 'Question not found' });
    
    question = await Question.findByIdAndUpdate(
      req.params.id,
      { $set: { title, content, category, role, company, difficulty } },
      { new: true }
    );
    
    res.json(question);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Question not found' });
    res.status(500).send('Server Error');
  }
};

// Delete a question
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ msg: 'Question not found' });
    
    await question.deleteOne();
    res.json({ msg: 'Question removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Question not found' });
    res.status(500).send('Server Error');
  }
};

// Get platform-wide analytics
exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalQuestions = await Question.countDocuments();
    const totalSessions = await InterviewSession.countDocuments();
    
    const completedSessions = await InterviewSession.find({ status: 'Completed', overallScore: { $exists: true } });
    
    let averageScore = 0;
    if (completedSessions.length > 0) {
      const sum = completedSessions.reduce((acc, session) => acc + (session.overallScore || 0), 0);
      averageScore = sum / completedSessions.length;
    }

    const roleBreakdown = await User.aggregate([
      { $group: { _id: '$targetRole', count: { $sum: 1 } } }
    ]);

    const roleBreakdownMap = {};
    roleBreakdown.forEach(rb => {
      roleBreakdownMap[rb._id || 'Unknown'] = rb.count;
    });

    res.json({
      totalUsers,
      totalQuestions,
      totalSessions,
      averageScore: averageScore.toFixed(1),
      roleBreakdown: roleBreakdownMap
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
