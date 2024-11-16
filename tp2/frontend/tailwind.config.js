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
          breakfast: "#8dd2b7", // mint 300
          lunch: "#e96ca2", // blue 300
          dinner: "#3d4f8e", // darkBlue 300
        },
        pink: {
          100: '#f9d1e0',
          200: '#f3a3c1',
          300: '#ec75a2',
          400: '#e64783',
          500: '#e96ca2',
        },
        blue: {
          100: '#b3c1e0',
          200: '#8693c1',
          300: '#5965a2',
          400: '#2c3783',
          500: '#425eab',
        },
        darkBlue: {
          100: '#a3b1d0',
          200: '#576baf',
          300: '#3d4f8e',
          400: '#273e8f',
          500: '#1a2b6e',
        },
        mint: {
          100: '#d9f0e7',
          200: '#b3e1cf',
          300: '#8dd2b7',
          400: '#67c39f',
          500: '#b8e0d3',
        },
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
        authForm: '420px',
        '1/2': '50%',
      },
      width: {
        mobile: '40rem',
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
      },
      fontSize: {
        'body-xs': '0.75rem',
        'body-sm': '0.875rem',
        'body-regular': '1rem',
        'heading-sm': '1.25rem',
        'heading-md': '1.75rem',
        'heading-lg': '2.25rem',
      },
      margin: {
        'row': '0 -2rem',
      },
      boxShadow: {
        'reverse-2xl': '0 25px 50px 12px rgba(0, 0, 0, 0.25);',
      },
    },
  },
  plugins: [],
}

