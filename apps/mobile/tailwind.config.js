/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#0a0a0a",
        muted: "#f4f4f5",
        "muted-foreground": "#71717a",
        primary: "#18181b",
        "primary-foreground": "#fafafa",
        border: "#e4e4e7",
      },
    },
  },
  plugins: [],
};
