import React from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ShieldCheck, Zap, ArrowRight, Calendar, CreditCard, AlertTriangle, Clock, MapPin, BadgeCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Reserva Inmediata | Talent OS',
  description: 'Bloqueo de fecha y reserva de talento mediante el gatillo de 1€.',
};

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface ArtistRecord {
  id: string;
  slug: string;
  displayName: string;
  status: string;
  basePrice?: number | null;
  currency?: string | null;
  city?: string | null;
  country?: string | null;
  responseTimeHours?: number | null;
  verifiedAt?: Date | null;
  createdAt?: Date | null;
}

const DEPOSIT_AMOUNT_EUR = 1;
const HOLD_WINDOW_HOURS = 48;

function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

function formatResponseTime(hours: number | null | undefined): string {
  if (hours === null || hours === undefined || Number.isNaN(hours)) {
    return 'Sin datos de respuesta';
  }
  if (hours < 1) {
    return '< 1 h de respuesta media';
  }
  if (hours < 24) {
    return `${Math.round(hours)} h de respuesta media`;
  }
  const days = Math.round(hours / 24);
  return `${days} d de respuesta media`;
}

function formatLocation(city: string | null | undefined, country: string | null | undefined): string {
  const parts = [city, country].filter((value): value is string => Boolean(value && value.trim().length > 0));
  if (parts.length === 0) {
    return 'Ubicación no especificada';
  }
  return parts.join(', ');
}

function formatMemberSince(createdAt: Date | null | undefined): string {
  if (!createdAt) {
    return 'Fecha de alta no disponible';
  }
  const year = createdAt.getFullYear();
  const month = createdAt.toLocaleString('es-ES', { month: 'long' });
  return `En EAR desde ${month} ${year}`;
}

