/** @type {import("prettier").Config} */
module.exports = {
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  tabWidth: 2,
  semi: true,
  printWidth: 120,
  singleQuote: false,
  trailingComma: "all",
  arrowParens: "avoid",
};
