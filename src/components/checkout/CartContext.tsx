'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
} from '@/lib/constants/ear-os-ssot';

export type EventServiceCategory =
  | 'finca'
  | 'artista'
  | 'sonido_audiovisual'
  | 'catering_gastronomia'
  | 'coordinador_boda'
  | 'flores_decoracion'
  | 'autobus_transporte'
  | 'coche_nupcial'
  | 'fotografia_video'
  | 'animacion_360'
  | 'vimume'
  | 'evento';

export interface CartItem {
  id: string;
  name: string;
  category: EventServiceCategory;
  providerName?: string;
  unitPriceEur: number;
  quantity: number;
  description: string;
  badge?: string;
  horquillaEstimada?: {
    minEur: number;
    maxEur: number;
  };
  metadata?: {
    distanceKm?: number;
    aforo?: number;
    hours?: number;
    origen?: string;
    destino?: string;
  };
}

interface CartContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  lastRemovedItem: CartItem | null;
  undoRemove: () => void;
  subtotalEur: number;
  fianzaStripeEur: number;
  liquidacionEventoEur: number;
  freeLogisticsProgress: number; // 0 to 100%
  totalProvidersCount: number;
  hasCategory: (category: EventServiceCategory) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([
    {
      id: 'edwin-agudelo-solista',
      name: 'Edwin Agudelo · Tenor Solista S-Class',
      category: 'artista',
      providerName: 'Edwin Agudelo Tenor',
      unitPriceEur: TARIFA_BASE_SOLISTA_EUR,
      quantity: 1,
      description: 'Voz lírica y repertorio de gala con rider Bose F1 y calibración acústica < 75 dB SPL.',
      badge: 'Suelo Canónico',
      metadata: { distanceKm: 45 },
    },
  ]);
  const [lastRemovedItem, setLastRemovedItem] = useState<CartItem | null>(null);

  // Carga y persistencia en disco del navegador (LocalStorage)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ear_sovereign_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        }
      }
    } catch {
      // Ignorar fallback de almacenamiento
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('ear_sovereign_cart', JSON.stringify(items));
    } catch {
      // Ignorar fallback
    }
  }, [items]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    const itemToRemove = items.find((i) => i.id === id);
    if (itemToRemove) {
      setLastRemovedItem(itemToRemove);
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const undoRemove = () => {
    if (lastRemovedItem) {
      setItems((prev) => [...prev, lastRemovedItem]);
      setLastRemovedItem(null);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const hasCategory = (category: EventServiceCategory): boolean => {
    return items.some((item) => item.category === category);
  };

  // Cálculo financiero canónico en céntimos enteros
  const subtotalEur = items.reduce((acc, curr) => acc + curr.unitPriceEur * curr.quantity, 0);

  // El depósito Price-Lock Stripe (100 €) es único y bloquea la fecha para todos los proveedores en el expediente
  const fianzaStripeEur = items.length > 0 ? DEPOSITO_STRIPE_EUR : 0;

  // Liquidación final deducible íntegramente
  const liquidacionEventoEur = Math.max(0, subtotalEur - fianzaStripeEur);

  // Barra de progreso de logística gratuita (< 50 km Hub Méntrida o pedidos colectivos > 800 €)
  const freeLogisticsProgress = Math.min(100, Math.round((subtotalEur / 800) * 100));

  // Conteo de proveedores independientes coordinados
  const totalProvidersCount = new Set(items.map((i) => i.providerName || i.name)).size;

  return (
    <CartContext.Provider
      value={{
        isOpen,
        setIsOpen,
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        lastRemovedItem,
        undoRemove,
        subtotalEur,
        fianzaStripeEur,
        liquidacionEventoEur,
        freeLogisticsProgress,
        totalProvidersCount,
        hasCategory,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
