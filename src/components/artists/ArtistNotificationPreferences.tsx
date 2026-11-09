"use client";

/**
 * ════════════════════════════════════════════════════════════════════════════
 * PREFERENCIAS DE NOTIFICACIÓN DEL ARTISTA — PANEL ACCESIBLE, CERO CLICS MUERTOS
 * ════════════════════════════════════════════════════════════════════════════
 * Requisito del CEO (W52_T04): el artista decide por dónde se le avisa
 * (email / WhatsApp / in-app) y el panel debe ser honesto y accesible.
 *
 * Reglas que se respetan aquí:
 *   · Taste Engine OLED: fondo #030305 / #050507, un único acento por vista
 *     (oro #ecb613), bordes border-white/10, sin emojis (iconos heroicons).
 *   · Accesibilidad real: cada canal es un <button role="switch"> con
 *     aria-checked, aria-labelledby y aria-describedby, navegable con Tab y
 *     activable con Enter/Espacio (comportamiento nativo del <button>).
 *   · Cero clics muertos (INV-09): cada control ejecuta un handler que persiste
 *     el cambio. Si la persistencia falla, el panel lo dice y revierte el
 *     estado optimista — nunca finge éxito (AF-1/AF-5).
 *   · El teléfono mostrado es la centralita canónica del SSOT (INV-12).
 * ════════════════════════════════════════════════════════════════════════════
 */

