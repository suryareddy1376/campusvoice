export default function MetricCard({ title, value, subtitle, icon, color = 'violet' }) {
  const colorMap = {
    violet: 'from-violet-600/20 to-violet-900/20 border-violet-700/30',
    green: 'from-green-600/20 to-green-900/20 border-green-700/30',
    amber: 'from-amber-600/20 to-amber-900/20 border-amber-700/30',
    blue: 'from-blue-600/20 to-blue-900/20 border-blue-700/30',
  };

  const iconColorMap = {
    violet: 'text-violet-400',
    green: 'text-green-400',
    amber: 'text-amber-400',
    blue: 'text-blue-400',
  };

  return (
    <div className={`clay-card bg-gradient-to-br ${colorMap[color]} p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1 text-white">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={`text-2xl ${iconColorMap[color]}`}>{icon}</div>
        )}
      </div>
    </div>
  );
}
