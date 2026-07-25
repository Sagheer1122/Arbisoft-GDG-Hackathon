/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nurse: {
          primary: '#5142C5',
          dark: '#3D2DA8',
          light: '#EDE9FE',
          bg: '#F7F7FB',
          text: '#16162A',
          secondary: '#707080',
          border: '#E7E7F0',
          success: '#39B879',
          warning: '#F6B728',
          danger: '#EF5350',
          shiftMorning: '#39B879',
          shiftEvening: '#F6B728',
          shiftNight: '#5142C5',
          shiftOff: '#9E9EAE',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'button': '12px',
        'badge': '20px',
      },
      boxShadow: {
        'nurse-sm': '0 2px 8px rgba(81, 66, 197, 0.06)',
        'nurse-md': '0 8px 24px rgba(81, 66, 197, 0.09)',
        'nurse-lg': '0 16px 36px rgba(81, 66, 197, 0.12)',
      },
    },
  },
  plugins: [],
}