function BookingSkeleton(): React.ReactElement {
  return (
    <main className="min-h-screen bg-[#030305] text-white pt-40 pb-24" aria-busy="true" aria-live="polite">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 md:p-20 space-y-12 relative overflow-hidden animate-pulse">
          <div className="space-y-6">
            <div className="h-6 w-48 bg-white/5 rounded-full" />
            <div className="h-16 w-3/4 bg-white/5 rounded-2xl" />
            <div className="h-4 w-2/3 bg-white/5 rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 gap-12 pt-12 border-t border-white/5">
            <div className="space-y-6">
              <div className="h-4 w-full bg-white/5 rounded-full" />
              <div className="h-4 w-5/6 bg-white/5 rounded-full" />
              <div className="h-4 w-4/6 bg-white/5 rounded-full" />
              <div className="h-10 w-40 bg-white/5 rounded-xl" />
            </div>
            <div className="bg-white/5 p-10 rounded-3xl space-y-8">
              <div className="h-8 w-full bg-white/5 rounded-xl" />
              <div className="h-14 w-full bg-white/5 rounded-xl" />
              <div className="h-3 w-3/4 mx-auto bg-white/5 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function BookingErrorState({ message }: { message: string }): React.ReactElement {
  return (
    <main className="min-h-screen bg-[#030305] text-white pt-40 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white/[0.02] border border-red-500/20 rounded-[3rem] p-12 md:p-20 space-y-8 relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="flex justify-center">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400">
              <AlertTriangle size={32} />
            </div>
          </div>
          <div className="space-y-4">
            <span className="text-red-400 text-[10px] font-black uppercase tracking-[0.4em] block">
              Error de Reserva
            </span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none font-syne">
              No se pudo cargar <br />
              <span className="text-white/40">la reserva</span>
            </h1>
            <p className="text-white/50 leading-relaxed max-w-xl mx-auto">{message}</p>
          </div>
          <div className="pt-4">
            <Link
              href="/artistas"
              className="inline-flex items-center gap-3 bg-[#ecb613] text-black font-black uppercase tracking-[0.3em] text-[10px] px-8 py-4 rounded-xl hover:bg-white transition-all"
            >
              Explorar Artistas <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function BookingEmptyState(): React.ReactElement {
  return (
    <main className="min-h-screen bg-[#030305] text-white pt-40 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 md:p-20 space-y-8 relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ecb613]/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="flex justify-center">
            <div className="p-4 bg-[#ecb613]/10 border border-[#ecb613]/20 rounded-2xl text-[#ecb613]">
              <Sparkles size={32} />
            </div>
          </div>
          <div className="space-y-4">
            <span className="text-[#ecb613] text-[10px] font-black uppercase tracking-[0.4em] block">
              Reserva no disponible
            </span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none font-syne">
              Este perfil <br />
              <span className="text-white/40">no acepta reservas</span>
            </h1>
            <p className="text-white/50 leading-relaxed max-w-xl mx-auto">
              El artista no está publicado o su agenda no admite bloqueos instantáneos en este momento.
            </p>
          </div>
          <div className="pt-4">
            <Link
              href="/artistas"
              className="inline-flex items-center gap-3 bg-[#ecb613] text-black font-black uppercase tracking-[0.3em] text-[10px] px-8 py-4 rounded-xl hover:bg-white transition-all"
            >
              Ver otros artistas <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default async function ArtistBookingPage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug || slug.trim().length === 0) {
    return <BookingEmptyState />;
  }

  let artist: ArtistRecord | null = null;
  let loadError: string | null = null;

  try {
    artist = (await prisma.artistProfile.findUnique({
      where: { slug },
    })) as ArtistRecord | null;
  } catch (error) {
    console.error('❌ [TALENT OS] Error al cargar datos para reserva:', error);
    loadError = 'Ha ocurrido un error al conectar con el servicio de reservas. Inténtalo de nuevo en unos minutos.';
  }

  if (loadError) {
    return <BookingErrorState message={loadError} />;
  }

  if (!artist) {
    notFound();
  }

  if (artist.status !== 'PUBLISHED') {
    return <BookingEmptyState />;
  }

  const currency = artist.currency && artist.currency.trim().length > 0 ? artist.currency : 'EUR';
  const depositLabel = formatCurrency(DEPOSIT_AMOUNT_EUR, currency);
  const responseLabel = formatResponseTime(artist.responseTimeHours ?? null);
  const locationLabel = formatLocation(artist.city ?? null, artist.country ?? null);
  const verifiedLabel = artist.verifiedAt ? 'Perfil verificado' : 'Verificación pendiente';
  const memberSinceLabel = formatMemberSince(artist.createdAt ?? null);
  const basePriceLabel =
    typeof artist.basePrice === 'number' && Number.isFinite(artist.basePrice)
      ? formatCurrency(artist.basePrice, currency)
      : 'Tarifa a consultar';

  return (
    <main className="min-h-screen bg-[#030305] text-white pt-40 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        {/* 🛡️ SECCIÓN DE RESERVA */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 md:p-20 space-y-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ecb613]/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#ecb613]/10 border border-[#ecb613]/20 rounded-lg text-[#ecb613]">
                <Zap size={20} />
              </div>
              <span className="text-[#ecb613] text-[10px] font-black uppercase tracking-[0.4em]">
                Reserva Instantánea
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none font-syne">
              Bloquear Fecha <br />
              <span className="text-white/40">{artist.displayName}</span>
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-black uppercase tracking-widest text-white/40">
              <span className="inline-flex items-center gap-2">
                <MapPin size={12} /> {locationLabel}
              </span>
              <span className="text-white/20">•</span>
              <span className="inline-flex items-center gap-2">
                <Clock size={12} /> {responseLabel}
              </span>
              <span className="text-white/20">•</span>
              <span className="inline-flex items-center gap-2">
                <BadgeCheck size={12} /> {verifiedLabel}
              </span>
              <span className="text-white/20">•</span>
              <span>{memberSinceLabel}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 pt-12 border-t border-white/5">
            <div className="space-y-8">
              <p className="text-white/60 leading-relaxed">
                Depósito de {depositLabel} para bloquear la fecha durante {HOLD_WINDOW_HOURS} h. El equipo EAR valida
                disponibilidad, logística y contrato antes de confirmar la reserva.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-white/40">
                  <Calendar size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Bloqueo de {HOLD_WINDOW_HOURS} h desde el pago
                  </span>
                </div>
                <div className="flex items-center gap-4 text-white/40">
                  <ShieldCheck size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {verifiedLabel} · Garantía EAR Gold
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-2">
                  Tarifa base del artista
                </span>
                <span className="text-2xl font-black italic">{basePriceLabel}</span>
              </div>
            </div>

            <div className="bg-white/5 p-10 rounded-3xl space-y-8">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                  Depósito de Reserva
                </span>
                <span className="text-3xl font-black italic">{depositLabel}</span>
              </div>
              <button
                type="button"
                className="w-full bg-[#ecb613] text-black font-black uppercase tracking-[0.3em] py-5 rounded-xl flex items-center justify-center gap-4 hover:bg-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
                aria-label={`Proceder al pago del depósito de ${depositLabel}`}
              >
                Proceder al Pago <CreditCard size={18} />
              </button>
              <p className="text-[8px] text-white/20 uppercase tracking-widest font-bold text-center leading-relaxed">
                Pago procesado por EAR Payments. <br />
                No reembolsable tras validación de fecha.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href={`/artistas/${artist.slug}`}
            className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors inline-flex items-center gap-2"
          >
            <ArrowRight size={12} className="rotate-180" /> Volver al Perfil
          </Link>
        </div>
      </div>
    </main>
  );
}

export { BookingSkeleton, BookingErrorState, BookingEmptyState };