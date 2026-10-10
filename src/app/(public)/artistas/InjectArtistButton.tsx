"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEventCart } from '@/context/EventCartContext';
import { ArrowRight, Check, Loader2, AlertCircle } from 'lucide-react';

interface InjectHeroButtonProps {
  artistId: string;
  artistName: string;
  basePrice: string;
  formats: string[];
}

interface InjectCatalogButtonProps {
  artistId: string;
  artistName: string;
  category: string;
  basePrice: string;
}

type InjectStatus = 'idle' | 'loading' | 'success' | 'error';

const ERROR_RESET_MS = 2500;

function parsePrice(raw: string, fallback: number): number {
  const digits = raw.replace(/\D/g, '');
  const parsed = parseInt(digits, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function formatMxn(value: number): string {
  return value.toLocaleString('es-MX');
}

function useInjectStatus(): {
  status: InjectStatus;
  setStatus: React.Dispatch<React.SetStateAction<InjectStatus>>;
  resetTimerRef: React.MutableRefObject<number | null>;
} {
  const [status, setStatus] = useState<InjectStatus>('idle');
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
    };
  }, []);

  return { status, setStatus, resetTimerRef };
}

export function InjectHeroButton({
  artistId,
  artistName,
  basePrice,
  formats,
}: InjectHeroButtonProps) {
  const { addToCart } = useEventCart();
  const router = useRouter();
  const { status, setStatus, resetTimerRef } = useInjectStatus();

  const price = parsePrice(basePrice, 650);
  const formatCount = Array.isArray(formats) ? formats.length : 0;
  const priceLabel = formatMxn(price);

  const handleInject = useCallback(() => {
    if (status === 'loading' || status === 'success') return;
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
    setStatus('loading');
    try {
      addToCart({
        slug: artistId,
        rawName: artistName,
        category: 'Artista S-Class',
        itemType: 'ARTIST_DIRECT',
        estimatedPrice: price,
        technicalWatts: 0,
      });
      setStatus('success');
      router.push('/cotizador');
    } catch {
      setStatus('error');
      resetTimerRef.current = window.setTimeout(() => {
        setStatus('idle');
        resetTimerRef.current = null;
      }, ERROR_RESET_MS);
    }
  }, [addToCart, artistId, artistName, price, router, status, setStatus, resetTimerRef]);

  const isDisabled = status === 'loading' || status === 'success';

  return (
    <button
      type="button"
      onClick={handleInject}
      disabled={isDisabled}
      aria-label={`Agregar ${artistName} al cotizador por $${priceLabel} MXN`}
      aria-busy={status === 'loading'}
      aria-live="polite"
      className="group relative w-full sm:w-auto py-3.5 px-7 rounded-2xl bg-white/10 hover:bg-white/15 disabled:opacity-70 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ease-out min-h-[48px] overflow-hidden ring-1 ring-white/10 hover:ring-[#ecb613]/40 hover:shadow-[0_0_24px_-4px_rgba(236,182,19,0.35)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305] motion-reduce:transition-none motion-reduce:active:scale-100"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full motion-reduce:hidden"
      />
      {status === 'loading' ? (
        <>
          <Loader2 size={16} className="animate-spin text-[#ecb613]" aria-hidden="true" />
          <span>Agregando…</span>
        </>
      ) : status === 'success' ? (
        <>
          <Check size={16} className="text-[#ecb613]" aria-hidden="true" />
          <span>Agregado</span>
        </>
      ) : status === 'error' ? (
        <>
          <AlertCircle size={16} className="text-red-400" aria-hidden="true" />
          <span>Error · reintentar</span>
        </>
      ) : (
        <>
          <span>
            + Agregar al cotizador · ${priceLabel} MXN
            {formatCount > 0
              ? ` · ${formatCount} formato${formatCount === 1 ? '' : 's'}`
              : ''}
          </span>
          <ArrowRight
            size={16}
            className="text-[#ecb613] transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            aria-hidden="true"
          />
        </>
      )}
    </button>
  );
}

export function InjectCatalogButton({
  artistId,
  artistName,
  category,
  basePrice,
}: InjectCatalogButtonProps) {
  const { addToCart } = useEventCart();
  const router = useRouter();
  const { status, setStatus, resetTimerRef } = useInjectStatus();

  const price = parsePrice(basePrice, 500);
  const priceLabel = formatMxn(price);

  const handleInject = useCallback(() => {
    if (status === 'loading' || status === 'success') return;
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
    setStatus('loading');
    try {
      addToCart({
        slug: artistId,
        rawName: artistName,
        category: category,
        itemType: 'ARTIST_DIRECT',
        estimatedPrice: price,
        technicalWatts: 0,
      });
      setStatus('success');
      router.push('/cotizador');
    } catch {
      setStatus('error');
      resetTimerRef.current = window.setTimeout(() => {
        setStatus('idle');
        resetTimerRef.current = null;
      }, ERROR_RESET_MS);
    }
  }, [addToCart, artistId, artistName, category, price, router, status, setStatus, resetTimerRef]);

  const isDisabled = status === 'loading' || status === 'success';

  return (
    <button
      type="button"
      onClick={handleInject}
      disabled={isDisabled}
      aria-label={`Agregar ${artistName} (${category}) al cotizador por $${priceLabel} MXN`}
      aria-busy={status === 'loading'}
      aria-live="polite"
      className="group relative flex-1 py-3 rounded-xl bg-[#ecb613] hover:bg-[#f5c62b] disabled:opacity-70 disabled:cursor-not-allowed text-black font-black text-xs uppercase tracking-wider text-center shadow-lg shadow-[#ecb613]/10 hover:shadow-[0_0_28px_-4px_rgba(236,182,19,0.55)] active:scale-95 transition-all duration-300 ease-out flex items-center justify-center gap-1.5 min-h-[44px] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305] motion-reduce:transition-none motion-reduce:active:scale-100"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full motion-reduce:hidden"
      />
      {status === 'loading' ? (
        <>
          <Loader2 size={14} className="animate-spin" aria-hidden="true" />
          <span>Agregando…</span>
        </>
      ) : status === 'success' ? (
        <>
          <Check size={14} aria-hidden="true" />
          <span>Agregado</span>
        </>
      ) : status === 'error' ? (
        <>
          <AlertCircle size={14} aria-hidden="true" />
          <span>Error · reintentar</span>
        </>
      ) : (
        <>
          <span>+ Agregar · ${priceLabel} MXN</span>
          <ArrowRight
            size={14}
            className="transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            aria-hidden="true"
          />
        </>
      )}
    </button>
  );
}