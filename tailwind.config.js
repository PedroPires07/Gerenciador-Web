/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { inter: ['Inter','ui-sans-serif','system-ui'] },
      colors: { brand: { 600:'#2D1C87', 700:'#231569' } }
    },
  },
  plugins: [],
}
