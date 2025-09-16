/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        'brand-primary': '#107C41',
        'brand-secondary': '#21A366',
      }
    },
  },
  plugins: [],
}
