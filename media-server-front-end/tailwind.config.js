/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:
      {
        deepBlack: '#111111',
        appleGray: '#F5F5F7',
        appleBlue: '#0077ED',
        appleLightBlue: '#238efa',
      }
    },
  },
  plugins: [],
}