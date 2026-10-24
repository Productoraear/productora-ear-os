import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Heart,
  CalendarCheck,
  ShieldCheck,
  MessageCircle,
  Bookmark,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';
import { DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';

export const metadata: Metadata = {
  title: 'Área de Parejas · Tu Boda Gestionada con Garantía S-Class | Productora EAR',
  description: `Espacio privado para novios: guarda proveedores favoritos, bloquea la fecha con depósito ${DEPOSITO_STRIPE_EUR}€ 100% deducible y recibe asesoría nupcial directa por WhatsApp sin coste.`,
  alternates: { canonical: 'https://productoraear.com/bodas/parejas' },
};

const FEATURES = [
  { icon: Bookmark, title: 'Favoritos & Listas', text: 'Guarda proveedores homologados y compara presupuestos en un único panel.' },
  { icon: CalendarCheck, title: 'Bloqueo de Fecha', text: `Depósito ${DEPOSITO_STRIPE_EUR}€ Price-Lock SHA-256, 100% deducible del total del show.` },
  { icon: MessageCircle, title: 'Asesoría Rápida', text: `WhatsApp directo ${CENTRALITA.display} para resolver dudas sin coste.` },
  { icon: ShieldCheck, title: 'Garantía Plan B', text: 'Relevo garantizado en menos de 2 horas y rider acústico 12 W/pax.' },
] as const;

const STEPS = [
  { n: '01', title: 'Explora por gremio', text: 'Navega la taxonomía canónica desde /bodas con filtros de precio, fecha, radio y momento.' },
  { n: '02', title: 'Bloquea la fecha', text: 'Cierra disponibilidad con depósito 100€ deducible y bloqueo atómico de fecha/hora.' },
  { n: '03', title: 'Confirma', text: 'Liquidación transparente con Split 80/10/10 y contrato digital sin intermediarios abusivos.' },
] as const;

export default function AreaParejasPage() {
  return (
    <main className="min-h-screen bg-[#030305] text-white overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <section className="space-y-6 max-w-3xl">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono font-black uppercase tracking-widest">
            <Heart className="w-3.5 h-3.5" /> Área de Parejas
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-white font-syne leading-[1.08] text-balance">
            Tu boda, gestionada<br />
            <span className="text-[#ecb613]">sin fricción comercial</span>
          </h1>
          <p className="text-sm sm:text-base text-white/60 font-light leading-relaxed max-w-xl">
            Garantía Mutua de Doble Vía: asesoría gratuita por WhatsApp o blindaje VIP con
            depósito 100€ deducible. Cero cuotas fijas, cero mensajes lentos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <a
              href={CENTRALITA.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-[#ecb613] hover:bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_10px_35px_rgba(236,182,19,0.4)] hover:scale-[1.03]"
            >
              <MessageCircle className="w-4 h-4" /> Asesoría Gratuita
            </a>
            <Link
              href="/bodas"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl border border-white/15 flex items-center justify-center gap-2 transition-all duration-300"
            >
              Explorar Proveedores <ChevronRight className="w-4 h-4 text-[#ecb613]" />
            </Link>
          </div>
        </section>

        <section className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 space-y-3 transition-all duration-300 hover:border-[#ecb613]/40 hover:-translate-y-1">
              <f.icon className="w-6 h-6 text-[#ecb613]" />
              <h3 className="text-sm font-black uppercase text-white font-syne">{f.title}</h3>
              <p className="text-xs text-white/55 leading-relaxed font-light">{f.text}</p>
            </div>
          ))}
        </section>

        <section className="mt-20 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono font-black uppercase tracking-[0.3em] text-[#ecb613]">Cómo funciona</span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-syne">Tres pasos, cero fricción</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {STEPS.map((s) => (
              <div key={s.n} className="relative rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 pt-10 overflow-hidden">
                <span className="absolute -top-4 -left-2 text-7xl font-black text-white/5 font-syne select-none">{s.n}</span>
                <h3 className="text-base font-black uppercase text-white font-syne">{s.title}</h3>
                <p className="text-xs text-white/55 leading-relaxed font-light mt-2">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-3xl bg-gradient-to-br from-[#12120f] to-[#0a0a0d] border border-[#ecb613]/30 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest block font-black">Price-Lock SHA-256</span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-syne">Bloquea tu fecha hoy</h2>
            <p className="text-xs sm:text-sm text-white/60 font-light">
              Depósito {DEPOSITO_STRIPE_EUR}€ 100% deducible. Si cambias de idea, reembolso automático en 24h.
            </p>
          </div>
          <Link
            href="/reservar/solista"
            className="shrink-0 px-8 py-4 bg-[#ecb613] hover:bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl flex items-center gap-2 transition-all duration-300 shadow-[0_0_30px_rgba(236,182,19,0.35)] hover:scale-105"
          >
            <Sparkles className="w-4 h-4" /> Reservar Fecha
          </Link>
        </section>
      </div>
    </main>
  );
}
