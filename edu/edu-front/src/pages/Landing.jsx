import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Shield, EyeOff, CheckCircle, Lock, ArrowRight, Github, 
  Linkedin, Mail, MessageCircle, Cpu, Database, Terminal, Layers, ExternalLink
} from "lucide-react";

export default function Landing() {
  const features = [
    { icon: <Shield className="text-blue-500" size={24} />, title: "Secure Auth", desc: "Institutional ID verification for every voter." },
    { icon: <EyeOff className="text-purple-500" size={24} />, title: "Anonymity", desc: "Cryptographic decoupling of identity and vote." },
    { icon: <CheckCircle className="text-green-500" size={24} />, title: "Fair Play", desc: "Strict one-person-one-vote enforcement logic." },
    { icon: <Lock className="text-red-500" size={24} />, title: "Immutable", desc: "Tamper-proof records using SHA-256 hashing." }
  ];

  const techStack = [
    { name: "React.js", icon: <Cpu size={14} />, color: "text-blue-400" },
    { name: "MongoDB", icon: <Database size={14} />, color: "text-yellow-500" },
    { name: "Node.js", icon: <Terminal size={14} />, color: "text-green-500" },
    { name: "Tailwind", icon: <Layers size={14} />, color: "text-teal-400" }
  ];

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-500/30 bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-slate-100 transition-colors duration-500">
      
      <main className="container mx-auto px-6 pt-24 pb-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600 blur-[120px] rounded-full"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-blue-600/10 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] mb-8 inline-block uppercase border border-blue-500/20"
        >
          Institutional Grade Voting
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl lg:text-[9rem] font-black tracking-tighter mb-6 bg-gradient-to-b from-slate-950 to-slate-500 dark:from-white dark:to-slate-500 bg-clip-text text-transparent leading-[0.9]"
        >
          EduVote
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto text-lg md:text-xl opacity-60 mb-10 font-medium leading-relaxed"
        >
          The gold standard for secure, anonymous digital voting. 
          Built for universities that demand transparency and cryptographic integrity.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-24"
        >
          <Link to="/register" className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-base shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
            Get Started <ArrowRight size={18}/>
          </Link>
          <Link to="/login" className="bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 px-10 py-4 rounded-2xl font-bold text-base hover:bg-black/5 dark:hover:bg-white/5 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/30 transition-all">
            Log In
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
          {features.map((f, i) => (
            <motion.div 
              key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white/40 dark:bg-white/[0.03] backdrop-blur-xl p-8 rounded-[2.5rem] text-left border border-white/20 dark:border-white/10 shadow-sm hover:shadow-blue-500/20 hover:border-blue-500 hover:border-2 transition-all duration-500"
            >
              <div className="mb-6 bg-white dark:bg-white/5 w-12 h-12 flex items-center justify-center rounded-2xl shadow-inner">{f.icon}</div>
              <h3 className="font-bold text-xl mb-2">{f.title}</h3>
              <p className="text-sm opacity-50 font-medium leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-32"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-white dark:bg-black p-3 rounded-[2.5rem] shadow-2xl overflow-hidden aspect-video border border-white/10">
              <iframe 
                className="w-full h-full rounded-[1.8rem]"
                src="https://www.youtube.com/embed/LQsHTT07g3s?si=YObzKb03VgI1cJ9w&amp;start=1" 
                title="EduVote Demo"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          </div>
          <p className="mt-6 text-sm font-black uppercase tracking-[0.4em] opacity-30 italic">System Architecture & Walkthrough</p>
        </motion.div>
      </main>

      <footer className="relative mt-auto overflow-hidden border-t-4 border-blue-500/30 dark:border-blue-500/50 bg-gradient-to-b from-slate-100 to-white dark:from-[#0a0a0a] dark:to-[#080808] pt-12 md:pt-20 lg:pt-24 pb-8 md:pb-12 shadow-[0_-20px_60px_-15px_rgba(59,130,246,0.15)]">
        
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 lg:gap-20 mb-12 md:mb-20 lg:mb-24">
            
            <div className="lg:col-span-5 text-center lg:text-left">
              <Link to="/" className="inline-block mb-6 md:mb-8 group">
                <span className="font-black tracking-tighter text-3xl md:text-4xl lg:text-5xl italic underline decoration-blue-500 decoration-[3px] md:decoration-[4px] lg:decoration-[5px] underline-offset-4 md:underline-offset-6 lg:underline-offset-8 group-hover:decoration-blue-600 group-hover:text-blue-600 transition-all duration-300">EduVote</span>
              </Link>
              <p className="text-base md:text-lg font-medium opacity-60 leading-relaxed max-w-md mb-8 md:mb-10 mx-auto lg:mx-0">
                Revolutionizing campus democracy through zero-knowledge principles and immutable ledger technology. Built for the thinkers of tomorrow.
              </p>
              
              <div className="space-y-4 md:space-y-5">
                <p className="text-xs md:text-sm font-black opacity-40 uppercase tracking-[0.3em]">Engineering Stack</p>
                <div className="flex flex-wrap gap-2 md:gap-3 justify-center lg:justify-start">
                  {techStack.map((tech, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:scale-105 transition-all duration-300 cursor-pointer">
                      <span className={tech.color}>{tech.icon}</span>
                      <span className="text-xs font-bold uppercase">{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
              <div className="space-y-5 md:space-y-6">
                <div className="flex flex-col items-center sm:items-start">
                  <div className="relative inline-block">
                    <h5 className="text-sm md:text-base font-black uppercase tracking-[0.2em] md:tracking-[0.25em] mb-2 text-blue-500 relative z-10">Platform</h5>
                    <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-blue-500 to-transparent rounded-full"></div>
                  </div>
                </div>
                <ul className="space-y-3 md:space-y-4 flex flex-col items-center sm:items-start">
                  <li className="w-full sm:w-auto">
                    <Link to="/register" className="text-sm md:text-base font-bold opacity-60 hover:opacity-100 hover:text-blue-500 sm:hover:translate-x-2 transition-all duration-300 flex items-center gap-2 group justify-center sm:justify-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-all"></span>
                      Registration 
                      <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-all"/>
                    </Link>
                  </li>
                  <li className="w-full sm:w-auto">
                    <Link to="/login" className="text-sm md:text-base font-bold opacity-60 hover:opacity-100 hover:text-blue-500 sm:hover:translate-x-2 transition-all duration-300 flex items-center gap-2 group justify-center sm:justify-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-all"></span>
                      Voter Portal
                    </Link>
                  </li>
                  <li className="w-full sm:w-auto">
                    <Link to="/rules" className="text-sm md:text-base font-bold opacity-60 hover:opacity-100 hover:text-blue-500 sm:hover:translate-x-2 transition-all duration-300 flex items-center gap-2 group justify-center sm:justify-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-all"></span>
                      Election Rules
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-5 md:space-y-6">
                <div className="flex flex-col items-center sm:items-start">
                  <div className="relative inline-block">
                    <h5 className="text-sm md:text-base font-black uppercase tracking-[0.2em] md:tracking-[0.25em] mb-2 text-blue-500 relative z-10">Legal</h5>
                    <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-blue-500 to-transparent rounded-full"></div>
                  </div>
                </div>
                <ul className="space-y-3 md:space-y-4 flex flex-col items-center sm:items-start">
                  <li className="w-full sm:w-auto">
                    <Link to="/terms" className="text-sm md:text-base font-bold opacity-60 hover:opacity-100 hover:text-blue-500 sm:hover:translate-x-2 transition-all duration-300 flex items-center gap-2 group justify-center sm:justify-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-all"></span>
                      Terms of Service
                    </Link>
                  </li>
                  <li className="w-full sm:w-auto">
                    <Link to="/privacy" className="text-sm md:text-base font-bold opacity-60 hover:opacity-100 hover:text-blue-500 sm:hover:translate-x-2 transition-all duration-300 flex items-center gap-2 group justify-center sm:justify-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-all"></span>
                      Privacy Policy
                    </Link>
                  </li>
                  <li className="w-full sm:w-auto">
                    <Link to="/security" className="text-sm md:text-base font-bold opacity-60 hover:opacity-100 hover:text-blue-500 sm:hover:translate-x-2 transition-all duration-300 flex items-center gap-2 group justify-center sm:justify-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-all"></span>
                      Audit Report
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-5 md:space-y-6 sm:col-span-2 md:col-span-1">
                <div className="flex flex-col items-center sm:items-start">
                  <div className="relative inline-block">
                    <h5 className="text-sm md:text-base font-black uppercase tracking-[0.2em] md:tracking-[0.25em] mb-2 text-blue-500 relative z-10">Connect</h5>
                    <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-blue-500 to-transparent rounded-full"></div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 md:gap-4 justify-center sm:justify-start">
                  <a href="https://github.com/bharathjeyakkumar" target="_blank" className="group relative p-3 md:p-4 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-blue-500 dark:hover:bg-blue-500 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/15 transition-all duration-300">
                    <Github size={20} className="md:w-[22px] md:h-[22px] text-slate-700 dark:text-slate-300 group-hover:text-white transition-colors"/>
                  </a>
                  <a href="https://www.linkedin.com/in/bharath-jeyakkumar-s-ba7089328" target="_blank" className="group relative p-3 md:p-4 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-blue-600 dark:hover:bg-blue-600 hover:scale-110 hover:shadow-lg hover:shadow-blue-600/15 transition-all duration-300">
                    <Linkedin size={20} className="md:w-[22px] md:h-[22px] text-slate-700 dark:text-slate-300 group-hover:text-white transition-colors"/>
                  </a>
                  <a href="mailto:bharathjeyakkumars@gmail.com" className="group relative p-3 md:p-4 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-red-500 dark:hover:bg-red-500 hover:scale-110 hover:shadow-lg hover:shadow-red-500/15 transition-all duration-300">
                    <Mail size={20} className="md:w-[22px] md:h-[22px] text-slate-700 dark:text-slate-300 group-hover:text-white transition-colors"/>
                  </a>
                  <a href="https://wa.me/9043641948" target="_blank" className="group relative p-3 md:p-4 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-green-500 dark:hover:bg-green-500 hover:scale-110 hover:shadow-lg hover:shadow-green-500/15 transition-all duration-300">
                    <MessageCircle size={20} className="md:w-[22px] md:h-[22px] text-slate-700 dark:text-slate-300 group-hover:text-white transition-colors"/>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-black/10 dark:border-white/10 pt-8 md:pt-10 lg:pt-12 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-5 lg:gap-10">
                <p className="text-xs md:text-sm font-black opacity-40 uppercase tracking-[0.15em] md:tracking-[0.25em] hover:opacity-60 transition-opacity text-center">
                © 2026 EDUVOTE
                </p>
                <div className="hidden md:block h-1.5 w-1.5 rounded-full bg-slate-500 opacity-30"></div>
                <div className="text-xs md:text-sm font-bold opacity-50 flex items-center gap-2 md:gap-3 hover:opacity-70 transition-opacity">
                    <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50"></div>
                    SYSTEMS OPERATIONAL
                </div>
            </div>
            
            <div className="font-mono text-xs md:text-sm opacity-50 tracking-wide md:tracking-widest uppercase py-2 md:py-3 px-4 md:px-6 rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-500/5 transition-all duration-300">
              Designed by <span className="relative inline-block text-blue-500 font-black cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 group">
                <span className="relative z-10 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:via-purple-500 group-hover:to-blue-600 transition-all duration-500">
                  bharathjeyakkumar 
                </span>
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 group-hover:w-full transition-all duration-500 ease-out"></span>
                <span className="absolute inset-0 -z-10 blur-xl opacity-0 group-hover:opacity-50 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 scale-0 group-hover:scale-150"></span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
