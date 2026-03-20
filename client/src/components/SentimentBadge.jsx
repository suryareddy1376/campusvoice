export default function SentimentBadge({ sentiment }) {
  const styles = {
    Angry: 'bg-red-900/60 text-red-300 border border-red-700/50',
    Neutral: 'bg-yellow-900/60 text-yellow-300 border border-yellow-700/50',
    Calm: 'bg-green-900/60 text-green-300 border border-green-700/50',
  };

  const icons = {
    Angry: '😠',
    Neutral: '😐',
    Calm: '😊',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[sentiment] || styles.Neutral}`}>
      <span>{icons[sentiment] || '😐'}</span>
      {sentiment}
    </span>
  );
}
