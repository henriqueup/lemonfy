/** @type {import('tailwindcss').Config} */
// To add intellisense include this value in VSCode's settings.json:
// "tailwindCSS.experimental.classRegex": [["/\\*tw\\*/ ([^;]*);", "\"([^\"]*)\""]]
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [],
};
