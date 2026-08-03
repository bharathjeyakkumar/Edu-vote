import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { 
  ShieldCheck, PlusCircle, BarChart3, LogOut, 
  Vote, Clock, Fingerprint, ShieldAlert, CheckCircle2, Loader2 
} from "lucide-react";
import CustomModal from "../components/CustomModal";

// 🚀 CENTRALIZED API CONFIG (Change this if your Render URL changes)
const API_URL = "https://edu-back-lymz.onrender.com/api";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isBioEnrolled, setIsBioEnrolled] = useState(false);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());
  const navigate = useNavigate();

  const [modal, setModal] = useState({ open: false, title: "", message: "", type: "success", onConfirm: null, confirmText: "" });

  useEffect(() => {
    const initDashboard = async () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (!token || !savedUser) {
        navigate("/login");
        return;
      }

      try {
        // 1. Fetch Fresh User Profile using Render URL
        const res = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: token }
        });
        setUserData(res.data);
        setUserRole(res.data.role);
        setIsBioEnrolled(res.data.isBiometricEnrolled);

        // 2. Fetch All Elections using Render URL
        const electRes = await axios.get(`${API_URL}/elections`, {
          headers: { Authorization: token }
        });
        setElections(electRes.data);
      } catch (error) {
        console.error("Dashboard Init Error:", error);
        if (error.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, [navigate]);

  // 🚀 FIXED BIOMETRIC ENROLLMENT LOGIC FOR PRODUCTION
// 🚀 FIXED ENROLLMENT LOGIC
const handleBiometricEnroll = async () => {
  // 🛡️ Safety check: ensure user data is loaded
  if (!userData || (!userData.id && !userData._id)) {
    setModal({ open: true, title: "Error", message: "User profile not synced. Please refresh.", type: "error" });
    return;
  }

  try {
    const challenge = window.crypto.getRandomValues(new Uint8Array(32));
    const currentDomain = window.location.hostname;

    // 🛡️ Get the ID correctly (handle both id and _id from MongoDB)
    const userIdString = userData.id || userData._id;

    const credential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { 
          name: "EduVote Secure",
          id: currentDomain 
        },
        user: {
          // 🚀 FIX: Converting the MongoDB ID string to Uint8Array safely
          id: Uint8Array.from(userIdString, c => c.charCodeAt(0)),
          name: userData.email,
          displayName: userData.email,
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }],
        authenticatorSelection: { 
          authenticatorAttachment: "platform",
          userVerification: "required"
        },
        timeout: 60000,
      }
    });

    const token = localStorage.getItem("token");
    const credId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));

    // Save to Render Backend
    await axios.post(`${API_URL}/auth/enroll-biometrics`, 
      { biometricId: credId }, 
      { headers: { Authorization: token } }
    );

    setIsBioEnrolled(true);
    setModal({ open: true, title: "Success", message: "Biometrics linked successfully!", type: "success" });
  } catch (err) {
    console.error("Biometric Error:", err);
    setModal({ open: true, title: "Enrollment Failed", message: "Fingerprint setup was cancelled or your browser denied the request.", type: "error" });
  }
};

  const handleLogoutTrigger = () => {
    setModal({
      open: true,
      title: "Sign Out",
      message: "End your secure institutional session?",
      type: "error",
      confirmText: "Sign Out",
      onConfirm: () => {
        localStorage.clear();
        navigate("/login");
      }
    });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center font-black uppercase text-[10px] tracking-[0.4em] opacity-20 italic animate-pulse">
        Synchronizing with Registry...
    </div>
  );

  return (
    <div className="p-4 md:p-10 max-w-4xl mx-auto mb-20 transition-all duration-500">
      
      {/* Header */}
      <div className="glass p-6 rounded-[2rem] mb-8 flex justify-between items-center shadow-xl border border-white/10">
        <div>
          <h1 className="text-xl font-black tracking-tighter flex items-center gap-2 italic dark:text-white">
            Dashboard <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          </h1>
          <p className="text-xs opacity-40 font-bold">{userData?.email}</p>
          <span className="mt-1 px-2 py-0.5 bg-blue-600 text-white text-[8px] font-black rounded uppercase tracking-widest">{userRole}</span>
        </div>
        <button onClick={handleLogoutTrigger} className="p-3 bg-red-500/5 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-colors">
          <LogOut size={20} />
        </button>
      </div>

      {/* 🛡️ BIOMETRICS CARD */}
      <div className={`p-6 rounded-3xl mb-6 border transition-all duration-500 ${isBioEnrolled ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-blue-600 text-white shadow-2xl'}`}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${isBioEnrolled ? 'bg-emerald-500/20 text-emerald-500' : 'bg-white/20 text-white'}`}>
                    {isBioEnrolled ? <CheckCircle2 /> : <Fingerprint />}
                </div>
                <div>
                    <h3 className={`text-sm font-black uppercase tracking-tight ${isBioEnrolled ? 'text-emerald-600' : 'text-white'}`}>
                        {isBioEnrolled ? "Passkey Active" : "Two-Factor Auth"}
                    </h3>
                    <p className={`text-[10px] font-medium opacity-60 ${isBioEnrolled ? 'text-slate-600 dark:text-slate-400' : 'text-white'}`}>
                        {isBioEnrolled ? "Biometric verification is enabled for this device." : "Enroll fingerprint for faster verification fallback."}
                    </p>
                </div>
            </div>
            {!isBioEnrolled && (
                <button onClick={handleBiometricEnroll} className="bg-white text-blue-600 px-6 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-slate-100 transition-all">
                    Enable Now
                </button>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {userRole === "Admin" && (
            <div className="bg-slate-900 border border-red-500/20 rounded-3xl p-6 text-white">
                <h2 className="text-sm font-black mb-1 uppercase tracking-widest leading-none flex items-center gap-2"><ShieldAlert size={16}/> Admin</h2>
                <p className="opacity-50 text-[9px] mb-4">Master authority for institutional data.</p>
                <Link to="/admin" className="bg-white text-black px-5 py-2 rounded-lg font-black text-[9px] uppercase inline-block hover:bg-gray-200">Open Panel</Link>
            </div>
        )}
        {(userRole === "Rep" || userRole === "Staff") && (
            <div className="bg-slate-100 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl p-6">
                <h2 className="text-sm font-black mb-1 uppercase tracking-widest leading-none flex items-center gap-2 dark:text-white"><PlusCircle size={16} className="text-blue-500" /> Controller</h2>
                <p className="opacity-40 text-[9px] mb-4 dark:text-white">Create polls and define categories.</p>
                <Link to="/create-poll" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-black text-[9px] uppercase inline-block shadow-lg">New Poll</Link>
            </div>
        )}
      </div>

      <h2 className="text-[10px] font-black mb-4 px-2 uppercase tracking-[0.3em] opacity-30 italic underline decoration-blue-500/30">Active Registry</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {elections.map((el) => {
          const deadline = el.endAt ? new Date(el.endAt) : null;
          const isExpired = deadline ? now > deadline : false;
          const isStopped = el.status === "stopped" || isExpired;
          const isEligible = el.allowedCategories?.includes(userRole);

          return (
            <div key={el._id} className="glass p-5 rounded-[2rem] border border-white/5 flex flex-col justify-between transition-colors hover:border-blue-500/20">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-bold truncate pr-4 dark:text-white italic">{el.title}</h3>
                  <span className={`text-[7px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${isStopped ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"}`}>{isStopped ? "Closed" : "Live"}</span>
                </div>
                <div className="flex items-center gap-1.5 mb-6 opacity-40 text-[8px] font-black uppercase tracking-tighter"><Clock size={12} /> {isStopped ? "Finalized:" : "Deadline:"}: {deadline ? deadline.toLocaleDateString() : "None"}</div>
              </div>
              
              <div className="flex gap-2">
                {isStopped ? <Link to={`/results/${el._id}`} className="flex-1 bg-slate-900 dark:bg-white dark:text-black text-white text-center py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest">Results</Link> : (
                  <>
                    {isEligible && userRole !== "Admin" && <Link to={`/vote/${el._id}`} className="flex-1 bg-blue-600 text-white text-center py-2.5 rounded-xl font-black text-[9px] uppercase shadow-lg shadow-blue-500/10 active:scale-95 transition-all">Vote</Link>}
                    {(el.creatorId === userData?.id || userRole === "Admin") && <Link to={`/results/${el._id}`} className="flex-1 bg-black/5 dark:bg-white/5 text-center py-2.5 rounded-xl font-black text-[9px] uppercase hover:bg-black/10 transition-colors">Monitor</Link>}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <CustomModal 
        isOpen={modal.open} onClose={() => setModal({ ...modal, open: false })} 
        title={modal.title} message={modal.message} type={modal.type} 
        onConfirm={modal.onConfirm} confirmText={modal.confirmText}
      />
    </div>
  );
}
