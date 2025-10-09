/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { inter: ['Inter','ui-sans-serif','system-ui'] },
      colors: { brand: { 600:'#0f8b61', 700:'#0e6f4f' } }
    },
  },
  plugins: [],
}
