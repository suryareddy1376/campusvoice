import { useState, useEffect } from 'react';

export default function CountdownTimer({ deadlineStr, status, department, createdAt }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [colorClass, setColorClass] = useState('text-slate-400');

  useEffect(() => {
    // If we only have createdAt and no deadlineStr (legacy usage), we could fallback, but 
    // all complaints now have escalation_deadline. Wait, let's keep a fallback just in case.
    const actualDeadline = deadlineStr || (createdAt ? new Date(new Date(createdAt).getTime() + 24 * 60 * 60 * 1000).toISOString() : null);

    if (status === 'Resolved' || status === 'Resolved_On_Ground') {
      setTimeLeft('Resolved');
      setColorClass('text-green-400');
      return;
    }

    if (!actualDeadline && status === 'Escalated_To_Chairman') {
      setTimeLeft('Max Escalation');
      setColorClass('text-red-400 animate-pulse');
      return;
    }

    if (!actualDeadline) {
      setTimeLeft('No deadline');
      return;
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      
      // Fix UTC parsing for Indian IST timezone
      const hasTimezone = actualDeadline.endsWith('Z') || actualDeadline.includes('+');
      const safeDeadlineStr = hasTimezone ? actualDeadline : `${actualDeadline}Z`;
      
      const deadline = new Date(safeDeadlineStr).getTime();
      const difference = deadline - now;

      if (difference <= 0) {
        setTimeLeft('SLA Breached');
        setColorClass('text-red-500 font-bold animate-pulse');
        clearInterval(interval);
      } else {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        
        setTimeLeft(hours > 0 ? `${hours}h ${minutes}m left` : `${minutes}m left`);
        
        if (department === 'Emergency' && hours < 1) {
          setColorClass('text-red-500 font-bold animate-pulse');
        } else if (hours < 6) {
          setColorClass('text-red-400');
        } else if (hours < 24) {
          setColorClass('text-amber-400 opacity-90');
        } else {
          setColorClass('text-slate-400 opacity-80');
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [deadlineStr, status, department, createdAt]);

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-mono tracking-wide ${colorClass}`}>
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {timeLeft === 'Resolved' ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        ) : timeLeft === 'SLA Breached' || timeLeft === 'Overdue' ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        )}
      </svg>
      {timeLeft}
    </span>
  );
}
