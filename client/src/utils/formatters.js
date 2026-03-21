// Helper to ensure Postgres timestamp without timezone is parsed as UTC
const parseUTC = (dateString) => {
  if (!dateString) return null;
  // If it doesn't already have timezone info, append 'Z' so it parses as UTC
  const hasTimezone = dateString.endsWith('Z') || dateString.includes('+') || dateString.match(/-\d{2}:\d{2}$/);
  const safeStr = hasTimezone ? dateString : `${dateString}Z`;
  return new Date(safeStr);
};

export function formatDate(dateString) {
  if (!dateString) return '—';
  return parseUTC(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString) {
  if (!dateString) return '—';
  return parseUTC(dateString).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTimeAgo(dateString) {
  if (!dateString) return '—';
  const now = new Date();
  const date = parseUTC(dateString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export function truncateText(text, maxLength = 100) {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

export function formatHours(hours) {
  if (hours === null || hours === undefined) return '—';
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  return `${Math.round(hours * 10) / 10} hrs`;
}

export function getShortId(uuid) {
  if (!uuid) return '—';
  return uuid.substring(0, 8).toUpperCase();
}
