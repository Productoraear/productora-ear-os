'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  HeartPulse,
  Image as ImageIcon,
  Loader2,
  Music,
  Phone,
  Play,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';

import { submitBookingRequestAction } from '@/app/(vendor)/vendor/actions';
import type { VendorMediaAssetRecord } from '@/lib/vendor/vendorCrmTypes';

// ─── Tipos públicos (cero `any`) ───────────────────────────────────────────────

export type VendorTier = 'FREE' | 'PREMIUM' | 'PRO' | 'ELITE';

/** Ficha pública del proveedor. Sin secretos, solo datos de escaparate. */
export interface VendorProfilePublic {
  id: string;
  slug: string | null;
  stageName: string | null;
  bio: string | null;
  baseRateEur: number | null;
  soundLimitDba: number | null;
  youtubeUrl: string | null;
  spotifyUrl: string | null;
}

interface VendorShowcaseCardProps {
  vendor: VendorProfilePublic;
  media: VendorMediaAssetRecord[];
  vimumeEnabled: boolean;
  tier: VendorTier;
}

interface BookingDraft {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  eventDate: string;
  pax: string;
  budgetEur: string;
}

type BookingMode = 'booking' | 'insta';

type SubmitFeedback = { ok: true; leadId: string } | { ok: false; error: string };

const EMPTY_DRAFT: BookingDraft = {
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  eventDate: '',
  pax: '',
  budgetEur: '',
};

const TIER_LABEL: Record<VendorTier, string> = {
  FREE: 'FREE (80/10/10)',
  PREMIUM: 'PRO',
  PRO: 'PRO',
  ELITE: 'ELITE',
};

const TIER_ACCENT: Record<VendorTier, string> = {
  FREE: 'text-[#ecb613] border-[#ecb613]/30 bg-[#ecb613]/10',
  PREMIUM: 'text-[#00E5FF] border-[#00E5FF]/30 bg-[#00E5FF]/10',
  PRO: 'text-[#00E5FF] border-[#00E5FF]/30 bg-[#00E5FF]/10',
  ELITE: 'text-white border-white/40 bg-white/10',
};

