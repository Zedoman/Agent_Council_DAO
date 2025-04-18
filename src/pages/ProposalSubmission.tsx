import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Wallet, AlertCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/axios";

const ProposalSubmission = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [walletConnected, setWalletConnected] = useState(() => {
    return localStorage.getItem("walletConnected") === "true";
  });
  const [showDisconnect, setShowDisconnect] = useState(() => {
    return localStorage.getItem("walletConnected") === "true";
  });
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const isFormValid = title && description && budget && duration && parseFloat(budget) >= 0 && parseInt(duration) >= 1;

  useEffect(() => {
    setShowDisconnect(walletConnected);
    if (walletConnected && window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          setWalletConnected(false);
          setShowDisconnect(false);
          localStorage.removeItem("walletConnected");
        }
      });
    }
  }, [walletConnected]);

  const connectWallet = async () => {
    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setShowDisconnect(false);
    setWalletAddress(null);
    localStorage.removeItem("walletConnected");
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected successfully.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid || !walletAddress) {
      toast({
        title: "Invalid input",
        description: "Please fill all fields correctly and connect your wallet.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post('/api/proposals/proposals', {
        title,
        description,
        budget: parseFloat(budget),
        duration: parseInt(duration),
        createdBy: walletAddress,
      });

      toast({
        title: "Proposal submitted!",
        description: "Your proposal has been submitted for agent review.",
        action: (
          <ToastAction
            altText="View proposals"
            onClick={() => navigate("/proposals")}
          >
            View proposals
          </ToastAction>
        ),
      });

      // Reset form
      setTitle("");
      setDescription("");
      setBudget("");
      setDuration("");

      // Navigate to proposals list
      navigate("/proposals");
    } catch (error) {
      console.error('Error submitting proposal:', error);
      toast({
        title: "Submission failed",
        description: "Failed to submit proposal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 relative">
      {showDisconnect && (
        <div className="absolute top-4 right-4 z-50">
          <Button
            onClick={disconnectWallet}
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
            <LogOut className="h-3 w-3" />
          </Button>
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
          Submit a Proposal
        </h1>
        <p className="text-gray-400 mb-8">
          Create a new proposal for the Agent Council DAO to review and vote on.
        </p>

        {!walletConnected ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Alert className="bg-blue-950/30 border-blue-500/50">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertTitle>Connect your wallet</AlertTitle>
              <AlertDescription>
                You need to connect your wallet before submitting a proposal.
              </AlertDescription>
              <Button
                onClick={connectWallet}
                disabled={isSubmitting}
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  "Connecting..."
                ) : (
                  <>
                    <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
                  </>
                )}
              </Button>
            </Alert>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 flex items-center justify-end"
          >
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-blue-400"
              asChild
            >
              <a href="/">Back to Home</a>
            </Button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Proposal Details
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Fill out the form below to create your properly formatted proposal.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-white">
                      Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter a clear, concise title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={!walletConnected || isSubmitting}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your proposal in detail..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={!walletConnected || isSubmitting}
                      className="min-h-[150px] bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budget" className="text-white">
                        Budget (ETH)
                      </Label>
                      <Input
                        id="budget"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        disabled={!walletConnected || isSubmitting}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-white">
                        Duration (mins)
                      </Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        placeholder="30"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        disabled={!walletConnected || isSubmitting}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={!walletConnected || !isFormValid || isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    {isSubmitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        Submit Proposal <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Proposal Guidelines
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Tips for creating a successful proposal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-white mb-2">
                    Be Clear and Concise
                  </h3>
                  <p className="text-sm text-gray-400">
                    Clearly outline the purpose, scope, and expected outcomes of your proposal to help agents understand its value.
                  </p>
                </div>
                <Separator className="bg-gray-800" />
                <div>
                  <h3 className="text-sm font-medium text-white mb-2">
                    Justify the Budget
                  </h3>
                  <p className="text-sm text-gray-400">
                    Provide a detailed breakdown of how funds will be used to ensure transparency and build trust.
                  </p>
                </div>
                <Separator className="bg-gray-800" />
                <div>
                  <h3 className="text-sm font-medium text-white mb-2">
                    Align with DAO Goals
                  </h3>
                  <p className="text-sm text-gray-400">
                    Ensure your proposal supports the mission and objectives of the Agent Council DAO.
                  </p>
                </div>
                <Separator className="bg-gray-800" />
                <div>
                  <h3 className="text-sm font-medium text-white mb-2">
                    Realistic Timeline
                  </h3>
                  <p className="text-sm text-gray-400">
                    Propose a duration that allows sufficient time for implementation while maintaining momentum.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full border-blue-500 text-blue-400 hover:bg-blue-500/10"
                  asChild
                >
                  <a href="/proposals">View Existing Proposals</a>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProposalSubmission;