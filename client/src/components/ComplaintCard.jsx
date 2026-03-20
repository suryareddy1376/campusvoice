import StatusBadge from './StatusBadge';
import SentimentBadge from './SentimentBadge';
import CountdownTimer from './CountdownTimer';
import { truncateText, formatTimeAgo, getShortId } from '../utils/formatters';

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

export default function ComplaintCard({ complaint, onClick }) {
  return (
    <div
      onClick={() => onClick?.(complaint)}
      className="clay-card p-4 cursor-pointer hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all duration-300 fade-in group"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs text-slate-500 font-mono">#{getShortId(complaint.id)}</span>
        {complaint.status !== 'Resolved' && (
          <CountdownTimer createdAt={complaint.created_at} />
        )}
      </div>

      <p className="text-sm text-slate-200 mb-3 leading-relaxed group-hover:text-white transition-colors">
        {truncateText(complaint.text, 120)}
      </p>

      <div className="flex flex-wrap items-center gap-2">
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
        {complaint.sentiment && <SentimentBadge sentiment={complaint.sentiment} />}
        <StatusBadge status={complaint.status} />
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/50">
        <span className="text-xs text-slate-500">
          {complaint.student?.name || (complaint.is_anonymous ? 'Anonymous' : 'Student')}
        </span>
        <span className="text-xs text-slate-500">{formatTimeAgo(complaint.created_at)}</span>
      </div>
    </div>
  );
}
