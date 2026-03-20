import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAnalytics } from '../hooks/useAnalytics';
import MetricCard from '../components/MetricCard';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts';
import { formatHours } from '../utils/formatters';
import Navbar from '../components/Navbar';

export default function Analytics() {
  const { user, logout } = useAuth();
  const { summary, categories, resolutionTime, predictions, loading, loadingPredictions, fetchAll, fetchPredictions } = useAnalytics();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const chartColors = {
    Hostel: '#818cf8',
    Academic: '#22d3ee',
    Infrastructure: '#fb923c',
  };

  const barData = categories.map((c) => ({
    ...c,
    fill: chartColors[c.category] || '#8b5cf6',
  }));

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <Navbar
        title="Analytics"
        subtitle="Grievance performance metrics"
        links={[
          { to: '/admin', label: '🏠 Dashboard', className: 'text-slate-400 hover:text-white transition-colors' },
        ]}
      />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-24">
            <svg className="animate-spin h-10 w-10 text-violet-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : (
          <>
            {/* Metric Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <MetricCard
                title="Total Complaints"
                value={summary?.total || 0}
                icon="📋"
                color="violet"
              />
              <MetricCard
                title="Resolved"
                value={summary?.resolved || 0}
                icon="✅"
                color="green"
              />
              <MetricCard
                title="Pending"
                value={summary?.pending || 0}
                icon="⏳"
                color="amber"
              />
              <MetricCard
                title="Avg Resolution Time"
                value={formatHours(summary?.avgResolutionTime)}
                icon="⚡"
                color="blue"
              />
            </div>

            {/* AI Predictive Insights (Hackathon Wow Feature) */}
            <div className="clay-card p-6 mb-8 border border-violet-500/30 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-transparent pointer-events-none" />
              <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-xl">🔮</span> AI Predictive Insights
                  <span className="bg-violet-600/20 text-violet-300 text-[10px] px-2 py-0.5 rounded border border-violet-500/50 uppercase tracking-wider font-bold animate-pulse">
                    Proactive Mode
                  </span>
                </h3>
                <button
                  onClick={fetchPredictions}
                  disabled={loadingPredictions}
                  className="clay-btn-primary px-4 py-2 text-xs font-medium text-white flex items-center gap-2"
                >
                  {loadingPredictions ? (
                     <>
                      <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Analyzing Quantum Timelines...
                     </>
                  ) : (
                    <>Generate Predictions</>
                  )}
                </button>
              </div>

              <div className="relative z-10 bg-slate-900/50 rounded-lg p-5 border border-slate-700/50 min-h-[100px]">
                 {predictions ? (
                   <div className="text-sm text-slate-300 leading-relaxed space-y-3 whitespace-pre-wrap">
                     {predictions}
                   </div>
                 ) : (
                   <div className="flex flex-col items-center justify-center text-slate-500 py-6">
                     <svg className="w-10 h-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                     </svg>
                     <p>Click generate to identify future failure points and predictive maintenance schedules.</p>
                   </div>
                 )}
              </div>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Bar Chart — Complaints by Category */}
              <div className="clay-card p-6">
                <h3 className="text-sm font-semibold text-white mb-6">Complaints by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                        color: '#f8fafc',
                      }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {barData.map((entry, index) => (
                        <rect key={index} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Line Chart — Resolution Time by Category */}
              <div className="clay-card p-6">
                <h3 className="text-sm font-semibold text-white mb-6">Avg Resolution Time by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={resolutionTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} unit="h" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                        color: '#f8fafc',
                      }}
                      formatter={(value) => [`${value} hrs`, 'Avg Time']}
                    />
                    <Bar dataKey="avgResolutionTime" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
