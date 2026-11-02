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
        craft: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0d8',
          300: '#f4a9b8',
          400: '#ec738f',
          500: '#de436a',
          600: '#c8244e',
          700: '#b70228',
          800: '#8a011e',
          900: '#75061e',
          950: '#43000b',
        },
      },
    },
  },
  plugins: [],
}
