/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      borderRadius: { xl: "0.75rem", "2xl": "1rem" },
      boxShadow: { soft: "0 1px 2px rgba(0,0,0,.06), 0 1px 3px rgba(0,0,0,.1)" },
    },
  },
  plugins: [],
}
