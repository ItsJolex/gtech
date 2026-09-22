/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#1A293D',
          800: '#2A4160', // Primary Navy Blue
          700: '#3A577D',
        },
        crimson: {
          900: '#8B1A18', // Hover state
          800: '#AC2220', // Deep Red
          700: '#C2312F',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
