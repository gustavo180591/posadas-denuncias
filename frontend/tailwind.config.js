/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a1a1a',
          light: '#2d2d2d',
          dark: '#000000'
        },
        secondary: {
          DEFAULT: '#dc2626',
          light: '#ef4444',
          dark: '#b91c1c'
        },
        accent: {
          DEFAULT: '#ffffff',
          light: '#f3f4f6',
          dark: '#e5e7eb'
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif']
      },
      spacing: {
        '128': '32rem',
        '144': '36rem'
      },
      borderRadius: {
        '4xl': '2rem'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
} 