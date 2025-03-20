import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import EmployerDashboard from "./pages/EmployerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeesPage from "./pages/EmployeesPage";
import PaymentsPage from "./pages/PaymentsPage";
import ESOPPage from "./pages/ESOPPage";
import SettingsPage from "./pages/SettingsPage";
import { Web3Provider } from "./context/useWeb3";
import LendingPage from "./pages/LendingPage";
import BotIntro from "./components/BotIntro.jsx";
import Bulk from "./pages/Bulk.jsx";
import AptosBulk from "./pages/AptosBulk.jsx";

export default function App() {
  const EmployerRoutes = () => (
    <Web3Provider>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/employer/dashboard" element={<EmployerDashboard />} />
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employer/employees" element={<EmployeesPage />} />
        <Route path="/employer/payments" element={<PaymentsPage />} />
        <Route path="/employer/esops" element={<ESOPPage />} />
        <Route path="/employer/settings" element={<SettingsPage />} />
        <Route path="/employer/dashboard/botintro" element={<BotIntro />} />
        <Route path="/lending" element={<LendingPage />} />
        <Route path="/bulk" element={<Bulk />} />
      </Routes>
    </Web3Provider>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Wrap employer-specific routes in Web3Provider */}
        <Route path="/*" element={<EmployerRoutes />} />
        <Route path="/aptos" element={<AptosBulk />} />
      </Routes>
    </Router>
  );
}

