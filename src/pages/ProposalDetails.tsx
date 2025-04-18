import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Clock,
  MessageSquare,
  BarChart3,
  Users,
} from "lucide-react";
import { Proposal, DebateMessage, Vote } from "@/types/proposal";
import api from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";

interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  vote: "yes" | "no" | "abstain" | null;
  reasoning: string;
}

const ProposalDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  useEffect(() => {
    const fetchProposal = async () => {
      setLoading(true);
      try {
        const proposalResponse = await api.get(`/api/proposals/proposals/${id}`);
        const fetchedProposal: Proposal = proposalResponse.data;

        const agentsResponse = await api.get('/api/agents');
        const backendAgents = agentsResponse.data;

        const mappedAgents: Agent[] = backendAgents.map((agent: any) => {
          const vote = fetchedProposal.votes.find((v: Vote) => v.agentId === agent.id);
          return {
            id: agent.id,
            name: agent.name,
            role: agent.role,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${agent.id}`,
            vote: vote ? vote.vote : null,
            reasoning: vote ? vote.reasoning : "",
          };
        });

        setProposal(fetchedProposal);
        setAgents(mappedAgents);
      } catch (error) {
        console.error("Error fetching proposal:", error);
        toast({
          title: "Error",
          description: "Failed to load proposal details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProposal();
    }
  }, [id, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading proposal details...</p>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Proposal Not Found</CardTitle>
            <CardDescription>
              The proposal you're looking for doesn't exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <a href="/">Return to Dashboard</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Inside ProposalDetails.js, update the voting duration logic
  const createdDate = new Date(proposal.createdAt);
  const durationInMs = proposal.duration * 60 * 1000; // Convert minutes to milliseconds
  const votingEndTime = new Date(createdDate.getTime() + durationInMs);
  const currentTime = new Date(); // Current system time
  const isVotingComplete = currentTime > votingEndTime;
  console.log("Current Time:", currentTime, "Voting End Time:", votingEndTime, "Is Voting Complete:", isVotingComplete);

  // Determine status and outcome (refined logic for non-approved cases)
  const yesVotes = agents.filter((agent) => agent.vote === "yes").length;
  const noVotes = agents.filter((agent) => agent.vote === "no").length;
  const status = isVotingComplete
    ? yesVotes >= 3 ? "Approved" : noVotes > 0 ? "Rejected" : "Pending"
    : proposal.status;
  const outcome = isVotingComplete
    ? yesVotes >= 3 ? "Likely to be Approved" : noVotes > 0 ? "Likely to be Rejected" : "Outcome Uncertain"
    : "Outcome Uncertain";

  const yesVotesCount = agents.filter((agent) => agent.vote === "yes").length;
  const noVotesCount = agents.filter((agent) => agent.vote === "no").length;
  const abstainVotesCount = agents.filter((agent) => agent.vote === "abstain").length;
  const totalVotes = agents.length;
  const yesPercentage = totalVotes > 0 ? (yesVotesCount / totalVotes) * 100 : 0;
  const noPercentage = totalVotes > 0 ? (noVotesCount / totalVotes) * 100 : 0;
  const abstainPercentage = totalVotes > 0 ? (abstainVotesCount / totalVotes) * 100 : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 bg-background min-h-screen">
      <Button variant="ghost" className="mb-6" asChild>
        <a href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </a>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-card border-border shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    {proposal.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    <Badge
                      variant={
                        status === "Approved"
                          ? "default"
                          : status === "Rejected"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {status}
                    </Badge>
                    <span className="ml-2 text-muted-foreground">
                      Created on {formatDate(proposal.createdAt)}
                    </span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-invert max-w-none">
                <p className="text-foreground">{proposal.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-card/50">
                  <CardContent className="p-4 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="text-lg font-semibold">
                        {proposal.budget} ETH
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card/50">
                  <CardContent className="p-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="text-lg font-semibold">
                        {proposal.duration} minutes
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card/50">
                  <CardContent className="p-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="text-lg font-semibold">
                        {formatDate(proposal.createdAt)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="debate" className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Agent Debate
              </TabsTrigger>
              <TabsTrigger value="votes" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Votes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Proposal Overview</CardTitle>
                  <CardDescription>
                    Current voting status and timeline
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {totalVotes === 0 ? (
                    <p className="text-muted-foreground">No votes recorded yet.</p>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">
                            Yes ({yesVotesCount}/{totalVotes})
                          </span>
                          <span className="text-sm">
                            {yesPercentage.toFixed(0)}%
                          </span>
                        </div>
                        <Progress value={yesPercentage} className="h-2 bg-muted" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">
                            No ({noVotesCount}/{totalVotes})
                          </span>
                          <span className="text-sm">
                            {noPercentage.toFixed(0)}%
                          </span>
                        </div>
                        <Progress value={noPercentage} className="h-2 bg-muted" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">
                            Abstain ({abstainVotesCount}/{totalVotes})
                          </span>
                          <span className="text-sm">
                            {abstainPercentage.toFixed(0)}%
                          </span>
                        </div>
                        <Progress
                          value={abstainPercentage}
                          className="h-2 bg-muted"
                        />
                      </div>
                    </>
                  )}

                  <div className="pt-4">
                    <h4 className="text-sm font-medium mb-2">Timeline</h4>
                    <div className="space-y-4">
                      <div className="flex">
                        <div className="mr-4 flex flex-col items-center">
                          <div className="h-4 w-4 rounded-full bg-primary"></div>
                          <div className="h-full w-0.5 bg-border"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Proposal Created
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(proposal.createdAt)}
                          </p>
                        </div>
                      </div>

                      {proposal.debate.length > 0 && (
                        <div className="flex">
                          <div className="mr-4 flex flex-col items-center">
                            <div className="h-4 w-4 rounded-full bg-primary"></div>
                            <div className="h-full w-0.5 bg-border"></div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              Agent Analysis Begins
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(proposal.debate[0].timestamp)}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex">
                        <div className="mr-4 flex flex-col items-center">
                          <div className="h-4 w-4 rounded-full bg-primary"></div>
                          <div className="h-full w-0.5 bg-border"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Voting in Progress
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {isVotingComplete
                              ? `Completed on ${formatDate(votingEndTime.toString())}`
                              : `Ends on ${formatDate(votingEndTime.toString())}`}
                          </p>
                        </div>
                      </div>

                      {isVotingComplete && (
                        <div className="flex">
                          <div className="mr-4 flex flex-col items-center">
                            <div className="h-4 w-4 rounded-full bg-primary"></div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              Proposal {status}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Final decision reached
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="debate" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Agent Debate</CardTitle>
                  <CardDescription>
                    Discussion between AI agents about this proposal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {proposal.debate.length > 0 ? (
                      proposal.debate.map((message, index) => {
                        const agent = agents.find(
                          (a) => a.id === message.agentId,
                        );
                        if (!agent) return null;

                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex gap-4"
                          >
                            <Avatar>
                              <AvatarImage src={agent.avatar} alt={agent.name} />
                              <AvatarFallback>
                                {agent.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">{agent.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {agent.role}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(message.timestamp).toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" },
                                  )}
                                </span>
                              </div>
                              <p className="mt-1">{message.message}</p>
                            </div>
                          </motion.div>
                        );
                      })
                    ) : (
                      <p className="text-muted-foreground">No debate messages yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="votes" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Agent Votes</CardTitle>
                  <CardDescription>
                    How each agent voted on this proposal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {agents.map((agent, index) => (
                      <motion.div
                        key={agent.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-4 p-4 rounded-lg bg-card/50"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={agent.avatar} alt={agent.name} />
                          <AvatarFallback>
                            {agent.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                              <h4 className="font-semibold">{agent.name}</h4>
                              <p className="text-xs text-muted-foreground">
                                {agent.role}
                              </p>
                            </div>
                            <Badge
                              variant={
                                agent.vote === "yes"
                                  ? "default"
                                  : agent.vote === "no"
                                    ? "destructive"
                                    : "outline"
                              }
                              className="self-start sm:self-center"
                            >
                              {agent.vote === "yes"
                                ? "Approve"
                                : agent.vote === "no"
                                  ? "Reject"
                                  : agent.vote === "abstain"
                                    ? "Abstain"
                                    : "Not Voted"}
                            </Badge>
                          </div>
                          <Separator className="my-2" />
                          <p className="text-sm">
                            {agent.reasoning || "No reasoning provided."}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <Card className="bg-card border-border shadow-lg sticky top-6">
            <CardHeader>
              <CardTitle>Voting Summary</CardTitle>
              <CardDescription>Current status of agent votes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span>Approval Threshold</span>
                  <Badge variant="outline">3/5 Required</Badge>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Vote Distribution
                  </h4>
                  {totalVotes === 0 ? (
                    <p className="text-muted-foreground">No votes recorded yet.</p>
                  ) : (
                    <>
                      <div className="flex h-4 rounded-full overflow-hidden">
                        <div
                          className="bg-primary"
                          style={{ width: `${yesPercentage}%` }}
                        ></div>
                        <div
                          className="bg-destructive"
                          style={{ width: `${noPercentage}%` }}
                        ></div>
                        <div
                          className="bg-muted"
                          style={{ width: `${abstainPercentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-2 text-xs">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-primary mr-1"></div>
                          <span>Yes ({yesVotesCount})</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-destructive mr-1"></div>
                          <span>No ({noVotesCount})</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-muted mr-1"></div>
                          <span>Abstain ({abstainVotesCount})</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-2">Agent Breakdown</h4>
                  <div className="space-y-3">
                    {agents.map((agent) => (
                      <div
                        key={agent.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={agent.avatar} alt={agent.name} />
                            <AvatarFallback>
                              {agent.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{agent.name}</span>
                        </div>
                        <Badge
                          variant={
                            agent.vote === "yes"
                              ? "default"
                              : agent.vote === "no"
                                ? "destructive"
                                : "outline"
                          }
                          className="text-xs"
                        >
                          {agent.vote === "yes"
                            ? "Yes"
                            : agent.vote === "no"
                              ? "No"
                              : agent.vote === "abstain"
                                ? "Abstain"
                                : "Not Voted"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Outcome Prediction
                  </h4>
                  <div className="p-3 rounded-lg bg-card/50 text-center">
                    <p className="text-sm font-medium">
                      {isVotingComplete ? outcome : "Outcome Uncertain"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetails;