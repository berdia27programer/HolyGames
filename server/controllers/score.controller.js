const Score = require('../models/Score');

exports.submitScore = async (req, res) => {
  try {
    const newScore = await Score.create(req.body);
    res.status(201).json({ status: 'success', data: newScore });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const topScores = await Score.find().sort({ score: -1 }).limit(10);
    res.status(200).json({ status: 'success', data: topScores });
  } catch (err) {
    res.status(400).json({ status: 'fail' });
  }
};