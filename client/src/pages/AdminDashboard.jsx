import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useComplaints } from '../hooks/useComplaints';
import StatusBadge from '../components/StatusBadge';
import SentimentBadge from '../components/SentimentBadge';
import CountdownTimer from '../components/CountdownTimer';
import { truncateText, getShortId, formatTimeAgo } from '../utils/formatters';
import Navbar from '../components/Navbar';

const priorityStyles = {
  High: 'bg-red-600/80 text-white',
  Medium: 'bg-amber-600/80 text-white',
  Low: 'bg-slate-600/80 text-white',
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { complaints, loading, fetchComplaints } = useComplaints();
  const navigate = useNavigate();

  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  useEffect(() => {
    fetchComplaints({
      status: filterStatus || undefined,
      category: filterCategory || undefined,
      priority: filterPriority || undefined,
    });
  }, [filterStatus, filterCategory, filterPriority, fetchComplaints]);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <Navbar 
        title="CampusVoice"
        subtitle="Admin Dashboard"
        links={[
          ...(user?.role === 'super_admin' ? [{ to: '/manage-admins', label: '👑 Manage Admins', className: 'text-amber-400' }] : []),
          { to: '/analytics', label: '📊 Analytics', className: 'text-violet-400' },
          { to: '/transparency', label: '🌐 Transparency', className: 'text-slate-400' }
        ]}
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter Bar */}
        <div className="clay-card p-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-slate-400 font-medium">Filters:</span>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="clay-input px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            >
              <option value="">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Assigned">Assigned</option>
              <option value="In_Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="clay-input px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            >
              <option value="">All Categories</option>
              <option value="Hostel">Hostel & Accommodation</option>
              <option value="Academic">Academic & Faculty</option>
              <option value="Infrastructure">Infrastructure & Maintenance</option>
              <option value="IT">IT & Technology</option>
              <option value="Cafeteria">Cafeteria & Mess</option>
              <option value="Sports">Sports & Extracurricular</option>
              <option value="Finance">Finance & Accounts</option>
              <option value="Security">Security & Transport</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="clay-input px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {(filterStatus || filterCategory || filterPriority) && (
              <button
                onClick={() => { setFilterStatus(''); setFilterCategory(''); setFilterPriority(''); }}
                className="text-xs text-slate-400 hover:text-white transition-colors ml-auto"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Complaints Table */}
        <div className="clay-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3 uppercase tracking-wider">ID</th>
                  <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3 uppercase tracking-wider">Complaint</th>
                  <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3 uppercase tracking-wider">Category</th>
                  <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3 uppercase tracking-wider">Priority</th>
                  <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3 uppercase tracking-wider">Sentiment</th>
                  <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3 uppercase tracking-wider">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3 uppercase tracking-wider">SLA</th>
                  <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3 uppercase tracking-wider">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16">
                      <svg className="animate-spin h-8 w-8 text-violet-500 mx-auto" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </td>
                  </tr>
                ) : complaints.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-slate-500">
                      No complaints match the current filters
                    </td>
                  </tr>
                ) : (
                  complaints.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => navigate(`/complaint/${c.id}`)}
                      className="border-b border-slate-700/30 hover:bg-slate-700/30 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 text-xs text-slate-400 font-mono">#{getShortId(c.id)}</td>
                      <td className="px-4 py-3 text-sm text-slate-200 max-w-xs">
                        <div>{truncateText(c.text, 60)}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {c.student?.name || 'Anonymous'}
                        </div>
                      </td>
                      <td className="px-4 py-3">{c.category && <span className="text-xs rounded-full px-2 py-0.5 bg-slate-700 text-slate-300">{c.category}</span>}</td>
                      <td className="px-4 py-3">{c.priority && <span className={`text-xs rounded-full px-2.5 py-0.5 font-medium ${priorityStyles[c.priority]}`}>{c.priority}</span>}</td>
                      <td className="px-4 py-3"><SentimentBadge sentiment={c.sentiment} /></td>
                      <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                      <td className="px-4 py-3">
                        {c.status !== 'Resolved' ? (
                          <CountdownTimer createdAt={c.created_at} />
                        ) : (
                          <span className="text-xs text-green-400">✓ Done</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">{formatTimeAgo(c.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-right text-xs text-slate-500">
          {complaints.length} complaint{complaints.length !== 1 ? 's' : ''} total
        </div>
      </main>
    </div>
  );
}
