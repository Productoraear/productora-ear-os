/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/widgets/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/context/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/contexts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
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
        // 🏛️ EAR OS 60-30-10 S-CLASS COLOR SYSTEM
        // 60% Dominant (OLED Black / Obsidian Canvas)
        obsidian: "#050505",
        onyx: "#08080a",
        canvas: "#050505",

        // 30% Secondary (Bento Structures, Panels & Muted Silver Texts)
        "surface-bento": "#0e0e12",
        "surface-panel": "#141418",
        "surface-elevated": "#1c1c22",
        "border-subtle": "rgba(255, 255, 255, 0.08)",
        "border-glass": "rgba(255, 255, 255, 0.14)",
        "text-secondary": "#9ca3af",

        // 10% Accent (Imperial Gold Focal Points & Conversion CTAs)
        gold: "#ecb613",
        "gold-imperial": "#ecb613",
        "gold-light": "#f5c538",
        "gold-dark": "#b38805",
        "gold-glow": "rgba(236, 182, 19, 0.25)",

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
        francia: ["var(--font-fraunces)", "Fraunces", "serif"],
        fraunces: ["var(--font-fraunces)", "Fraunces", "serif"],
        montserrat: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
        headline: ["var(--font-fraunces)", "Fraunces", "serif"],
        display: ["var(--font-fraunces)", "Fraunces", "serif"],
        serif: ["var(--font-fraunces)", "Fraunces", "serif"],
        body: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
        sans: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
        label: ["Space Grotesk", "sans-serif"],
        syne: ["var(--font-fraunces)", "Syne", "sans-serif"],
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
