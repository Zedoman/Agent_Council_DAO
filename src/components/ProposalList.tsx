import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpDown, Filter, Search } from "lucide-react";
import { Proposal } from "@/types/proposal";
import api from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";

interface ProposalListProps {
  proposals?: Proposal[];
  showFilters?: boolean;
}

const ProposalList = ({
  proposals: initialProposals = [],
  showFilters = true,
}: ProposalListProps) => {
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (initialProposals.length > 0) {
      setProposals(initialProposals);
      setLoading(false);
      return;
    }

    const fetchProposals = async () => {
      try {
        const response = await api.get('/api/proposals/proposals');
        setProposals(response.data);
      } catch (error) {
        console.error('Error fetching proposals:', error);
        toast({
          title: "Error",
          description: "Failed to load proposals.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
    // Poll every 5 seconds for status updates
    const interval = setInterval(fetchProposals, 5000);
    return () => clearInterval(interval);
  }, [initialProposals, toast]);

  // Filter and sort proposals
  const filteredProposals = proposals
    .filter((proposal) => {
      const matchesSearch =
        proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proposal.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        proposal.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "highest-budget":
          return b.budget - a.budget;
        case "lowest-budget":
          return a.budget - b.budget;
        default:
          return 0;
      }
    });

  // Calculate dynamic status for each proposal
  const getDynamicStatus = (proposal: Proposal) => {
    const createdDate = new Date(proposal.createdAt);
    const durationInMs = proposal.duration * 60 * 1000; // Convert minutes to milliseconds
    const votingEndTime = new Date(createdDate.getTime() + durationInMs);
    const isVotingComplete = new Date() > votingEndTime;
  
    if (isVotingComplete) {
      const yesVotes = proposal.votes.filter((vote) => vote.vote === "yes").length;
      const noVotes = proposal.votes.filter((vote) => vote.vote === "no").length;
      return yesVotes >= 3 ? "Approved" : noVotes > 0 ? "Rejected" : "Pending";
    }
    return proposal.status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
      case "Voting":
        return "bg-blue-500/20 text-blue-500 border-blue-500/50";
      case "Approved":
        return "bg-green-500/20 text-green-500 border-green-500/50";
      case "Rejected":
        return "bg-red-500/20 text-red-500 border-red-500/50";
      default:
        return "bg-gray-500/20 text-gray-500 border-gray-500/50";
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading proposals...</div>;
  }

  return (
    <div className="w-full bg-background text-foreground">
      {showFilters && (
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search proposals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="voting">Voting</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="highest-budget">Highest Budget</SelectItem>
                  <SelectItem value="lowest-budget">Lowest Budget</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="grid" className="w-full">
            <TabsList className="grid w-[200px] grid-cols-2">
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
            <TabsContent value="grid" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProposals.map((proposal) => (
                  <Card
                    key={proposal.id}
                    className="overflow-hidden border border-border/50 bg-card hover:border-primary/50 transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <Badge className={`${getStatusColor(getDynamicStatus(proposal))}`}>
                          {getDynamicStatus(proposal)}
                        </Badge>
                        <div className="text-sm font-medium text-primary">
                          {proposal.budget} ETH
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                        {proposal.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {proposal.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          {new Date(proposal.createdAt).toLocaleDateString()}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-primary/50 text-primary hover:bg-primary/10"
                          asChild
                        >
                          <a href={`/proposal/${proposal.id}`}>View Details</a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="list" className="mt-4">
              <div className="space-y-4">
                {filteredProposals.map((proposal) => (
                  <Card
                    key={proposal.id}
                    className="overflow-hidden border border-border/50 bg-card hover:border-primary/50 transition-all duration-300"
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              className={`${getStatusColor(getDynamicStatus(proposal))}`}
                            >
                              {getDynamicStatus(proposal)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(
                                proposal.createdAt,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold">
                            {proposal.title}
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {proposal.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm font-medium text-primary whitespace-nowrap">
                            {proposal.budget} ETH
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-primary/50 text-primary hover:bg-primary/10"
                            asChild
                          >
                            <a href={`/proposal/${proposal.id}`}>
                              View Details
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {!showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {proposals.slice(0, 3).map((proposal) => (
            <Card
              key={proposal.id}
              className="overflow-hidden border border-border/50 bg-card hover:border-primary/50 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Badge className={`${getStatusColor(getDynamicStatus(proposal))}`}>
                    {getDynamicStatus(proposal)}
                  </Badge>
                  <div className="text-sm font-medium text-primary">
                    {proposal.budget} ETH
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                  {proposal.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {proposal.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {new Date(proposal.createdAt).toLocaleDateString()}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-primary/50 text-primary hover:bg-primary/10"
                    asChild
                  >
                    <a href={`/proposal/${proposal.id}`}>View Details</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredProposals.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="rounded-full bg-primary/10 p-3 mb-4">
            <Filter className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">No proposals found</h3>
          <p className="text-muted-foreground text-sm max-w-md">
            {searchQuery
              ? `No proposals matching "${searchQuery}" were found. Try adjusting your search or filters.`
              : "There are no proposals matching your current filters. Try adjusting your criteria."}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProposalList;