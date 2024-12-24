/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F5F5F5",
        primary: "#F8F8F8",
        accent: "#F59E0B",
        danger: "#EF4444",
        success: "#10B981",
        light: "#F3F4F6",
        dark: "#1F2937",
      },
    },
  },
  plugins: [],
}

