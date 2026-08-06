const InterviewSession = require('../models/InterviewSession');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const { generateFeedback } = require('../utils/llm');

exports.startSession = async (req, res) => {
  try {
    const { role } = req.body;
    const session = new InterviewSession({
      user: req.user.id,
      role: role || 'Software Engineer',
    });
    await session.save();
    res.json(session);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getNextQuestion = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await InterviewSession.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({ msg: 'Session not found' });
    }

    // A simple logic to get a random question for the role that hasn't been answered yet
    // In a real app, this should check the Answer model to avoid duplicates in the same session
    const count = await Question.countDocuments({ role: session.role });
    if (count === 0) {
      // Fallback if no questions for the specific role
      const anyCount = await Question.countDocuments();
      if (anyCount === 0) {
         return res.status(404).json({ msg: 'No questions available in the question bank' });
      }
      const random = Math.floor(Math.random() * anyCount);
      const question = await Question.findOne().skip(random);
      return res.json(question);
    }

    const random = Math.floor(Math.random() * count);
    const question = await Question.findOne({ role: session.role }).skip(random);
    
    res.json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.submitAnswer = async (req, res) => {
  try {
    const { sessionId, questionId, userAnswer, codeSnippet } = req.body;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }

    let feedbackJSON = {};
    let score = 0;
    
    try {
      feedbackJSON = await generateFeedback(question, userAnswer, codeSnippet);
      score = feedbackJSON.score || 0;
    } catch (llmError) {
      console.error('LLM API Error during answer submission:', llmError);
      return res.status(503).json({ msg: 'Failed to generate feedback from LLM API' });
    }

    const answer = new Answer({
      session: sessionId,
      question: questionId,
      userAnswer,
      codeSnippet,
      score,
      feedbackJSON,
    });

    await answer.save();
    
    // Optional: update session overall score here

    res.json(answer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
