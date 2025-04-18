import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import ProposalSubmission from "./pages/ProposalSubmission";
import ProposalDetails from "./pages/ProposalDetails";
import ProposalList from "./pages/ProposalList";
import Governance from "./pages/Governance";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/proposal-submission" element={<ProposalSubmission />} />
          <Route path="/proposal/:id" element={<ProposalDetails />} />
          <Route path="/proposals" element={<ProposalList />} />
          <Route path="/governance" element={<Governance />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
