"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Loader2,
  Lock,
  Music2,
  Sparkles,
  Users,
} from "lucide-react";
import {
  MARIACHI_DISPATCH_HUBS,
  MARIACHI_FORMATS,
  calculateMariachiQuote,
  type MariachiFormatId,
} from "@/lib/mariachi/mariachiDispatchCore";
import { checkoutMariachiDeposit } from "@/app/actions/mariachiCheckoutActions";

/**
 * ════════════════════════════════════════════════════════════════════════════
 * VISTA B — DESCUBRIMIENTO TIPO TINDER (`/mariachis`)
 * ════════════════════════════════════════════════════════════════════════════
 * Mazo de cartas sobre el catálogo CANÓNICO (`MARIACHI_FORMATS`). Cero datos
 * inventados: nombre, integrantes, descripción, público recomendado, repertorio
 * y depósito nacen del SSOT (`mariachi-formats` → `ear-os-ssot`).
 *
 * El CTA no es decorativo: recalcula la cotización con el motor determinista y
 * dispara la Server Action `checkoutMariachiDeposit` (Stripe Price-Lock 100 €)
 * con el mismo hash SHA-256 que valida el servidor; si no coincide, el servidor
 * rechaza la sesión. El precio no se puede manipular desde el cliente.
 *
 * Navegación: flechas del teclado (← →), botones y gesto de arrastre táctil.
 * ════════════════════════════════════════════════════════════════════════════
 */

const DISCOVERY_HUB = MARIACHI_DISPATCH_HUBS[0];
const SWIPE_THRESHOLD_PX = 56;

interface DiscoveryCard {
  id: MariachiFormatId;
  name: string;
  members: number;
  description: string;
  recommendedFor: string;
  repertoireCount: number;
  depositAmount: number;
  totalGrossPrice: number;
  priceLockHash: string;
  destinationName: string;
}

/** Euro sin decimales: los escalones comerciales son cifras cerradas. */
const EURO = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function buildDiscoveryCards(): readonly DiscoveryCard[] {
  return MARIACHI_FORMATS.map((format) => {
    const destinationName = `Reserva ${format.name} — precio cerrado`;
    const quote = calculateMariachiQuote(
      format.id,
      { lat: DISCOVERY_HUB.lat, lng: DISCOVERY_HUB.lng },
      destinationName,
      2,
      DISCOVERY_HUB.id,
    );

    return {
      id: format.id,
      name: format.name,
      members: format.members,
      description: format.description,
      recommendedFor: format.recommendedFor,
      repertoireCount: format.repertoireCount,
      depositAmount: format.depositAmount,
      totalGrossPrice: quote.totalGrossPrice,
      priceLockHash: quote.priceLockHash,
      destinationName,
    };
  });
}

