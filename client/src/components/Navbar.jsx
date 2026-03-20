import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative w-10 h-5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${
        isDark ? 'bg-violet-600/30 border border-violet-500/40' : 'bg-amber-100 border border-amber-300'
      } ${className}`}
      aria-label="Toggle theme"
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 ${
        isDark
          ? 'left-0.5 bg-slate-700 text-violet-300'
          : 'left-[22px] bg-white text-amber-500'
      }`}>
        {isDark ? (
          /* Moon icon */
          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        ) : (
          /* Sun icon */
          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a1 1 0 011 1v1a1 1 0 01-2 0V3a1 1 0 011-1zM4.22 4.22a1 1 0 011.42 0l.7.7a1 1 0 01-1.42 1.41l-.7-.7a1 1 0 010-1.41zM2 12a1 1 0 011-1h1a1 1 0 010 2H3a1 1 0 01-1-1zm17 0a1 1 0 011-1h1a1 1 0 010 2h-1a1 1 0 01-1-1zM4.92 18.36l.7-.7a1 1 0 011.42 1.41l-.7.7a1 1 0 01-1.42-1.41zm12.02-.7l.7.7a1 1 0 001.42-1.41l-.7-.7a1 1 0 00-1.42 1.41zM12 20a1 1 0 011 1v1a1 1 0 01-2 0v-1a1 1 0 011-1zm0-15a7 7 0 100 14A7 7 0 0012 5z" />
          </svg>
        )}
      </span>
    </button>
  );
}

export default function Navbar({ title = 'CampusVoice', subtitle, links = [] }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 clay-badge border-b border-white/5 mx-4 mt-4 mb-8 relative">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-violet-600/20 rounded-xl flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-white truncate">{title}</h1>
            {subtitle && <p className="text-xs text-slate-400 truncate">{subtitle}</p>}
          </div>
        </div>

        {/* Desktop: Nav links + theme toggle + user/auth */}
        <div className="hidden sm:flex items-center gap-4 shrink-0">
          {links.map((link, i) => (
            <Link
              key={i}
              to={link.to}
              className={`text-sm transition-colors ${link.className || 'text-slate-400 hover:text-white'}`}
            >
              {link.label}
            </Link>
          ))}

          <ThemeToggle />

          {user && <span className="text-sm text-slate-300">👋 {user.name}</span>}
          {user ? (
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <Link to="/login" className="text-sm text-violet-400 hover:text-white transition-colors">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="sm:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            className="text-slate-400 hover:text-white transition-colors p-1"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="sm:hidden px-4 py-4 border-t border-white/5 bg-slate-900/95 backdrop-blur-xl rounded-b-2xl absolute top-full left-0 right-0 shadow-2xl">
          <div className="flex flex-col gap-4">
            {user && (
              <div className="text-sm text-slate-300 pb-3 border-b border-slate-700/50">
                <span className="block font-medium text-white mb-1">👋 {user.name}</span>
                <span className="text-xs capitalize px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  {user.role}
                </span>
              </div>
            )}
            {links.map((link, i) => (
              <Link
                key={i}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`text-sm block transition-colors ${link.className || 'text-slate-300 hover:text-white'}`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <button
                onClick={() => { setIsOpen(false); logout(); navigate('/login'); }}
                className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors text-left pt-3 border-t border-slate-700/50 mt-1"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors text-left pt-3 border-t border-slate-700/50 mt-1"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
