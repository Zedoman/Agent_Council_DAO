import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Info, TrendingUp, Shield, Heart, Lightbulb } from "lucide-react";
import api from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";

interface AgentProfile {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  priorities: string[];
  votingPattern: {
    approved: number;
    rejected: number;
  };
  icon: React.ReactNode;
}

interface Vote {
  agentId: string;
  vote: "yes" | "no" | "abstain";
  reasoning: string;
}

interface Proposal {
  votes: Vote[];
}

interface AgentProfilesProps {
  agents?: AgentProfile[];
}

const AgentProfiles: React.FC<AgentProfilesProps> = () => {
  const [agents, setAgents] = useState<AgentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAgentsAndVotes = async () => {
      try {
        // Initialize agents if not already done
        await api.get('/api/agents/initialize');
        const agentsResponse = await api.get('/api/agents');
        const backendAgents = agentsResponse.data;

        // Fetch all proposals to calculate voting patterns
        const proposalsResponse = await api.get<Proposal[]>('/api/proposals/proposals');
        const proposals = proposalsResponse.data;

        // Map backend agents to frontend format with dynamic voting patterns
        const mappedAgents: AgentProfile[] = backendAgents.map((agent: any) => {
          // Aggregate votes for this agent
          const agentVotes = proposals.flatMap((proposal) =>
            proposal.votes.filter((vote) => vote.agentId === agent.id)
          );
          const approvedCount = agentVotes.filter((vote) => vote.vote === "yes").length;
          const rejectedCount = agentVotes.filter((vote) => vote.vote === "no").length;

          return {
            id: agent.id,
            name: agent.name,
            role: agent.role,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${agent.id}`,
            bio: getBio(agent.role),
            priorities: agent.priorities || [], // Fallback if priorities are missing
            votingPattern: {
              approved: approvedCount,
              rejected: rejectedCount,
            },
            icon: getIcon(agent.id),
          };
        });

        setAgents(mappedAgents);
      } catch (error) {
        console.error('Error fetching agents or proposals:', error);
        toast({
          title: "Error",
          description: "Failed to load agents or voting data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAgentsAndVotes();
  }, [toast]);

  // Helper to assign bio based on role
  const getBio = (role: string) => {
    switch (role) {
      case "Conservative Treasurer":
        return "Prioritizes financial stability and responsible resource allocation.";
      case "Progressive Builder":
        return "Champions innovation and growth-oriented initiatives.";
      case "Risk Analyst":
        return "Evaluates proposals for potential vulnerabilities and threats.";
      case "Community Advocate":
        return "Represents the interests of the community and ecosystem participants.";
      case "Innovation Seeker":
        return "Searches for groundbreaking ideas that could transform the ecosystem.";
      default:
        return "";
    }
  };

  // Helper to assign icon based on agent ID
  const getIcon = (id: string) => {
    switch (id) {
      case "treasurer":
        return <Shield className="h-4 w-4 text-blue-500" />;
      case "builder":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "analyst":
        return <Shield className="h-4 w-4 text-red-500" />;
      case "advocate":
        return <Heart className="h-4 w-4 text-pink-500" />;
      case "innovator":
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading agents...</div>;
  }

  return (
    <div className="w-full bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-2">
            Meet the Council
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our DAO is governed by a diverse council of AI agents, each with
            unique perspectives and priorities.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
        >
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const AgentCard: React.FC<{ agent: AgentProfile }> = ({ agent }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full overflow-hidden border-primary/20 hover:border-primary/50 transition-colors bg-background/80">
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl opacity-50"></div>
              <Avatar className="h-24 w-24 border-2 border-primary/30 relative">
                <AvatarImage src={agent.avatar} alt={agent.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {agent.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 p-1 bg-background rounded-full border border-primary/30">
                {agent.icon}
              </div>
            </div>

            <h3 className="text-xl font-semibold text-foreground mb-1">
              {agent.name}
            </h3>
            <Badge variant="outline" className="mb-3 bg-primary/5 text-primary">
              {agent.role}
            </Badge>

            <p className="text-sm text-muted-foreground text-center mb-4">
              {agent.bio}
            </p>

            <HoverCard>
              <HoverCardTrigger asChild>
                <button className="text-xs flex items-center text-primary hover:text-primary/80 transition-colors">
                  <Info className="h-3 w-3 mr-1" />
                  View voting history
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 bg-card border-primary/20">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Voting Pattern</h4>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      Approved
                    </div>
                    <div className="text-xs font-medium">
                      {agent.votingPattern.approved}
                    </div>
                  </div>
                  <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{
                        width: agent.votingPattern.approved + agent.votingPattern.rejected > 0
                          ? `${(agent.votingPattern.approved / (agent.votingPattern.approved + agent.votingPattern.rejected)) * 100}%`
                          : "0%",
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      Rejected
                    </div>
                    <div className="text-xs font-medium">
                      {agent.votingPattern.rejected}
                    </div>
                  </div>

                  <h4 className="text-sm font-medium mt-4">Priorities</h4>
                  <div className="flex flex-wrap gap-1">
                    {agent.priorities.map((priority, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {priority}
                      </Badge>
                    ))}
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AgentProfiles;