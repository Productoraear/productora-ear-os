import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  BadgeCheck,
  Wallet,
  MessageCircle,
  TrendingUp,
  ChevronRight,
  Lock,
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';
import { SPLIT_SOBERANO, DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';

const ARTISTA_PCT = Math.round(SPLIT_SOBERANO.artista * 100);
const EAR_PCT = Math.round(SPLIT_SOBERANO.earOs * 100);
const VIMUME_PCT = Math.round(SPLIT_SOBERANO.vimume * 100);

export const metadata: Metadata = {
  title: 'Área de Proveedor · Homologación S-Class & Split 80/10/10 | Productora EAR',
  description: `Espacio privado para proveedores: reclama tu ficha con 2FA, obtén homologación acústica y cobra con liquidación transparente del Split Soberano ${ARTISTA_PCT}/${EAR_PCT}/${VIMUME_PCT}.`,
  alternates: { canonical: 'https://productoraear.com/bodas/proveedor' },
};

const FEATURES = [
  { icon: BadgeCheck, title: 'Reclama tu Ficha (2FA)', text: 'Verifica la titularidad de tu negocio y desbloquea el contacto directo verificable.' },
  { icon: ShieldCheck, title: 'Homologación S-Class', text: 'Auditoría acústica 12 W/pax, rider por contexto y seguro de RC 1M€.' },
  { icon: Wallet, title: 'Panel de Reservas', text: `Cobra con depósito ${DEPOSITO_STRIPE_EUR}€ Price-Lock y comisiones liquidadas en 7 días.` },
  { icon: TrendingUp, title: `Split ${ARTISTA_PCT}/${EAR_PCT}/${VIMUME_PCT}`, text: 'Cero cuotas fijas. Cobras el 80% como artista ejecutor.' },
] as const;

export default function AreaProveedorPage() {
  return (
    <main className="min-h-screen bg-[#030305] text-white overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <section className="space-y-6 max-w-3xl">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-[10px] font-mono font-black uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" /> Área de Proveedor
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-white font-syne leading-[1.08] text-balance">
            Monetiza tu talento<br />
            <span className="text-[#00E5FF]">sin cuotas fijas</span>
          </h1>
          <p className="text-sm sm:text-base text-white/60 font-light leading-relaxed max-w-xl">
            Reclama tu perfil verificado con teléfono real, obtén homologación S-Class y
            liquida cada reserva con el Split Soberano {ARTISTA_PCT}/{EAR_PCT}/{VIMUME_PCT}. Cero fachadas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link
              href="/reclamar-perfil"
              className="px-8 py-4 bg-[#00E5FF] hover:bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_10px_35px_rgba(0,229,255,0.35)] hover:scale-[1.03]"
            >
              <Lock className="w-4 h-4" /> Reclamar mi Perfil
            </Link>
            <a
              href={CENTRALITA.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl border border-white/15 flex items-center justify-center gap-2 transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4 text-[#00E5FF]" /> Hablar con el CEO
            </a>
          </div>
        </section>

        <section className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 space-y-3 transition-all duration-300 hover:border-[#00E5FF]/40 hover:-translate-y-1">
              <f.icon className="w-6 h-6 text-[#00E5FF]" />
              <h3 className="text-sm font-black uppercase text-white font-syne">{f.title}</h3>
              <p className="text-xs text-white/55 leading-relaxed font-light">{f.text}</p>
            </div>
          ))}
        </section>

        <section className="mt-20 rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 sm:p-12 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono font-black uppercase tracking-[0.3em] text-[#00E5FF]">Modelo de Monetización</span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-syne">Cero cuotas · Cobro por reserva cerrada</h2>
            <p className="text-sm text-white/55 font-light max-w-2xl leading-relaxed">
              No pagas mensualidades. EAR OS gana cuando tú ganas: {EAR_PCT}% de infraestructura y {VIMUME_PCT}%
              de impacto social se descuentan solo al cerrar reserva. Tu {ARTISTA_PCT}% llega íntegro.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { pct: `${ARTISTA_PCT}%`, label: 'Artista Ejecutor', color: '#ecb613' },
              { pct: `${EAR_PCT}%`, label: 'Infraestructura EAR OS', color: '#00E5FF' },
              { pct: `${VIMUME_PCT}%`, label: 'VIMUME (Impacto Social)', color: '#34D399' },
            ].map((row) => (
              <div key={row.label} className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 text-center space-y-1">
                <span className="text-4xl font-black font-syne" style={{ color: row.color }}>{row.pct}</span>
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/50">{row.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-3xl bg-gradient-to-br from-[#0a1214] to-[#0a0a0d] border border-[#00E5FF]/30 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-[10px] font-mono text-[#00E5FF] uppercase tracking-widest block font-black">Doctrina del Dato Verificado</span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-syne">Solo se vende con teléfono real</h2>
            <p className="text-xs sm:text-sm text-white/60 font-light">
              Perfiles con placeholder o centralita se marcan `verified:false` y no se exponen.
              Reclama tu ficha para desbloquear la visibilidad directa.
            </p>
          </div>
          <Link
            href="/panel"
            className="shrink-0 px-8 py-4 bg-[#00E5FF] hover:bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl flex items-center gap-2 transition-all duration-300 shadow-[0_0_30px_rgba(0,229,255,0.35)] hover:scale-105"
          >
            Ir a mi Panel <ChevronRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </main>
  );
}
