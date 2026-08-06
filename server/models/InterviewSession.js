const mongoose = require('mongoose');

const InterviewSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, required: true },
  status: { type: String, enum: ['In Progress', 'Completed'], default: 'In Progress' },
  overallScore: { type: Number },
  weakAreas: [{ type: String }],
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
});

module.exports = mongoose.model('InterviewSession', InterviewSessionSchema);
