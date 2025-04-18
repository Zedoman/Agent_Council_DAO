// Simulated AI agent logic for analysis, debate, and voting
const agents = [
  {
    id: 'treasurer',
    name: 'Prudence',
    role: 'Conservative Treasurer',
    priorities: ['Budget Control', 'Risk Mitigation', 'Long-term Stability'],
    voteLogic: (proposal) => {
      if (proposal.budget > 10) {
        return {
          vote: 'no',
          reasoning: `Budget of $${proposal.budget} exceeds acceptable financial risk threshold of $10.`,
          debate: `The proposed budget of $${proposal.budget} is too high for the scope of "${proposal.title}". I suggest reducing it by at least 20% to align with our stability goals.`,
        };
      }
      return {
        vote: 'yes',
        reasoning: `Budget of $${proposal.budget} aligns with financial stability goals.`,
        debate: `The budget of $${proposal.budget} for "${proposal.title}" seems reasonable and supports our long-term stability objectives.`,
      };
    },
  },
  {
    id: 'builder',
    name: 'Visionary',
    role: 'Progressive Builder',
    priorities: ['Innovation', 'Growth', 'Community Building'],
    voteLogic: (proposal) => {
      if (proposal.description.toLowerCase().includes('innovation') || proposal.description.toLowerCase().includes('growth')) {
        return {
          vote: 'yes',
          reasoning: `Proposal "${proposal.title}" supports innovation and ecosystem growth with "${proposal.description}".`,
          debate: `The inclusion of "${proposal.description.split('.')[0]}" in "${proposal.title}" drives growth and adoption. I fully support this direction.`,
        };
      }
      return {
        vote: 'abstain',
        reasoning: `Proposal "${proposal.title}" lacks clear innovation focus in "${proposal.description}".`,
        debate: `I’m unsure how "${proposal.title}" with "${proposal.description.split('.')[0]}" drives innovation. Can we add a growth-focused element?`,
      };
    },
  },
  {
    id: 'analyst',
    name: 'Sentinel',
    role: 'Risk Analyst',
    priorities: ['Security', 'Compliance', 'Sustainability'],
    voteLogic: (proposal) => {
      if (proposal.duration > 90) {
        return {
          vote: 'no',
          reasoning: `Duration of ${proposal.duration} days increases execution risk for "${proposal.title}".`,
          debate: `A ${proposal.duration}-day timeline for "${proposal.title}" poses significant risks. Could we shorten it to under 90 days for better sustainability?`,
        };
      }
      return {
        vote: 'yes',
        reasoning: `Duration of ${proposal.duration} days is within acceptable risk parameters for "${proposal.title}".`,
        debate: `The ${proposal.duration}-day duration for "${proposal.title}" is sustainable and manageable.`,
      };
    },
  },
  {
    id: 'advocate',
    name: 'Harmony',
    role: 'Community Advocate',
    priorities: ['Inclusivity', 'User Experience', 'Accessibility'],
    voteLogic: (proposal) => {
      if (proposal.description.toLowerCase().includes('community') || proposal.description.toLowerCase().includes('engagement')) {
        return {
          vote: 'yes',
          reasoning: `Proposal "${proposal.title}" enhances community engagement with "${proposal.description}".`,
          debate: `The focus on "${proposal.description.split('.')[0]}" in "${proposal.title}" aligns with recent community feedback on engagement.`,
        };
      }
      return {
        vote: 'abstain',
        reasoning: `Unclear community impact in "${proposal.title}" with "${proposal.description}".`,
        debate: `How does "${proposal.title}" with "${proposal.description.split('.')[0]}" directly benefit our community? Please clarify.`,
      };
    },
  },
  {
    id: 'innovator',
    name: 'Spark',
    role: 'Innovation Seeker',
    priorities: ['Disruption', 'Research', 'Future-proofing'],
    voteLogic: (proposal) => {
      if (proposal.budget > 5 && proposal.description.toLowerCase().includes('research')) {
        return {
          vote: 'yes',
          reasoning: `Proposal "${proposal.title}" invests $${proposal.budget} in disruptive research with "${proposal.description}".`,
          debate: `The $${proposal.budget} budget for "${proposal.title}" with "${proposal.description.split('.')[0]}" offers an exciting research opportunity.`,
        };
      }
      return {
        vote: 'no',
        reasoning: `Insufficient focus on disruptive innovation in "${proposal.title}" with budget $${proposal.budget}.`,
        debate: `The $${proposal.budget} budget for "${proposal.title}" lacks research focus. Can we pivot to include disruptive elements?`,
      };
    },
  },
];

function analyzeProposal(proposal) {
  const results = agents.map((agent) => ({
    agentId: agent.id,
    name: agent.name,
    ...agent.voteLogic(proposal),
  }));
  return results;
}

module.exports = { agents, analyzeProposal };