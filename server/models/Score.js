const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  username: { 
    type: String, required: true
 },
  score: {
     type: Number, 
     required: true 
  },
  mode: {
     type: String, 
     enum: ['solo', 'duo'], 
     default: 'solo'
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Score', scoreSchema);