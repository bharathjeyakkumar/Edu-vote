import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ dark, setDark }) {
  return (
    <div 
      onClick={() => setDark(!dark)}
      className={`relative w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-500 ${
        dark ? "bg-slate-800 border border-slate-700" : "bg-blue-100 border border-blue-200"
      }`}
    >
      <motion.div
        className={`z-10 w-6 h-6 rounded-full flex items-center justify-center shadow-lg ${
          dark ? "bg-slate-200" : "bg-yellow-400"
        }`}
        animate={{ x: dark ? 32 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {dark ? (
          <Moon size={14} className="text-slate-900 fill-slate-900" />
        ) : (
          <Sun size={14} className="text-white fill-white" />
        )}
      </motion.div>

      <div className="absolute inset-0 flex justify-between items-center px-2 opacity-20">
        <Sun size={12} className={dark ? "text-white" : "text-transparent"} />
        <Moon size={12} className={dark ? "text-transparent" : "text-slate-900"} />
      </div>
    </div>
  );
}