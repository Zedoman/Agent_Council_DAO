import React from "react";
import ProposalListComponent from "@/components/ProposalList";

const ProposalList = () => {
  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
          All Proposals
        </h1>
        <p className="text-gray-400 mb-8">
          Browse and filter all proposals submitted to the Agent Council DAO.
        </p>

        <ProposalListComponent showFilters={true} />
      </div>
    </div>
  );
};

export default ProposalList;
