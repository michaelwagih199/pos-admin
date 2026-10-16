/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}', './projects/**/*.{html,ts}'],
  corePlugins: {
    // Disabled so Tailwind's preflight reset stops overriding
    // Bootstrap 4 / Angular Material / Ng-Zorro global styles.
    preflight: false,
  },
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
