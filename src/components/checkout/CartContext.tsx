'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  SPLIT_SOBERANO,
} from '@/lib/constants/ear-os-ssot';

/* ========================================================================== */
/* TIPOS Y CONTRATOS MULTI-PROVEEDOR S-CLASS                                  */
/* ========================================================================== */

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

export type ExtendedServiceCategory =
  | EventServiceCategory
  | 'ARTISTA'
  | 'FINCA'
  | 'SONIDO'
  | 'FLORES'
  | 'CATERING'
  | 'COORDINACION';

export interface CartItem {
  id: string;
  name: string;
  category: ExtendedServiceCategory;
  providerId?: string;
  providerName?: string;
  unitPriceEur: number;
  priceEur?: number;
  priceCents?: number;
  quantity: number;
  description?: string;
  badge?: string;
  pax?: number;
  distanceKm?: number;
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

export interface ProviderBreakdown {
  providerId: string;
  providerName: string;
  category: string;
  itemCents: number;
  netPayoutCents: number; // 80% to provider
}

export interface SovereignSettlementSplit {
  totalCents: number;
  subtotalCents: number;
  providersTotalCents: number; // 80%
  earOsCents: number; // 10%
  vimumeCents: number; // 10%
  depositDeductedCents: number; // 10,000 cents = 100.00 €
  pendingFinalSettlementCents: number; // totalCents - depositDeductedCents
  providersBreakdown: ProviderBreakdown[];
  priceLockSha256: string;
  algorithm: 'HARE_NIEMEYER_INTEGER_CENTS';
}

export interface CartContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  items: CartItem[];
  setItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
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

  // Milestone 3: Aritmética de Céntimos Enteros y Split Soberano
  subtotalCents: number;
  totalCents: number;
  depositCents: number;
  pendingBalanceCents: number;
  priceLockSha256: string;
  splitBreakdown: SovereignSettlementSplit;
  calculateSplit: (customTotalCents?: number, customDepositCents?: number) => SovereignSettlementSplit;
}

/* ========================================================================== */
/* MOTOR CRIPTOGRÁFICO DETERMINÍSTICO SHA-256 (UNIVERSAL / CERO DEPENDENCIAS)  */
/* ========================================================================== */

function rotr(n: number, x: number): number {
  return (x >>> n) | (x << (32 - n));
}

function pureSha256(ascii: string): string {
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let result = '';

  const words: number[] = [];
  const asciiBitLength = ascii.length * 8;

  // Constantes de redondeo (primeros 32 bits de las raíces cúbicas de los primeros 64 primos)
  const k: number[] = [];
  const isPrime = (n: number) => {
    for (let factor = 2; factor * factor <= n; factor++) {
      if (n % factor === 0) return false;
    }
    return true;
  };

  let primeCounter = 0;
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (isPrime(candidate)) {
      k[primeCounter] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      primeCounter++;
    }
  }

  // Valores hash iniciales (primeros 32 bits de las raíces cuadradas de los primeros 8 primos)
  const hash: number[] = [];
  primeCounter = 0;
  for (let candidate = 2; primeCounter < 8; candidate++) {
    if (isPrime(candidate)) {
      hash[primeCounter] = (mathPow(candidate, 1 / 2) * maxWord) | 0;
      primeCounter++;
    }
  }

  ascii += '\x80';
  while ((ascii.length % 64) - 56) ascii += '\x00';
  for (let i = 0; i < ascii.length; i++) {
    const j = ascii.charCodeAt(i);
    words[i >> 2] |= j << ((3 - (i % 4)) * 8);
  }
  words[words.length] = (asciiBitLength / maxWord) | 0;
  words[words.length] = asciiBitLength | 0;

  for (let j = 0; j < words.length; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = [...hash];

    for (let i = 0; i < 64; i++) {
      let w15 = w[i - 15];
      let w2 = w[i - 2];

      const s0 = i >= 16 ? rotr(7, w15) ^ rotr(18, w15) ^ (w15 >>> 3) : 0;
      const s1 = i >= 16 ? rotr(17, w2) ^ rotr(19, w2) ^ (w2 >>> 10) : 0;
      if (i >= 16) {
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }

      const a = hash[0];
      const e = hash[4];
      const S1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
      const ch = (e & hash[5]) ^ (~e & hash[6]);
      const temp1 = (hash[7] + S1 + ch + k[i] + w[i]) | 0;
      const S0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
      const maj = (a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]);
      const temp2 = (S0 + maj) | 0;

      hash[7] = hash[6];
      hash[6] = hash[5];
      hash[5] = hash[4];
      hash[4] = (hash[3] + temp1) | 0;
      hash[3] = hash[2];
      hash[2] = hash[1];
      hash[1] = hash[0];
      hash[0] = (temp1 + temp2) | 0;
    }

    for (let i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (let i = 0; i < 8; i++) {
    for (let b = 3; b >= 0; b--) {
      const byte = (hash[i] >> (b * 8)) & 255;
      result += (byte < 16 ? '0' : '') + byte.toString(16);
    }
  }

  return result;
}

