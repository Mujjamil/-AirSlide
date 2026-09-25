/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#ECE8E1',
          light: '#F6F3EC',
          surface: '#F1ECE4',
          muted: '#DFD9CE',
          border: 'rgba(18, 19, 22, 0.09)',
          'border-hi': 'rgba(18, 19, 22, 0.20)',
        },
        ink: {
          DEFAULT: '#121316',
          soft: '#1E2025',
          muted: '#686661',
          light: '#8E8B84',
        },
        obsidian: {
          DEFAULT: '#0C0D0F',
          soft: '#121317',
          card: '#16181D',
          surface: '#1D1F26',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-hi': 'rgba(255, 255, 255, 0.18)',
          muted: '#8D8D96',
          text: '#F5F5F7',
        },
        bronze: {
          DEFAULT: '#C7B299',
          light: '#DCCBBA',
          dark: '#A6927B',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1deg)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(0.96)' },
        },
        flashPop: {
          '0%': { opacity: '0', transform: 'translate(-50%, -50%) scale(0.6)' },
          '25%': { opacity: '1', transform: 'translate(-50%, -50%) scale(1.15)' },
          '65%': { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
          '100%': { opacity: '0', transform: 'translate(-50%, -50%) scale(0.96)' },
        },
        slideOutLeft: {
          to: { opacity: '0', transform: 'translateX(-50px) scale(0.97)' },
        },
        slideOutRight: {
          to: { opacity: '0', transform: 'translateX(50px) scale(0.97)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        float: 'float 3.5s ease-in-out infinite',
        floatSlow: 'floatSlow 7s ease-in-out infinite',
        orbit: 'orbit 25s linear infinite',
        pulseSubtle: 'pulseSubtle 2.5s ease-in-out infinite',
        flashPop: 'flashPop 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        slideOutLeft: 'slideOutLeft 0.2s ease forwards',
        slideOutRight: 'slideOutRight 0.2s ease forwards',
        slideIn: 'slideIn 0.22s ease forwards',
      },
    },
  },
  plugins: [],
};
