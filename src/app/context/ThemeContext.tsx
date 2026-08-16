"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

const CustomThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Core provider that wraps children with next-themes provider and custom bridge context
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
      <ThemeBridge>{children}</ThemeBridge>
    </NextThemesProvider>
  );
}

// Inner bridge to adapt next-themes hooks to our un-broken unified API
function ThemeBridge({ children }: { children: React.ReactNode }) {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = (theme === "system" ? resolvedTheme : theme) as "light" | "dark" || "dark";

  const toggleTheme = () => {
    setTheme(activeTheme === "dark" ? "light" : "dark");
  };

  const handleSetTheme = (t: "light" | "dark") => {
    setTheme(t);
  };

  // 📱 S-CLASS MOBILE 3-SECOND LONG-PRESS GESTURE DETECTOR
  useEffect(() => {
    if (!mounted) return;

    let pressTimer: NodeJS.Timeout | null = null;
    let isMoving = false;

    const handlePointerDown = (e: PointerEvent) => {
      // Activate only on mobile viewports (< 768px) or actual touch contacts
      const isMobileTouch = window.innerWidth < 768 || e.pointerType === 'touch';
      if (!isMobileTouch) return;

      // Safely ignore interactive components so we don't block target actions
      const target = e.target as HTMLElement;
      if (
        !target ||
        target.closest('button') || 
        target.closest('a') || 
        target.closest('input') || 
        target.closest('textarea') || 
        target.closest('select') ||
        target.closest('[role="button"]') ||
        target.isContentEditable
      ) {
        return;
      }

      isMoving = false;

      // Start 3-second timer for gesture trigger
      pressTimer = setTimeout(() => {
        if (!isMoving) {
          setTheme(activeTheme === "dark" ? "light" : "dark");
          
          // Provide S-Class mobile haptic vibration feedback if supported
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate([80, 40, 80]);
          }
          
          console.log(`📱 [THEME_GESTURE]: 3-second mobile hold detected. Theme switched to ${activeTheme === "dark" ? "light" : "dark"}`);
        }
      }, 3000);
    };

    const handlePointerUp = () => {
      if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    };

    const handlePointerMove = () => {
      // Cancel gesture toggle instantly on any scroll or drag movements
      isMoving = true;
      if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    };

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("pointercancel", handlePointerUp, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      window.removeEventListener("pointermove", handlePointerMove);
      if (pressTimer) clearTimeout(pressTimer);
    };
  }, [mounted, activeTheme, setTheme]);

  // Provide fallback state during SSR to prevent visual flash
  const contextValue: ThemeContextType = {
    theme: mounted ? activeTheme : "dark",
    toggleTheme,
    setTheme: handleSetTheme,
  };

  return (
    <CustomThemeContext.Provider value={contextValue}>
      {children}
    </CustomThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(CustomThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
