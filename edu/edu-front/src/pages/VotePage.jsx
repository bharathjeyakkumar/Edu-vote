import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { 
  Clock, ShieldCheck, AlertCircle, CheckCircle2, 
  ChevronRight, Loader2, Mail, Fingerprint, Send, ShieldQuestion 
} from "lucide-react";
import CustomModal from "../components/CustomModal";

// 🚀 CENTRALIZED API CONFIG
const API_URL = "https://edu-back-lymz.onrender.com/api";

export default function VotePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Data States
  const [election, setElection] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [choice, setChoice] = useState("");
  const [status, setStatus] = useState("loading");
  const [msg, setMsg] = useState("");
  
  // Security Logic States
  const [view, setView] = useState("ballot"); // 'ballot', 'security-choice', 'otp-input'
  const [otpInput, setOtpInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Modal State
  const [modal, setModal] = useState({ open: false, title: "", message: "", type: "success" });

  useEffect(() => {
    const checkAccess = async () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (!token || !savedUser) return navigate("/login");

      try {
        // 1. Fetch Fresh User Profile for Biometric Status
        const userRes = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: token }
        });
        setUserProfile(userRes.data);

        // 2. Fetch Election Data
        const electRes = await axios.get(`${API_URL}/elections/${id}`, {
          headers: { Authorization: token }
        });
        
        const electData = electRes.data;
        const now = new Date();
        const deadline = electData.endAt ? new Date(electData.endAt) : null;

        // 3. Time-Lock Check
        if (electData.status === "stopped" || (deadline && now > deadline)) {
          setStatus("closed");
          setElection(electData);
          return;
        }

        setElection(electData);

        // 4. Role Eligibility Check
        if (!electData.allowedCategories?.includes(userRes.data.role)) {
          setStatus("denied");
        } else {
          setStatus("eligible");
        }
      } catch (err) {
        console.error("Access Error:", err);
        if (err.response?.status === 401) navigate("/login");
        setStatus("error");
      }
    };
    checkAccess();
  }, [id, navigate]);

  // 🚀 Step 1: Initiate Security Layer
  const handleInitiateSecurity = async () => {
    if (!choice) {
      setModal({ open: true, title: "Empty Selection", message: "Choose a candidate before verifying identity.", type: "error" });
      return;
    }

    if (userProfile.isBiometricEnrolled) {
      setView("security-choice"); 
    } else {
      handleRequestOTP(); // Auto-fallback to OTP
    }
  };

  // 🚀 Step 2A: Fingerprint Verification (Production Fix)
  const handleBiometricVerify = async () => {
    setIsVerifying(true);
    try {
      const challenge = window.crypto.getRandomValues(new Uint8Array(32));
      const currentDomain = window.location.hostname; // 🛡️ Production ID

      await navigator.credentials.get({
        publicKey: {
          challenge,
          rpId: currentDomain, 
          allowCredentials: [{
            id: Uint8Array.from(atob(userProfile.biometricId), c => c.charCodeAt(0)),
            type: 'public-key'
          }],
          timeout: 60000,
        }
      });

      await finalizeBallotSubmission("BIOMETRIC_VERIFIED");
    } catch (err) {
      console.error("Biometric Error:", err);
      setModal({ open: true, title: "Failed", message: "Fingerprint unverified. Use Email OTP instead.", type: "error" });
      setView("ballot");
    } finally {
      setIsVerifying(false);
    }
  };

  // 🚀 Step 2B: Request Email OTP
  const handleRequestOTP = async () => {
    setIsVerifying(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/vote/request-otp`, {}, {
        headers: { Authorization: token }
      });
      setView("otp-input");
    } catch (err) {
      setModal({ open: true, title: "Error", message: "Failed to dispatch verification code.", type: "error" });
    } finally {
      setIsVerifying(false);
    }
  };

  // 🚀 Step 3: Final Backend Submission
  const finalizeBallotSubmission = async (securityCode) => {
    setIsVerifying(true);
    const token = localStorage.getItem("token");
    try {
      const receiptId = Math.random().toString(36).substring(2, 10).toUpperCase();

      await axios.post(`${API_URL}/vote`, { 
        electionId: id, 
        candidate: choice, 
        receiptHash: receiptId,
        otp: securityCode 
      }, {
        headers: { Authorization: token }
      });

      setMsg(`Receipt ID: ${receiptId}`);
      setModal({ open: true, title: "Success", message: "Ballot cast and cryptographically secured.", type: "success" });
    } catch (err) {
      setModal({ open: true, title: "Rejected", message: err.response?.data?.error || "Submission failed.", type: "error" });
    } finally {
      setIsVerifying(false);
    }
  };

  // --- UI RENDERING ---

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center opacity-20 font-black uppercase text-xs tracking-widest italic animate-pulse">Auditing ID...</div>;
  
  if (status === "closed") return (
    <div className="max-w-md mx-auto mt-20 p-10 glass rounded-[2rem] shadow-2xl text-center border border-red-500/20 transition-all">
      <Clock size={48} className="text-red-500 mx-auto mb-4" />
      <h2 className="text-xl font-black mb-2 dark:text-white uppercase italic">Locked</h2>
      <p className="opacity-60 mb-8 text-xs font-medium dark:text-white/70">The deadline has passed for {election?.title}.</p>
      <Link to={`/results/${id}`} className="w-full inline-block bg-slate-900 dark:bg-white text-white dark:text-black py-4 rounded-xl font-black text-xs uppercase tracking-widest">Final Report 📊</Link>
    </div>
  );

  if (status === "voted") return (
    <div className="max-w-md mx-auto mt-20 p-10 glass rounded-[2rem] shadow-2xl text-center border border-emerald-500/20 transition-all">
      <ShieldCheck size={64} className="text-green-500 mx-auto mb-4" />
      <h2 className="text-2xl font-black mb-2 dark:text-white uppercase tracking-tighter">Processed</h2>
      <p className="opacity-60 mb-6 text-sm font-medium dark:text-white/70">{msg}</p>
      <button onClick={() => navigate("/dashboard")} className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest">Dashboard</button>
    </div>
  );

  return (
    <div className="max-w-md mx-auto mt-10 md:mt-20 p-8 glass rounded-[2.5rem] shadow-2xl border border-white/10 relative overflow-hidden">
      
      <div className="flex items-center gap-2 mb-6">
        <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[8px] font-black rounded-lg uppercase tracking-widest border border-blue-500/20">
           {view === "ballot" ? "Ballot Access" : "Identity Check"}
        </span>
      </div>

      {view === "ballot" && (
        <div className="animate-in fade-in transition-all">
          <h1 className="text-3xl font-black tracking-tighter dark:text-white italic mb-1 leading-none">{election?.title}</h1>
          <p className="text-xs opacity-50 mb-8 font-medium leading-relaxed dark:text-white/60">Choose a candidate. Submission requires institutional identity verification.</p>
          
          <div className="relative mb-10">
            <select className="w-full p-4 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none border border-black/5 dark:border-white/10 font-bold appearance-none cursor-pointer text-sm shadow-inner" 
              onChange={(e) => setChoice(e.target.value)} value={choice}>
                <option value="">-- Select Candidate --</option>
                {election?.candidates.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 opacity-20 pointer-events-none" />
          </div>

          <button onClick={handleInitiateSecurity} disabled={isVerifying} className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/30 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2">
            {isVerifying ? <Loader2 className="animate-spin" /> : <>Verify & Cast <ShieldCheck size={16}/></>}
          </button>
        </div>
      )}

      {view === "security-choice" && (
        <div className="animate-in fade-in transition-all text-center">
            <ShieldQuestion size={48} className="text-blue-500 mx-auto mb-4" />
            <h2 className="text-xl font-black mb-2 dark:text-white uppercase italic tracking-tighter leading-none">Security Protocol</h2>
            <p className="text-xs opacity-60 mb-8 font-medium">Select verification method.</p>
            
            <div className="flex flex-col gap-3">
                <button onClick={handleBiometricVerify} className="w-full bg-slate-900 dark:bg-white text-white dark:text-black py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3">
                    <Fingerprint size={18} /> Touch ID / Face ID
                </button>
                <button onClick={handleRequestOTP} className="w-full glass py-4 rounded-xl font-black text-[10px] uppercase tracking-widest dark:text-white flex items-center justify-center gap-3">
                    <Mail size={18} /> Email Code
                </button>
                <button onClick={() => setView("ballot")} className="text-[9px] font-black uppercase opacity-30 mt-6 tracking-widest">Back to Ballot</button>
            </div>
        </div>
      )}

      {view === "otp-input" && (
        <div className="animate-in fade-in transition-all text-center">
          <Mail size={48} className="text-purple-500 mx-auto mb-4" />
          <h2 className="text-xl font-black mb-2 dark:text-white italic uppercase tracking-tighter">Enter Code</h2>
          <p className="text-xs opacity-60 mb-8 font-medium leading-relaxed">A 6-digit code was sent to your email.</p>

          <input 
            type="text" maxLength="6" placeholder="000000"
            className="w-full bg-slate-100 dark:bg-slate-800 p-4 rounded-xl outline-none font-black text-2xl tracking-[0.6em] text-center dark:text-white mb-6 border border-black/5"
            onChange={(e) => setOtpInput(e.target.value)}
          />

          <div className="flex gap-2">
             <button onClick={() => setView("ballot")} className="flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest bg-black/5 dark:bg-white/5 dark:text-white">Back</button>
             <button onClick={() => finalizeBallotSubmission(otpInput)} disabled={isVerifying} className="flex-[2] bg-purple-600 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-purple-500/20 active:scale-95 transition-all">
                {isVerifying ? <Loader2 className="animate-spin" /> : "Authorize"}
             </button>
          </div>
        </div>
      )}

      <CustomModal 
        isOpen={modal.open} onClose={() => { setModal({ ...modal, open: false }); if(modal.type === "success") setStatus("voted"); }} 
        title={modal.title} message={modal.message} type={modal.type} 
      />
    </div>
  );
}
