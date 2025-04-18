import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Wallet, Search, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import AgentProfiles from "./AgentProfiles";
import ProposalList from "./ProposalList";
import { Proposal } from "@/types/proposal";
import api from "@/lib/axios";

const HomePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [walletConnected, setWalletConnected] = useState(() => {
    return localStorage.getItem("walletConnected") === "true";
  });
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [recentProposals, setRecentProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setShowDisconnect(walletConnected);
    if (walletConnected && window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      });
    }
  }, [walletConnected]);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await api.get('/api/proposals/proposals');
        const sortedProposals = response.data
          .sort((a: Proposal, b: Proposal) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3); // Get 3 most recent
        setRecentProposals(sortedProposals);
      } catch (error) {
        console.error('Error fetching proposals:', error);
        toast({
          title: "Error",
          description: "Failed to load recent proposals.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [toast]);

  const handleConnectWallet = async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        toast({
          title: "MetaMask not found",
          description: "Please install MetaMask to connect your wallet.",
          variant: "destructive",
        });
        window.open("https://metamask.io/download/", "_blank");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setWalletConnected(true);
        setWalletAddress(accounts[0]);
        localStorage.setItem("walletConnected", "true");
        toast({
          title: "Wallet connected",
          description: `Connected as ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      toast({
        title: "Connection failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnectWallet = () => {
    setWalletConnected(false);
    setShowDisconnect(false);
    setWalletAddress(null);
    localStorage.removeItem("walletConnected");
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected successfully.",
    });
  };

  const handleLearnMoreAboutGovernance = () => {
    navigate('/governance'); // Navigate to governance page
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      {showDisconnect && (
        <div className="absolute top-4 right-4 z-50">
          <Button
            onClick={handleDisconnectWallet}
            variant="outline"
            size="sm"
            className="border-green-500 text-green-400 hover:bg-green-500/10 flex items-center gap-1"
          >
            <Badge
              variant="outline"
              className="mr-1 border-green-500 text-green-400"
            >
              {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Wallet Connected"}
            </Badge>
            <LogOut className="h-3 w-3 border-green-500 text-green-400" />
          </Button>
        </div>
      )}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 z-0"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full filter blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
              Agent Council DAO
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-gray-300">
              Decentralized Governance Powered by AI Agents
            </p>

            {!walletConnected ? (
              <Button
                onClick={handleConnectWallet}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 rounded-lg text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
              >
                <Wallet className="mr-2 h-5 w-5" />
                Connect Wallet
              </Button>
            ) : (
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 rounded-lg text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                asChild
              >
                <a href="/proposal-submission">
                  Submit Proposal
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-purple-400">
                Our Purpose
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                Agent Council DAO is a revolutionary decentralized autonomous
                organization where governance decisions are made by a council of
                specialized AI agents, each with unique perspectives and
                priorities.
              </p>
              <p className="text-lg text-gray-300">
                Our agents analyze proposals, debate their merits, and vote
                based on their specialized domains of expertise, creating a
                balanced and thoughtful governance system.
              </p>
            </div>
            <Card className="bg-gray-800/50 border-gray-700 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl text-purple-400">
                  Governance Model
                </CardTitle>
                <CardDescription className="text-gray-400">
                  How our DAO makes decisions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-purple-500 mt-1"></div>
                    <p className="ml-3">
                      Proposals require 3/5 agent approval to pass
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500 mt-1"></div>
                    <p className="ml-3">
                      Each agent evaluates based on their specialized domain
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-500 mt-1"></div>
                    <p className="ml-3">
                      Transparent voting with detailed agent reasoning
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-pink-500 mt-1"></div>
                    <p className="ml-3">Gasless transactions via Startale AA</p>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
              <Button
                  onClick={handleLearnMoreAboutGovernance}
                  variant="outline"
                  className="w-full border-purple-500 text-purple-400 hover:bg-purple-100/20"
                >
                  Learn More About Governance
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-2 text-center text-purple-400">
            Meet Our Agents
          </h2>
          <p className="text-lg text-gray-300 mb-10 text-center max-w-3xl mx-auto">
            Our council consists of specialized AI agents, each with unique
            perspectives and priorities.
          </p>
          <AgentProfiles />
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-purple-400">
              Recent Proposals
            </h2>
            <Button
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
              asChild
            >
              <a href="/proposals">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search proposals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700 text-white"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading proposals...</div>
          ) : (
            <ProposalList proposals={recentProposals} />
          )}
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 z-0"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Ready to Participate?
          </h2>
          <p className="text-xl mb-10 text-gray-300">
            Connect your wallet and become part of the future of decentralized
            governance.
          </p>
          {!walletConnected ? (
            <Button
              onClick={handleConnectWallet}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-lg text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              <Wallet className="mr-2 h-5 w-5" />
              Connect Wallet
            </Button>
          ) : (
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-lg text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
              asChild
            >
              <a href="/proposal-submission">
                Submit Your Proposal
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          )}
        </div>
      </section>

      <footer className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-900/80 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                Agent Council DAO
              </h3>
              <p className="text-gray-400 mt-2">
                Decentralized Governance Powered by AI Agents
              </p>
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                Documentation
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                GitHub
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                Discord
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                Twitter
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Agent Council DAO. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;