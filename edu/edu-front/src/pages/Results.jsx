import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api"; // 🚀 Using the centralized API
import { 
  ChevronDown, ChevronUp, Trophy, Ban, CheckCircle, 
  FileSpreadsheet, XCircle, Clock, BarChart3 
} from "lucide-react";
import * as XLSX from "xlsx";
import CustomModal from "../components/CustomModal";

export default function Results() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Data States
  const [election, setElection] = useState(null);
  const [tally, setTally] = useState({}); // { Candidate: [{hash, time}] }
  const [leader, setLeader] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());
  
  // UI State
  const [modal, setModal] = useState({ open: false, title: "", message: "", type: "success" });

  useEffect(() => {
    // 1. Sync clock for automatic time-lock UI
    const timer = setInterval(() => setNow(new Date()), 10000);

    const fetchAuditData = async () => {
      try {
        // 🚀 2. Fetch Election Info
        const electRes = await API.get(`/elections/${id}`);
        const electData = electRes.data;
        setElection(electData);

        // 🚀 3. Fetch All Votes for this election from MongoDB
        const votesRes = await API.get(`/results/${id}`);
        const votesData = votesRes.data;
        
        let tempTally = {};
        electData.candidates.forEach(c => tempTally[c] = []);

        votesData.forEach(vote => {
          if (tempTally[vote.candidate]) {
            tempTally[vote.candidate].push({
              hash: vote.receiptHash || "N/A",
              time: new Date(vote.timestamp).toLocaleString()
            });
          }
        });

        setTally(tempTally);

        // 🚀 4. Determine current winner
        let maxVotes = -1;
        let leadingCandidate = null;
        Object.entries(tempTally).forEach(([name, votes]) => {
          if (votes.length > maxVotes && votes.length > 0) {
            maxVotes = votes.length;
            leadingCandidate = name;
          }
        });
        setLeader(leadingCandidate);
      } catch (err) {
        console.error("Audit Fetch Failure:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditData();
    return () => clearInterval(timer);
  }, [id]);

  const deadline = election?.endAt ? new Date(election.endAt) : null;
  const isExpired = deadline ? now > deadline : false;
  const isStopped = election?.status === "stopped" || isExpired;
  
  // Check role from LocalStorage
  const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isCreatorOrAdmin = election?.creatorId === savedUser.id || savedUser.role === "Admin";

  // 🚀 EXCEL GENERATOR
  const downloadExcelReport = () => {
    try {
      const rows = [["VOTER RECEIPT HASH", "TIME OF VOTE", "CANDIDATE NAME"]];

      Object.entries(tally).forEach(([candidate, votes]) => {
        votes.forEach(v => {
          rows.push([v.hash, v.time, candidate]);
        });
      });

      rows.push([], ["--- FINAL SUMMARY TALLY ---"], ["CANDIDATE NAME", "TOTAL VOTES RECEIVED"]);
      Object.entries(tally).forEach(([name, votes]) => {
        rows.push([name, votes.length]);
      });

      const worksheet = XLSX.utils.aoa_to_sheet(rows);
      worksheet['!cols'] = [{ wch: 25 }, { wch: 25 }, { wch: 25 }];
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Audit Report");
      XLSX.writeFile(workbook, `${election.title}_Audit_Log.xlsx`);

      setModal({ open: true, title: "Export Complete", message: "Institutional audit log downloaded.", type: "success" });
    } catch (err) {
      setModal({ open: true, title: "Export Failed", message: "Spreadsheet generation error.", type: "error" });
    }
  };

  const stopElection = async () => {
    if (window.confirm("Manually terminate this election cycle?")) {
      try {
        await API.patch(`/elections/${id}/stop`);
        setElection(prev => ({ ...prev, status: "stopped" }));
        setModal({ open: true, title: "Cycle Stopped", message: "Voting is now permanently disabled.", type: "success" });
      } catch (err) {
        setModal({ open: true, title: "Error", message: "Failed to update database.", type: "error" });
      }
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center opacity-20 font-black uppercase text-xs tracking-widest italic">Compiling Audit...</div>;

  return (
    <div className="max-w-xl mx-auto mt-6 p-6 md:p-8 glass rounded-[2.5rem] shadow-2xl border border-white/10 mb-20 animate-in fade-in transition-all">
      
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-2xl font-black tracking-tight dark:text-white italic uppercase leading-none">{election?.title}</h1>
          <div className="flex items-center gap-2 mt-2 opacity-50 uppercase text-[9px] font-black tracking-widest">
             <span className={isStopped ? "text-red-500" : "text-green-500"}>{isStopped ? "Finalized" : "Live Counting"}</span>
             <span className="dark:text-white">• Cryptographic Audit</span>
          </div>
        </div>
        <button onClick={() => navigate("/dashboard")} className="opacity-20 hover:opacity-100 transition-opacity dark:text-white">
           <XCircle size={24} />
        </button>
      </div>

      {leader && (
        <div className={`mb-8 p-6 rounded-[2rem] text-white shadow-2xl flex items-center gap-6 transition-all duration-500 ${isStopped ? 'bg-slate-900 border border-emerald-500/30' : 'bg-blue-600 shadow-blue-500/20'}`}>
          <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md">
            {isStopped ? <CheckCircle size={32} /> : <Trophy size={32} />}
          </div>
          <div>
            <p className="text-[9px] uppercase font-black tracking-widest opacity-60">Status: Result Winner</p>
            <h2 className="text-3xl font-black italic tracking-tight">{leader}</h2>
            <p className="text-[10px] font-bold opacity-40 uppercase tracking-tighter">{tally[leader]?.length} Verified Ballots</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-widest opacity-30 px-2 dark:text-white italic">Registry Statistics</h3>
        {Object.entries(tally).map(([name, votes]) => (
          <div key={name} className="glass rounded-2xl overflow-hidden border border-white/5 transition-all">
            <div 
              onClick={() => isCreatorOrAdmin && setExpanded(expanded === name ? null : name)} 
              className={`p-5 flex justify-between items-center ${isCreatorOrAdmin ? 'cursor-pointer hover:bg-black/5 dark:hover:bg-white/5' : ''}`}
            >
              <div>
                <span className="block text-xl font-bold italic dark:text-white">{name}</span>
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{votes.length} Total Tally</span>
              </div>
              {isCreatorOrAdmin && (
                <div className="opacity-30 dark:text-white">
                   {expanded === name ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              )}
            </div>

            {isCreatorOrAdmin && expanded === name && (
              <div className="px-5 pb-5 pt-2 bg-black/5 dark:bg-white/5 border-t border-white/5">
                <div className="grid grid-cols-1 gap-1.5 pt-3">
                  {votes.length > 0 ? votes.map((v, i) => (
                    <div key={i} className="text-[9px] font-mono p-2 bg-white dark:bg-slate-900 rounded-lg flex justify-between items-center border border-black/5 dark:border-white/5 shadow-inner">
                      <span className="opacity-60 dark:text-white italic tracking-tighter truncate pr-4">{v.hash}</span>
                      <span className="opacity-30 text-[8px] uppercase whitespace-nowrap">{v.time}</span>
                    </div>
                  )) : <p className="text-[10px] opacity-20 py-2 italic text-center uppercase tracking-widest">No entries yet</p>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {isCreatorOrAdmin && (
        <div className="mt-10 flex flex-col gap-3">
          <button onClick={downloadExcelReport} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2">
            <FileSpreadsheet size={16} /> Download Full Audit Report (.xlsx)
          </button>
          
          {!isStopped && (
            <button onClick={stopElection} className="w-full bg-red-600/10 text-red-500 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-red-500/20 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
                <Ban size={16} /> Force System Lock
            </button>
          )}
        </div>
      )}

      <CustomModal 
        isOpen={modal.open} onClose={() => setModal({ ...modal, open: false })} 
        title={modal.title} message={modal.message} type={modal.type} 
      />
    </div>
  );
}
