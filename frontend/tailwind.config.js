/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        phantom: {
          bg: "#0A0A0B",
          accent: "#8C68FF"
        }
      }
    }
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        phantomdark: {
          primary: "#8C68FF",
          secondary: "#2C2C2E",
          accent: "#1C1C1E",
          neutral: "#111111",
          "base-100": "#0A0A0B",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272"
        }
      }
    ]
  }
}
