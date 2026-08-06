const InterviewSession = require('../models/InterviewSession');
const Answer = require('../models/Answer');

exports.getSessionHistory = async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ user: req.user.id })
      .sort({ startedAt: -1 })
      .limit(20);
    res.json(sessions);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.getScoreTrends = async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ user: req.user.id, status: 'Completed' })
      .sort({ completedAt: 1 })
      .limit(10);

    const trends = sessions.map((s) => ({
      date: s.completedAt ? s.completedAt.toLocaleDateString() : s.startedAt.toLocaleDateString(),
      score: s.overallScore || 0,
      role: s.role,
    }));

    res.json(trends);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.getWeakAreas = async (req, res) => {
  try {
    // Get all answers for the user's sessions
    const sessions = await InterviewSession.find({ user: req.user.id }).select('_id');
    const sessionIds = sessions.map((s) => s._id);

    const answers = await Answer.find({ session: { $in: sessionIds } }).populate('question', 'category title');

    // Group by category and compute average score
    const categoryMap = {};
    for (const ans of answers) {
      if (!ans.question) continue;
      const cat = ans.question.category;
      if (!categoryMap[cat]) categoryMap[cat] = { total: 0, count: 0 };
      categoryMap[cat].total += ans.score || 0;
      categoryMap[cat].count += 1;
    }

    const weakAreas = Object.entries(categoryMap).map(([category, data]) => ({
      category,
      avgScore: parseFloat((data.total / data.count).toFixed(1)),
      count: data.count,
    })).sort((a, b) => a.avgScore - b.avgScore);

    res.json(weakAreas);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
