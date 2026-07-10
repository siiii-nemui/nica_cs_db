/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nica-red': '#E53935',
        'nica-dark': '#111111',
        'nica-panel': '#1A1A1A',
        'nica-gray': '#333333',
        'nica-text': '#E0E0E0',
      }
    },
  },
  plugins: [],
}
