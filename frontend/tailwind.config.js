/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        neon: '#00fff7',
        glass: 'rgba(255,255,255,0.1)',
      },
    },
  },
  plugins: [],
}

