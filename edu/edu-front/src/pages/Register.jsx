import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Tesseract from "tesseract.js";
import { 
  UserPlus, Mail, ChevronRight, ArrowLeft, Loader2, 
  Camera, ShieldCheck, Hash, CheckCircle2 
} from "lucide-react";
import CustomModal from "../components/CustomModal";
import API from "../api"; 

export default function Register() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "", password: "", confirmPassword: "", regno: "", role: "Student", otp: "", classPrefix: "", managedPrefix: ""
  });

  const [modal, setModal] = useState({ open: false, title: "", message: "", type: "success" });

  // 🚀 STEP 1: Request OTP from Backend
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setModal({ open: true, title: "Mismatch", message: "Security keys do not match.", type: "error" });
      return;
    }
    setLoading(true);
    try {
      await API.post("/auth/register-otp", { email: formData.email });
      setStep(2);
    } catch (err) {
      setModal({ open: true, title: "Error", message: "Failed to send code.", type: "error" });
    } finally { setLoading(false); }
  };

  // 🚀 STEP 3 (STUDENT): Standard Tesseract Scan (Works well on Laptops)
  const handleIDScan = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsScanning(true);
    try {
      // Direct recognition without canvas processing
      const { data: { text } } = await Tesseract.recognize(file, 'eng');
      
      // Basic regex to find 10 digits
      const foundRegNo = text.match(/\d{10}/)?.[0];

      if (foundRegNo) {
        setFormData({ ...formData, regno: foundRegNo, classPrefix: foundRegNo.substring(0, 6) });
        setModal({ open: true, title: "Identity Scanned", message: `ID ${foundRegNo} detected.`, type: "success" });
      } else {
        setModal({ open: true, title: "Unclear Scan", message: "Could not detect a valid 10-digit ID. Use a clearer photo.", type: "error" });
      }
    } catch (err) { 
      setModal({ open: true, title: "OCR Error", message: "System failed to process image.", type: "error" }); 
    } finally { 
      setIsScanning(false); 
    }
  };

  // 🚀 FINAL STEP: Submit to MongoDB
  const handleFinalRegister = async () => {
    setLoading(true);
    try {
      await API.post("/auth/register-final", formData);
      setModal({ 
        open: true, 
        title: "Registration Complete", 
        message: "Your identity has been verified. You can now sign in.", 
        type: "success" 
      });
    } catch (err) {
      setModal({ open: true, title: "Denied", message: err.response?.data?.error || "Registration error.", type: "error" });
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center px-6 transition-all duration-500">
      
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="absolute top-8 left-8">
        <Link to="/" className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 flex items-center gap-2"><ArrowLeft size={14}/> Back to Home</Link>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="w-full max-w-lg relative z-10 py-10">
        
        {/* Step Progress Pills */}
        <div className="flex justify-center gap-3 mb-10">
            {[1, 2, 3].map((s) => (
                <div key={s} className={`h-1 rounded-full transition-all duration-700 ${step === s ? 'w-10 bg-[#25D366]' : 'w-3 bg-slate-300 dark:bg-slate-800'}`}></div>
            ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="st1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-8"><UserPlus size={40} className="text-[#25D366] mx-auto mb-4" /><h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none dark:text-white">Create <span className="text-slate-400">Identity</span></h1></div>
              <div className="glass p-8 rounded-[2rem] border border-white/10 shadow-2xl space-y-5">
                <input className="w-full bg-slate-100 dark:bg-white/5 p-4 rounded-2xl outline-none font-bold text-sm" placeholder="Institutional Email" type="email" onChange={e => setFormData({...formData, email: e.target.value})} required />
                <div className="grid grid-cols-2 gap-3">
                    <input className="w-full bg-slate-100 dark:bg-white/5 p-4 rounded-2xl outline-none font-bold text-sm" placeholder="Password" type="password" onChange={e => setFormData({...formData, password: e.target.value})} required />
                    <input className="w-full bg-slate-100 dark:bg-white/5 p-4 rounded-2xl outline-none font-bold text-sm" placeholder="Confirm" type="password" onChange={e => setFormData({...formData, confirmPassword: e.target.value})} required />
                </div>
                <div className="pt-2">
                  <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2 mb-3 block">Register As</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Student", "Rep", "Staff"].map((r) => (
                      <button key={r} type="button" onClick={() => setFormData({...formData, role: r})} 
                        className={`py-3 rounded-xl font-black text-xs transition-all border-2 uppercase ${formData.role === r ? 'bg-[#25D366] border-[#25D366] text-white shadow-lg' : 'bg-transparent border-slate-200 dark:border-white/10 opacity-40 dark:text-white'}`}>{r}</button>
                    ))}
                  </div>
                </div>
                <button onClick={handleRequestOTP} disabled={loading} className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2">{loading ? <Loader2 className="animate-spin" /> : <>Send Verification Code <ChevronRight size={18}/></>}</button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="st2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
               <div className="glass p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
                  <Mail size={50} className="text-[#25D366] mx-auto mb-6" /><h2 className="text-2xl font-black italic mb-2 uppercase dark:text-white leading-none">Check Inbox</h2><p className="text-sm opacity-50 mb-8 font-medium">Verify your institutional mail.</p>
                  <input maxLength="6" className="w-full bg-slate-100 dark:bg-white/5 p-5 rounded-2xl text-center text-3xl font-black tracking-[0.5em] mb-10 outline-none dark:text-white" onChange={e => setFormData({...formData, otp: e.target.value})} />
                  <button onClick={() => setStep(3)} className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-black text-xs uppercase shadow-xl active:scale-95 transition-all">Verify OTP</button>
               </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="st3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <div className="glass p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
                    {formData.role === "Student" ? (
                        <>
                            <Camera size={40} className="text-[#25D366] mx-auto mb-4" /><h2 className="text-2xl font-black italic mb-2 uppercase leading-none dark:text-white">Identity Scan</h2><p className="text-xs opacity-50 mb-8 dark:text-white">Scan ID card for automated verification.</p>
                            <label className="block w-full py-12 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl cursor-pointer hover:bg-emerald-500/5 transition-all mb-6">
                                <input type="file" className="hidden" accept="image/*" onChange={handleIDScan} />
                                {isScanning ? <Loader2 className="animate-spin mx-auto text-emerald-500" /> : <div className="text-[10px] font-black uppercase dark:text-white">Capture College ID</div>}
                            </label>
                            {formData.regno && <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 mb-6 text-left"><p className="text-xs font-black text-emerald-600 uppercase tracking-tighter">Verified ID: {formData.regno}</p><p className="text-[10px] font-bold opacity-50 mt-1 dark:text-white uppercase">Class Prefix: {formData.classPrefix}</p></div>}
                        </>
                    ) : (
                        <>
                            <ShieldCheck size={40} className="text-[#25D366] mx-auto mb-4" /><h2 className="text-2xl font-black italic mb-2 uppercase leading-none dark:text-white">Authority Prefix</h2><p className="text-xs opacity-50 mb-8 dark:text-white">Set the 6-digit prefix for the group you manage.</p>
                            <div className="relative mb-8">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 dark:text-white" size={16}/><input maxLength="6" className="w-full bg-slate-100 dark:bg-white/5 p-4 pl-12 rounded-2xl outline-none font-bold text-sm dark:text-white" placeholder="e.g. 2024CS" onChange={e => setFormData({...formData, managedPrefix: e.target.value.toUpperCase()})} />
                            </div>
                        </>
                    )}
                    <button onClick={handleFinalRegister} disabled={loading || (formData.role === "Student" && !formData.regno)} className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-black text-xs uppercase shadow-xl active:scale-95 transition-all">Finish Registration</button>
                </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-10 text-center text-sm font-medium opacity-40 dark:text-white">
          Already verified? <Link to="/login" className="text-[#25D366] font-black hover:underline">Sign In</Link>
        </p>
      </motion.div>

      <CustomModal 
        isOpen={modal.open} 
        onClose={() => { 
          setModal({...modal, open: false}); 
          if(modal.title === "Registration Complete") navigate("/login"); 
        }} 
        title={modal.title} 
        message={modal.message} 
        type={modal.type} 
      />
    </div>
  );
}
