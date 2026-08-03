import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Mail, ArrowLeft, ShieldCheck, Loader2, HelpCircle 
} from "lucide-react";
import CustomModal from "../components/CustomModal";
import API from "../api"; // 🚀 Using the centralized API

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, title: "", message: "", type: "success" });
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🚀 REST API Call to your Render Backend
      // Forces lowercase to match MongoDB registration logic
      const res = await API.post("/auth/reset-password", { 
        email: email.trim().toLowerCase() 
      });
      
      setModal({
        open: true,
        title: "Link Dispatched",
        message: "A secure recovery link has been sent to your university email address. Please check your inbox.",
        type: "success"
      });
    } catch (err) {
      const errorDesc = err.response?.data?.error || "An unexpected error occurred. Please try again later.";
      
      setModal({
        open: true,
        title: "Reset Failed",
        message: errorDesc,
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

      {/* Navigation */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="absolute top-8 left-8 z-20">
        <Link to="/login" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-blue-500 transition-all group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Sign In
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-blue-600/10 rounded-3xl border border-blue-500/20 mb-6">
            <ShieldCheck size={40} className="text-blue-600" />
          </div>
          <p className="text-blue-500 font-black tracking-[0.4em] uppercase text-[10px] mb-2">Account Recovery</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic leading-none">
            Reset <span className="text-slate-400 dark:text-slate-600">Access</span>
          </h1>
          <p className="text-sm opacity-50 mt-4 max-w-xs mx-auto font-medium">
            Enter your email and we'll send you a secure link to reset your security key.
          </p>
        </div>

        <div className="glass p-8 md:p-10 rounded-[2rem] border border-white/10 shadow-2xl relative group">
            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2 dark:text-white">Registered Email</label>
                <div className="relative group/input">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within/input:text-blue-500 transition-all dark:text-white" size={18} />
                  <input 
                    className="w-full bg-slate-100 dark:bg-white/5 border-2 border-transparent focus:border-blue-500/50 p-4 pl-12 rounded-2xl outline-none font-bold text-sm text-slate-900 dark:text-white placeholder-slate-500 transition-all" 
                    type="email" 
                    placeholder="name@university.edu" 
                    value={email}
                    onChange={e => setEmail(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <button 
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Send Recovery Link"}
              </button>
            </form>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 opacity-60">
            <p className="text-sm font-medium italic dark:text-white">Locked out of your account?</p>
            <a href="mailto:bharathjeyakkumars@gmail.com" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest hover:text-blue-500 transition-colors dark:text-white">
                <HelpCircle size={14} /> Contact Support
            </a>
        </div>
      </motion.div>

      {/* 🚀 Custom Modal Implementation */}
      <CustomModal 
        isOpen={modal.open} 
        onClose={() => {
           setModal({ ...modal, open: false });
           if(modal.type === "success") navigate("/login");
        }} 
        title={modal.title} 
        message={modal.message} 
        type={modal.type} 
      />
    </div>
  );
}
