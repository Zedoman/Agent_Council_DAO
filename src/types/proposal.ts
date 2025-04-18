export interface DebateMessage {
  agentId: string;
  message: string;
  timestamp: string;
}

export interface Vote {
  agentId: string;
  vote: "yes" | "no" | "abstain";
  reasoning: string;
}

export interface Proposal {
  id: string;
  title: string;
  status: "Pending" | "Voting" | "Approved" | "Rejected";
  budget: number;
  duration: number;
  description: string;
  createdAt: string;
  createdBy: string;
  debate: DebateMessage[];
  votes: Vote[];
}