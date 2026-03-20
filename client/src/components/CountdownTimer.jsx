import { useState, useEffect } from 'react';

export default function CountdownTimer({ createdAt, slaHours = 24 }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculate = () => {
      const deadline = new Date(new Date(createdAt).getTime() + slaHours * 60 * 60 * 1000);
      const now = new Date();
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeLeft('SLA Breached');
        setIsUrgent(true);
        setIsExpired(true);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setIsUrgent(hours < 2);
      setIsExpired(false);

      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m left`);
      } else {
        setTimeLeft(`${minutes}m left`);
      }
    };

    calculate();
    const interval = setInterval(calculate, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [createdAt, slaHours]);

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-mono font-medium ${
        isExpired
          ? 'text-red-400 animate-pulse'
          : isUrgent
          ? 'text-red-400'
          : 'text-slate-400'
      }`}
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {timeLeft}
    </span>
  );
}
