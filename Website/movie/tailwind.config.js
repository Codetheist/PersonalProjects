/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/js/*.js",
    "./src/pages/*.js",
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
