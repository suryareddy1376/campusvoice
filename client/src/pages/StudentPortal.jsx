import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useComplaints } from '../hooks/useComplaints';
import ComplaintCard from '../components/ComplaintCard';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentPortal() {
  const { user, logout } = useAuth();
  const { complaints, loading, error, fetchComplaints, submitComplaint } = useComplaints();
  const navigate = useNavigate();

  const [text, setText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  // Initialize SpeechRecognition
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition. Please use Chrome or Edge.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    // Let the browser auto-detect the spoken language (Hindi, Telugu, broken English)
    recognition.lang = window.navigator.language || 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText((prev) => prev ? prev + ' ' + transcript : transcript);
    };
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitComplaint(text, isAnonymous, imageFile);
      setText('');
      setIsAnonymous(false);
      setImageFile(null);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative z-10 pb-20 sm:pb-0">
      <Navbar
        title="CampusVoice"
        subtitle="Student Portal"
        links={[
          { to: '/transparency', label: 'Public Board', className: 'text-slate-400 hover:text-white transition-colors' },
        ]}
      />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Submit Complaint */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 mb-8 bg-slate-900/60 border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] relative overflow-hidden"
        >
          {/* Subtle ambient light behind form */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-neonPurple/10 rounded-full blur-[80px] -z-10" />

          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 drop-shadow-md">
            <span className="w-8 h-8 rounded-full bg-neonPurple/20 flex items-center justify-center border border-neonPurple/40">
              <svg className="w-4 h-4 text-neonPurple drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Submit an Incident
          </h2>

          <form onSubmit={handleSubmit} className="relative z-10">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Describe the incident in detail. The ChronoVerse AI evaluates and prioritizes anomalies automatically..."
              rows={4}
              required
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 resize-none text-sm focus:border-neonPurple focus:ring-1 focus:ring-neonPurple transition-all outline-none"
            />

            <div className="flex items-center gap-3 mt-3">
              <button
                type="button"
                onClick={startListening}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                  isListening
                    ? 'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse'
                    : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20'
                }`}
              >
                {isListening ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                    Listening (Speak Now)...
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    Dictate Grievance (Multi-language)
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {imageFile ? imageFile.name : 'Attach Image Evidence'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                </label>
                {imageFile && (
                  <button 
                    type="button" 
                    onClick={() => setImageFile(null)}
                    className="text-slate-500 hover:text-red-400"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              {/* Anonymous Toggle */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-11 h-6 rounded-full transition-all duration-300 ${isAnonymous ? 'bg-violet-600' : 'bg-slate-700'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${isAnonymous ? 'translate-x-5' : ''}`} />
                  </div>
                </div>
                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  Submit Anonymously
                </span>
              </label>

              <button
                type="submit"
                disabled={submitting || !text.trim()}
                className="bg-neonPurple/20 hover:bg-neonPurple/40 border border-neonPurple/50 text-neonPurple hover:text-white px-6 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(139,92,246,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing Anomaly...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Log Incident
                  </>
                )}
              </button>
            </div>
          </form>

          <AnimatePresence>
            {submitSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 bg-emerald-900/20 border border-emerald-500/30 text-emerald-300 text-sm rounded-xl px-4 py-3 flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
              >
                <svg className="w-4 h-4 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Incident verified and synchronized. ChronoVerse Analytics online.
              </motion.div>
            )}

            {submitError && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 bg-red-900/20 border border-red-500/30 text-red-300 text-sm rounded-xl px-4 py-3 shadow-[0_0_15px_rgba(220,38,38,0.1)]"
              >
                {submitError}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* My Complaints */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 drop-shadow-md">
            <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <svg className="w-4 h-4 text-neonBlue drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </span>
            Personal Time-Stream
            <span className="text-xs text-slate-500 font-mono ml-2 block pt-1">({complaints.length} RECORDS)</span>
          </h2>

          {loading && !complaints.length ? (
            <div className="flex justify-center py-20">
              <svg className="animate-spin h-8 w-8 text-neonPurple drop-shadow-[0_0_15px_rgba(139,92,246,0.6)]" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : complaints.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center py-20 text-slate-500 glass-card bg-white/5 border border-white/5"
            >
              <svg className="w-16 h-16 mx-auto mb-4 text-slate-600 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-lg font-medium text-slate-400">Stream Empty</p>
              <p className="text-sm mt-1 text-slate-500">Log your first incident array above</p>
            </motion.div>
          ) : (
            <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {complaints.map((c) => (
                  <ComplaintCard
                    key={c.id}
                    complaint={c}
                    onClick={() => navigate(`/complaint/${c.id}`)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
