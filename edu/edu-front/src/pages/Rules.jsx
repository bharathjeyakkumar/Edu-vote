import React from "react";
import { motion } from "framer-motion";
import { 
  Scale, Users, Clock, ClipboardCheck, FileSearch, 
  ArrowLeft, CheckCircle2, AlertCircle 
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Rules() {
  const voterRules = [
    {
      icon: <Users className="text-green-500" size={24} />,
      title: "One Person, One Vote",
      desc: "Strict enforcement of institutional ID logic. You can only cast one vote per election cycle.",
      glowColor: "group-hover:border-green-500/50 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.2)]"
    },
    {
      icon: <ClipboardCheck className="text-green-500" size={24} />,
      title: "Receipt Integrity",
      desc: "Save your unique Receipt Hash immediately. This is your only tool for verifying your vote in audit logs.",
      glowColor: "group-hover:border-green-500/50 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.2)]"
    }
  ];

  const staffRules = [
    {
      icon: <Scale className="text-blue-500" size={24} />,
      title: "Accurate Categorization",
      desc: "Election reps must strictly verify and select the correct eligible category (Student, Rep, or Staff).",
      glowColor: "group-hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
    },
    {
      icon: <Clock className="text-blue-500" size={24} />,
      title: "Automatic Locking",
      desc: "Once a deadline is set, the system locks automatically. Elections cannot be reopened for any reason.",
      glowColor: "group-hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
    },
    {
      icon: <FileSearch className="text-blue-500" size={24} />,
      title: "Finalized Results",
      desc: "Election results remain encrypted and hidden until the finalization protocol is triggered by the system.",
      glowColor: "group-hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-slate-100 selection:bg-green-500/30 transition-colors duration-500 pb-20">
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-green-600/10 blur-[80px] md:blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-blue-600/10 blur-[70px] md:blur-[100px] rounded-full translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="container mx-auto px-5 pt-24 md:pt-32 max-w-4xl relative z-10">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-green-500 transition-all mb-8 md:mb-12 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Democracy
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 md:mb-16"
        >
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
            <div className="p-3 md:p-5 bg-white dark:bg-white/5 rounded-2xl md:rounded-[2rem] border border-green-500/20 shadow-xl inline-flex w-fit">
              <Scale size={32} className="text-blue-500 md:w-10 md:h-10" />
            </div>
            <div className="space-y-1">
                <p className="text-blue-500 font-black tracking-[0.3em] uppercase text-[9px] md:text-[11px] px-1">
                    Compliance Manual v1.4
                </p>
                <h1 className="text-4xl md:text-7xl font-black tracking-tighter italic leading-none">
                    Rule <span className="text-slate-400 dark:text-slate-600">Book</span>
                </h1>
            </div>
          </div>
          <p className="text-base md:text-xl opacity-50 font-medium leading-relaxed max-w-2xl mt-6">
            To ensure a fair and transparent election, every participant must adhere to the 
            <span className="text-slate-900 dark:text-white font-bold underline decoration-green-500/30"> EduVote Constitutional Framework</span>.
          </p>
        </motion.div>

        <div className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-6 opacity-40">
            <CheckCircle2 size={18} className="text-green-500" />
            <h2 className="text-xs md:text-sm font-black uppercase tracking-[0.3em]">Protocol for Voters</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:gap-6">
            {voterRules.map((rule, i) => (
              <RuleCard key={i} rule={rule} index={i} />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-6 opacity-40">
            <AlertCircle size={18} className="text-blue-500" />
            <h2 className="text-xs md:text-sm font-black uppercase tracking-[0.3em]">Protocol for Conductors</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:gap-6">
            {staffRules.map((rule, i) => (
              <RuleCard key={i} rule={rule} index={i} />
            ))}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 md:mt-24 text-center"
        >
          <div className="inline-block p-6 md:p-8 rounded-[2rem] border border-dashed border-black/10 dark:border-white/10">
            <p className="text-[10px] md:text-xs font-black opacity-30 uppercase tracking-[0.4em]">
              Violations result in immediate ID disqualification.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

function RuleCard({ rule, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group relative"
    >
      <div className={`
        relative flex flex-col md:flex-row gap-5 md:gap-8 items-start md:items-center 
        p-6 md:p-10 rounded-[1.8rem] md:rounded-[2.5rem] 
        bg-white/50 dark:bg-white/[0.02] backdrop-blur-xl
        border-2 border-black/5 dark:border-white/5 
        transition-all duration-500 ease-out
        ${rule.glowColor}
      `}>
        <div className="shrink-0 p-3 md:p-4 bg-white dark:bg-white/5 rounded-xl md:rounded-2xl shadow-inner group-hover:scale-110 transition-transform duration-500">
          {rule.icon}
        </div>
        <div className="space-y-1.5 md:space-y-2 text-left">
          <h3 className="text-lg md:text-2xl font-black tracking-tight transition-colors">
            {rule.title}
          </h3>
          <p className="text-sm md:text-base opacity-50 group-hover:opacity-80 font-medium leading-relaxed transition-opacity duration-500">
            {rule.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}