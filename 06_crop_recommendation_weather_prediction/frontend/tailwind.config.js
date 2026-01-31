/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "farm-green": "#4CAF50",
        "farm-dark": "#2E7D32",
        "farm-light": "#81C784",
      },
    },
  },
  plugins: [],
};
