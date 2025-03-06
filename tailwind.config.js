/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          50: '#EBEAFC',
          100: '#D7D5FA',
          200: '#AFABF5',
          300: '#8880F0',
          400: '#6056EB',
          500: '#4F46E5',
          600: '#2D23D1',
          700: '#231CA5',
          800: '#191478',
          900: '#0F0D4B',
        },
        secondary: {
          DEFAULT: '#14B8A6',
          50: '#E7F9F6',
          100: '#D0F3EE',
          200: '#A1E7DE',
          300: '#72DBCE',
          400: '#43CFBD',
          500: '#14B8A6',
          600: '#109285',
          700: '#0C6D64',
          800: '#084942',
          900: '#042421',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
} 