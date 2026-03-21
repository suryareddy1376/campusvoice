import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useComplaints } from '../hooks/useComplaints';
import StatusBadge from '../components/StatusBadge';
import SentimentBadge from '../components/SentimentBadge';
import CountdownTimer from '../components/CountdownTimer';
import SmartReplyBox from '../components/SmartReplyBox';
import { formatDateTime, getShortId } from '../utils/formatters';
import api from '../utils/api';
import { motion } from 'framer-motion';

const priorityStyles = {
  High: 'bg-red-600/80 text-white',
  Medium: 'bg-amber-600/80 text-white',
  Low: 'bg-slate-600/80 text-white',
};

const categoryStyles = {
  Hostel: 'bg-indigo-900/60 text-indigo-300 border border-indigo-700/50',
  Academic: 'bg-cyan-900/60 text-cyan-300 border border-cyan-700/50',
  Infrastructure: 'bg-orange-900/60 text-orange-300 border border-orange-700/50',
  IT: 'bg-purple-900/60 text-purple-300 border border-purple-700/50',
  Cafeteria: 'bg-rose-900/60 text-rose-300 border border-rose-700/50',
  Sports: 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50',
  Finance: 'bg-yellow-900/60 text-yellow-300 border border-yellow-700/50',
  Security: 'bg-slate-700/60 text-slate-300 border border-slate-600/50',
  Emergency: 'bg-red-900/80 text-red-300 border border-red-500/80 animate-pulse',
};

