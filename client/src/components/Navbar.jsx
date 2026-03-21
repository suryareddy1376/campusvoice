import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';

function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative w-10 h-5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neonPurple/50 ${
        isDark ? 'bg-slate-800 border border-slate-700' : 'bg-amber-100 border border-amber-300'
      } ${className}`}
      aria-label="Toggle theme"
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 ${
        isDark
          ? 'left-0.5 bg-slate-900 text-neonPurple'
          : 'left-[22px] bg-white text-amber-500'
      }`}>
        {isDark ? (
          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        ) : (
          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a1 1 0 011 1v1a1 1 0 01-2 0V3a1 1 0 011-1zM4.22 4.22a1 1 0 011.42 0l.7.7a1 1 0 01-1.42 1.41l-.7-.7a1 1 0 010-1.41zM2 12a1 1 0 011-1h1a1 1 0 010 2H3a1 1 0 01-1-1zm17 0a1 1 0 011-1h1a1 1 0 010 2h-1a1 1 0 01-1-1zM4.92 18.36l.7-.7a1 1 0 011.42 1.41l-.7.7a1 1 0 01-1.42-1.41zm12.02-.7l.7.7a1 1 0 001.42-1.41l-.7-.7a1 1 0 00-1.42 1.41zM12 20a1 1 0 011 1v1a1 1 0 01-2 0v-1a1 1 0 011-1zm0-15a7 7 0 100 14A7 7 0 0012 5z" />
          </svg>
        )}
      </span>
    </button>
  );
}

export default function Navbar({ title = 'ChronoVerse', subtitle, links = [] }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-4 z-50 glass-card mx-4 mb-8">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <svg className="w-5 h-5 text-neonPurple drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold bg-gradient-to-r from-neonPurple to-neonBlue bg-clip-text text-transparent truncate flex items-center gap-2">
              {title}
              {subtitle && <span className="text-xs font-normal text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full ml-2">{subtitle}</span>}
            </h1>
          </div>
        </div>

        {/* Desktop: Premium Navigation Toggle */}
        <div className="hidden md:flex relative items-center bg-slate-900/50 rounded-full p-1 border border-white/5 mx-auto shadow-inner">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-5 py-1.5 text-sm font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-pill"
                    className="absolute inset-0 bg-neonPurple/40 rounded-full border border-neonPurple/50 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Desktop: Right cluster */}
        <div className="hidden sm:flex items-center gap-4 shrink-0">
          <ThemeToggle />

          {user && (
            <div className="flex items-center gap-2 pr-3 border-r border-white/10">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shadow-inner">
                <span className="text-xs font-bold text-slate-300">{user.name.charAt(0)}</span>
              </div>
            </div>
          )}

          {user ? (
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="px-4 py-1.5 text-sm rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all shadow-sm"
            >
              System Exit
            </button>
          ) : (
            <Link to="/login" className="px-5 py-1.5 text-sm rounded-full bg-neonPurple/20 hover:bg-neonPurple/30 border border-neonPurple/50 text-neonPurple hover:text-white transition-all shadow-[0_0_10px_rgba(139,92,246,0.2)]">
              Initialize
            </Link>
          )}
        </div>

        {/* Mobile: Hamburger */}
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
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="sm:hidden px-4 py-4 border-t border-white/10 bg-slate-900/95 backdrop-blur-3xl rounded-b-2xl absolute top-full left-0 right-0 shadow-2xl"
          >
            <div className="flex flex-col gap-4">
              {user && (
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <span className="text-sm font-bold text-slate-300">{user.name.charAt(0)}</span>
                  </div>
                  <div>
                    <span className="block font-medium text-white">{user.name}</span>
                    <span className="text-xs uppercase tracking-wider text-neonPurple px-1.5 py-0.5 rounded bg-neonPurple/10 border border-neonPurple/20">
                      {user.role}
                    </span>
                  </div>
                </div>
              )}
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm block transition-colors ${location.pathname === link.to ? 'text-neonBlue font-medium' : 'text-slate-300'}`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <button
                  onClick={() => { setIsOpen(false); logout(); navigate('/login'); }}
                  className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors text-left pt-3 border-t border-white/10 mt-1"
                >
                  System Exit
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-neonPurple hover:text-neonBlue transition-colors text-left pt-3 border-t border-white/10 mt-1"
                >
                  Initialize Platform
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
