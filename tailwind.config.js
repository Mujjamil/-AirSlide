/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        surface: 'rgba(15, 15, 20, 0.82)',
        'surface-hi': 'rgba(255, 255, 255, 0.08)',
        border: 'rgba(255, 255, 255, 0.10)',
        'border-hi': 'rgba(255, 255, 255, 0.22)',
        accent: {
          DEFAULT: '#6366f1',
          glow: 'rgba(99, 102, 241, 0.4)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        flashPop: {
          '0%': { opacity: '0', transform: 'translate(-50%, -50%) scale(0.4)' },
          '25%': { opacity: '1', transform: 'translate(-50%, -50%) scale(1.4)' },
          '60%': { opacity: '1', transform: 'translate(-50%, -50%) scale(1.05)' },
          '100%': { opacity: '0', transform: 'translate(-50%, -50%) scale(1.1)' },
        },
        slideOutLeft: {
          to: { opacity: '0', transform: 'translateX(-60px) scale(0.96)' },
        },
        slideOutRight: {
          to: { opacity: '0', transform: 'translateX(60px) scale(0.96)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        flashPop: 'flashPop 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        slideOutLeft: 'slideOutLeft 0.18s ease forwards',
        slideOutRight: 'slideOutRight 0.18s ease forwards',
        slideIn: 'slideIn 0.2s ease forwards',
      },
      backdropBlur: {
        glass: '20px',
      },
    },
  },
  plugins: [],
};
