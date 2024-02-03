/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}', './projects/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        blue_primary: {
          dark: "#44596E",
        },
        accent: "#EC994B",
      }
    },
  },
  plugins: [],
}
