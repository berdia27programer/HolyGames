const Score = require('../models/Score');

exports.submitScore = async (req, res) => {
  try {
    const newScore = await Score.create(req.body);
    res.status(201).json({ status: 'success', data: newScore });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.submitReport = async (req, res) => {
  try {
    console.log('User Report:', req.body);
    res.status(200).json({ status: 'success', message: 'Report submitted successfully' });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};