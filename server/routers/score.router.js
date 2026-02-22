const express = require('express');
const scoreController = require('../controllers/score.controller');
const scoreRouter = express.Router();

scoreRouter.post('/', scoreController.submitScore);

scoreRouter.get('/leaderboard', scoreController.getLeaderboard);

module.exports = scoreRouter;