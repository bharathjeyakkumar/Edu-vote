const mongoose = require('mongoose'); // 🚀 THIS WAS MISSING

const electionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  allowedCategories: [String],
  candidates: [String],
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'open' },
  endAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Election', electionSchema);