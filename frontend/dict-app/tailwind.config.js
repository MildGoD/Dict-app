/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  theme: {
    extend: {
      // Color
      colors: {
        primary: '#EE2645',
        secondary: '#EF863E',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
