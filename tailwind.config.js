/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html",
    ],
    theme: {
      extend: {
        colors: {
          cricket: {
            green: '#6366f1',     // Indigo (primary accent)
            lightgreen: '#06b6d4', // Cyan (fresh, secondary accent)
            darkgreen: '#0ea5e9',  // Sky blue (bright detail highlight)
            pitch: '#111827',     // Deep charcoal (dark surfaces)
            stadium: '#0f172a',   // Main dark background
            gold: '#facc15',      // Premium gold
            silver: '#d1d5db',    // Clean silver
            bronze: '#b45309',    // Warm bronze
          },
        },
        backgroundImage: {
          'stadium-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          'pitch-gradient': 'linear-gradient(45deg, #111827 0%, #1e293b 50%, #111827 100%)',
          'auction-gradient': 'linear-gradient(135deg, #6366f1 0%, #06b6d4 50%, #0ea5e9 100%)',
        },
        animation: {
          'bounce-in': 'bounceIn 0.6s ease-out',
          'slide-in': 'slideIn 0.5s ease-out',
          'fade-in': 'fadeIn 0.4s ease-out',
          'pulse-glow': 'pulseGlow 2s infinite',
          'confetti': 'confetti 3s ease-out',
        },
        keyframes: {
          bounceIn: {
            '0%': { transform: 'scale(0.3)', opacity: '0' },
            '50%': { transform: 'scale(1.05)', opacity: '0.8' },
            '70%': { transform: 'scale(0.9)', opacity: '1' },
            '100%': { transform: 'scale(1)', opacity: '1' },
          },
          slideIn: {
            '0%': { transform: 'translateX(-100%)', opacity: '0' },
            '100%': { transform: 'translateX(0)', opacity: '1' },
          },
          fadeIn: {
            '0%': { opacity: '0', transform: 'translateY(20px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          pulseGlow: {
            '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)' },
            '50%': { boxShadow: '0 0 40px rgba(6, 182, 212, 0.8)' },
          },
        },
        fontFamily: {
          'cricket': ['Inter', 'system-ui', 'sans-serif'],
          'display': ['Poppins', 'system-ui', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }
  