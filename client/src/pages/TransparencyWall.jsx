import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { formatHours, truncateText } from '../utils/formatters';
import Navbar from '../components/Navbar';

const categoryStyles = {
  Hostel: 'bg-indigo-900/60 text-indigo-300 border border-indigo-700/50',
  Academic: 'bg-cyan-900/60 text-cyan-300 border border-cyan-700/50',
  Infrastructure: 'bg-orange-900/60 text-orange-300 border border-orange-700/50',
};

export default function TransparencyWall() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTransparency();
  }, []);

  const fetchTransparency = async () => {
    try {
      const { data } = await api.get('/transparency');
      setComplaints(data);
    } catch (err) {
      console.error('Failed to fetch transparency data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = complaints.filter((c) => {
    if (filterCategory && c.category !== filterCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.text?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q) ||
        c.reply?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar
        title="Transparency Wall"
        subtitle="See how grievances are handled"
        links={[
          { to: '/login', label: '← Back to Login', className: 'text-violet-400 hover:text-violet-300 transition-colors' },
        ]}
      />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resolved complaints..."
              className="w-full clay-input px-4 py-3 text-sm text-white placeholder-slate-500"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="clay-input px-4 py-3 text-sm text-white"
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
        </div>

        {/* Results count */}
        <p className="text-xs text-slate-500 mb-4">{filtered.length} resolved complaints</p>

        {loading ? (
          <div className="flex justify-center py-24">
            <svg className="animate-spin h-10 w-10 text-violet-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-slate-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-medium">No resolved complaints found</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <div
                key={c.id}
                className="clay-card p-5 transition-all duration-300 hover:border-green-600/30 hover:-translate-y-1 fade-in"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryStyles[c.category] || 'bg-slate-700 text-slate-300'}`}>
                    {c.category}
                  </span>
                  <span className="text-xs text-green-400 font-medium flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Resolved
                  </span>
                </div>

                <p className="text-sm text-slate-200 mb-3 leading-relaxed">
                  {truncateText(c.text, 150)}
                </p>

                {c.reply && (
                  <div className="bg-slate-900/60 rounded-lg p-3 mb-3 border border-slate-700/30">
                    <p className="text-xs text-slate-500 mb-1 font-medium">Admin Response</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {truncateText(c.reply, 120)}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-700/30">
                  <span>⏱️ Resolved in {formatHours(c.time_to_resolve)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
