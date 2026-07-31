/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rachma: {
          bg: '#FDF5F6',       
          card: '#FFFFFF',     
          primary: '#B83250',  
          secondary: '#9E2A43',
          soft: '#F4DCDD',     
          text: '#2D2727',     
          muted: '#7A6B6E'     
        }
      }
    },
  },
  plugins: [],
}