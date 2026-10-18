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
          // Single source of truth: classic palette values come from the
          // design tokens (src/styles/tokens/) — see docs/DESIGN_SYSTEM.md.
          // NOTE: Tailwind opacity modifiers (e.g. bg-accent/50) do not work
          // with var() colors — none are in use.
          dark: "var(--vn-brand)",
        },
        accent: "var(--vn-accent)",
      }
    },
  },
  plugins: [],
}
