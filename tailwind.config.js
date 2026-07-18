/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        cinzel: ['Cinzel', 'serif'],
      },
      colors: {
        pergamino: {
          50: '#fbf7ee',
          100: '#f3ead2',
          200: '#e6d3a5',
          800: '#4a3620',
          900: '#2f2313',
        },
        sangre: {
          50: '#fbeced',
          100: '#f6d9db',
          200: '#efb4b7',
          300: '#e58287',
          400: '#d54d55',
          500: '#c12b33',
          600: '#7a1f24',
          700: '#651a1e',
          800: '#4d1215',
          900: '#3a0c0e',
        },
        dndoscuro: {
          50: '#2a2a2a',
          100: '#222222',
          200: '#1a1a1a',
          300: '#151515',
          400: '#111111',
          500: '#0a0a0a',
          600: '#0d0d0d',
          700: '#090909',
          800: '#070707',
          900: '#050505',
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-light': '0 8px 32px 0 rgba(255, 255, 255, 0.1)',
        'neon': '0 0 10px rgba(101, 26, 30, 0.8), 0 0 20px rgba(101, 26, 30, 0.5)',
      },
      backgroundImage: {
        'dnd-texture': "url('https://www.transparenttextures.com/patterns/dark-leather.png')",
      }
    },
  },
  plugins: [],
};
