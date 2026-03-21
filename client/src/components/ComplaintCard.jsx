import { motion } from 'framer-motion';
import StatusBadge from './StatusBadge';
import SentimentBadge from './SentimentBadge';
import CountdownTimer from './CountdownTimer';
import { truncateText, formatTimeAgo, getShortId } from '../utils/formatters';

const priorityStyles = {
  High: 'bg-red-600/80 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]',
  Medium: 'bg-amber-600/80 text-white shadow-[0_0_10px_rgba(217,119,6,0.5)]',
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
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => onClick?.(complaint)}
      className="glass-card p-5 cursor-pointer bg-slate-900/40 border border-white/5 hover:border-white/20 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs text-neonBlue font-mono tracking-wider drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">#{getShortId(complaint.id)}</span>
        {complaint.status !== 'Resolved' && (
          <CountdownTimer createdAt={complaint.created_at} />
        )}
      </div>

      <p className="text-sm text-slate-300 mb-4 leading-relaxed group-hover:text-white transition-colors duration-300 min-h-[40px]">
        {truncateText(complaint.text, 120)}
      </p>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {complaint.category && (
           <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide uppercase ${categoryStyles[complaint.category]}`}>
            {complaint.category}
          </span>
        )}
        {complaint.priority && (
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide uppercase ${priorityStyles[complaint.priority]}`}>
            {complaint.priority}
          </span>
        )}
        {complaint.sentiment && <SentimentBadge sentiment={complaint.sentiment} />}
        <StatusBadge status={complaint.status} />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/10 group-hover:border-white/20 transition-colors">
        <span className="text-xs text-slate-400 font-medium">
          {complaint.student?.name || (complaint.is_anonymous ? 'Anonymous User' : 'Student')}
        </span>
        <span className="text-xs text-slate-500 font-mono">{formatTimeAgo(complaint.created_at)}</span>
      </div>
    </motion.div>
  );
}
