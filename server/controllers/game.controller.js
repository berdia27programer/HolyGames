const Seed = require('../models/Seed');
const { getDailyWave } = require('../utils/primeGenerator');

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
    res.status(500).json({ message: `The Holy Server encountered an error: ${err}` });
  }
};