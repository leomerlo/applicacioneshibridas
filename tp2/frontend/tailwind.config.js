/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#425EAB',
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
        navbar: '56px',
      },
      padding: {
        'navbar': '96px',
      },
      maxWidth: {
        authForm: '420px'
      },
      backgroundPosition: {
        dividerLineSteps: 'left 9px top 8px',
        dividerLineDays: 'left 22px top 8px',
        dividerLineBlocks: '-11px 0px',
        dividerLineBlocksBottom: '-11px -1px',
      },
      backgroundImage: {
        dividerLineBlocks: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23C2C2C2' stroke-width='2' stroke-dasharray='6%2c 10' stroke-dashoffset='3' stroke-linecap='square'/%3e%3c/svg%3e")`
      },
      backgroundSize: {
        dividerLineBlocks: 'calc(100% + 12px) 100%',
        dividerLineBlocksTop: 'calc(100% + 12px) calc(100% + 1px)',
        dividerLineBlocksBottom: 'calc(100% + 12px) calc(100% + 1px)',
        '50%': '50%',
        '25%': '25%'
      }
    },
  },
  plugins: [],
}

