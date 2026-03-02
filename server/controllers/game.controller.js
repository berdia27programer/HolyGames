const Seed = require('../models/Seed');
const { getDailyWave } = require('../utils/primeGenerator');
const { sendReportEmail } = require('../utils/mailer');

exports.getDailyChallenge = async (req, res) => {
  try {
    let dailySeed = await Seed.findOne().sort({ generatedAt: -1 });

    if (!dailySeed) {
      const newRandomValue = Math.floor(Math.random() * 100) + 1;
      dailySeed = await Seed.create({ seedValue: newRandomValue });
    }

    const gameWave = getDailyWave(dailySeed.seedValue);

    res.status(200).json({
      status: 'success',
      seed: dailySeed.seedValue,
      wave: gameWave
    });
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err}` });
  }
};

exports.reportProblem = async (req, res) => {
  try {
    const { userEmail, problemReport } = req.body;

    if (!userEmail || !problemReport) {
      return res.status(400).json({ message: 'Email and problem report are required' });
    }

    try {
      await sendReportEmail(userEmail, problemReport);
      res.status(200).json({
        status: 'success',
        message: 'Problem report sent successfully to the team'
      });
    } catch (emailErr) {
      console.error('Email sending error:', emailErr);
      res.status(500).json({ 
        status: 'fail',
        message: 'Failed to send email: ' + emailErr.message 
      });
    }
  } catch (err) {
    console.error('Report problem error:', err);
    res.status(500).json({ message: 'Failed to process report: ' + err.message });
  }
};