const express = require('express');
const scoreController = require('../controllers/score.controller');
const scoreRouter = express.Router();

scoreRouter.post('/', scoreController.submitScore);

scoreRouter.post('/report', scoreController.submitReport);

module.exports = scoreRouter;