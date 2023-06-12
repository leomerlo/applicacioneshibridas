/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#5E47D2',
          secondary: '#F7F5FF',
          focus: '#E2DCFF',
          hover: '#6045E8',
          pressed: '#220F80'
        },
        gray: {
          20: '#F5F5F5',
          30: '#EDEDED',
          40: '#E0E0E0',
          50: '#C2C2C2',
          60: '#9E9E9E',
          70: '#757575',
          80: '#616161',
          90: '#424242',
          100: '#212121',
        },
      },
      width: {
        mobile: '393px',
        authForm: '420px'
      },
      height: {
        mobile: '852px',
      },
      maxWidth: {
        authForm: '420px'
      }
    },
  },
  plugins: [],
}

