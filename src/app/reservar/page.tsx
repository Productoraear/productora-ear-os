import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Music, Users, ShieldCheck, ArrowRight, Star, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Reserva Oficial de Artistas & Shows en Directo · Productora EAR",
  description:
    "Reserva oficial con garantía contractual y depósito de 100 € en Stripe. Elige entre el Solista Insignia Edwin Agudelo (350 €) o explora el Catálogo Nacional de 6.710 artistas auditados.",
  alternates: { canonical: "https://productoraear.com/reservar" },
};

export default function ReservarHubPage() {
  return (
    <main className="w-full min-h-screen bg-[#030305] text-white py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* HEADER PRINCIPAL */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PORTAL CANÓNICO DE RESERVAS · SPLIT SOBERANO 80/10/10</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-syne uppercase tracking-tight">
            Reserva Oficial de <span className="text-[#ecb613]">Artistas & Shows</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
            Reserva directa con garantía contractual, sonido profesional Bose F1 y bloqueo de fecha mediante depósito inmutable de 100 € en Stripe.
          </p>
        </div>

        {/* LAS DOS RUTAS PRINCIPALES DE RESERVA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* OPCIÓN 1: SOLISTA INSIGNIA EDWIN AGUDELO & MARIACHIS */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#100d07] via-[#08080d] to-[#030305] border-2 border-[#ecb613]/80 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-[0_0_30px_rgba(236,182,19,0.15)] group hover:border-[#ecb613] transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#ecb613] text-black font-mono font-black text-xs uppercase">
                  ⭐ Solista Insignia & Gala
                </span>
                <span className="text-xs font-mono text-[#ecb613] font-bold">Desde 350.00 €</span>
              </div>
              <h2 className="text-2xl font-black font-syne uppercase text-white group-hover:text-[#ecb613] transition-colors">
                Edwin Agudelo & Formatos de Gala
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                Contratación directa del tenor lírico Edwin Agudelo (Solista Premium 350€), Mariachis (Trío 550€, Quinteto 850€, Ensamble 13p 1.300€) y Cuartetos de Gala.
              </p>
              <ul className="space-y-2 text-xs font-mono text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#ecb613]" />
                  <span>Sonido Bose F1 2.000W + Shure Axient RF incluido</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#ecb613]" />
                  <span>Logística GPS desde Hub Méntrida (Toledo)</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#ecb613]" />
                  <span>Depósito de 100 € Stripe Price-Lock</span>
                </li>
              </ul>
            </div>

            <Link
              href="/reservar/solista"
              className="w-full bg-[#ecb613] hover:bg-white text-black font-black uppercase py-4 px-6 rounded-2xl text-center transition font-mono text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              <Lock className="w-4 h-4 fill-black" />
              <span>Reservar Edwin Agudelo / Mariachis</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* OPCIÓN 2: DIRECTORIO NACIONAL DE 6.710+ ARTISTAS */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#090912] via-[#050508] to-[#030305] border border-slate-800 p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-slate-600 transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-200 font-mono font-bold text-xs uppercase">
                  🌍 Catálogo Nacional Auditado
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">6.710 Artistas</span>
              </div>
              <h2 className="text-2xl font-black font-syne uppercase text-white group-hover:text-emerald-400 transition-colors">
                Todas las Categorías & Géneros
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                Explora el directorio nacional completo por provincia y especialidad: Flamenco, Pop/Rock, Jazz, DJs, Música Clásica, Magos, Circo, Monólogos e Infantiles.
              </p>
              <ul className="space-y-2 text-xs font-mono text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-emerald-400" />
                  <span>12 Familias Artísticas & 48 Especialidades</span>
                </li>
                <li className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Cobertura en las 52 provincias de España</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-emerald-400" />
                  <span>Split Soberano 80/10/10 para todo el catálogo</span>
                </li>
              </ul>
            </div>

            <Link
              href="/artistas"
              className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-extrabold uppercase py-4 px-6 rounded-2xl text-center transition font-mono text-xs flex items-center justify-center gap-2"
            >
              <Music className="w-4 h-4 text-emerald-400" />
              <span>Explorar 6.710+ Artistas & Shows</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
