/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fdf9ee',
          100: '#faf0d0',
          200: '#f5de9b',
          300: '#efc865',
          400: '#e8b33a',
          500: '#d4941e',
          600: '#b97416',
          700: '#955514',
          800: '#7a4317',
          900: '#663916',
          950: '#3a1d09',
        },
        noir: {
          50:  '#f5f5f5',
          100: '#e8e8e8',
          200: '#d1d1d1',
          300: '#adadad',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5a5a5a',
          700: '#4a4a4a',
          800: '#3d3d3d',
          900: '#1a1a1a',
          950: '#0d0d0d',
        },
        cream: {
          50: '#fdfcf7',
          100: '#faf6ec',
          200: '#f4ecd4',
          300: '#ecddbc',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'Helvetica', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