export function computeCryptographicSha256(payload: string): string {
  try {
    // Si corre en Node.js (SSR, scripts o tests unitarios)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const nodeCrypto = typeof window === 'undefined' ? require('crypto') : null;
    if (nodeCrypto && typeof nodeCrypto.createHash === 'function') {
      return nodeCrypto.createHash('sha256').update(payload).digest('hex');
    }
  } catch {
    // Fallback continuo
  }
  return pureSha256(payload);
}

/* ========================================================================== */
/* ORÁCULO MATEMÁTICO: SPLIT SOBERANO 80/10/10 (HARE-NIEMEYER INTEGER CENTS)  */
/* ========================================================================== */

/**
 * Calcula la liquidación canónica del Split Soberano:
 * - 80% Artistas / Proveedores
 * - 10% EAR OS Infraestructura
 * - 10% VIMUME Impacto Social
 * Mediante el algoritmo de mayor resto (Hare-Niemeyer), garantizando igualdad exacta:
 * `providersTotalCents + earOsCents + vimumeCents === totalCents`.
 */
export function calculateHareNiemeyerSplit(
  totalCents: number,
  depositCents: number = Math.round(DEPOSITO_STRIPE_EUR * 100),
  providerBreakdownInput?: Array<{ id: string; name: string; category: string; cents: number }>
): SovereignSettlementSplit {
  const safeTotalCents = Math.max(0, Math.round(totalCents));
  const safeDepositCents = Math.min(safeTotalCents, Math.max(0, Math.round(depositCents)));

  // Cuotas de reparto ideales
  const quotaProviders = safeTotalCents * SPLIT_SOBERANO.artista; // 0.80
  const quotaEarOs = safeTotalCents * SPLIT_SOBERANO.earOs; // 0.10
  const quotaVimume = safeTotalCents * SPLIT_SOBERANO.vimume; // 0.10

  // Asignación de suelo entero
  let intProviders = Math.floor(quotaProviders);
  let intEarOs = Math.floor(quotaEarOs);
  let intVimume = Math.floor(quotaVimume);

  // Restos fraccionales
  const remProviders = quotaProviders - intProviders;
  const remEarOs = quotaEarOs - intEarOs;
  const remVimume = quotaVimume - intVimume;

  const assigned = intProviders + intEarOs + intVimume;
  let remainingCents = safeTotalCents - assigned;

  // Ordenar restos decrecientes para distribuir los céntimos sobrantes
  const remainders = [
    { target: 'providers', val: remProviders },
    { target: 'earOs', val: remEarOs },
    { target: 'vimume', val: remVimume },
  ].sort((a, b) => b.val - a.val);

  for (const item of remainders) {
    if (remainingCents <= 0) break;
    if (item.target === 'providers') intProviders++;
    else if (item.target === 'earOs') intEarOs++;
    else if (item.target === 'vimume') intVimume++;
    remainingCents--;
  }

  // Desglose individual de cada proveedor
  const providersBreakdown: ProviderBreakdown[] = [];
  if (providerBreakdownInput && providerBreakdownInput.length > 0) {
    let allocatedProviderCents = 0;
    for (let i = 0; i < providerBreakdownInput.length; i++) {
      const p = providerBreakdownInput[i];
      const isLast = i === providerBreakdownInput.length - 1;
      const netPayout = isLast
        ? intProviders - allocatedProviderCents
        : Math.round(p.cents * SPLIT_SOBERANO.artista);
      allocatedProviderCents += netPayout;
      providersBreakdown.push({
        providerId: p.id,
        providerName: p.name,
        category: p.category,
        itemCents: p.cents,
        netPayoutCents: netPayout,
      });
    }
  } else {
    providersBreakdown.push({
      providerId: 'default-provider',
      providerName: 'Proveedor Principal S-Class',
      category: 'ARTISTA',
      itemCents: safeTotalCents,
      netPayoutCents: intProviders,
    });
  }

  const pendingFinalSettlementCents = Math.max(0, safeTotalCents - safeDepositCents);

  // Sello criptográfico SHA-256 Price-Lock
  const hashPayload = `${safeTotalCents}:${intProviders}:${intEarOs}:${intVimume}:${safeDepositCents}`;
  const priceLockSha256 = computeCryptographicSha256(hashPayload);

  return {
    totalCents: safeTotalCents,
    subtotalCents: safeTotalCents,
    providersTotalCents: intProviders,
    earOsCents: intEarOs,
    vimumeCents: intVimume,
    depositDeductedCents: safeDepositCents,
    pendingFinalSettlementCents,
    providersBreakdown,
    priceLockSha256,
    algorithm: 'HARE_NIEMEYER_INTEGER_CENTS',
  };
}

