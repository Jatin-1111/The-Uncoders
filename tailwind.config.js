/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Parkinsans', 'sans-serif'], // Add Parkinsans
      },
      animation: {
        slideDown: 'slideDown 0.5s ease-out', // Slide-down animation
      },
      keyframes: {
        slideDown: {
          '0%': { transform: 'translateY(-50px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
