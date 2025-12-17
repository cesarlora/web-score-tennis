/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "376px",
        xl: "1200px",
        xxl: "1281px",
        xxxl: "1366px",
        "2xl": "1400px",
        "3xl": "1600px",
      },
    },
    colors: {
      primary: {
        700:  "#834D1D",
        600:  "#A66D37",
        500:  "#B4813E",
        400:  "#C3944C",
        300:  "#D2B072",
        200:  "#E2D0A6",
        100:  "#F0E7D1",
        50:  "#F9F6ED"
      },
      secondary: {
        700: "#B96D04",
        600: "#E09900",
        500: "#FCC504",
        400: "#FFE31E",
        300: "#FFF148",
        200: "#FFFA87",
        100: "#FFFDC5",
        50: "#FFFEEA"
      },
      tertiary: {
        blue: "#001D3D",
        green: "#017539"
      },
      neutral: {
        700: "#4F4F4F",
        600: "#5D5D5D",
        500: "#777777",
        400: "#888888",
        300: "#B0B0B0",
        200: "#D1D1D1",
        100: "#E7E7E7",
        50: "#EDEDEE"
      },
      semantic: {
        black: "#232323",
        error: "#E61717",
        "error-bg": "#FFEFF0",
        warning: "#FDC700",
        "warning-bg": "#FEFDE8",
        success: "#5EA500",
        "success-bg": "#F8FFE5",
        white: "#FFFFFF",
        transparent: "transparent",
      },
    }, 
    fontSize: {
      "heading-h1-lg": ["72px", "88px"],
      "heading-h1-md": ["56px", "64px"],
      "heading-h2-lg": ["48px", "56px"],
      "heading-h2-md": ["40px", "48px"],
      "heading-h3-md": ["32px", "40px"],
      "heading-h4-md": ["28px", "32px"],
      "heading-h5-lg": ["24px", "32px"],
      "heading-h6-lg": ["20px", "32px"],
      "lead": ["18px", "32px"],
      "body-1": ["16px", "24px"],
      "body-2": ["14px", "24px"],
      "caption": ["12px", "24px"],
    },
    fontFamily: {
      display: 'DM Sans',
      body: 'Libre Baskerville',
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.container': {
          maxWidth: '100%',
          margin: '0 auto',
          padding: '0 15px',
          '@screen sm': {
            maxWidth: '540px'
          },
          '@screen md': {
            maxWidth: '720px'
          },
          '@screen lg': {
            maxWidth: '960px'
          },
          '@screen xl': {
            maxWidth: '1200px'
          },
          '@screen xxl': {
            maxWidth: '1296px'
          },
        }
      })
    }
  ],
}