function formatEur(value: number | null): string {
  if (value === null || Number.isNaN(value)) return 'Precio a consultar';
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

function digitCount(value: string): number {
  return (value.match(/\d/g) ?? []).length;
}

/**
 * 🏬 VendorShowcaseCard — Escaparate público S-Class.
 * Ficha estructurada (bio, tier, rider acústico, tarifa), galería media,
 * sello VIMUME y CTA de reserva que escribe un `VendorLead` real vía server action.
 */
export default function VendorShowcaseCard({
  vendor,
  media,
  vimumeEnabled,
  tier,
}: VendorShowcaseCardProps) {
  const images = useMemo(
    () => media.filter((asset) => asset.type === 'IMAGE'),
    [media],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [modalMode, setModalMode] = useState<BookingMode | null>(null);
  const [draft, setDraft] = useState<BookingDraft>(EMPTY_DRAFT);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<SubmitFeedback | null>(null);

  const safeIndex = Math.min(activeIndex, Math.max(0, images.length - 1));
  const stageName = vendor.stageName?.trim() || 'Proveedor sin nombre artístico';
  const hasSlug = Boolean(vendor.slug && vendor.slug.trim().length > 0);

  // Cerrar modal con Escape (accesibilidad).
  useEffect(() => {
    if (!modalMode) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setModalMode(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [modalMode]);

  const openModal = (mode: BookingMode) => {
    setDraft(EMPTY_DRAFT);
    setFeedback(null);
    setModalMode(mode);
  };

  const updateDraft = (field: keyof BookingDraft, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!hasSlug) return;

    const clientName = draft.clientName.trim();
    const clientPhone = draft.clientPhone.trim();

    if (clientName.length < 2) {
      setFeedback({ ok: false, error: 'Escribe tu nombre (mínimo 2 caracteres).' });
      return;
    }
    if (digitCount(clientPhone) < 9) {
      setFeedback({ ok: false, error: 'Escribe un teléfono válido (mínimo 9 dígitos).' });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    const rawPax = draft.pax.trim() === '' ? null : Number.parseInt(draft.pax, 10);
    const rawBudget = draft.budgetEur.trim() === '' ? null : Number.parseFloat(draft.budgetEur.replace(',', '.'));

    const result = await submitBookingRequestAction({
      vendorSlug: vendor.slug as string,
      clientName,
      clientPhone,
      clientEmail: draft.clientEmail.trim() || undefined,
      eventDate: draft.eventDate || undefined,
      pax: rawPax !== null && !Number.isNaN(rawPax) ? rawPax : undefined,
      budgetEur: rawBudget !== null && !Number.isNaN(rawBudget) ? rawBudget : undefined,
      source: modalMode === 'insta' ? 'insta_book' : 'vendor_escaparate',
    });

    setSubmitting(false);

    if (result.ok) {
      setFeedback({ ok: true, leadId: result.leadId });
      setDraft(EMPTY_DRAFT);
    } else {
      setFeedback({ ok: false, error: result.error });
    }
  };

  return (
    <>
      <section
        aria-label={`Escaparate público de ${stageName}`}
        className="w-full overflow-x-hidden rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-xl transition-all duration-300 ease-out"
      >
        {/* ─── Galería / Hero ─────────────────────────────────────────────── */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-t-3xl bg-[#050507]">
          {images.length > 0 ? (
            <>
              <img
                src={images[safeIndex].url}
                alt={`${stageName} · imagen ${safeIndex + 1} de ${images.length}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-transparent to-transparent" />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveIndex((prev) => (prev - 1 + images.length) % images.length)}
                    aria-label="Imagen anterior"
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 border border-white/10 text-white hover:bg-[#ecb613] hover:text-black transition-all duration-300"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveIndex((prev) => (prev + 1) % images.length)}
                    aria-label="Imagen siguiente"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 border border-white/10 text-white hover:bg-[#ecb613] hover:text-black transition-all duration-300"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((image, index) => (
                      <button
                        key={image.id}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        aria-label={`Ir a la imagen ${index + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          index === safeIndex ? 'w-5 bg-[#ecb613]' : 'w-1.5 bg-white/40 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-zinc-500">
              <ImageIcon size={32} />
              <span className="text-xs font-mono uppercase tracking-widest">Galería en preparación</span>
            </div>
          )}

          {/* Badges de homologación */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border font-mono ${TIER_ACCENT[tier]}`}>
              <BadgeCheck size={11} className="inline mr-1" />
              {TIER_LABEL[tier]}
            </span>
            {vimumeEnabled && (
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border font-mono text-emerald-300 border-emerald-400/30 bg-emerald-400/10">
                <HeartPulse size={11} className="inline mr-1" />
                VIMUME 10%
              </span>
            )}
          </div>
        </div>

        {/* ─── Ficha estructurada ─────────────────────────────────────────── */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black font-syne text-white tracking-tight">
              {stageName}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <Sparkles size={12} className="text-[#ecb613]" />
                {formatEur(vendor.baseRateEur)}
              </span>
              {vendor.soundLimitDba !== null && (
                <span className="inline-flex items-center gap-1.5">
                  <Music size={12} className="text-cyan-300" />
                  {vendor.soundLimitDba} dBA
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Clock size={12} className="text-zinc-500" />
                Respuesta &lt; 24h
              </span>
            </div>
          </div>

          <p className="text-sm text-zinc-400 font-light leading-relaxed line-clamp-5">
            {vendor.bio?.trim() || 'Biografía en preparación. Este espacio mostrará la propuesta de valor del proveedor.'}
          </p>

          {(vendor.youtubeUrl || vendor.spotifyUrl) && (
            <div className="flex flex-wrap gap-3">
              {vendor.youtubeUrl && (
                <a
                  href={vendor.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold hover:bg-rose-500/20 transition-all duration-300"
                >
                  <Play size={13} /> Vídeo demo
                </a>
              )}
              {vendor.spotifyUrl && (
                <a
                  href={vendor.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold hover:bg-emerald-500/20 transition-all duration-300"
                >
                  <Music size={13} /> Escuchar
                </a>
              )}
            </div>
          )}

          {/* ─── CTAs ─────────────────────────────────────────────────────── */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => openModal('booking')}
              disabled={!hasSlug}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#ecb613] hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-black font-mono text-xs font-black uppercase rounded-2xl transition-all duration-300 ease-out hover:scale-[1.02] shadow-lg shadow-amber-950/40"
            >
              Solicitar Reserva (24h)
              <ArrowRight size={15} />
            </button>
            <button
              type="button"
              onClick={() => openModal('insta')}
              disabled={!hasSlug}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed border border-white/10 text-white font-mono text-xs font-black uppercase rounded-2xl transition-all duration-300 ease-out hover:scale-[1.02]"
            >
              <Zap size={15} className="text-[#ecb613]" />
              Insta-Book
            </button>
          </div>

          {!hasSlug && (
            <p className="text-[11px] font-mono text-amber-400/80 flex items-center gap-1.5">
              <ShieldCheck size={13} />
              La reserva se habilita cuando el perfil dispone de slug público.
            </p>
          )}
        </div>
      </section>

      {/* ─── Modal / Drawer de reserva ─────────────────────────────────────── */}
      {modalMode !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
          onClick={() => setModalMode(null)}
        >
          <div
            className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0a0a0f] border border-white/10 p-6 sm:p-8 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h3 id="booking-modal-title" className="text-lg font-black font-syne text-white">
                  {modalMode === 'insta' ? 'Reserva exprés · Insta-Book' : 'Solicitar Reserva (24h)'}
                </h3>
                <p className="text-xs text-zinc-400 font-light mt-1">
                  {stageName} · Sin compromiso, respuesta garantizada en 24 horas.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalMode(null)}
                aria-label="Cerrar"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="booking-name" className="block text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                  Nombre *
                </label>
                <input
                  id="booking-name"
                  type="text"
                  value={draft.clientName}
                  onChange={(event) => updateDraft('clientName', event.target.value)}
                  required
                  minLength={2}
                  maxLength={120}
                  placeholder="Tu nombre y apellidos"
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#ecb613] placeholder:text-zinc-600"
                />
              </div>

              <div>
                <label htmlFor="booking-phone" className="block text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                  Teléfono *
                </label>
                <input
                  id="booking-phone"
                  type="tel"
                  value={draft.clientPhone}
                  onChange={(event) => updateDraft('clientPhone', event.target.value)}
                  required
                  placeholder="+34 600 000 000"
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#ecb613] placeholder:text-zinc-600"
                />
              </div>

              <div>
                <label htmlFor="booking-date" className="block text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                  Fecha del evento
                </label>
                <input
                  id="booking-date"
                  type="date"
                  value={draft.eventDate}
                  onChange={(event) => updateDraft('eventDate', event.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#ecb613]"
                />
              </div>

              {modalMode === 'booking' && (
                <>
                  <div>
                    <label htmlFor="booking-email" className="block text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                      Email (opcional)
                    </label>
                    <input
                      id="booking-email"
                      type="email"
                      value={draft.clientEmail}
                      onChange={(event) => updateDraft('clientEmail', event.target.value)}
                      placeholder="tu@email.com"
                      className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#ecb613] placeholder:text-zinc-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="booking-pax" className="block text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                        Invitados
                      </label>
                      <input
                        id="booking-pax"
                        type="number"
                        min={0}
                        value={draft.pax}
                        onChange={(event) => updateDraft('pax', event.target.value)}
                        placeholder="0"
                        className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#ecb613] placeholder:text-zinc-600"
                      />
                    </div>
                    <div>
                      <label htmlFor="booking-budget" className="block text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                        Presupuesto €
                      </label>
                      <input
                        id="booking-budget"
                        type="number"
                        min={0}
                        step="0.01"
                        value={draft.budgetEur}
                        onChange={(event) => updateDraft('budgetEur', event.target.value)}
                        placeholder="0"
                        className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#ecb613] placeholder:text-zinc-600"
                      />
                    </div>
                  </div>
                </>
              )}

              {feedback !== null && (
                <div
                  className={`p-3 rounded-xl border text-xs font-mono flex items-start gap-2 ${
                    feedback.ok
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  {feedback.ok ? <CheckCircle2 size={14} className="shrink-0 mt-0.5" /> : <X size={14} className="shrink-0 mt-0.5" />}
                  <span>
                    {feedback.ok
                      ? `¡Solicitud registrada! Tu referencia es #${feedback.leadId}. Te contactaremos en menos de 24h.`
                      : feedback.error}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#ecb613] hover:bg-amber-300 disabled:opacity-60 text-black font-mono text-xs font-black uppercase rounded-2xl transition-all duration-300"
              >
                {submitting ? <Loader2 size={15} className="animate-spin" /> : <Phone size={15} />}
                {submitting ? 'Enviando…' : 'Enviar solicitud'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}






