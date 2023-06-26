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
          10: '#FFFFFF',
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
        info: {
          main: "#0080DD",
          secondary: "#D9EFFF",
        },
        mealIcons: {
          breakfast: "#A82525",
          lunch: "#F5AC0F",
          dinner: "#0080DD",
        }
      },
      width: {
        avatar: '60px',
        authForm: '420px'
      },
      height: {
        avatar: '60px',
        navbar: '64px',
      },
      padding: {
        'navbar': '96px',
      },
      maxWidth: {
        authForm: '420px'
      },
      backgroundPosition: {
        dividerLineSteps: 'left 9px top 8px',
        dividerLineDays: 'left 22px top 8px'
      }
    },
  },
  plugins: [],
}

