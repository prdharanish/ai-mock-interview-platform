const Question = require('../models/Question');

exports.getQuestions = async (req, res) => {
  try {
    const { category, role, difficulty, company, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (role) filter.role = role;
    if (difficulty) filter.difficulty = difficulty;
    if (company) filter.company = { $in: [company] };
    if (search) filter.title = { $regex: search, $options: 'i' };

    const questions = await Question.find(filter).sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ msg: 'Question not found' });
    res.json(question);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.createQuestion = async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!question) return res.status(404).json({ msg: 'Question not found' });
    res.json(question);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ msg: 'Question not found' });
    res.json({ msg: 'Question removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