export default function ComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { complaint, loading, fetchComplaint, updateStatus, sendReply, suggestReply } = useComplaints();
  
  const [newStatus, setNewStatus] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  
  // Escalation Modal overrides
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [escalateTo, setEscalateTo] = useState('HOD');
  const [escalateReason, setEscalateReason] = useState('');
  const [escalating, setEscalating] = useState(false);

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const superAdmin = user?.role === 'super_admin';
  const currentLevel = superAdmin ? 4 : (user?.level || 1);
  const complaintLevel = complaint?.escalation_level || 1;
  
  // Only users who meet or exceed the complaint's escalation level can reply/resolve
  const canRespond = isAdmin && currentLevel >= complaintLevel;

  useEffect(() => {
    fetchComplaint(id);
  }, [id, fetchComplaint]);

  useEffect(() => {
    if (complaint) setNewStatus(complaint.status);
  }, [complaint]);

  const handleStatusUpdate = async () => {
    if (!canRespond) return;
    if (!newStatus || newStatus === complaint.status) return;
    setStatusUpdating(true);
    try {
      await updateStatus(id, newStatus);
      setStatusMsg('Status updated!');
      setTimeout(() => setStatusMsg(''), 3000);
      fetchComplaint(id);
    } catch (err) {
      setStatusMsg('Error: ' + err.message);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleSendReply = async (complaintId, replyText, isAiDrafted) => {
    if (!canRespond) return;
    await sendReply(complaintId, replyText, isAiDrafted);
    fetchComplaint(id);
  };

  const handleManualEscalation = async () => {
    if (!escalateReason.trim()) {
      alert("Please provide a reason for manual escalation.");
      return;
    }
    setEscalating(true);
    try {
      await api.post(`/complaints/${id}/manual-escalate`, {
        reason: escalateReason,
        escalate_to: escalateTo
      });
      setShowEscalateModal(false);
      setEscalateReason('');
      fetchComplaint(id);
    } catch (err) {
      alert('Error escalating: ' + (err.response?.data?.error || err.message));
    } finally {
      setEscalating(false);
    }
  };

  if (loading && !complaint) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-violet-500 border-t-transparent border-solid rounded-full"></div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400">
        Complaint not found
      </div>
    );
  }

  return (
    <div className="relative z-10 pb-12">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-4 z-50 glass-card mx-4 sm:mx-8 mt-4 mb-8 bg-slate-900/60 border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
      >
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all drop-shadow-md"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <span className="text-neonPurple drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]">#</span>
              {getShortId(complaint.id)}
            </h1>
            <p className="text-xs text-slate-400 font-mono">{formatDateTime(complaint.created_at)}</p>
          </div>
          {complaint.status !== 'Resolved' && (
            <div className="ml-auto flex items-center gap-3">
              {complaint.escalation_deadline && (
                <div className="text-right flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-0.5">Deadline</span>
                  <div className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/50 shadow-inner">
                    <CountdownTimer createdAt={complaint.created_at} /> {/* Could switch to deadline-based timer here if we port EscalationTimer over, but this is fine for now */}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.header>

      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-4 relative">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Complaint Text */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 md:p-8 bg-slate-900/60 border-t-4 border-neonPurple/80 shadow-[0_8px_30px_rgba(139,92,246,0.1)] relative overflow-hidden"
            >
              {/* Subtle ambient light */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-neonPurple/10 rounded-full blur-[80px] -z-10" />

              <div className="flex flex-wrap items-center gap-3 mb-6 relative z-10">
                {complaint.department && (
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryStyles[complaint.department] || categoryStyles.Security}`}>
                    {complaint.department === 'Emergency' ? '🚨 EMERGENCY' : complaint.department}
                  </span>
                )}
                {complaint.priority && (
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityStyles[complaint.priority]}`}>
                    {complaint.priority}
                  </span>
                )}
                {complaintLevel > 1 && (
                  <span className="rounded-full px-2.5 py-0.5 text-xs font-bold bg-amber-600/20 text-amber-500 border border-amber-500/50">
                    L{complaintLevel} Escalated
                  </span>
                )}
                <SentimentBadge sentiment={complaint.sentiment} />
                <StatusBadge status={complaint.status} />
                {complaint.is_anonymous && (
                  <span className="text-xs text-slate-400 bg-slate-900 border border-slate-700/50 rounded-full px-2.5 py-1 shadow-inner">🕶️ Anonymous ID</span>
                )}
              </div>

              <p className="text-slate-200 leading-relaxed whitespace-pre-wrap text-[16px] font-medium relative z-10">{complaint.text}</p>

              <div className="mt-8 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-500 font-mono relative z-10">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neonBlue/80 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  INITIATOR: <span className="text-slate-300 font-sans tracking-wide">{complaint.student?.name || 'Anonymous User'}</span>
                </span>
                <span>SYNC: {formatDateTime(complaint.created_at)}</span>
              </div>
            </motion.div>

            {/* Replies */}
            {complaint.replies && complaint.replies.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Communication Thread ({complaint.replies.length})
                </h3>
                {complaint.replies.map((reply, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + (idx * 0.05) }}
                    key={reply.id} 
                    className="glass-card bg-slate-900/40 border border-white/5 p-5 transition-all hover:bg-white/5 hover:border-white/10"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-neonPurple/20 flex items-center justify-center text-xs font-bold text-neonPurple border border-neonPurple/30 shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                        {(reply.admin?.name || 'A')[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold tracking-wide text-white">
                        {reply.admin?.name || 'Administrator'}
                      </span>
                      {reply.is_ai_drafted && (
                         <span className="bg-neonBlue/10 text-neonBlue border border-neonBlue/30 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-[0_0_8px_rgba(59,130,246,0.3)]">
                           <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                           AI Assist
                         </span>
                      )}
                      <span className="text-xs text-slate-500 ml-auto font-mono">{formatDateTime(reply.sent_at)}</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed pl-11">{reply.reply_text}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Smart Reply Box (Admin Only - if permission allows) */}
            {isAdmin && complaint.status !== 'Resolved' ? (
              canRespond ? (
                <SmartReplyBox
                  complaint={complaint}
                  onSuggest={suggestReply}
                  onSend={handleSendReply}
                />
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                  className="glass-card p-5 text-center bg-amber-900/10 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                >
                  <p className="text-amber-400 text-sm font-medium tracking-wide">
                    <span className="block mb-2 text-2xl">🔒</span>
                    Clearance Required. Encrypted for Level {complaintLevel} Authority.
                  </p>
                  <p className="text-slate-500 text-xs mt-2">Current Clearance: Level {currentLevel}</p>
                </motion.div>
              )
            ) : null}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Admin Controls */}
            {isAdmin && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6 relative overflow-hidden bg-slate-900/60 border border-white/10"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-neonPurple/20 blur-[50px] rounded-full"></div>
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  Admin Operations
                </h3>

                <div className="space-y-4">
                  {canRespond ? (
                    <>
                      <div className="relative z-10">
                        <label className="text-xs font-bold tracking-wider uppercase text-neonBlue mb-2 block drop-shadow-sm">System Override: Status</label>
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-neonPurple focus:ring-1 focus:ring-neonPurple transition-all outline-none shadow-inner"
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="Assigned">Assigned (In Review)</option>
                          <option value="In_Progress">In Progress (Active)</option>
                          <option value="Resolved">Resolved (System)</option>
                          <option value="Resolved_On_Ground">Resolved (On Ground)</option>
                          {currentLevel >= 2 && <option value="Escalated_To_HOD">Escalated: HOD (Level 2)</option>}
                          {currentLevel >= 3 && <option value="Escalated_To_Chairman">Escalated: Chairman (Level 3)</option>}
                        </select>
                      </div>

                      <button
                        onClick={handleStatusUpdate}
                        disabled={statusUpdating || newStatus === complaint.status}
                        className="w-full clay-btn-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg shadow-violet-500/20 disabled:opacity-50 transition-all hover:-translate-y-0.5 uppercase tracking-wide"
                      >
                        {statusUpdating ? 'Processing...' : 'Save Status Change'}
                      </button>

                      {statusMsg && (
                        <p className={`text-xs text-center font-medium ${statusMsg.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
                          {statusMsg}
                        </p>
                      )}
                      
                      {/* Manual Escalation Button */}
                      {complaint.status !== 'Resolved' && complaint.escalation_level < 3 && complaint.department !== 'Emergency' && (
                         <button
                           onClick={() => setShowEscalateModal(true)}
                           className="w-full mt-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 transition-all text-center uppercase tracking-wide border border-amber-500/50"
                         >
                           ⚠️ Force Escalate
                         </button>
                      )}
                    </>
                  ) : (
                    <div className="p-3 bg-slate-800/50 border border-slate-700 rounded text-center text-sm text-slate-400">
                      View-only mode. Authority rests with Level {complaintLevel} executives.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Audit Log (The Timeline Spine) */}
            {complaint.audit_logs && complaint.audit_logs.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6 bg-slate-900/60 border border-white/5"
              >
                <h3 className="text-sm font-semibold text-white mb-6 flex items-center gap-2 drop-shadow-md">
                  <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-neonBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </span>
                  Escalation & History
                </h3>
                <div className="space-y-6 relative pl-2">
                  {/* The Background Track for Timeline Spine */}
                  <div className="absolute left-[15px] top-6 bottom-4 w-[2px] bg-slate-800 rounded-full" />

                  {complaint.audit_logs.map((log, i) => {
                    const isEscalation = log.action.includes('Escalat');
                    
                    return (
                    <motion.div 
                      key={log.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + (i * 0.1) }}
                      className="relative pl-8 group"
                    >
                      {/* Timeline Neon Spine Overlay */}
                      {i < complaint.audit_logs.length - 1 && (
                        <div className="absolute left-[5px] top-6 bottom-[-24px] w-[2px] bg-gradient-to-b from-neonPurple/80 via-neonBlue/30 to-transparent transition-all origin-top group-hover:from-neonPurple group-hover:via-neonBlue" />
                      )}
                      
                      {/* Timeline Node */}
                      <div className={`absolute left-[-2px] top-1.5 w-4 h-4 rounded-full flex items-center justify-center transition-all ${isEscalation ? 'bg-amber-900/80 border border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.6)]' : 'bg-slate-900 border border-neonPurple shadow-[0_0_12px_rgba(139,92,246,0.5)] group-hover:scale-125'}`}>
                        <div className={`w-2 h-2 rounded-full ${isEscalation ? 'bg-amber-400 animate-pulse' : 'bg-neonPurple animate-pulse'}`} />
                      </div>

                      {/* Content Card */}
                      <div className={`p-4 rounded-xl transition-all ${isEscalation ? 'bg-amber-500/10 border border-amber-500/30 shadow-[0_4px_20px_rgba(245,158,11,0.1)]' : 'bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10'}`}>
                        <p className={`text-sm font-semibold tracking-wide ${isEscalation ? 'text-amber-400 drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]' : 'text-slate-200'}`}>{log.action}</p>
                        <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest font-bold font-mono">
                          {log.performer?.name || 'System Auto-Processor'} <span className="text-neonPurple px-2">•</span> {formatDateTime(log.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  )})}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
      
      {/* Escalate Modal */}
      {showEscalateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-w-sm w-full p-6 text-left">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-amber-500">⚠️</span> Manual Escalation
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              Bypass SLA timeouts and send immediately to a higher authority.
            </p>
            
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">Escalate Target</label>
            <select
                value={escalateTo}
                onChange={(e) => setEscalateTo(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm mb-4 focus:ring-2 focus:ring-amber-500 outline-none"
            >
                {currentLevel < 2 && <option value="HOD">Department HOD (Level 2)</option>}
                <option value="Chairman">Executive Chairman (Level 3)</option>
            </select>
            
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">Reason for Escalation</label>
            <textarea 
               value={escalateReason}
               onChange={(e) => setEscalateReason(e.target.value)}
               className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm mb-5 min-h-[80px] focus:ring-2 focus:ring-amber-500 outline-none resize-none"
               placeholder="E.g., Requires cross-department budgeting..."
            />
            
            <div className="flex gap-3 justify-end">
               <button 
                  onClick={() => setShowEscalateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                  disabled={escalating}
               >
                  Cancel
               </button>
               <button 
                  onClick={handleManualEscalation}
                  disabled={escalating || !escalateReason.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-orange-500/20 disabled:opacity-50 transition-all"
               >
                  {escalating ? 'Escalating...' : 'Confirm Escalation'}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
