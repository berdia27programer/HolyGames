const express = require('express');
const gameController = require('../controllers/game.controller');
const gameRouter = express.Router();

gameRouter.get('/daily-challenge', gameController.getDailyChallenge);
gameRouter.post('/report-problem', gameController.reportProblem);

module.exports = gameRouter;