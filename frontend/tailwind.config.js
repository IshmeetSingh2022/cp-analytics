/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono:    ['Space Mono', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#f0fdf4',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
        void: {
          900: '#080c10',
          800: '#0d1117',
          700: '#161b22',
          600: '#21262d',
          500: '#30363d',
          400: '#484f58',
          300: '#6e7681',
          200: '#b1bac4',
          100: '#e6edf3',
        },
      },
      keyframes: {
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        blink: {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.4s ease-out forwards',
        'fade-in':  'fade-in 0.3s ease-out forwards',
        blink:      'blink 1s step-end infinite',
      },
    },
  },
  plugins: [],
}
