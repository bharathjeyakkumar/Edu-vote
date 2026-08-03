import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api"; // 🚀 Using the centralized API instance
import { motion } from "framer-motion";
import { Lock, ShieldCheck, Loader2, ArrowLeft } from "lucide-react";
import CustomModal from "../components/CustomModal";

export default function ResetFinal() {
  const { token } = useParams(); // 🚀 Grabs the secret token from the email URL
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, title: "", message: "", type: "success" });

  const handleUpdate = async (e) => {
    e.preventDefault();

    // 🛡️ Client-side validation
    if (password !== confirmPassword) {
      setModal({ open: true, title: "Mismatch", message: "The security keys do not match. Please re-enter.", type: "error" });
      return;
    }

    if (password.length < 6) {
      setModal({ open: true, title: "Weak Key", message: "Security key must be at least 6 characters.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      // 🚀 REST API Call to your Render Backend
      // This sends the token and the new password to your Express server
      await API.post("/auth/reset-password-confirm", {
        token: token,
        newPassword: password
      });

      setModal({
        open: true,
        title: "Key Updated",
        message: "Your institutional security key has been successfully updated. You can now sign in.",
        type: "success"
      });
    } catch (err) {
      const errorMsg = err.response?.data?.error || "This reset link is invalid or has expired.";
      setModal({
        open: true,
        title: "Link Expired",
        message: errorMsg,
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center px-6 relative overflow-hidden transition-colors duration-500">
      
      {/* Background Blurs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full"></div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-blue-600/10 rounded-3xl border border-blue-500/20 mb-6">
            <ShieldCheck size={40} className="text-blue-600" />
          </div>
          <p className="text-blue-500 font-black tracking-[0.4em] uppercase text-[10px] mb-2">Secure Update</p>
          <h1 className="text-4xl font-black tracking-tighter italic leading-none dark:text-white">
            Set New <span className="text-slate-400 dark:text-slate-600">Key</span>
          </h1>
        </div>

        <div className="glass p-8 md:p-10 rounded-[2rem] border border-white/10 shadow-2xl relative">
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2 dark:text-white">New Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:text-blue-500 transition-all dark:text-white" size={18} />
                <input 
                  className="w-full bg-slate-100 dark:bg-white/5 border-2 border-transparent focus:border-blue-500/50 p-4 pl-12 rounded-2xl outline-none font-bold text-sm text-slate-900 dark:text-white" 
                  type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2 dark:text-white">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:text-blue-500 transition-all dark:text-white" size={18} />
                <input 
                  className="w-full bg-slate-100 dark:bg-white/5 border-2 border-transparent focus:border-blue-500/50 p-4 pl-12 rounded-2xl outline-none font-bold text-sm text-slate-900 dark:text-white" 
                  type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required 
                />
              </div>
            </div>

            <button disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex justify-center items-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Finalize Reset"}
            </button>
          </form>
        </div>

        <div className="text-center mt-10">
          <Link to="/login" className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 flex items-center justify-center gap-2 dark:text-white">
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      </motion.div>

      {/* 🚀 High-End Custom Modal */}
      <CustomModal 
        isOpen={modal.open} 
        onClose={() => {
          setModal({ ...modal, open: false });
          // If success, send them to login
          if (modal.type === "success") navigate("/login");
        }} 
        title={modal.title} 
        message={modal.message} 
        type={modal.type} 
      />
    </div>
  );
}
