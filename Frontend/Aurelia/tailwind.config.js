/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F6F4EE",
        surface: "#EDE9E0",
        rule: "#D6D0C2",
        ink: "#181716",
        "ink-muted": "#68645C",
        accent: {
          DEFAULT: "#C24E26",
          hover: "#A83F1C",
        },
      },
      fontFamily: {
        heading: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'Inter'", "monospace"],
      },
      borderRadius: {
        none: "0px",
        xs: "2px",
        sm: "2px",
      },
      boxShadow: {
        none: "none",
      },
    },
  },
  plugins: [],
};
