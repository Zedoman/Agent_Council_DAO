const express = require('express');
const router = express.Router();
const Proposal = require('../models/Proposal');
const { submitProposal } = require('../services/blockchain');
const { processProposal } = require('../services/agentService');

router.get('/proposals', async (req, res) => {
  try {
    const proposals = await Proposal.find();
    res.json(proposals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch proposals' });
  }
});

router.get('/proposals/:id', async (req, res) => {
  try {
    const proposal = await Proposal.findOne({ id: req.params.id });
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    // Optionally simulate or fetch updated debate and votes if not already processed
    if (proposal.debate.length === 0 || proposal.votes.length === 0) {
      const agentResults = await processProposal(proposal); // Use your service to update
      proposal.debate = agentResults.debate || proposal.debate;
      proposal.votes = agentResults.votes || proposal.votes;
      await proposal.save();
    }
    res.json(proposal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch proposal' });
  }
});

router.post('/proposals', async (req, res) => {
  try {
    const { title, description, budget, duration, createdBy } = req.body;
    const id = Date.now().toString(); // Simple ID generation

    const proposal = new Proposal({
      id,
      title,
      description,
      budget: parseFloat(budget),
      duration: parseInt(duration),
      createdBy,
      status: 'Pending',
    });

    // Save to MongoDB
    await proposal.save();

    // Submit to blockchain
    await submitProposal(proposal);

    // Trigger agent processing
    const agentResults = await processProposal(proposal);

    // Update proposal with agent results
    proposal.debate = agentResults.debate || [];
    proposal.votes = agentResults.votes || [];
    await proposal.save();

    res.status(201).json({ proposal, agentResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit proposal' });
  }
});

// Initialize agents (optional, if needed separately)
router.get('/agents/initialize', (req, res) => {
  res.json([]); // Placeholder; adjust based on your agent data source
});

router.get('/agents', (req, res) => {
  res.json([]); // Placeholder; adjust based on your agent data source
});

module.exports = router;