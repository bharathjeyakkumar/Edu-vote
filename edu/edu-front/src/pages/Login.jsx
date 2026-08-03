import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Mail, Lock, LogIn, ArrowLeft, 
  ShieldCheck, Loader2, HelpCircle 
} from "lucide-react";
import CustomModal from "../components/CustomModal";
import API from "../api"; // 🚀 Using the centralized API instance

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, title: "", message: "", type: "success" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🚀 Step 1: Call MongoDB Backend via Render
      const res = await API.post("/auth/login", { 
        email: email.trim().toLowerCase(), 
        password 
      });
      
      // 🚀 Step 2: Save Data to LocalStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // 🚀 Step 3: Handle Redirects (for shared voting links)
      const redirectURL = localStorage.getItem("redirectURL");
      if (redirectURL && !redirectURL.includes("/login")) {
        localStorage.removeItem("redirectURL");
        navigate(redirectURL);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      // 🚀 Step 4: Map Backend Error to Modal
      const errorMsg = err.response?.data?.error || "Unauthorized credentials or account does not exist.";
      setModal({ 
        open: true, 
        title: "Access Denied", 
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

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="absolute top-8 left-8 z-20">
        <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-blue-500 transition-all group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <ShieldCheck size={48} className="text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-black tracking-tighter italic leading-none">Welcome <span className="text-slate-400 dark:text-slate-600">Back</span></h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mt-2">Institutional Access Protocol</p>
        </div>

        <div className="glass p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative group">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2 dark:text-white">University Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:text-blue-500 transition-all dark:text-white" size={18} />
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

            <div className="space-y-2">
              <div className="flex justify-between px-2">
                <label className="text-xs font-black uppercase tracking-widest opacity-40 dark:text-white">Security Key</label>
                <Link to="/reset" className="text-xs font-bold text-blue-500 hover:underline">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:text-blue-500 transition-all dark:text-white" size={18} />
                <input 
                  className="w-full bg-slate-100 dark:bg-white/5 border-2 border-transparent focus:border-blue-500/50 p-4 pl-12 rounded-2xl outline-none font-bold text-sm text-slate-900 dark:text-white placeholder-slate-500 transition-all" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <button 
              disabled={loading} 
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Sign In <LogIn size={18} /></>}
            </button>
          </form>
        </div>

        <div className="flex flex-col gap-3 mt-8 items-center opacity-60">
          <p className="text-sm font-medium dark:text-white">Not registered? <Link to="/register" className="text-blue-500 font-black underline">Create Account</Link></p>
          <Link to="mailto:bharathjeyakkumars@gmail.com" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest hover:text-blue-500 transition-colors dark:text-white">
            <HelpCircle size={14} /> Contact Support
          </Link>
        </div>
      </motion.div>

      {/* 🚀 High-End Custom Modal */}
      <CustomModal 
        isOpen={modal.open} 
        onClose={() => setModal({ ...modal, open: false })} 
        title={modal.title} 
        message={modal.message} 
        type={modal.type} 
      />
    </div>
  );
}
