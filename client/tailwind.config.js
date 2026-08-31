/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:
      {
        specialPurple: "rgb(35, 12, 136)",
        deepBlack: '#111111',
        appleGray: '#F5F5F7',
        appleBlue: '#0077ED',
        appleLightBlue: '#238efa',
        appleLighterBlue: '#4ba2fa'
      },
      transitionProperty: {
        'visibility' : 'visibility',
        'opacity' : 'opacity'
      }
    },
  },
  plugins: [],
}