import React from "react";
import { motion } from "framer-motion";
import { 
  Scale, ShieldAlert, Gavel, Lock, GraduationCap, 
  ArrowLeft, CheckCircle2, FileText 
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Terms() {
  const termPoints = [
    {
      icon: <ShieldAlert className="text-blue-500" size={24} />,
      title: "Voter Eligibility",
      desc: "Users must use valid institutional email addresses. Any attempt to register with fake credentials will result in an immediate and permanent account ban.",
      glowColor: "group-hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
    },
    {
      icon: <Gavel className="text-blue-500" size={24} />,
      title: "Platform Integrity",
      desc: "Any attempt to exploit, hack, or manipulate the voting database is strictly prohibited. Violators will face disciplinary and legal action by the institution.",
      glowColor: "group-hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
    },
    {
      icon: <Lock className="text-blue-500" size={24} />,
      title: "Finality & Immutability",
      desc: "Once a vote is cast and the election deadline passes, results are final. Records cannot be altered, deleted, or rolled back by any party.",
      glowColor: "group-hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
    },
    {
      icon: <GraduationCap className="text-blue-500" size={24} />,
      title: "Academic Usage",
      desc: "This platform is strictly for academic and committee selections. Commercial use, spamming, or advertising within election portals is prohibited.",
      glowColor: "group-hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-slate-100 selection:bg-blue-500/30 transition-colors duration-500 pb-20">
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/10 blur-[80px] md:blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-slate-400/10 blur-[70px] md:blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="container mx-auto px-5 pt-24 md:pt-32 max-w-4xl relative z-10">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-blue-500 transition-all mb-8 md:mb-12 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Democracy
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 md:mb-16"
        >
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
            <div className="p-3 md:p-5 bg-white dark:bg-white/5 rounded-2xl md:rounded-[2rem] border border-blue-500/20 shadow-xl inline-flex w-fit">
              <Scale size={32} className="text-blue-500 md:w-10 md:h-10" />
            </div>
            <div className="space-y-1">
                <p className="text-blue-500 font-black tracking-[0.3em] uppercase text-[9px] md:text-[11px] px-1">
                    Legal Framework v3.1
                </p>
                <h1 className="text-4xl md:text-7xl font-black tracking-tighter italic leading-none">
                    Terms <span className="text-slate-400 dark:text-slate-600">of Service</span>
                </h1>
            </div>
          </div>
          <p className="text-base md:text-xl opacity-50 font-medium leading-relaxed max-w-2xl mt-6">
            By accessing the EduVote platform, you agree to be bound by our 
            <span className="text-slate-900 dark:text-white font-bold underline decoration-blue-500/30"> Institutional Governance Agreement</span>.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {termPoints.map((term, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group relative"
            >
              <div className={`
                relative flex flex-col md:flex-row gap-5 md:gap-8 items-start md:items-center 
                p-6 md:p-10 rounded-[1.8rem] md:rounded-[2.5rem] 
                bg-white/50 dark:bg-white/[0.02] backdrop-blur-xl
                border-2 border-black/5 dark:border-white/5 
                transition-all duration-500 ease-out
                ${term.glowColor}
              `}>
                
                <div className="shrink-0 p-3 md:p-4 bg-white dark:bg-white/5 rounded-xl md:rounded-2xl shadow-inner group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                  {term.icon}
                </div>

                <div className="space-y-1.5 md:space-y-2 text-left">
                  <h3 className="text-lg md:text-2xl font-black tracking-tight transition-colors">
                    {term.title}
                  </h3>
                  <p className="text-sm md:text-base opacity-50 group-hover:opacity-80 font-medium leading-relaxed transition-opacity duration-500">
                    {term.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 md:mt-24 text-center"
        >
          <div className="inline-flex flex-col md:flex-row items-center gap-4 p-6 md:p-8 rounded-[2rem] border border-dashed border-black/10 dark:border-white/10">
            <CheckCircle2 size={20} className="text-blue-500" />
            <p className="text-[10px] md:text-xs font-black opacity-30 uppercase tracking-[0.4em]">
              Usage constitutes acceptance of all terms listed above.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}