import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function CustomModal({ isOpen, onClose, title, message, type = "success", onConfirm, confirmText }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="glass w-full max-w-sm p-8 rounded-2xl shadow-2xl relative z-10 text-center border border-white/10"
          >
            <div className="flex flex-col items-center">
              <div className={`p-3 rounded-xl mb-4 inline-block ${type === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                {type === "success" ? <CheckCircle size={32} /> : <AlertCircle size={32} />}
              </div>
              <h2 className="text-lg font-black mb-2 uppercase tracking-widest dark:text-white italic">{title}</h2>
              <p className="text-sm opacity-60 font-medium leading-relaxed mb-8 dark:text-white/80">{message}</p>
              
              <div className="flex gap-2 w-full">
                {onConfirm ? (
                  <>
                    <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-sm bg-black/5 dark:bg-white/5 dark:text-white transition-colors">
                      Cancel
                    </button>
                    <button onClick={onConfirm} className="flex-1 py-3 rounded-xl font-bold text-sm bg-red-600 text-white shadow-lg shadow-red-600/20 transition-colors">
                      {confirmText || "Confirm"}
                    </button>
                  </>
                ) : (
                  <button onClick={onClose} className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-opacity hover:opacity-90">
                    Continue
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}