export default function MariachiTinderDiscovery(): React.ReactElement {
  const cards = useMemo<readonly DiscoveryCard[]>(buildDiscoveryCards, []);
  const [index, setIndex] = useState<number>(0);
  const [loadingId, setLoadingId] = useState<MariachiFormatId | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const dragStartX = useRef<number | null>(null);

  const total = cards.length;
  const current = cards[index];

  const goTo = useCallback(
    (next: number) => {
      setIndex((previous) => {
        if (total === 0) return previous;
        return (next + total) % total;
      });
    },
    [total],
  );

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  const handleCheckout = useCallback(async (card: DiscoveryCard) => {
    try {
      setLoadingId(card.id);
      setErrorMsg(null);

      const result = await checkoutMariachiDeposit({
        formatId: card.id,
        destinationLat: DISCOVERY_HUB.lat,
        destinationLng: DISCOVERY_HUB.lng,
        destinationName: card.destinationName,
        endHour: 2,
        overrideHubId: DISCOVERY_HUB.id,
        repertoireSongs: 0,
        clientHash: card.priceLockHash,
        issuedAt: Date.now(),
      });

      if (!result.ok) {
        setErrorMsg(result.error || "No se pudo iniciar la pasarela de pago Stripe.");
        return;
      }

      window.location.href = result.url;
    } catch (err: unknown) {
      console.error("MARIACHI_DISCOVERY_STRIPE_ERROR:", err);
      setErrorMsg("Error de conexión con la pasarela de pago.");
    } finally {
      setLoadingId(null);
    }
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>): void => {
    dragStartX.current = event.clientX;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>): void => {
    const start = dragStartX.current;
    dragStartX.current = null;
    if (start === null) return;

    const delta = event.clientX - start;
    if (delta <= -SWIPE_THRESHOLD_PX) goNext();
    else if (delta >= SWIPE_THRESHOLD_PX) goPrev();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    }
  };

  if (!current) return <div className="min-h-[420px]" aria-hidden="true" />;

  const isLoading = loadingId === current.id;

  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-3 mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono uppercase tracking-[0.25em]">
          <Sparkles size={14} />
          Modo Descubrimiento
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-syne uppercase text-white tracking-tight">
          Desliza y Encuentra tu Formato
        </h2>
        <p className="text-sm sm:text-base text-white/60 font-sans max-w-2xl">
          Una carta por formato real del catálogo. Desliza con el dedo, con las flechas del teclado
          o con los botones: bloquea la fecha con el depósito de 100 € íntegramente descontable.
        </p>
      </div>

      <div
        role="group"
        aria-roledescription="carrusel"
        aria-label="Formatos de mariachi disponibles"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className="relative mx-auto w-full max-w-3xl touch-pan-y rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 sm:p-10 outline-none focus-visible:border-[#ecb613]/60 transition-colors duration-300 ease-out select-none"
      >
        <div className="flex items-center justify-between mb-6">
          <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-zinc-400">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {cards.map((card, dotIndex) => (
              <span
                key={card.id}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ease-out ${
                  dotIndex === index ? "bg-[#ecb613] scale-150" : "bg-white/20 scale-100"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono text-zinc-300">
              <Users size={12} className="text-[#ecb613]" />
              {current.members} {current.members === 1 ? "músico" : "músicos"}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono text-zinc-300">
              <Music2 size={12} className="text-[#00E5FF]" />
              {current.repertoireCount} temas en repertorio
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono text-zinc-300">
              <Lock size={12} className="text-[#FF2B44]" />
              Depósito {EURO.format(current.depositAmount)} deducible
            </span>
          </div>

          <h3 className="text-2xl sm:text-4xl font-black font-syne text-white leading-tight">
            {current.name}
          </h3>

          <p className="text-sm sm:text-base text-white/70 font-sans leading-relaxed">
            {current.description}
          </p>

          <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4">
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400 mb-1">
              Vibra recomendada
            </p>
            <p className="text-sm text-white/80 font-sans">{current.recommendedFor}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-6">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400">
              Precio cerrado · IVA incluido
            </p>
            <p className="text-3xl sm:text-4xl font-black font-syne text-[#ecb613]">
              {EURO.format(current.totalGrossPrice)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              type="button"
              onClick={() => void handleCheckout(current)}
              disabled={isLoading}
              aria-busy={isLoading}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#ecb613] text-[#030305] text-sm font-bold font-syne uppercase tracking-wide hover:bg-[#f5c531] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-300 ease-out"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CreditCard size={16} />
              )}
              {isLoading
                ? "Abriendo Stripe…"
                : `Bloquear Fecha · ${EURO.format(current.depositAmount)}`}
            </button>
            <Link
              href="/reservar/solista"
              className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors duration-300 ease-out"
            >
              Configurar fecha y distancia
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {errorMsg ? (
          <p role="alert" className="mt-4 text-xs font-mono text-[#FF2B44]">
            {errorMsg}
          </p>
        ) : null}

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Formato anterior"
            className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/10 text-zinc-300 hover:border-[#ecb613]/60 hover:text-[#ecb613] transition-colors duration-300 ease-out"
          >
            <ChevronLeft size={18} />
          </button>
          <p aria-live="polite" className="sr-only">
            {`Carta ${index + 1} de ${total}: ${current.name}`}
          </p>
          <button
            type="button"
            onClick={goNext}
            aria-label="Siguiente formato"
            className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/10 text-zinc-300 hover:border-[#ecb613]/60 hover:text-[#ecb613] transition-colors duration-300 ease-out"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}


