import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api"; // 🚀 Using the centralized API
import { 
  ShieldAlert, Trash2, RefreshCw, AlertTriangle, 
  ArrowLeft, Database, Loader2 
} from "lucide-react";
import CustomModal from "../components/CustomModal";

export default function AdminPanel() {
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [modal, setModal] = useState({ open: false, title: "", message: "", type: "success" });
  const navigate = useNavigate();

  useEffect(() => {
    // 🛡️ Security Check: Only allow if role in LocalStorage is Admin
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
        navigate("/login");
        return;
    }

    const user = JSON.parse(savedUser);
    if (user.role !== "Admin") {
      navigate("/dashboard");
    } else {
      setIsAdmin(true);
    }
  }, [navigate]);

  // 🚀 Master Reset Logic
  const handleMasterReset = async () => {
    const confirmText = "RESET-APP";
    const input = prompt(`⚠️ CRITICAL: This will permanently wipe all elections, votes, and audit logs.\n\nType "${confirmText}" to execute:`);
    
    if (input !== confirmText) return;

    setLoading(true);
    try {
      // 🚀 REST API Call to the Express Backend DELETE route
      const res = await API.delete("/admin/reset");

      setModal({
        open: true,
        title: "System Purged",
        message: res.data.message || "Institutional database successfully reset.",
        type: "success"
      });
    } catch (err) {
      setModal({
        open: true,
        title: "Reset Failed",
        message: err.response?.data?.error || "Unauthorized request or database error.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin && !modal.open) return null;

  return (
    <div className="max-w-xl mx-auto mt-6 md:mt-10 p-8 glass rounded-[2rem] shadow-2xl border border-red-500/20 transition-all duration-500 mb-20">
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <div className="bg-red-600 p-3 rounded-xl text-white shadow-lg shadow-red-600/20">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight dark:text-white uppercase italic leading-none">System Admin</h1>
            <p className="text-[9px] font-black uppercase opacity-40 tracking-widest mt-1">Global Authority Console</p>
          </div>
        </div>
        <button 
          onClick={() => navigate("/dashboard")} 
          className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 flex items-center gap-1 transition-all"
        >
          <ArrowLeft size={14}/> Dashboard
        </button>
      </div>

      {/* Danger Zone Card */}
      <div className="bg-red-600/5 dark:bg-red-600/10 border border-red-600/20 p-8 rounded-[2rem] mb-10 text-center relative overflow-hidden">
        <AlertTriangle className="text-red-600 mx-auto mb-4" size={40} />
        <h3 className="text-lg font-black text-red-600 uppercase tracking-tighter italic mb-2">Danger Zone</h3>
        <p className="text-xs opacity-60 font-medium mb-8 dark:text-white leading-relaxed max-w-xs mx-auto">
          Wiping the database will recursively erase all <strong>Elections</strong>, <strong>Votes</strong>, and <strong>Tally Records</strong>. Institutional users will remain.
        </p>
        
        <button 
          onClick={handleMasterReset}
          disabled={loading}
          className="w-full py-4 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-red-600/30 hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
          {loading ? "Purging Records..." : "Execute Factory Reset"}
        </button>
      </div>

      {/* Admin Information Legend */}
      <div className="grid grid-cols-2 gap-4 opacity-40">
        <div className="p-5 border-2 border-dashed border-black/5 dark:border-white/5 rounded-3xl">
            <Database size={16} className="mb-2 text-blue-500" />
            <p className="text-[9px] font-bold leading-tight uppercase tracking-tighter">Cleaning includes all voter status flags and anonymous ballot collections.</p>
        </div>
        <div className="p-5 border-2 border-dashed border-black/5 dark:border-white/5 rounded-3xl">
            <RefreshCw size={16} className="mb-2 text-green-500" />
            <p className="text-[9px] font-bold leading-tight uppercase tracking-tighter">Use this function to prepare the platform for a new academic semester.</p>
        </div>
      </div>

      {/* Final Branding */}
      <div className="mt-12 text-center opacity-20 text-[9px] font-black uppercase tracking-[0.3em] dark:text-white">
        EduVote Admin Engine • Confidential Integrity System
      </div>

      {/* 🚀 Custom Modal for Feedback */}
      <CustomModal 
        isOpen={modal.open} 
        onClose={() => {
            setModal({ ...modal, open: false });
            if (modal.title === "System Purged") navigate("/dashboard");
        }} 
        title={modal.title} 
        message={modal.message} 
        type={modal.type} 
      />
    </div>
  );
}
