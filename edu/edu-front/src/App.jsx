import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Components
import Navbar from "./components/Navbar";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreatePoll from "./pages/CreatePoll";
import VotePage from "./pages/VotePage";
import Results from "./pages/Results";
import AdminPanel from "./pages/AdminPanel";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Rules from "./pages/Rules";
import AuditReport from "./pages/AuditReport";
import ResetPassword from "./pages/ResetPassword";
import ResetFinal from "./pages/ResetFinal";
export default function App() {
  const [dark, setDark] = useState(true);

  // Apply dark mode class to HTML element whenever 'dark' state changes
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <Router>
      <div className="min-h-screen transition-colors duration-500 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        
        {/* Navbar stays fixed at the top of every page */}
        <Navbar dark={dark} setDark={setDark} />

        <Routes>
          {/* Main Entry Point */}
          <Route path="/" element={<Landing />} />

          {/* Authentication & Account Recovery */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/reset-password-final/:token" element={<ResetFinal />} />
          {/* User Dashboard & Core Features */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-poll" element={<CreatePoll />} />
          <Route path="/vote/:id" element={<VotePage />} />
          <Route path="/results/:id" element={<Results />} />

          {/* Specialized Pages */}
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/security" element={<AuditReport />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/rules" element={<Rules />} />

          {/* Catch-all: Redirect unknown URLs to Landing */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}