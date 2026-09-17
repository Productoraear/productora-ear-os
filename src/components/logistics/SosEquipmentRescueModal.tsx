"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  Box,
  Clock,
  Loader2,
  MapPin,
  RotateCcw,
  Truck,
  Weight,
  X,
  Zap,
} from "lucide-react";

type DispatchResponse = {
  success: boolean;
  quote?: {
    vehicle: {
      id: string;
      name: string;
      fleetClass: string;
      capacityM3: number;
      payloadKg: number;
      equipment: string[];
    };
    distanceKm: number;
    estimatedMinutes: number;
    logisticsCostEur: number;
    totalCostEur: number;
    departureUnavailable: boolean;
    message: string;
  };
  error?: string;
};

type SosEquipmentRescueModalProps = {
  open: boolean;
  onClose: () => void;
  defaultDestination?: { lat: number; lng: number };
};

const FLEET_CLASS_LABEL: Record<string, string> = {
  micro: "Micro Furgoneta",
  medio: "Van Medio",
  pesado: "Camión Pesado",
};

export default function SosEquipmentRescueModal({
  open,
  onClose,
  defaultDestination,
}: SosEquipmentRescueModalProps) {
  const [lat, setLat] = useState<string>("40.4168");
  const [lng, setLng] = useState<string>("-3.7038");
  const [volume, setVolume] = useState<string>("4");
  const [weight, setWeight] = useState<string>("300");
  const [extraPax, setExtraPax] = useState<string>("0");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DispatchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  useEffect(() => {
    if (!open) return;
    if (defaultDestination) {
      setLat(String(defaultDestination.lat));
      setLng(String(defaultDestination.lng));
    }
    reset();
  }, [open, defaultDestination, reset]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/logistics/sos-dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: {
            lat: Number(lat),
            lng: Number(lng),
          },
          requiredVolumeM3: Number(volume),
          requiredWeightKg: Number(weight),
          extraPax: Number(extraPax) || 0,
        }),
      });

      const data = (await res.json()) as DispatchResponse;
      if (!res.ok || !data.success) {
        setError(data.error || "No se pudo calcular el despacho de rescate.");
        return;
      }

      setResult(data);
    } catch {
      setError("Fallo de red al contactar con la central EAR SOS.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl border border-[#FF2B44]/30 bg-[#030305] text-white shadow-[0_0_60px_rgba(255,43,68,0.15)]">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-[#030305]/95 px-6 py-5 backdrop-blur">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FF2B44]/40 bg-[#FF2B44]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-[#FF2B44]">
              <Zap size={13} />
              EAR SOS Rescue
            </div>
            <h2 className="font-syne text-2xl font-black uppercase tracking-tight">
              Despacho de flota de rescate
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/40">
                <MapPin size={13} /> Latitud destino
              </span>
              <input
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-[#050507] px-4 py-3 font-mono text-sm text-white outline-none transition focus:border-[#FF2B44]/60"
              />
            </label>
            <label className="space-y-2">
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/40">
                <MapPin size={13} /> Longitud destino
              </span>
              <input
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-[#050507] px-4 py-3 font-mono text-sm text-white outline-none transition focus:border-[#FF2B44]/60"
              />
            </label>
            <label className="space-y-2">
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/40">
                <Box size={13} /> Volumen (m³)
              </span>
              <input
                type="number"
                step="any"
                min="0"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-[#050507] px-4 py-3 font-mono text-sm text-white outline-none transition focus:border-[#FF2B44]/60"
              />
            </label>
            <label className="space-y-2">
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/40">
                <Weight size={13} /> Peso (kg)
              </span>
              <input
                type="number"
                step="any"
                min="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-[#050507] px-4 py-3 font-mono text-sm text-white outline-none transition focus:border-[#FF2B44]/60"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF2B44] px-6 py-4 font-black uppercase tracking-widest text-white transition hover:shadow-[0_0_35px_rgba(255,43,68,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Truck size={18} />
            )}
            {loading ? "Calculando despacho…" : "Calcular rescate"}
          </button>
        </form>

        {/* Result */}
        {error && (
          <div className="mx-6 mb-6 rounded-2xl border border-[#FF2B44]/40 bg-[#FF2B44]/10 p-4">
            <p className="flex items-start gap-2 font-body text-sm text-[#FF2B44]">
              <AlertTriangle size={18} className="shrink-0" />
              {error}
            </p>
          </div>
        )}

        {result?.quote && (
          <div className="mx-6 mb-6 space-y-4 rounded-2xl border border-white/10 bg-[#050507] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-syne text-lg font-black uppercase tracking-tight">
                  {result.quote.vehicle.name}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#FF2B44]">
                  {FLEET_CLASS_LABEL[result.quote.vehicle.fleetClass] ??
                    result.quote.vehicle.fleetClass}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-3xl font-black text-[#FF2B44]">
                  {result.quote.totalCostEur.toFixed(2)} €
                </p>
                <p className="font-mono text-[10px] text-white/40">
                  coste total estimado
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Metric icon={MapPin} label="Distancia" value={`${result.quote.distanceKm} km`} />
              <Metric icon={Clock} label="ETA" value={`${result.quote.estimatedMinutes} min`} />
              <Metric icon={Box} label="Cubicaje" value={`${result.quote.vehicle.capacityM3} m³`} />
              <Metric icon={Weight} label="Carga útil" value={`${result.quote.vehicle.payloadKg} kg`} />
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                Equipamiento embarcado
              </p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {result.quote.vehicle.equipment.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-white/10 px-3 py-1 font-body text-xs text-white/70"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p
              className={`font-body text-sm ${result.quote.departureUnavailable ? "text-[#FF2B44]" : "text-emerald-400"}`}
            >
              {result.quote.message}
            </p>

            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <RotateCcw size={14} />
              Nuevo cálculo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
      <div className="flex items-center gap-1.5 text-[#FF2B44]">
        <Icon size={13} />
        <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">
          {label}
        </span>
      </div>
      <p className="mt-1 font-mono text-sm font-bold text-white">{value}</p>
    </div>
  );
}