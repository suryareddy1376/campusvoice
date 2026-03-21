import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useComplaints } from '../hooks/useComplaints';
import StatusBadge from '../components/StatusBadge';
import SentimentBadge from '../components/SentimentBadge';
import { truncateText, getShortId, formatTimeAgo } from '../utils/formatters';
import Navbar from '../components/Navbar';
import CountdownTimer from '../components/CountdownTimer';
import { motion, AnimatePresence } from 'framer-motion';

const priorityStyles = {
  High: 'bg-red-600/80 text-white',
  Medium: 'bg-amber-600/80 text-white',
  Low: 'bg-slate-600/80 text-white',
};

const getEscalationBadge = (level, department) => {
  if (department === 'Emergency') {
    return <span className="text-xs rounded-full px-2 py-0.5 bg-red-600 font-bold text-white animate-pulse">EMERGENCY</span>;
  }
  if (level === 3) return <span className="text-xs rounded-full px-2 py-0.5 bg-red-900/80 text-white border border-red-500/30">Chairman Level</span>;
  if (level === 2) return <span className="text-xs rounded-full px-2 py-0.5 bg-amber-900/80 text-white border border-amber-500/30">HOD Level</span>;
  return <span className="text-xs rounded-full px-2 py-0.5 bg-slate-700 text-slate-300">Department</span>;
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { complaints, loading, fetchComplaints } = useComplaints();
  const navigate = useNavigate();

  const [filterStatus, setFilterStatus] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterLevel, setFilterLevel] = useState('');

  // Level 1 staff only see their department. Level 2 (HOD), 3 (Chairman), and super_admin see dropdown
  const showDepartmentFilter = user?.role === 'super_admin' || user?.level === 2 || user?.level === 3;

  useEffect(() => {
    fetchComplaints({
      status: filterStatus || undefined,
      department: filterDepartment || undefined,
      priority: filterPriority || undefined,
      escalation_level: filterLevel || undefined,
    });
  }, [filterStatus, filterDepartment, filterPriority, filterLevel, fetchComplaints]);

  return (
    <div className="relative z-10">
      <Navbar 
        title="Admin Systems"
        subtitle="Command Center"
        links={[
          ...(user?.role === 'super_admin' ? [{ to: '/manage-admins', label: 'Security & Access', className: 'text-amber-400' }] : []),
          { to: '/analytics', label: 'Predictions', className: 'text-neonPurple block' },
          { to: '/transparency', label: 'Public Audit', className: 'text-slate-400' }
        ]}
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 mb-6 !bg-white/5 border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-neonBlue font-medium tracking-wide uppercase">Live Filters:</span>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 text-sm text-white bg-slate-900/50 border border-white/10 rounded-xl focus:border-neonPurple focus:ring-1 focus:ring-neonPurple transition-all outline-none"
            >
              <option value="">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Assigned">Assigned</option>
              <option value="In_Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Escalated_To_HOD">Escalated: HOD</option>
              <option value="Escalated_To_Chairman">Escalated: Chairman</option>
            </select>

            {showDepartmentFilter && (
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-4 py-2 text-sm text-white bg-slate-900/50 border border-white/10 rounded-xl focus:border-neonPurple focus:ring-1 focus:ring-neonPurple transition-all outline-none"
              >
                <option value="">All Sectors</option>
                <option value="Emergency">🚨 EMERGENCY</option>
                <option value="Hostel">Hostel & Accommodation</option>
                <option value="Academic">Academic & Faculty</option>
                <option value="Infrastructure">Infrastructure & Maintenance</option>
                <option value="IT">IT & Technology</option>
                <option value="Cafeteria">Cafeteria & Mess</option>
                <option value="Sports">Sports & Extracurricular</option>
                <option value="Finance">Finance & Accounts</option>
                <option value="Security">Security & Transport</option>
              </select>
            )}

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 text-sm text-white bg-slate-900/50 border border-white/10 rounded-xl focus:border-neonPurple focus:ring-1 focus:ring-neonPurple transition-all outline-none"
            >
              <option value="">All Priorities</option>
              <option value="High">Priority: High</option>
              <option value="Medium">Priority: Medium</option>
              <option value="Low">Priority: Low</option>
            </select>
            
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-4 py-2 text-sm text-white bg-slate-900/50 border border-white/10 rounded-xl focus:border-neonPurple focus:ring-1 focus:ring-neonPurple transition-all outline-none"
            >
              <option value="">All Tiers</option>
              <option value="1">Tier 1 (Dept)</option>
              <option value="2">Tier 2 (HOD)</option>
              <option value="3">Tier 3 (Super)</option>
            </select>

            {(filterStatus || filterDepartment || filterPriority || filterLevel) && (
              <button
                onClick={() => { setFilterStatus(''); setFilterDepartment(''); setFilterPriority(''); setFilterLevel(''); }}
                className="text-xs text-slate-400 hover:text-white transition-colors ml-auto"
              >
                Clear filters
              </button>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card overflow-hidden !bg-slate-900/60 border border-white/5 backdrop-blur-2xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3 uppercase tracking-wider">ID</th>
                  <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3 uppercase tracking-wider">Complaint</th>
                  <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3 uppercase tracking-wider">Department</th>
                  <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3 uppercase tracking-wider">Escalation</th>
                  <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3 uppercase tracking-wider">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3 uppercase tracking-wider">SLA Deadline</th>
                  <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3 uppercase tracking-wider">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 relative">
                <AnimatePresence>
                  {loading ? (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td colSpan={7} className="text-center py-16">
                        <div className="animate-spin h-8 w-8 border-4 border-neonPurple border-t-transparent border-solid rounded-full mx-auto shadow-[0_0_15px_rgba(139,92,246,0.6)]"></div>
                      </td>
                    </motion.tr>
                  ) : complaints.length === 0 ? (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td colSpan={7} className="text-center py-16 text-slate-500 font-mono">
                        // PLATFORM IDLE: NO MATCHING RECORDS ENCOUNTERED //
                      </td>
                    </motion.tr>
                  ) : (
                    complaints.map((c, i) => (
                      <motion.tr
                        key={c.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => navigate(`/complaint/${c.id}`)}
                        className="hover:bg-white/5 cursor-pointer transition-colors group"
                      >
                        <td className="px-4 py-3 text-xs text-neonBlue font-mono group-hover:text-cyan-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all">#{getShortId(c.id)}</td>
                        <td className="px-4 py-4 text-sm text-slate-200 max-w-xs align-top">
                          <div className="font-semibold text-white tracking-wide">{truncateText(c.text, 60)}</div>
                          <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-neonPurple shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                            {c.student?.name || 'Anonymous User'}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {c.department && <span className="text-xs rounded-full px-2.5 py-1 bg-slate-900/50 text-slate-300 border border-white/10 uppercase tracking-wider shadow-inner">{c.department}</span>}
                        </td>
                        <td className="px-4 py-3">
                          {getEscalationBadge(c.escalation_level, c.department)}
                        </td>
                        <td className="px-4 py-3 flex items-center mt-2.5"><StatusBadge status={c.status} /></td>
                        <td className="px-4 py-3 whitespace-nowrap font-mono tracking-wider">
                          <CountdownTimer 
                            deadlineStr={c.escalation_deadline} 
                            status={c.status} 
                            department={c.department} 
                            createdAt={c.created_at} 
                          />
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 font-mono">{formatTimeAgo(c.created_at)}</td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="mt-4 text-right text-xs text-slate-500">
          {complaints.length} complaint{complaints.length !== 1 ? 's' : ''} total
        </div>
      </main>
    </div>
  );
}
