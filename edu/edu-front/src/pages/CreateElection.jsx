import { motion } from 'framer-motion';
import { PlusCircle, ShieldCheck } from 'lucide-react';

const CreateElection = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto backdrop-blur-lg bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-8">
        <ShieldCheck className="text-blue-500 w-10 h-10" />
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Launch Secure Election
        </h1>
      </div>

      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium opacity-70 mb-2">Election Title</label>
          <input type="text" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 focus:ring-2 ring-blue-500 outline-none transition-all" />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium opacity-70 mb-2">Eligibility Category</label>
            <select className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 outline-none">
              <option>General Students</option>
              <option>Class Representatives</option>
              <option>Faculty Members</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium opacity-70 mb-2">Voter Limit</label>
            <input type="number" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 outline-none" />
          </div>
        </div>

        <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] rounded-xl font-bold text-white transition-all transform active:scale-95">
          Create & Generate Secure Link
        </button>
      </form>
    </motion.div>
  );
};
export default CreateElection;