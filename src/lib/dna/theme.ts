
/**
 * 🎨 S-CLASS DESIGN SYSTEM (DNA EAR) - V2.4 REBIRTH
 * Centralización de estilos estrictos para el Arquitecto.
 */

export const THEME = {
  colors: {
    black: "#050505",
    surface: "#2d2616", // Elevación de superficie para cards
    gold: {
      primary: "#ecb613",    // Rebirth Dorado V2.4
      dark: "#b8860b",       // Dark Contrast
      light: "#f5d67b",
      muted: "rgba(236, 182, 19, 0.1)"
    },
    background: "#221d10",   // S-Class Kernel Deep Brown
    status: {
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444"
    }
  },
  typography: {
    bold: "font-black tracking-tighter uppercase",
    serif: "font-serif italic", 
    brand: "font-cinzel tracking-tighter uppercase", // Identidad de marca
    label: "text-[10px] font-black uppercase tracking-[0.4em] text-white/30",
    body: "text-sm text-white/60 leading-relaxed font-sans"
  },
  animations: {
    spring: { type: "spring", stiffness: 100, damping: 15 },
    stagger: {
      container: {
        animate: { transition: { staggerChildren: 0.1 } }
      },
      item: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 }
      }
    }
  }
};

export const GLASS_STYLE = "bg-white/[0.02] border border-white/5 backdrop-blur-xl";
export const GOLD_HUD_STYLE = "border-[#ecb613]/20 shadow-[0_0_30px_rgba(236,182,19,0.05)]";
