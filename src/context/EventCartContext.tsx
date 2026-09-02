'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ItemType = 'HARDWARE_RIDER' | 'VENDOR_SERVICE' | 'ARTIST_DIRECT';

export interface CartItem {
  slug: string;
  rawName: string;
  category: string;
  itemType: ItemType;
  estimatedPrice: number;
  isLocked?: boolean;       // Bloqueo de tarifa 72h SHA-256
  technicalWatts?: number;  // Cálculo de vatios según aforo
  imageUrl?: string;
}

interface EventCartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (slug: string) => void;
  clearCart: () => void;
  totalBudget: number;
  totalWatts: number;
  hardwareMargin: number;
}

const EventCartContext = createContext<EventCartContextType | undefined>(undefined);

export function EventCartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('ear_os_hybrid_cart');
    if (saved) {
      try { setCart(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ear_os_hybrid_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => (prev.some((i) => i.slug === item.slug) ? prev : [...prev, item]));
  };

  const removeFromCart = (slug: string) => {
    setCart((prev) => prev.filter((item) => item.slug !== slug));
  };

  const clearCart = () => setCart([]);

  const totalBudget = cart.reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);
  const totalWatts = cart.reduce((sum, item) => sum + (item.technicalWatts || 0), 0);
  
  // Margen directo >75% en Hardware Tier 0 frente al 10% de B2B
  const hardwareMargin = cart
    .filter((item) => item.itemType === 'HARDWARE_RIDER' || item.itemType === 'ARTIST_DIRECT')
    .reduce((sum, item) => sum + item.estimatedPrice * 0.75, 0);

  return (
    <EventCartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        totalBudget,
        totalWatts,
        hardwareMargin,
      }}
    >
      {children}
    </EventCartContext.Provider>
  );
}

export const useEventCart = () => {
  const context = useContext(EventCartContext);
  if (!context) throw new Error('useEventCart debe usarse dentro de EventCartProvider');
  return context;
};
