/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './pages/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        aribau: ['"Aribau Grotesk"', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          900: "#00575F",
          800: "#007A8A",
          50: "#E0F6FA"
        },
        secondary: {
          500: "#00B691",
          300: "#4BCFB2",
          50: "#C9F1E8",
        },
        tertiary: {
          300: "#E3E2DF",
          100: "#F7F6F3",
        },
        neutral: {
          900: "#222222",
          800: "#434343",
          700: "#626262",
          600: "#9F9F9F",
          500: "#BEBEBE",
          400: "#E1E1E1",
          300: "#EFEFEF",
          200: "#F5F5F5",
          100: "#FFFFFF",
        },
        "opacity-black":{
          1000: "#000000",
          800: "#000000DE",
          600: "#00000099",
          400: "#00000061",
          200: "#0000001F",
        },
        "opacity-white":{
          1000: "#FFFFFF",
          800: "#FFFFFFDE",
          600: "#FFFFFF99",
          400: "#FFFFFF61",
          200: "#FFFFFF1F",
        },
        information: {
          800: "#1E848D",
          600: "#00BACB",
          200: "#E2FAFA"
        },
        success: {
          800: "#1657CF",
          600: "#1F6EFF",
          200: "#EBF1FE"
        },
        warning: {
          800: "#CE7C00",
          600: "#FFC226",
          200: "#FFF9DF"
        },
        error: {
          800: "#C32626",
          600: "#F24B4B",
          200: "#FEF2F2"
        },
        charcoal: "#222222",
        "sea-green": "#007A8A",
        cotton: "#F7F6F3",
        "retail-red": "#B12028"
      },
      fontSize: {

      }
    },
  },
  plugins: [],
};
