const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'InterviewSession', required: true },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  userAnswer: { type: String, required: true },
  codeSnippet: { type: String },
  score: { type: Number },
  feedbackJSON: { type: Object }, // Stores structured feedback from LLM
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Answer', AnswerSchema);
