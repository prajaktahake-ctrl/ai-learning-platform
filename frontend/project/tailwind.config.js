/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        fog: {
          50: '#FBFAFD',
          100: '#F4F2F8',
          200: '#E9E6ED',
          300: '#D8D3E0',
          400: '#C3BDD0',
        },
        ink: {
          900: '#241F2E',
          800: '#36304A',
          700: '#4A4360',
          600: '#5E5670',
          500: '#736C82',
          400: '#8C859B',
          300: '#A8A2B5',
        },
        pine: {
          50: '#EAF1EE',
          100: '#D3E2DC',
          200: '#A7C5B9',
          300: '#6F9C8B',
          400: '#4A7C6A',
          500: '#2F5D50',
          600: '#244A40',
          700: '#1B3830',
          800: '#142822',
        },
        coral: {
          300: '#EBA39A',
          400: '#E0887C',
          500: '#D9756A',
          600: '#C25F54',
          700: '#A04A40',
        },
        mustard: {
          300: '#E0BC6A',
          400: '#D4AB52',
          500: '#C99A3B',
          600: '#B0862F',
          700: '#8E6A24',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        stat: '0.04em',
        label: '0.12em',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.55' },
          '70%': { transform: 'scale(2.4)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        },
        'draw-line': {
          '0%': { strokeDashoffset: 'var(--dash-len, 1000)' },
          '100%': { strokeDashoffset: '0' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'check-pop': {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '60%': { transform: 'scale(1.12)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out both',
        'scale-in': 'scale-in 0.25s ease-out both',
        'slide-up': 'slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'pulse-ring': 'pulse-ring 2s ease-in-out infinite',
        'draw-line': 'draw-line 1.2s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'check-pop': 'check-pop 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
};
