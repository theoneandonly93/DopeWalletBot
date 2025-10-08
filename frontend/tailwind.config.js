/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
module.exports = {
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0C0C0C",
        card: "#1A1A1A",
        line: "#222222",
        textDim: "#9CA3AF",
        success: "#16a34a",
        danger: "#ef4444",
      },
      borderRadius: {
        xl2: "1rem",
      }
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        dopedark: {
          primary: "#3B82F6", // blue primary instead of purple
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
