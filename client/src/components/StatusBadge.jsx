export default function StatusBadge({ status }) {
  const styles = {
    Submitted: 'bg-blue-900/60 text-blue-300 border border-blue-700/50',
    Assigned: 'bg-purple-900/60 text-purple-300 border border-purple-700/50',
    In_Progress: 'bg-amber-900/60 text-amber-300 border border-amber-700/50',
    Resolved: 'bg-green-900/60 text-green-300 border border-green-700/50',
  };

  const labels = {
    Submitted: 'Submitted',
    Assigned: 'Assigned',
    In_Progress: 'In Progress',
    Resolved: 'Resolved',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || styles.Submitted}`}>
      <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${status === 'Resolved' ? 'bg-green-400' : status === 'In_Progress' ? 'bg-amber-400' : status === 'Assigned' ? 'bg-purple-400' : 'bg-blue-400'}`} />
      {labels[status] || status}
    </span>
  );
}
