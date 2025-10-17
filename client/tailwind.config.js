/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'pixel': ['VT323', 'monospace'],
      },
      colors: {
        'brand-blue': '#E0F2FE',
        'brand-offwhite': '#F5F5F5',
        'brand-pink': '#FBCFE8',
        'brand-text': '#212121',
      }
    },
  },
  plugins: [],
}