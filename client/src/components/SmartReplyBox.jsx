import { useState } from 'react';

export default function SmartReplyBox({ complaint, onSuggest, onSend }) {
  const [replyText, setReplyText] = useState('');
  const [isAiDrafted, setIsAiDrafted] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSuggest = async () => {
    setGenerating(true);
    setError(null);
    try {
      const draft = await onSuggest(complaint.id);
      setReplyText(draft);
      setIsAiDrafted(true);
    } catch (err) {
      setError(err.message || 'Failed to generate suggestion');
    } finally {
      setGenerating(false);
    }
  };

  const handleSend = async () => {
    if (!replyText.trim()) return;
    setSending(true);
    setError(null);
    try {
      await onSend(complaint.id, replyText, isAiDrafted);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setReplyText('');
      setIsAiDrafted(false);
    } catch (err) {
      setError(err.message || 'Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="clay-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Reply to Complaint
        </h3>
        {isAiDrafted && (
          <span className="inline-flex items-center gap-1 bg-purple-900/60 text-purple-300 border border-purple-700/50 rounded-full px-2.5 py-0.5 text-xs font-medium">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI Drafted
          </span>
        )}
      </div>

      <button
        onClick={handleSuggest}
        disabled={generating}
        className="w-full mb-3 clay-btn-primary !bg-purple-600 hover:!bg-purple-700 disabled:!bg-purple-800 text-white px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-2"
      >
        {generating ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Generating AI Reply...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Suggest Reply with AI
          </>
        )}
      </button>

      <textarea
        value={replyText}
        onChange={(e) => {
          setReplyText(e.target.value);
          if (isAiDrafted && e.target.value !== replyText) {
            // If admin edits the AI draft, it's now a modified draft
          }
        }}
        placeholder="Type your reply here or use AI to generate one..."
        rows={4}
        className="w-full clay-input px-4 py-3 text-sm text-white placeholder-slate-500 resize-none"
      />

      {error && (
        <div className="mt-2 text-xs text-red-400 bg-red-900/30 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-2 text-xs text-green-400 bg-green-900/30 rounded-lg px-3 py-2 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Reply sent successfully!
        </div>
      )}

      <button
        onClick={handleSend}
        disabled={!replyText.trim() || sending}
        className="mt-3 w-full clay-btn-primary !bg-emerald-600 hover:!bg-emerald-700 disabled:!bg-emerald-800 text-white px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-2"
      >
        {sending ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sending...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Send Reply
          </>
        )}
      </button>
    </div>
  );
}
