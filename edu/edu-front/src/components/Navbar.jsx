import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// 🚀 Firebase import removed
import ThemeToggle from "./ThemeToggle";
import { ChevronLeft, ChevronRight, Vote } from "lucide-react";

export default function Navbar({ dark, setDark }) {
  const location = useLocation();
  const navigate = useNavigate();

  // 🚀 MERN LOGIC: Check if user is logged in via LocalStorage instead of Firebase
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  // Logic: Only show < > buttons if logged in AND not on entry/auth pages
  const authPages = ["/", "/login", "/register", "/reset"];
  const showNavButtons = isLoggedIn && !authPages.includes(location.pathname);
  
  const isLanding = location.pathname === "/";

  return (
    <nav className="sticky top-0 z-50 w-full px-4 md:px-10 py-4">
      <div className="glass max-w-7xl mx-auto px-4 md:px-6 py-3 rounded-2xl flex justify-between items-center shadow-xl border border-white/10">
        
        {/* LEFT: Navigation + Logo */}
        <div className="flex items-center gap-4">
          {showNavButtons && (
            <div className="flex items-center gap-2 mr-2">
              <button 
                onClick={() => navigate(-1)}
                className="p-1.5 glass rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all opacity-60 hover:opacity-100 active:scale-90"
                title="Go Back"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={() => navigate(1)}
                className="p-1.5 glass rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all opacity-60 hover:opacity-100 active:scale-90"
                title="Go Forward"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          <Link to="/" className="text-xl font-black tracking-tighter flex items-center gap-2 hover:scale-105 transition-transform dark:text-white">
            EduVote <Vote size={20} className="text-blue-500" />
          </Link>
        </div>

        {/* RIGHT: Auth Links + Theme Toggle */}
        <div className="flex items-center gap-6">
          {/* 🚀 If on Landing and NOT logged in, show Auth links */}
          {isLanding && !isLoggedIn && (
            <div className="hidden md:flex items-center gap-6 mr-2">
              <Link to="/login" className="text-[10px] font-black uppercase tracking-widest opacity-50 hover:opacity-100 transition dark:text-white">
                Login
              </Link>
              <Link to="/register" className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-600 transition underline decoration-blue-500/30 underline-offset-4">
                Join System
              </Link>
            </div>
          )}

          {/* 🚀 If LOGGED IN, show a small dashboard shortcut (Optional but High-End) */}
          {isLoggedIn && isLanding && (
            <Link to="/dashboard" className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mr-4 italic">
              Go to Dashboard →
            </Link>
          )}

          <ThemeToggle dark={dark} setDark={setDark} />
        </div>
      </div>
    </nav>
  );
}
