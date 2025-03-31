/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#121212", // Vimegle Dark Theme
        primary: "#ff4d4d", // Red Buttons
        secondary: "#007bff", // Blue Chat Bubbles
        textPrimary: "#ffffff", // White Text
        textSecondary: "#b0b0b0", // Light Grey Text
        borderColor: "#333", // Input Borders
        inputBg: "#1e1e1e", // Input Background
        hoverBg: "#ff3333", // Button Hover
      },
      fontFamily: {
        sans: ["Inter", "Arial", "sans-serif"],
      },
      borderRadius: {
        xl: "15px",
      },
      boxShadow: {
        glow: "0px 0px 20px rgba(255, 77, 77, 0.6)", // Button Glow
      },
    },
  },
  plugins: [],
};
