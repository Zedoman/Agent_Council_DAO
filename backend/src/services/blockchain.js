const { Web3 } = require('web3');
const config = require('../config');

// Validate config
if (!config || !config.soneiumRpc || !config.privateKey || !config.contractAddress) {
  throw new Error('Config is missing required fields (soneiumRpc, privateKey, contractAddress)');
}

// Initialize Web3
const web3 = new Web3(config.soneiumRpc);

// ABI of the deployed AgentCouncilDAO contract
const contractArtifact = require('../../../artifacts/contracts/AgentCouncilDAO.sol/AgentCouncilDAO.json'); // Load the artifact
if (!contractArtifact || !contractArtifact.abi) {
  throw new Error('Invalid or missing ABI in AgentCouncilDAO.json');
}
const contract = new web3.eth.Contract(contractArtifact.abi, config.contractAddress);

async function submitProposal(proposal) {
  const account = web3.eth.accounts.privateKeyToAccount(config.privateKey);
  web3.eth.accounts.wallet.add(account);

  const tx = contract.methods.submitProposal(
    proposal.id,
    proposal.title,
    proposal.description,
    web3.utils.toWei(proposal.budget.toString(), 'ether'),
    proposal.duration,
  );

  const gas = await tx.estimateGas({ from: account.address });
  const receipt = await tx.send({
    from: account.address,
    gas,
  });

  return receipt;
}

async function recordVote(proposalId, agentId, vote) {
  const account = web3.eth.accounts.privateKeyToAccount(config.privateKey);
  web3.eth.accounts.wallet.add(account);

  const tx = contract.methods.recordVote(proposalId, agentId, vote);

  const gas = await tx.estimateGas({ from: account.address });
  const receipt = await tx.send({
    from: account.address,
    gas,
  });

  return receipt;
}

async function getProposal(proposalId) {
  const proposal = await contract.methods.getProposal(proposalId).call();
  return {
    id: proposal[0],
    title: proposal[1],
    description: proposal[2],
    budget: web3.utils.fromWei(proposal[3], 'ether'),
    duration: proposal[4],
    status: proposal[5],
    yesVotes: proposal[6],
    noVotes: proposal[7],
  };
}

module.exports = { submitProposal, recordVote, getProposal };