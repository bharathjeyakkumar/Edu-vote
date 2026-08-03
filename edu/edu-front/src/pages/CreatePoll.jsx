import { useState, useEffect } from "react";
import API from "../api"; // 🚀 Import the centralized API
import { useNavigate } from "react-router-dom";
import { Calendar, Users, Type, ListPlus, Search, Loader2 } from "lucide-react";
import CustomModal from "../components/CustomModal";

export default function CreatePoll() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, title: "", message: "", type: "success" });

  // Form States
  const [title, setTitle] = useState("");
  const [selectedCats, setSelectedCats] = useState([]);
  const [endDate, setEndDate] = useState("");
  
  // Candidate States
  const [candSource, setCandSource] = useState("Custom"); 
  const [availableUsers, setAvailableUsers] = useState([]); 
  const [selectedFromList, setSelectedFromList] = useState([]); 
  const [customCandidates, setCustomCandidates] = useState(""); 
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["Student", "Rep", "Staff"];
  const isDark = document.documentElement.classList.contains("dark");

  // 🚀 FETCH Registered Users from MongoDB
  useEffect(() => {
    const fetchUsers = async () => {
      if (candSource === "Rep" || candSource === "Staff") {
        try {
          // Calls: https://edu-back-lymz.onrender.com/api/users/role/:role
          const res = await API.get(`/users/role/${candSource}`);
          const list = res.data.map(u => u.email.split('@')[0]);
          setAvailableUsers(list);
        } catch (err) {
          console.error("Institutional Sync Failed:", err);
        }
      }
    };
    fetchUsers();
  }, [candSource]);

  const toggleCategory = (cat) => {
    setSelectedCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const toggleCandidateSelection = (name) => {
    setSelectedFromList(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  const handleCreate = async () => {
    const finalCandidates = candSource === "Custom" 
      ? customCandidates.split(",").map(c => c.trim()).filter(c => c !== "")
      : selectedFromList;

    if (!title || finalCandidates.length === 0 || selectedCats.length === 0 || !endDate) {
      setModal({ open: true, title: "Form Incomplete", message: "Ensure title, eligibility, and candidates are set.", type: "error" });
      return;
    }

    if (new Date(endDate) <= new Date()) {
      setModal({ open: true, title: "Invalid Date", message: "The deadline must be set in the future.", type: "error" });
      return;
    }

    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      // 🚀 Save to MongoDB via Render API
      await API.post("/elections", {
        title,
        allowedCategories: selectedCats,
        candidates: finalCandidates,
        creatorId: user.id,
        endAt: new Date(endDate).toISOString(),
        status: "open"
      });

      setModal({ 
        open: true, 
        title: "Launched", 
        message: "The election has been successfully registered in the MongoDB cluster.", 
        type: "success" 
      });
    } catch (err) {
      setModal({ open: true, title: "Launch Failed", message: err.response?.data?.error || "Connection error.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-6 p-6 md:p-8 glass rounded-2xl shadow-xl border border-white/10 mb-20 transition-all duration-500">
      
      <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
        <h2 className="text-xl font-black italic tracking-tighter flex items-center gap-2 dark:text-white uppercase">
          <ListPlus className="text-blue-500" /> New Election
        </h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-black opacity-40 ml-2 dark:text-white">Election Name</label>
            <input 
              className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-blue-500 p-3 rounded-xl outline-none font-bold text-xs dark:text-white" 
              onChange={e => setTitle(e.target.value)} 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-black opacity-40 ml-2 dark:text-white">Auto-Lock Deadline</label>
            <div className="relative group">
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none dark:text-white" size={14} />
              <input 
                type="datetime-local" 
                style={{ colorScheme: isDark ? 'dark' : 'light' }} 
                className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-blue-500 p-3 rounded-xl outline-none font-bold text-xs dark:text-white"
                onChange={e => setEndDate(e.target.value)} 
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase font-black opacity-40 ml-2 dark:text-white">Voter Eligibility</label>
          <div className="flex gap-2">
            {categories.map(cat => (
              <button 
                key={cat} type="button" onClick={() => toggleCategory(cat)} 
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                  selectedCats.includes(cat) ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-transparent border-black/5 dark:border-white/5 opacity-40 dark:text-white'
                }`}
              >
                {cat}s
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase font-black opacity-40 ml-2 dark:text-white">Candidate Source</label>
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-black/20 rounded-xl">
            {["Custom", "Rep", "Staff"].map(src => (
              <button 
                key={src} type="button" onClick={() => setCandSource(src)} 
                className={`py-2 rounded-lg text-[9px] font-black uppercase transition-all ${
                  candSource === src ? 'bg-white dark:bg-slate-800 shadow-sm opacity-100 text-blue-600' : 'opacity-40 dark:text-white'
                }`}
              >
                {src}
              </button>
            ))}
          </div>
        </div>

        <div className="pb-4">
          {candSource === "Custom" ? (
            <textarea 
              className="w-full bg-slate-100 dark:bg-white/5 p-4 rounded-2xl border border-transparent focus:border-blue-500 outline-none text-xs font-bold min-h-[80px] dark:text-white placeholder-slate-400" 
              placeholder="Enter candidate names separated by commas..." 
              onChange={e => setCustomCandidates(e.target.value)}
            />
          ) : (
            <div className="bg-slate-100/50 dark:bg-black/10 rounded-2xl p-4 max-h-[160px] overflow-y-auto border border-white/5 custom-scrollbar">
               <div className="relative mb-3 sticky top-0 bg-inherit z-10">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-20 dark:text-white" size={14} />
                  <input 
                    className="w-full bg-white dark:bg-slate-900 pl-10 pr-4 py-2 rounded-xl text-[10px] font-bold outline-none border border-transparent focus:border-blue-500 dark:text-white"
                    placeholder={`Search Institutional ${candSource}s...`}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
               <div className="space-y-1">
                  {availableUsers.filter(u => u.toLowerCase().includes(searchTerm.toLowerCase())).map(name => (
                    <label key={name} className="flex items-center justify-between p-2 rounded-xl hover:bg-blue-500/10 cursor-pointer group">
                      <span className="text-xs font-bold dark:text-white group-hover:text-blue-500 transition-colors">{name}</span>
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded-full accent-blue-600 cursor-pointer"
                        checked={selectedFromList.includes(name)}
                        onChange={() => toggleCandidateSelection(name)}
                      />
                    </label>
                  ))}
               </div>
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={handleCreate} 
        disabled={loading}
        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" size={18} /> : "Launch Election Cycle"}
      </button>

      <CustomModal 
        isOpen={modal.open} 
        onClose={() => {
           setModal({ ...modal, open: false });
           if(modal.type === "success") navigate("/dashboard");
        }} 
        title={modal.title} 
        message={modal.message} 
        type={modal.type} 
      />
    </div>
  );
}
