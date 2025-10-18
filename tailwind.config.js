/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}", "./src/**/*.html", "./src/**/*.ts"],
  theme: {
    extend: {
      colors: {
        'scape-cream': '#FEF5E6',
        'scape-teal': '#96BCA5',
        'scape-green': '#6D9386',
        'scape-dark': '#354B48',
      },
      fontFamily: {
        'lexend': ['Lexend Deca', 'sans-serif'],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
