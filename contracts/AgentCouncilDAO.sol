// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AgentCouncilDAO {
    // Proposal structure
    struct Proposal {
        string id;
        string title;
        string description;
        uint256 budget;
        uint256 duration;
        string status; // Pending, Voting, Approved, Rejected
        uint256 yesVotes;
        uint256 noVotes;
        mapping(address => bool) hasVoted;
    }

    // Mapping of proposal ID to Proposal
    mapping(string => Proposal) public proposals;
    // List of agent addresses (for simplicity, assume backend controls these)
    address[] public agents;
    // Owner of the contract
    address public owner;

    // Events
    event ProposalSubmitted(string id, string title, uint256 budget);
    event VoteCast(string id, address agent, string vote);
    event ProposalStatusChanged(string id, string status);

    constructor(address[] memory _agents) {
        owner = msg.sender;
        agents = _agents;
    }

    // Submit a new proposal
    function submitProposal(
        string memory _id,
        string memory _title,
        string memory _description,
        uint256 _budget,
        uint256 _duration
    ) external {
        require(bytes(proposals[_id].id).length == 0, "Proposal ID already exists");

        Proposal storage newProposal = proposals[_id];
        newProposal.id = _id;
        newProposal.title = _title;
        newProposal.description = _description;
        newProposal.budget = _budget;
        newProposal.duration = _duration;
        newProposal.status = "Pending";
        newProposal.yesVotes = 0;
        newProposal.noVotes = 0;

        emit ProposalSubmitted(_id, _title, _budget);
    }

    // Record a vote (yes/no/abstain)
    function recordVote(string memory _id, string memory _vote) external {
        require(bytes(proposals[_id].id).length != 0, "Proposal does not exist");
        require(isAgent(msg.sender), "Not an authorized agent");
        require(!proposals[_id].hasVoted[msg.sender], "Agent already voted");

        proposals[_id].hasVoted[msg.sender] = true;

        if (keccak256(abi.encodePacked(_vote)) == keccak256(abi.encodePacked("yes"))) {
            proposals[_id].yesVotes += 1;
        } else if (keccak256(abi.encodePacked(_vote)) == keccak256(abi.encodePacked("no"))) {
            proposals[_id].noVotes += 1;
        }

        emit VoteCast(_id, msg.sender, _vote);

        // Check if voting is complete (3/5 majority)
        if (proposals[_id].yesVotes >= 3) {
            proposals[_id].status = "Approved";
            emit ProposalStatusChanged(_id, "Approved");
        } else if (proposals[_id].noVotes >= 3) {
            proposals[_id].status = "Rejected";
            emit ProposalStatusChanged(_id, "Rejected");
        } else if (proposals[_id].yesVotes + proposals[_id].noVotes >= agents.length) {
            proposals[_id].status = "Rejected"; // Default to reject if no majority
            emit ProposalStatusChanged(_id, "Rejected");
        }
    }

    // Get proposal details
    function getProposal(string memory _id)
        external
        view
        returns (
            string memory id,
            string memory title,
            string memory description,
            uint256 budget,
            uint256 duration,
            string memory status,
            uint256 yesVotes,
            uint256 noVotes
        )
    {
        Proposal storage p = proposals[_id];
        return (
            p.id,
            p.title,
            p.description,
            p.budget,
            p.duration,
            p.status,
            p.yesVotes,
            p.noVotes
        );
    }

    // Check if address is an agent
    function isAgent(address _addr) internal view returns (bool) {
        for (uint256 i = 0; i < agents.length; i++) {
            if (agents[i] == _addr) return true;
        }
        return false;
    }

    // Update agents (only owner)
    function updateAgents(address[] memory _newAgents) external {
        require(msg.sender == owner, "Only owner can update agents");
        agents = _newAgents;
    }
}