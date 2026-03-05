/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./client/js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          brown: '#3E2723',
          orange: '#C0582B',
          cream: '#F5EBDD',
          olive: '#6B705C',
          charcoal: '#2C2C2C',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}