/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/js/*.js",
    "./src/pages/*.html",
    "./index.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
  ],
}