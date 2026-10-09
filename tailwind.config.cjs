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

        // 10% Accent (S-Class Sovereign Ruby Red & Diamond Cyan)
        gold: "#ecb613",
        "gold-imperial": "#ecb613",
        "gold-light": "#f5c538",
        "gold-dark": "#b38805",
        "gold-glow": "rgba(236, 182, 19, 0.35)",

        // 🎬 CINEMATIC MONOCHROME SYSTEM (SQUARESPACE ULTRA-LUXURY SPEC)
        obsidian: "#000000",
        paper: "#ffffff",
        charcoal: "#2f2f2f",
        ash: "#898989",
        fog: "#dddddd",
        slate: "#999999",

        // 💎 PALETA CORPORATIVA DIAMOND EAR OS (HIGH-TECH SYSTEM)
        "ear-cyan": "#00E5FF",
        "ear-blue": "#00E5FF",
        "ear-sapphire": "#030305",
        "ear-sapphire-dark": "#050507",
        "ear-coral": "#FF2B44",

        // 💎 PALETA SOBERANA DIAMANTE ROJO & DIAMANTE AZUL (SSOT CUADERNO)
        "ear-red": {
          DEFAULT: "#E11D48",
          primary: "#E11D48",
          action: "#FF2B44",
          highlight: "#FF6B7D",
          deep: "#9F1239",
          light: "#FEE2E2",
        },
        "ear-blue-palette": {
          DEFAULT: "#00E5FF",
          deep: "#030305",
          technical: "#00E5FF",
          electric: "#00E5FF",
          ice: "#66F0FF",
          sky: "#00B8D4",
        },

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
      boxShadow: {
        "glow-ear-blue": "0 0 25px rgba(0, 229, 255, 0.35)",
        "glow-ear-cyan": "0 0 20px rgba(0, 229, 255, 0.25)",
        "glow-ear-coral": "0 0 20px rgba(255, 43, 68, 0.35)",
        "glow-ear-red": "0 0 25px rgba(255, 43, 68, 0.4)",
        "glow-ear-sapphire": "0 10px 40px -10px rgba(3, 3, 5, 0.8)",
      },
      backgroundImage: {
        "grad-ear-sapphire": "linear-gradient(185deg, #030305 0%, #000000 100%)",
        "grad-ear-cyan-blue": "linear-gradient(135deg, #00E5FF 0%, #00B8D4 100%)",
        "grad-ear-red": "linear-gradient(135deg, #FF6B7D 0%, #FF2B44 50%, #E11D48 75%, #9F1239 100%)",
        "grad-ear-blue": "linear-gradient(135deg, #66F0FF 0%, #00E5FF 35%, #00B8D4 70%, #00E5FF 100%)",
      },
      fontFamily: {
        montserrat: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
        body: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
        sans: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
        inter: ["var(--font-inter)", "Inter", "sans-serif"],
        syne: ["var(--font-syne)", "Syne", "sans-serif"],
        display: ["var(--font-syne)", "Syne", "sans-serif"],
        headline: ["var(--font-syne)", "Syne", "sans-serif"],
        francia: ["var(--font-fraunces)", "Fraunces", "serif"],
        fraunces: ["var(--font-fraunces)", "Fraunces", "serif"],
        serif: ["var(--font-fraunces)", "Fraunces", "serif"],
        label: ["Space Grotesk", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
        jm: ["var(--font-jetbrains-mono)", "JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
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