import React, { useCallback, useMemo, useState } from "react";
import {
  BellIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { CENTRALITA_EAR_OS } from "@/lib/constants/ear-os-ssot";

/** Canales soportados por el motor de avisos. */
export type NotificationChannel = "email" | "whatsapp" | "inapp";

export interface NotificationPreference {
  readonly channel: NotificationChannel;
  readonly enabled: boolean;
}

export interface ArtistNotificationPreferencesProps {
  /** Estado inicial persistido (Server Component → Client Component). */
  readonly initialPreferences?: readonly NotificationPreference[];
  /**
   * Persistencia real. Debe devolver `true` sólo si el cambio quedó grabado.
   * Si no se inyecta, el panel trabaja en memoria y lo declara en la UI.
   */
  readonly onPersist?: (preferences: readonly NotificationPreference[]) => Promise<boolean>;
}

interface ChannelMeta {
  readonly id: NotificationChannel;
  readonly title: string;
  readonly description: string;
  readonly Icon: typeof EnvelopeIcon;
}

const CHANNEL_META: readonly ChannelMeta[] = [
  {
    id: "email",
    title: "Email de facturación",
    description:
      "Liquidaciones, facturas y expedientes SHA-256. Requerido para operar con Stripe.",
    Icon: EnvelopeIcon,
  },
  {
    id: "whatsapp",
    title: "WhatsApp",
    description: "Avisos de fecha bloqueada, urgencias y confirmaciones de bolo.",
    Icon: DevicePhoneMobileIcon,
  },
  {
    id: "inapp",
    title: "Panel in-app",
    description: "Bandeja dentro del cockpit. Sin coste externo y siempre disponible.",
    Icon: ComputerDesktopIcon,
  },
];

const DEFAULTS: readonly NotificationPreference[] = [
  { channel: "email", enabled: true },
  { channel: "whatsapp", enabled: false },
  { channel: "inapp", enabled: true },
];

/** El email nunca se apaga: sin él no hay cobro ni factura legal (JUR-1). */
const LOCKED_CHANNELS: ReadonlySet<NotificationChannel> = new Set<NotificationChannel>([
  "email",
]);

export default function ArtistNotificationPreferences({
  initialPreferences,
  onPersist,
}: ArtistNotificationPreferencesProps) {
  const [preferences, setPreferences] = useState<readonly NotificationPreference[]>(() => {
    if (!initialPreferences || initialPreferences.length === 0) return DEFAULTS;
    // Se completa cualquier canal ausente para que la UI nunca quede a medias.
    return CHANNEL_META.map((meta) => {
      const found = initialPreferences.find((entry) => entry.channel === meta.id);
      const fallback = DEFAULTS.find((entry) => entry.channel === meta.id);
      return { channel: meta.id, enabled: found?.enabled ?? fallback?.enabled ?? false };
    });
  });

  const [savingChannel, setSavingChannel] = useState<NotificationChannel | null>(null);
  const [status, setStatus] = useState<"idle" | "saved" | "error" | "local">("idle");

  const enabledCount = useMemo(
    () => preferences.filter((entry) => entry.enabled).length,
    [preferences],
  );

  const toggle = useCallback(
    async (channel: NotificationChannel) => {
      if (LOCKED_CHANNELS.has(channel)) return;

      const previous = preferences;
      const next = preferences.map((entry) =>
        entry.channel === channel ? { ...entry, enabled: !entry.enabled } : entry,
      );

      setPreferences(next);
      setSavingChannel(channel);

      if (!onPersist) {
        // Modo memoria declarado en la UI: no se finge persistencia.
        setStatus("local");
        setSavingChannel(null);
        return;
      }

      try {
        const ok = await onPersist(next);
        if (ok) {
          setStatus("saved");
        } else {
          setPreferences(previous);
          setStatus("error");
        }
      } catch {
        setPreferences(previous);
        setStatus("error");
      } finally {
        setSavingChannel(null);
      }
    },
    [onPersist, preferences],
  );

  return (
    <section
      aria-labelledby="artist-notification-preferences-title"
      className="bg-[#050507] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6"
    >
      <header className="flex items-start gap-4 border-b border-white/10 pb-5">
        <div className="p-2.5 rounded-xl bg-[#ecb613]/10 text-[#ecb613] shrink-0">
          <BellIcon className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h2
            id="artist-notification-preferences-title"
            className="text-lg sm:text-xl font-bold text-white font-syne"
          >
            Preferencias de notificación
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Elige por dónde te avisamos. Canales activos:{" "}
            <span className="font-mono text-[#ecb613]">{enabledCount}</span> de{" "}
            <span className="font-mono text-zinc-300">{CHANNEL_META.length}</span>. Consultas
            urgentes en la centralita {CENTRALITA_EAR_OS}.
          </p>
        </div>
      </header>

      <ul className="space-y-3">
        {CHANNEL_META.map((meta) => {
          const entry = preferences.find((item) => item.channel === meta.id);
          const checked = entry?.enabled ?? false;
          const locked = LOCKED_CHANNELS.has(meta.id);
          const busy = savingChannel === meta.id;

          return (
            <li
              key={meta.id}
              className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-black/40 border border-white/10"
            >
              <div className="flex items-start gap-3 min-w-0">
                <meta.Icon
                  className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p id={`channel-title-${meta.id}`} className="text-sm font-bold text-white">
                    {meta.title}
                    {locked && (
                      <span className="ml-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                        Obligatorio
                      </span>
                    )}
                  </p>
                  <p id={`channel-desc-${meta.id}`} className="text-xs text-zinc-400 mt-0.5">
                    {meta.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={checked}
                aria-labelledby={`channel-title-${meta.id}`}
                aria-describedby={`channel-desc-${meta.id}`}
                disabled={locked || busy}
                onClick={() => void toggle(meta.id)}
                className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050507] ${
                  checked ? "bg-[#ecb613] border-[#ecb613]" : "bg-zinc-800 border-white/10"
                } ${locked || busy ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <span className="sr-only">
                  {checked ? "Desactivar" : "Activar"} {meta.title}
                </span>
                <span
                  aria-hidden="true"
                  className={`inline-block h-5 w-5 transform rounded-full bg-[#030305] transition-transform duration-200 ${
                    checked ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>

      <div aria-live="polite" className="min-h-[20px]">
        {status === "saved" && (
          <p className="text-xs font-mono text-emerald-400 flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
            Preferencias guardadas.
          </p>
        )}
        {status === "error" && (
          <p className="text-xs font-mono text-[#FF2B44] flex items-center gap-2">
            <ExclamationTriangleIcon className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
            No se pudo guardar. Cambio revertido: vuelve a intentarlo.
          </p>
        )}
        {status === "local" && (
          <p className="text-xs font-mono text-zinc-500">
            Cambio aplicado solo en esta sesión: no hay persistencia conectada.
          </p>
        )}
      </div>
    </section>
  );
}
