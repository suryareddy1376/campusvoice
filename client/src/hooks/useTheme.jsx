import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Persist user's preference in localStorage
    return localStorage.getItem('campusvoice-theme') || 'dark';
  });

  useEffect(() => {
    // Apply data-theme to the root HTML element so CSS vars kick in
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('campusvoice-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
