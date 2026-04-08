/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand-amber': '#FDBA4D',
        'brand-gold': '#F59E0B',
        'brand-orange': '#F97316',
        'surface-light': '#F7F7F7',
        'surface-lighter': '#EFEFEF',
      },
      fontFamily: {
        'serif': ['Merriweather', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-wheat': 'linear-gradient(90deg, #FDBA4D 0%, #F59E0B 50%, #F97316 100%)',
      },
      animation: {
        'spin': 'spin 1s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      transitionDuration: {
        '150': '150ms',
        '120': '120ms',
        '180': '180ms',
      },
    },
  },
  plugins: [],
};