/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // Mandatorio para next-themes
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        border: "var(--border)",
        // Keep original brand colors as fallback/utilities
        obsidian: "#050505",
        gold: "#ecb613",
        // Stitch Semantic Tokens (Additive)
        "on-surface-variant": "#d0c5af",
        "surface-bright": "#3a3939",
        "surface-variant": "#353534",
        "surface-container-lowest": "#0e0e0e",
        "surface-container-low": "#1c1b1b",
        "surface-container": "#201f1f",
        "surface-container-high": "#2a2a2a",
        "surface-container-highest": "#353534",
        "on-surface": "#e5e2e1",
        "primary-container": "#d4af37",
        "on-primary-container": "#554300",
        "secondary": "#c6c6c6",
        "outline": "#99907c",
        "outline-variant": "#4d4635",
      },
      fontFamily: {
        "headline": ["Newsreader", "serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Space Grotesk", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0px", 
        "lg": "0px", 
        "xl": "0px", 
        "full": "9999px"
      }
    },
  },
  plugins: [],
}
