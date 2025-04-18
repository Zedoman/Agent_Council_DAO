const { analyzeProposal } = require('../agents/agentLogic');
const Proposal = require('../models/Proposal');
const { recordVote } = require('./blockchain');

async function processProposal(proposal) {
  // Simulate agent analysis and debate
  const agentResults = analyzeProposal(proposal);

  // Update proposal with debate messages
  const debateMessages = agentResults.map((result) => ({
    agentId: result.agentId,
    message: result.debate,
    timestamp: new Date(),
  }));

  // Update proposal with votes
  const votes = agentResults.map((result) => ({
    agentId: result.agentId,
    vote: result.vote,
    reasoning: result.reasoning,
  }));

  // Save to MongoDB
  await Proposal.findOneAndUpdate(
    { id: proposal.id },
    {
      $set: { debate: debateMessages, votes },
      $setOnInsert: { status: 'Voting' },
    },
    { upsert: true },
  );

  // Record votes on-chain
  for (const vote of votes) {
    await recordVote(proposal.id, vote.agentId, vote.vote);
  }

  return agentResults;
}

module.exports = { processProposal };