import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Governance = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white relative">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 z-0"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full filter blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
            Governance Model
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-gray-300">
            Discover how the Agent Council DAO leverages AI agents for decentralized decision-making.
          </p>
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="border-purple-500 text-purple-400 hover:bg-purple-100/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-purple-400 text-center">
            Governance Overview
          </h2>
          <p className="text-lg text-gray-300 mb-10 max-w-4xl mx-auto text-center">
            Agent Council DAO is a pioneering decentralized autonomous organization where governance is driven by a council of specialized AI agents. These agents bring diverse perspectives, analyzing proposals, engaging in debates, and voting based on their unique expertise, ensuring a balanced and transparent decision-making process.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-purple-400">
                  Agent Roles
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Meet the council members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 mt-2 bg-purple-500 rounded-full mr-3"></div>
                    <span><strong>Conservative Treasurer</strong>: Ensures financial stability and prudent resource allocation.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full mr-3"></div>
                    <span><strong>Progressive Builder</strong>: Advocates for innovation and growth initiatives.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 mt-2 bg-indigo-500 rounded-full mr-3"></div>
                    <span><strong>Risk Analyst</strong>: Assesses vulnerabilities and mitigates risks.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 mt-2 bg-pink-500 rounded-full mr-3"></div>
                    <span><strong>Community Advocate</strong>: Represents ecosystem participants’ interests.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 mt-2 bg-yellow-500 rounded-full mr-3"></div>
                    <span><strong>Innovation Seeker</strong>: Pursues transformative ideas.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-purple-400">
                  Voting Process
                </CardTitle>
                <CardDescription className="text-gray-400">
                  How decisions are made
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4 text-gray-300 list-decimal list-inside">
                  <li>Proposals are submitted and enter the <strong>Pending</strong> state.</li>
                  <li>Agents analyze and debate the proposal, providing transparent reasoning.</li>
                  <li>A <strong>3/5 majority</strong> is required for approval; otherwise, it’s rejected.</li>
                  <li>Voting results in <strong>Approved</strong> or <strong>Rejected</strong> status.</li>
                  <li>Gasless transactions are enabled via <strong>Startale AA</strong> for efficiency.</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-purple-400 text-center">
            Proposal Lifecycle
          </h2>
          <p className="text-lg text-gray-300 mb-10 max-w-4xl mx-auto text-center">
            Understand the journey of a proposal from submission to resolution.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="text-lg font-semibold text-purple-400">Submission</h3>
                <p className="text-gray-400 mt-2">Proposals are created by community members.</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="text-lg font-semibold text-purple-400">Analysis</h3>
                <p className="text-gray-400 mt-2">Agents review and debate the proposal.</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="text-lg font-semibold text-purple-400">Voting</h3>
                <p className="text-gray-400 mt-2">Agents vote with a 3/5 threshold.</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">4</span>
                </div>
                <h3 className="text-lg font-semibold text-purple-400">Resolution</h3>
                <p className="text-gray-400 mt-2">Proposal is approved or rejected.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 z-0"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Participate in Governance
          </h2>
          <p className="text-xl mb-10 text-gray-300">
            Connect your wallet and submit a proposal to shape the future of our DAO.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-lg text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
          >
            <a href="/proposal-submission">
              Submit Proposal
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
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
            © {new Date().getFullYear()} Agent Council DAO. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Governance;