import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useComplaints } from '../hooks/useComplaints';
import StatusBadge from '../components/StatusBadge';
import SentimentBadge from '../components/SentimentBadge';
import CountdownTimer from '../components/CountdownTimer';
import SmartReplyBox from '../components/SmartReplyBox';
import { formatDateTime, getShortId } from '../utils/formatters';

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
};

export default function ComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { complaint, loading, fetchComplaint, updateStatus, sendReply, suggestReply } = useComplaints();
  const [newStatus, setNewStatus] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  useEffect(() => {
    fetchComplaint(id);
  }, [id, fetchComplaint]);

  useEffect(() => {
    if (complaint) setNewStatus(complaint.status);
  }, [complaint]);

  const handleStatusUpdate = async () => {
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
    await sendReply(complaintId, replyText, isAiDrafted);
    fetchComplaint(id);
  };

  if (loading && !complaint) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-violet-500" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
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
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 clay-badge border-b border-white/5 mx-4 mt-4 mb-8">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold text-white">Complaint #{getShortId(complaint.id)}</h1>
            <p className="text-xs text-slate-400">{formatDateTime(complaint.created_at)}</p>
          </div>
          {complaint.status !== 'Resolved' && (
            <div className="ml-auto">
              <CountdownTimer createdAt={complaint.created_at} />
            </div>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Complaint Text */}
            <div className="clay-card p-6">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {complaint.category && (
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryStyles[complaint.category]}`}>
                    {complaint.category}
                  </span>
                )}
                {complaint.priority && (
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityStyles[complaint.priority]}`}>
                    {complaint.priority}
                  </span>
                )}
                <SentimentBadge sentiment={complaint.sentiment} />
                <StatusBadge status={complaint.status} />
                {complaint.is_anonymous && (
                  <span className="text-xs text-slate-500 bg-slate-700/50 rounded-full px-2 py-0.5">🕶️ Anonymous</span>
                )}
              </div>

              <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{complaint.text}</p>

              <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-500">
                <span>By: {complaint.student?.name || 'Anonymous'}</span>
                <span>{formatDateTime(complaint.created_at)}</span>
              </div>
            </div>

            {/* Replies */}
            {complaint.replies && complaint.replies.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  Replies ({complaint.replies.length})
                </h3>
                {complaint.replies.map((reply) => (
                  <div key={reply.id} className="clay-card p-4 fade-in">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-violet-400">
                        {reply.admin?.name || 'Admin'}
                      </span>
                      {reply.is_ai_drafted && (
                        <span className="bg-purple-900/60 text-purple-300 border border-purple-700/50 rounded-full px-2 py-0.5 text-xs font-medium flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          AI Drafted
                        </span>
                      )}
                      <span className="text-xs text-slate-500 ml-auto">{formatDateTime(reply.sent_at)}</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{reply.reply_text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Smart Reply Box (Admin Only) */}
            {isAdmin && complaint.status !== 'Resolved' && (
              <SmartReplyBox
                complaint={complaint}
                onSuggest={suggestReply}
                onSend={handleSendReply}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Admin Controls */}
            {isAdmin && (
              <div className="clay-card p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Admin Controls</h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Update Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full clay-input px-3 py-2 text-sm text-white"
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="Assigned">Assigned</option>
                      <option value="In_Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>

                  <button
                    onClick={handleStatusUpdate}
                    disabled={statusUpdating || newStatus === complaint.status}
                    className="w-full clay-btn-primary text-white px-4 py-2 text-sm font-medium transition-all"
                  >
                    {statusUpdating ? 'Updating...' : 'Save Status'}
                  </button>

                  {statusMsg && (
                    <p className={`text-xs ${statusMsg.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
                      {statusMsg}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Audit Log */}
            {complaint.audit_logs && complaint.audit_logs.length > 0 && (
              <div className="clay-card p-5">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Audit Log
                </h3>
                <div className="space-y-3">
                  {complaint.audit_logs.map((log, i) => (
                    <div key={log.id} className="relative pl-6">
                      {/* Timeline line */}
                      {i < complaint.audit_logs.length - 1 && (
                        <div className="absolute left-[7px] top-5 bottom-0 w-px bg-slate-700" />
                      )}
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-300 font-medium">{log.action}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {log.performer?.name || 'System'} · {formatDateTime(log.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
