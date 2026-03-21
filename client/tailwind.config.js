/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        neonPurple: '#8b5cf6',
        neonBlue: '#3b82f6',
      },
      animation: {
        'orb-pulse': 'orb-pulse 10s ease-in-out infinite',
      },
      keyframes: {
        'orb-pulse': {
          '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
          '50%': { opacity: 0.9, transform: 'scale(1.2)' },
        }
      }
    },
  },
  plugins: [],
}
