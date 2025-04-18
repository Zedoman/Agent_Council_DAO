const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  duration: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Voting', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String, required: true },
  debate: [{
    agentId: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
  }],
  votes: [{
    agentId: String,
    vote: { type: String, enum: ['yes', 'no', 'abstain'] },
    reasoning: String,
  }],
});

module.exports = mongoose.model('Proposal', proposalSchema);