import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, ShieldCheck, ArrowRight, Phone, MessageCircle, 
  Crown, Heart, Building2, Boxes, Mic2, FileText, CheckCircle2, 
  Calendar, Star, Music, Award, Users, ChevronRight
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';

export default function Home() {
  const occasionLinks = [
    { title: 'Bodas de Gala', href: '/artistas/bodas', tag: 'B2C VIP' },
    { title: 'Cumpleaños & Fiestas', href: '/artistas/cumpleanos', tag: 'FAMILIAR' },
    { title: 'Licitaciones B2G', href: '/ocasiones/ayuntamientos', tag: 'SECTOR PÚBLICO' },
    { title: 'Eventos Corporativos', href: '/ocasiones/corporativo', tag: 'B2B ÉLITE' },
    { title: 'Ferias & Grandes Formatos', href: '/ocasiones/ferias', tag: 'MASIVO' },
    { title: 'Mariachis en Madrid', href: '/servicios/mariachis/madrid', tag: 'LOCAL' },
  ];

  return (
    <div className="bg-[#050505] text-white min-h-screen flex flex-col selection:bg-[#ecb613] selection:text-black">
      
      {/* 🚀 HERO SECTION: INTENT ROUTER S-CLASS */}
      <section className="pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6 relative overflow-hidden">
        {/* Ambient glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-[#ecb613]/10 via-transparent to-transparent blur-[140px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono font-black uppercase tracking-[0.3em]">
            <span className="w-2 h-2 rounded-full bg-[#ecb613] animate-ping" />
            EAR OS // PLATAFORMA DE CONTRATACIÓN MUSICAL & LOGÍSTICA S-CLASS
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase italic tracking-tighter text-white font-syne leading-[0.9]">
            La Infraestructura que Convierte <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white">
              Intención en Realidad
            </span>
          </h1>

          <p className="text-white/60 text-base sm:text-xl max-w-3xl mx-auto font-light leading-relaxed">
            No somos un catálogo inerte. Interpretamos tu necesidad, calculamos el presupuesto exacto sin intermediarios y coordinamos la actuación con rigor logístico y cobertura jurídica completa.
          </p>

          {/* Quick Intent CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-xl mx-auto">
            <Link
              href="/cotizador"
              className="w-full sm:w-auto flex-1 py-4 px-8 rounded-2xl bg-[#ecb613] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 min-h-[50px] shadow-xl shadow-[#ecb613]/20 active:scale-95 transition-all"
            >
              <span>Calcular Presupuesto en Vivo</span>
              <ArrowRight size={16} />
            </Link>

            <a
              href={CENTRALITA.tel}
              className="w-full sm:w-auto flex-1 py-4 px-8 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 min-h-[50px] active:scale-95 transition-all"
            >
              <Phone size={16} className="text-[#ecb613]" />
              <span>Llamar Centralita: {CENTRALITA.display}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 👑 PACIENTE CERO: EDWIN AGUDELO (TARJETA DE HONOR INSIGNIA) */}
      <section className="px-4 sm:px-6 pb-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-b from-[#121212] to-[#080808] border border-[#ecb613]/40 rounded-[2.5rem] sm:rounded-[3.5rem] p-6 sm:p-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#ecb613]/10 blur-[100px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Bio & Authority */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#ecb613] text-black text-[9px] font-black uppercase tracking-widest font-mono">
                    PACIENTE CERO // ARTISTA INSIGNIA
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-[9px] font-mono">
                    37+ CONCIERTOS INTERNACIONALES
                  </span>
                </div>

                <div>
                  <h2 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tighter text-white font-syne">
                    Edwin Agudelo
                  </h2>
                  <p className="text-[#ecb613] text-xs sm:text-sm font-bold uppercase tracking-widest mt-1">
                    Tenor Lírico & Mariachi de Gran Gala
                  </p>
                </div>

                <p className="text-white/60 text-sm sm:text-base leading-relaxed font-light">
                  La validación viva de EAR OS. Desde recitales íntimos a piano hasta grandes ensambles orquestales de 16 músicos y espectáculos ecuestres de alta escuela. Cobertura en toda España con ingeniería acústica dedicada.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-black/60 p-3.5 rounded-2xl border border-white/5">
                    <span className="text-[9px] font-mono uppercase text-zinc-400 block">Solista & Piano</span>
                    <span className="text-lg font-black text-white">650€</span>
                  </div>
                  <div className="bg-black/60 p-3.5 rounded-2xl border border-white/5">
                    <span className="text-[9px] font-mono uppercase text-zinc-400 block">Cuarteto Imperial</span>
                    <span className="text-lg font-black text-[#ecb613]">950€</span>
                  </div>
                  <div className="bg-black/60 p-3.5 rounded-2xl border border-white/5">
                    <span className="text-[9px] font-mono uppercase text-zinc-400 block">Gran Gala (6+)</span>
                    <span className="text-lg font-black text-white">2.800€</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Link
                    href="/artistas/edwin-agudelo"
                    className="py-3.5 px-6 rounded-2xl bg-[#ecb613] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 min-h-[48px] shadow-lg shadow-[#ecb613]/20 active:scale-95 transition-all"
                  >
                    <span>Ver Dossier Oficial de Edwin Agudelo</span>
                    <ChevronRight size={16} />
                  </Link>
                  <Link
                    href="/cotizador?items=cuarteto-gala"
                    className="py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 min-h-[48px] transition-all"
                  >
                    <span>Cotizar Formato Directo</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Key Metrics & Seals */}
              <div className="lg:col-span-5 bg-black/60 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5">
                <h4 className="text-xs font-mono font-black uppercase tracking-widest text-[#ecb613] flex items-center gap-2">
                  <ShieldCheck size={16} /> Garantías de Contratación S-Class
                </h4>

                <ul className="space-y-3 text-xs text-white/80">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#ecb613] shrink-0 mt-0.5" />
                    <span>Microfonía inalámbrica Shure Axient Digital & Neumann sin interferencias.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#ecb613] shrink-0 mt-0.5" />
                    <span>Póliza de Responsabilidad Civil de 1.000.000€ y altas de Seguridad Social.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#ecb613] shrink-0 mt-0.5" />
                    <span>Bloqueo atómico de fecha con depósito de reserva trazable.</span>
                  </li>
                </ul>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                  <span className="text-[10px] font-mono text-zinc-400 block uppercase">Disponibilidad Actual</span>
                  <span className="text-sm font-black text-emerald-400">● Calendario Abierto para Temporada 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🧭 CUATRO PERFILES, CUATRO CAMINOS: EL ROUTER DE INTENCIÓN */}
      <section className="px-4 sm:px-6 py-16 bg-[#080808] border-y border-white/5 relative z-10">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#ecb613]">ADAPTACIÓN MULTI-PERFIL</span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tighter text-white font-syne">
              Cuatro Perfiles. Cuatro Caminos. <br />
              <span className="text-white/40">Una Sola Inteligencia.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Profile 1: Particular / Pareja / Cliente */}
            <div className="bg-[#101010] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-[#ecb613]/50 transition-all shadow-xl">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                  <Heart size={22} />
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">Perfil 1</span>
                  <h3 className="text-xl font-black uppercase italic tracking-tight text-white mt-0.5">Cliente de Eventos</h3>
                </div>
                <p className="text-white/50 text-xs leading-relaxed">
                  Bodas, aniversarios y galas privadas. Presupuesto exacto con Price-Lock SHA-256 (72h) y depósito de 10 €.
                </p>
              </div>
              <Link
                href="/cotizador?mode=bespoke&role=cliente"
                className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-[#ecb613] hover:text-black text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 min-h-[48px] transition-all"
              >
                <span>Cotización Bespoke</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {/* Profile 2: Institución / B2G */}
            <div className="bg-[#101010] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-[#ecb613]/50 transition-all shadow-xl">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Building2 size={22} />
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">Perfil 2</span>
                  <h3 className="text-xl font-black uppercase italic tracking-tight text-white mt-0.5">Institución / B2G</h3>
                </div>
                <p className="text-white/50 text-xs leading-relaxed">
                  Ayuntamientos, comisiones y residencias. Contratos menores (Art. 118 LCSP &lt;15.000€) y fondos NextGenEU.
                </p>
              </div>
              <Link
                href="/vimume/clinica?mode=b2g&role=institucion"
                className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-[#ecb613] hover:text-black text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 min-h-[48px] transition-all"
              >
                <span>Pliegos B2G & VIMUME</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {/* Profile 3: Proveedor / Partner */}
            <div className="bg-[#101010] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-[#ecb613]/50 transition-all shadow-xl">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Boxes size={22} />
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">Perfil 3</span>
                  <h3 className="text-xl font-black uppercase italic tracking-tight text-white mt-0.5">Proveedor / Partner</h3>
                </div>
                <p className="text-white/50 text-xs leading-relaxed">
                  Sonido Line Array, microfonía y logística. Intégrate en la red S-Class o reclama tu ficha entre los 22.471 indexados.
                </p>
              </div>
              <Link
                href="/servicios?mode=dynamic&role=proveedor"
                className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-[#ecb613] hover:text-black text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 min-h-[48px] transition-all"
              >
                <span>Ingresar al Ecosistema</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {/* Profile 4: Artista / Producción */}
            <div className="bg-[#101010] border border-[#ecb613]/30 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-[#ecb613] transition-all shadow-xl">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
                  <Mic2 size={22} />
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#ecb613]">Perfil 4</span>
                  <h3 className="text-xl font-black uppercase italic tracking-tight text-white mt-0.5">Artista / Producción</h3>
                </div>
                <p className="text-white/50 text-xs leading-relaxed">
                  The Signal: Evaluación de talento para Diamantes Rojos con liquidación soberana bajo el split 80/10/10.
                </p>
              </div>
              <Link
                href="/artistas?mode=signal&role=artista"
                className="w-full py-3.5 rounded-2xl bg-[#ecb613] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 min-h-[48px] shadow-lg shadow-[#ecb613]/20 active:scale-95 transition-all"
              >
                <span>Evaluar en The Signal</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 HUBS POR OCASIÓN Y DEMANDA TRANSACCIONAL */}
      <section className="px-4 sm:px-6 py-16 relative z-10">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#ecb613]">DEMANDA ORGÁNICA</span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase italic tracking-tight text-white font-syne">
                Páginas de Ocasión & Contratación
              </h2>
            </div>
            <Link
              href="/cotizador"
              className="text-xs font-black uppercase tracking-widest text-[#ecb613] hover:underline flex items-center gap-1 min-h-[44px]"
            >
              <span>Ver Cotizador Integral →</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {occasionLinks.map(occ => (
              <Link
                key={occ.href}
                href={occ.href}
                className="bg-[#0e0e0e] border border-white/10 hover:border-[#ecb613]/50 rounded-2xl p-5 flex items-center justify-between group transition-all min-h-[64px]"
              >
                <div className="space-y-1">
                  <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-400 block">{occ.tag}</span>
                  <span className="text-sm font-black uppercase tracking-tight text-white group-hover:text-[#ecb613] transition-colors">{occ.title}</span>
                </div>
                <ChevronRight size={16} className="text-zinc-500 group-hover:text-[#ecb613] transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
