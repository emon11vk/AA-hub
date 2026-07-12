/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#970000',
          hover: '#7A0000',
        },
        sidebar: {
          bg: '#FFFFFF',
          text: '#121F3E',
          active: '#970000',
        },
        bg: {
          main: '#F4F6F8',
          card: '#FFFFFF',
          highlight: '#EFF4FF',
          muted: '#F0F2F5',
        },
        border: '#E2E8F0',
        text: {
          primary: '#121F3E',
          secondary: '#515E80',
          muted: '#94A3B8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      }
    },
  },
  plugins: [],
}
