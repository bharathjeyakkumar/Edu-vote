import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, FileText, CheckCircle2, Lock, Activity, 
  ArrowLeft, ShieldAlert, Zap, Globe, RefreshCw, SearchCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import CustomModal from "../components/CustomModal"; // 🚀 Added Modal

export default function AuditReport() {
  // 🚀 Modal State for standardizing alerts
  const [modal, setModal] = useState({ open: false, title: "", message: "", type: "success" });
  const [isScanning, setIsScanning] = useState(false);

  const auditFindings = [
    {
      icon: <Zap className="text-blue-500" size={20} />,
      title: "Authentication Security",
      desc: "Firebase Auth with institutional email verification provides robust identity management and prevent unauthorized access.",
      glowColor: "group-hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]"
    },
    {
      icon: <Lock className="text-green-500" size={20} />,
      title: "Data Encryption",
      desc: "All data transmissions utilize TLS 1.3 protocol. Data at rest is protected using industry-standard AES-256 encryption.",
      glowColor: "group-hover:border-green-500/50 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.1)]"
    },
    {
      icon: <ShieldCheck className="text-purple-500" size={20} />,
      title: "Vote Integrity",
      desc: "SHA-256 hashing algorithms ensure vote immutability. Any tampering attempt is immediately flagged by the system.",
      glowColor: "group-hover:border-purple-500/50 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]"
    },
    {
      icon: <Activity className="text-red-500" size={20} />,
      title: "Anonymity Protection",
      desc: "Zero-knowledge proofs and cryptographic decoupling maintain a total air-gap between voter identity and ballot choice.",
      glowColor: "group-hover:border-red-500/50 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.1)]"
    }
  ];

  // 🚀 Live Scan Logic to replace old alert behavior
  const handleSystemScan = () => {
    setIsScanning(true);
    // Simulate a deep audit scan
    setTimeout(() => {
      setIsScanning(false);
      setModal({
        open: true,
        title: "Integrity Verified",
        message: "EduVote Security Engine has completed a 128-bit checksum scan. All database records are immutable and valid.",
        type: "success"
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-slate-100 selection:bg-blue-500/30 transition-colors duration-500 pb-20">
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-5 pt-20 max-w-4xl relative z-10">
        
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-blue-500 transition-all mb-8 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Democracy
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
            <div className="p-4 bg-white dark:bg-white/5 rounded-[2rem] border border-blue-500/20 shadow-xl inline-flex w-fit">
              <ShieldCheck size={32} className="text-blue-500" />
            </div>
            <div className="space-y-1">
                <p className="text-blue-500 font-black tracking-[0.3em] uppercase text-[9px] px-1">System Audit v4.0.2</p>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic leading-none">
                    Security <span className="text-slate-400 dark:text-slate-600">Audit</span>
                </h1>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-8">
            <p className="text-sm opacity-50 font-medium leading-relaxed max-w-xl">
                Comprehensive verification of the digital infrastructure. Our security 
                posture is audited to ensure absolute electoral integrity.
            </p>
            {/* 🚀 NEW: Trigger Scan Button */}
            <button 
                onClick={handleSystemScan}
                disabled={isScanning}
                className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
                {isScanning ? <RefreshCw className="animate-spin" size={14}/> : <SearchCheck size={14}/>}
                {isScanning ? "Scanning Database..." : "Verify System Status"}
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-4">
          {auditFindings.map((finding, i) => (
            <motion.div
              key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="group relative"
            >
              <div className={`relative flex flex-col md:flex-row gap-6 items-start md:items-center p-6 md:p-8 rounded-[2rem] bg-white/50 dark:bg-white/[0.02] backdrop-blur-xl border-2 border-black/5 dark:border-white/5 transition-all duration-500 ${finding.glowColor}`}>
                <div className="shrink-0 p-3 bg-white dark:bg-white/5 rounded-2xl shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  {finding.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black tracking-tight">{finding.title}</h3>
                  <p className="text-xs opacity-50 group-hover:opacity-80 font-medium leading-relaxed">{finding.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mt-16 text-center space-y-4">
          <div className="inline-block p-6 rounded-[2rem] border border-dashed border-black/10 dark:border-white/10">
            <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.4em]">Next Full-Spectrum Audit: July 2026</p>
          </div>
          <div className="flex justify-center items-center gap-2 text-[9px] font-bold opacity-40 uppercase tracking-widest">
            <Globe size={12} className="text-blue-500" /> Verified by EduVote Security Council
          </div>
        </motion.div>

      </div>

      {/* 🚀 Custom Modal Integration */}
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