/* ========================================================================== */
/* PROVEEDOR DEL CONTEXTO DE REACT                                            */
/* ========================================================================== */

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([
    {
      id: 'edwin-agudelo-solista',
      name: 'Edwin Agudelo · Tenor Solista S-Class',
      category: 'artista',
      providerId: 'prov-edwin-agudelo',
      providerName: 'Edwin Agudelo Tenor',
      unitPriceEur: TARIFA_BASE_SOLISTA_EUR,
      priceEur: TARIFA_BASE_SOLISTA_EUR,
      priceCents: Math.round(TARIFA_BASE_SOLISTA_EUR * 100),
      quantity: 1,
      description: 'Voz lírica y repertorio de gala con rider Bose F1 y calibración acústica < 75 dB SPL.',
      badge: 'Suelo Canónico',
      metadata: { distanceKm: 45 },
    },
  ]);
  const [lastRemovedItem, setLastRemovedItem] = useState<CartItem | null>(null);

  // Carga y sincronización persistente en LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ear_sovereign_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalizar items cargados
          const normalized = parsed.map((item: CartItem) => {
            const unitPrice = item.unitPriceEur ?? item.priceEur ?? TARIFA_BASE_SOLISTA_EUR;
            return {
              ...item,
              unitPriceEur: unitPrice,
              priceEur: unitPrice,
              priceCents: item.priceCents ?? Math.round(unitPrice * 100),
              providerId: item.providerId ?? item.id,
              providerName: item.providerName ?? item.name,
            };
          });
          setItems(normalized);
        }
      }
    } catch {
      // Fallback silencioso
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('ear_sovereign_cart', JSON.stringify(items));
    } catch {
      // Fallback silencioso
    }
  }, [items]);

  const addItem = useCallback((rawItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const unitPrice = rawItem.unitPriceEur ?? rawItem.priceEur ?? 0;
    const itemToAdd: CartItem = {
      ...rawItem,
      unitPriceEur: unitPrice,
      priceEur: unitPrice,
      priceCents: rawItem.priceCents ?? Math.round(unitPrice * 100),
      providerId: rawItem.providerId ?? rawItem.id,
      providerName: rawItem.providerName ?? rawItem.name,
      quantity: rawItem.quantity && rawItem.quantity > 0 ? rawItem.quantity : 1,
      description: rawItem.description ?? '',
    };

    setItems((prev) => {
      const existing = prev.find((i) => i.id === itemToAdd.id);
      if (existing) {
        return prev.map((i) =>
          i.id === itemToAdd.id ? { ...i, quantity: i.quantity + itemToAdd.quantity } : i
        );
      }
      return [...prev, itemToAdd];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const itemToRemove = prev.find((i) => i.id === id);
      if (itemToRemove) {
        setLastRemovedItem(itemToRemove);
      }
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const undoRemove = useCallback(() => {
    if (lastRemovedItem) {
      setItems((prev) => [...prev, lastRemovedItem]);
      setLastRemovedItem(null);
    }
  }, [lastRemovedItem]);

  const updateQuantity = useCallback((id: string, delta: number) => {
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
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const hasCategory = useCallback(
    (category: EventServiceCategory): boolean => {
      const catLower = category.toLowerCase();
      return items.some((item) => item.category.toLowerCase() === catLower);
    },
    [items]
  );

  // Cálculos financieros derivados
  const subtotalCents = useMemo(() => {
    return items.reduce((acc, curr) => {
      const unitCents = curr.priceCents ?? Math.round((curr.unitPriceEur ?? curr.priceEur ?? 0) * 100);
      return acc + unitCents * curr.quantity;
    }, 0);
  }, [items]);

  const subtotalEur = subtotalCents / 100;

  // Depósito Stripe 100 € deducible (10.000 cts)
  const depositCents = items.length > 0 ? Math.round(DEPOSITO_STRIPE_EUR * 100) : 0;
  const fianzaStripeEur = depositCents / 100;

  const pendingBalanceCents = Math.max(0, subtotalCents - depositCents);
  const liquidacionEventoEur = pendingBalanceCents / 100;

  // Split Soberano reactivo
  const splitBreakdown = useMemo(() => {
    const providerBreakdownInput = items.map((i) => ({
      id: i.providerId ?? i.id,
      name: i.providerName ?? i.name,
      category: String(i.category),
      cents: (i.priceCents ?? Math.round((i.unitPriceEur ?? i.priceEur ?? 0) * 100)) * i.quantity,
    }));
    return calculateHareNiemeyerSplit(subtotalCents, depositCents, providerBreakdownInput);
  }, [items, subtotalCents, depositCents]);

  const priceLockSha256 = splitBreakdown.priceLockSha256;

  const calculateSplit = useCallback(
    (customTotalCents?: number, customDepositCents?: number): SovereignSettlementSplit => {
      const total = customTotalCents !== undefined ? customTotalCents : subtotalCents;
      const deposit = customDepositCents !== undefined ? customDepositCents : depositCents;
      return calculateHareNiemeyerSplit(total, deposit);
    },
    [subtotalCents, depositCents]
  );

  const freeLogisticsProgress = Math.min(100, Math.round((subtotalEur / 800) * 100));
  const totalProvidersCount = new Set(items.map((i) => i.providerName || i.providerId || i.name)).size;

  return (
    <CartContext.Provider
      value={{
        isOpen,
        setIsOpen,
        items,
        setItems,
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
        subtotalCents,
        totalCents: subtotalCents,
        depositCents,
        pendingBalanceCents,
        priceLockSha256,
        splitBreakdown,
        calculateSplit,
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
