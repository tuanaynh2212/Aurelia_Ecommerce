export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kraft:   { DEFAULT: "#CDB79A", dark: "#B8A080" },  // backdrop rails, section fills
        paper:   { DEFAULT: "#FBF8F2" },                   // tags, cards — highest contrast base
        ink:     { DEFAULT: "#2A211B", muted: "#6B5E54", faint: "#9E9086" }, // all text on kraft/paper
        cobalt:  { DEFAULT: "#2447D6", hover: "#1A35B0" }, // sale price, CTA, focus ring — paper only
        bg:      "#FBF8F2",           // paper
        surface: "#CDB79A",           // kraft
        rule:    "#D9CFBE",
        "ink-muted": "#6B5E54",
        accent: {
          DEFAULT: "#2447D6",         // cobalt replaces old terracotta accent
          hover:   "#1A35B0",
        },
      },
      fontFamily: {
        heading: ["'Fraunces'", "'Georgia'", "serif"],
        body:    ["'Inter'", "system-ui", "sans-serif"],
        mono:    ["'IBM Plex Mono'", "'Courier New'", "monospace"],
      },
      fontSize: {
        "tag-sku":   ["0.625rem",  { lineHeight: "1",    letterSpacing: "0.12em" }],
        "tag-price": ["1.25rem",   { lineHeight: "1.2",  fontVariantNumeric: "tabular-nums" }],
        "tag-size":  ["0.6875rem", { lineHeight: "1",    letterSpacing: "0.06em" }],
      },
      borderRadius: {
        none:  "0px",
        tag:   "2px",   // die-cut corner radius — tags only
        hole:  "9999px", // punched hole only
      },
      boxShadow: {
        tag: "0 6px 24px -4px rgba(42,33,27,0.18), 0 2px 8px -2px rgba(42,33,27,0.10)",
        none: "none",
      },
      dropShadow: {
        soft: "0 1px 2px rgba(42,33,27,0.06)",
        card: "0 2px 6px rgba(42,33,27,0.08)",
      },
      spacing: {
        "4.5": "1.125rem",
        "13":  "3.25rem",
        "15":  "3.75rem",
        "18":  "4.5rem",
        "22":  "5.5rem",
        "26":  "6.5rem",
        "30":  "7.5rem",
      },
      keyframes: {
        "tag-swing": {
          "0%, 100%":  { transform: "rotate(0deg)" },
          "30%":       { transform: "rotate(2.5deg)" },
          "70%":       { transform: "rotate(-0.8deg)" },
        },
        "tag-flip-in": {
          "0%":   { transform: "rotateY(90deg)",  opacity: "0" },
          "100%": { transform: "rotateY(0deg)",   opacity: "1" },
        },
        "tag-flip-out": {
          "0%":   { transform: "rotateY(0deg)",   opacity: "1" },
          "100%": { transform: "rotateY(-90deg)", opacity: "0" },
        },
        "fade-in": {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "tag-swing":    "tag-swing 220ms ease-out 1 forwards",
        "tag-flip-in":  "tag-flip-in 280ms ease-out forwards",
        "tag-flip-out": "tag-flip-out 220ms ease-in forwards",
        "fade-in":      "fade-in 400ms ease-out forwards",
      },
      aspectRatio: {
        "product":  "4 / 5",   // product photo — tag front
        "editorial": "3 / 2",  // editorial photo — Look of the Week
      },
      gridTemplateColumns: {
        "12": "repeat(12, minmax(0, 1fr))",
      },
    },
  },
  plugins: [],
};
