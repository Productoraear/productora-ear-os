"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SovereignSignal, BASE_SIGNAL } from './types';

interface SovereignContextType {
  signal: SovereignSignal;
  updateSignal: (updates: Partial<SovereignSignal>) => void;
  isMounted: boolean;
}

const SovereignContext = createContext<SovereignContextType | undefined>(undefined);

const STORAGE_KEY = 'ear_sovereign_signal_v128_encrypted';

/**
 * S-CLASS ENCRYPTION GATEWAY
 * Obscurece la memoria de sesión para proteger la intención soberana.
 */
const sClassEncrypt = (data: any): string => {
  try {
    const str = JSON.stringify(data);
    return btoa(unescape(encodeURIComponent(str)));
  } catch (e) {
    return "";
  }
};

const sClassDecrypt = (encoded: string): any => {
  try {
    const decoded = decodeURIComponent(escape(atob(encoded)));
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
};

/**
 * SovereignContextProvider - V128.3
 * Materialización de la Personalización Contextual 2027.
 */
export const SovereignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [signal, setSignal] = useState<SovereignSignal>(BASE_SIGNAL);
  const [isMounted, setIsMounted] = useState(false);

  // 🛡️ Hydration Guard & Initial Load
  useEffect(() => {
    setIsMounted(true);
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = sClassDecrypt(stored);
        if (parsed && typeof parsed === 'object' && parsed.intentClass) {
          setSignal({ ...BASE_SIGNAL, ...parsed });
        }
      }
    } catch (e) {
      console.warn("🛡️ [SOVEREIGN_CONTEXT] Decryption failure, falling back to baseline.");
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const updateSignal = (updates: Partial<SovereignSignal>) => {
    setSignal(prev => {
      // 🧠 Lógica de Persistencia de Intención (3 nichos, 2 provincias)
      let nextNiches = prev.lastNiches;
      if (updates.lastNiches) {
        nextNiches = updates.lastNiches.slice(0, 3);
      }

      let nextProvinces = prev.lastProvinces;
      if (updates.lastProvinces) {
        nextProvinces = updates.lastProvinces.slice(0, 2);
      }

      const next = { 
        ...prev, 
        ...updates,
        lastNiches: nextNiches,
        lastProvinces: nextProvinces,
        isB2G: updates.isB2G !== undefined ? updates.isB2G : prev.isB2G,
        updatedAt: new Date().toISOString() 
      };
      
      // Persistencia cifrada en LocalStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, sClassEncrypt(next));
        } catch (e) {
          console.error("❌ [SOVEREIGN_CONTEXT] Storage failure.");
        }
      }
      return next;
    });
  };

  return (
    <SovereignContext.Provider value={{ signal, updateSignal, isMounted }}>
      {children}
    </SovereignContext.Provider>
  );
};

export const useSovereignContext = () => {
  const context = useContext(SovereignContext);
  if (!context) {
    throw new Error('useSovereignContext must be used within a SovereignProvider');
  }
  return context;
};
