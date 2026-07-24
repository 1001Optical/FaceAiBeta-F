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
              "black": {
                  1000: "#000000",
                  800: "#000000DE",
                  600: "#00000099",
                  400: "#00000061",
                  200: "#0000001F",
              },
              "white": {
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
          },
      },
  },
  plugins: [],
};
