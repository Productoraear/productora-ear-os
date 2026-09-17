"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Film, Loader2, Lock, ShieldCheck, CheckCircle2 } from "lucide-react";

type SongTier = "standard_49" | "cinematic_99";

interface CheckoutResponse {
  ok: boolean;
  checkout?: {
    amountEur: number;
    label: string;
    priceLock: string;
    validThrough: string;
    depositPriceLockEur: number;
    songTier: SongTier;
  };
  error?: string;
}

interface DigitalPayButtonProps {
  details?: Record<string, unknown>;
  onCheckoutComplete?: (checkout: NonNullable<CheckoutResponse["checkout"]>) => void;
}

const TIERS: {
  id: SongTier;
  name: string;
  price: string;
  badge: string;
  icon: React.ReactNode;
  accent: "#ecb613" | "#00E5FF";
  features: string[];
}[] = [
  {
    id: "standard_49",
    name: "Estándar",
    price: "49 €",
    badge: "CANCIÓN PERSONALIZADA",
    icon: <Sparkles className="w-5 h-5" />,
    accent: "#ecb613",
    features: ["Voz clonada de Edwin Agudelo", "Letra de 5 historias", "Master FLAC 24-bit"],
  },
  {
    id: "cinematic_99",
    name: "Con Videoclip",
    price: "99 €",
    badge: "CANCIÓN + VIDEOCLIP IA",
    icon: <Film className="w-5 h-5" />,
    accent: "#00E5FF",
    features: ["Todo lo del plan Estándar", "Videoclip cinemático Higgsfield", "Entrega MP4 H.265 masterizada"],
  },
];

export default function DigitalPayButton({ details, onCheckoutComplete }: DigitalPayButtonProps) {
  const [loadingTier, setLoadingTier] = useState<SongTier | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<CheckoutResponse["checkout"] | null>(null);

  const handlePurchase = async (songTier: SongTier) => {
    setLoadingTier(songTier);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/digital-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songTier, details: details ?? {} }),
      });

      const data = (await response.json()) as CheckoutResponse;

      if (!response.ok || !data.ok || !data.checkout) {
        setError(data.error ?? "No se pudo generar el pago. Inténtalo de nuevo.");
        return;
      }

      setSuccess(data.checkout);
      onCheckoutComplete?.(data.checkout);
    } catch {
      setError("Error de red al contactar con el checkout digital.");
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TIERS.map((tier) => {
          const isLoading = loadingTier === tier.id;
          const isSuccess = success?.songTier === tier.id;

          return (
            <motion.button
              key={tier.id}
              type="button"
              onClick={() => handlePurchase(tier.id)}
              disabled={isLoading || loadingTier !== null}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="p-5 rounded-2xl border text-left transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#0D0D15",
                borderColor: isSuccess ? tier.accent : "#1A1A24",
                boxShadow: isSuccess ? `0 0 24px ${tier.accent}22` : "none",
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${tier.accent}14`, border: `1px solid ${tier.accent}33` }}
                >
                  {tier.icon}
                </div>
                <span
                  className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded border"
                  style={{ color: tier.accent, borderColor: `${tier.accent}44`, backgroundColor: `${tier.accent}0D` }}
                >
                  {tier.badge}
                </span>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <h3 className="font-bold text-white text-lg">{tier.name}</h3>
                  <p className="text-3xl font-bold mt-1" style={{ color: tier.accent }}>
                    {tier.price}
                  </p>
                </div>
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" style={{ color: tier.accent }} />
                ) : isSuccess ? (
                  <CheckCircle2 className="w-6 h-6" style={{ color: tier.accent }} />
                ) : (
                  <Lock className="w-5 h-5 text-zinc-500" />
                )}
              </div>

              <ul className="mt-4 pt-4 border-t border-[#1A1A24] space-y-1.5">
                {tier.features.map((feature) => (
                  <li key={feature} className="text-xs text-zinc-400 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full" style={{ backgroundColor: tier.accent }} />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.button>
          );
        })}
      </div>

      {error && (
        <p className="mt-4 text-sm text-[#FF2B44] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          {error}
        </p>
      )}

      {success && (
        <div className="mt-4 p-4 rounded-xl border border-[#10B981]/30 bg-[#10B981]/5 text-xs font-mono text-zinc-300 space-y-1">
          <div className="flex justify-between">
            <span className="text-zinc-400">Price Lock SHA-256</span>
            <span className="text-[#10B981]">VÁLIDO</span>
          </div>
          <p className="text-zinc-500 break-all">{success.priceLock.slice(0, 40)}…</p>
          <div className="flex justify-between">
            <span className="text-zinc-400">Válido hasta</span>
            <span className="text-white">{new Date(success.validThrough).toLocaleString("es-ES")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Depósito Price-Lock</span>
            <span className="text-white">{success.depositPriceLockEur.toFixed(2)} €</span>
          </div>
        </div>
      )}
    </div>
  );
}