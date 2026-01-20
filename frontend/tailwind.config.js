/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#0BB08B', // Your custom green
      },
      fontFamily: {
        // Assuming you import the font in index.css, otherwise it falls back to sans
        switzal: ['Switzal', 'sans-serif'], 
      }
    },
  },
  plugins: [],
}