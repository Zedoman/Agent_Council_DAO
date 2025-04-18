const express = require('express');
const router = express.Router();
const Agent = require('../models/Agent');
const { agents } = require('../agents/agentLogic');

// Initialize agents in DB if not already present
router.get('/initialize', async (req, res) => {
  try {
    for (const agent of agents) {
      await Agent.findOneAndUpdate(
        { id: agent.id },
        {
          id: agent.id,
          name: agent.name,
          role: agent.role,
          priorities: agent.priorities,
        },
        { upsert: true },
      );
    }
    res.status(200).json({ message: 'Agents initialized' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to initialize agents' });
  }
});

router.get('/', async (req, res) => {
  try {
    const dbAgents = await Agent.find();
    res.json(dbAgents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

module.exports = router;