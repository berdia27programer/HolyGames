const mongoose = require('mongoose');

const seedSchema = new mongoose.Schema({
  seedValue: {
    type: Number,
    required: true
  },
  generatedAt: {
     type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: Date.now,
    index: { expires: 86400 }
  }
});

module.exports = mongoose.model('Seed', seedSchema);