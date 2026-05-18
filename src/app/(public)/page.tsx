import Link from "next/link";
import {
  ShieldCheck,
  Brain,
  CheckCircle2,
  Truck,
  Volume2
} from "lucide-react";
import React from "react";
import DiscoverySearch from "@/app/components/public/DiscoverySearch";
import AtmosphereMatcherClient from "@/app/components/public/AtmosphereMatcherClient";

export default function HomePage() {
  return (
    <main className="bg-background text-foreground min-h-screen relative pb-24 md:pb-0">
      
      {/* 🌌 Atmospheric Backdrop (Aura Onyx Blend) */}
      <div className="absolute inset-0 bg-gradient-to-br from-card via-background to-card pointer-events-none z-0 opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_top,rgba(236,182,19,0.08),transparent_65%)] pointer-events-none z-0" />

      {/* 🎬 FIRST SCROLL: HUD BENTO GRID HEADERS */}
      <section className="relative z-10 pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center justify-start min-h-[90vh] space-y-12">
        
        {/* Top Active Status Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card text-muted-foreground text-[9px] font-black uppercase tracking-[0.4em]">
          Ecosistema Transaccional S-Class
        </div>

        {/* Title Gate */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none text-foreground">
            PRODUCTORA<span className="text-primary">EAR</span>
          </h1>
          <p className="text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-muted-foreground">
            Logística y Contratación Territorial Soberana
          </p>
        </div>

        {/* Core Gateway Search Component */}
        <div className="w-full relative z-30">
          <DiscoverySearch />
        </div>

        {/* 🚀 BENTO GRID - THREE VERTICALS ABOVE THE FOLD */}
        <div className="w-full space-y-6 pt-4">
          <div className="text-left border-l-2 border-primary pl-4">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Líneas de Asignación Core</h2>
            <p className="text-muted-foreground text-[9px] uppercase font-bold tracking-wider">Acceso transaccional inmediato sin fricción.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* CARD 1: FLEET OS */}
            <div className="bg-card/60 backdrop-blur-xl border border-border/80 hover:border-primary/40 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-muted rounded-2xl text-primary border border-border">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-foreground">FLEET OS</h3>
                    <p className="text-[9px] font-black uppercase text-muted-foreground tracking-wider">Logística de Flota</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  Logística soberana, emisión de waybills en tiempo real, optimización de rutas y despacho inteligente con cobertura PostGIS.
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-6">
                <Link 
                  href="/command-center" 
                  className="w-full py-3 bg-foreground text-background font-black uppercase text-[9px] tracking-widest rounded-xl text-center hover:bg-primary hover:text-foreground transition-colors"
                >
                  Gestionar Flota
                </Link>
                <Link 
                  href="/servicios" 
                  className="w-full py-2.5 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground font-black uppercase text-[9px] tracking-widest rounded-xl text-center transition-all"
                >
                  Disponibilidad Territorial
                </Link>
              </div>
            </div>

            {/* CARD 2: TALENT OS */}
            <div className="bg-card/60 backdrop-blur-xl border border-border/80 hover:border-primary/40 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-muted rounded-2xl text-primary border border-border">
                    <Volume2 size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-foreground">TALENT OS</h3>
                    <p className="text-[9px] font-black uppercase text-muted-foreground tracking-wider">Roster Premium</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  Roster de artistas élite, perfiles premium verificados y contratación directa con cálculo de depósitos vía Stripe.
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-6">
                <Link 
                  href="/artistas" 
                  className="w-full py-3 bg-primary text-foreground font-black uppercase text-[9px] tracking-widest rounded-xl text-center hover:bg-foreground hover:text-background transition-colors"
                >
                  Reserva Directa
                </Link>
                <Link 
                  href="/contacto" 
                  className="w-full py-2.5 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground font-black uppercase text-[9px] tracking-widest rounded-xl text-center transition-all"
                >
                  Contacto Central
                </Link>
              </div>
            </div>

            {/* CARD 3: VIMUME OS */}
            <div className="bg-card/60 backdrop-blur-xl border border-border/80 hover:border-primary/40 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-muted rounded-2xl text-primary border border-border">
                    <Brain size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-foreground">VIMUME OS</h3>
                    <p className="text-[9px] font-black uppercase text-muted-foreground tracking-wider">Neurotecnología</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  Metodología clínica de estimulación cognitiva a 40Hz, terapias musicales para residencias y convenios con administraciones públicas.
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-6">
                <Link 
                  href="/vimume" 
                  className="w-full py-3 bg-foreground text-background font-black uppercase text-[9px] tracking-widest rounded-xl text-center hover:bg-primary hover:text-foreground transition-colors"
                >
                  Convenios Públicos
                </Link>
                <Link 
                  href="/vimume/conocimiento/agenda-2030-ods" 
                  className="w-full py-2.5 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground font-black uppercase text-[9px] tracking-widest rounded-xl text-center transition-all"
                >
                  Metodología Científica
                </Link>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* 🌌 SECOND SCROLL: INTERACTIVE ATMOSPHERE MATCHER */}
      <section id="atmosphere-matcher" className="relative z-10 py-24 px-4 md:px-8 border-t border-border bg-card/40">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[8px] font-black uppercase tracking-widest">
              ⚡ Motor Inteligente de Atmósferas
            </div>
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-foreground">
              ENCUENTRA TU ATMÓSFERA S-CLASS
            </h2>
            <p className="text-muted-foreground text-xs md:text-sm leading-relaxed font-medium">
              Selecciona el tono de tu evento y el sistema filtrará instantáneamente los proveedores certificados, estimación de presupuesto y disponibilidad.
            </p>
          </div>

          {/* Mount the isolated client-side matcher component */}
          <AtmosphereMatcherClient />

        </div>
      </section>

      {/* 👑 THIRD SCROLL: "RECLAMAR PERFIL S-CLASS" CTA PANEL */}
      <section className="relative z-10 py-24 px-4 md:px-8 border-y border-border bg-card/40">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-card via-background to-card border border-border rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full pointer-events-none" />
          
          <div className="space-y-8 relative z-10 max-w-2xl text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[8px] font-black uppercase tracking-widest">
              <ShieldCheck size={10} /> Canal para Afiliados / Proveedores
            </div>
            
            <div className="space-y-3">
              <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-foreground">
                RECLAMAR PERFIL <span className="text-primary">S-CLASS</span>
              </h2>
              <p className="text-muted-foreground text-xs md:text-sm font-bold uppercase tracking-[0.3em]">
                Únete a la Red de Asignación de Servicios y Logística Soberana
              </p>
            </div>

            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed italic font-medium">
              Si eres artista, músico de élite, terapeuta neurológico o empresa de infraestructura premium, reclama tu perfil para ingresar al ledger de asignación de servicios y capitalizar la demanda con pagos atómicos mediante Stripe Connect.
            </p>

            <div className="grid grid-cols-2 gap-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={12} className="text-primary" /> Liquidaciones Instantáneas
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={12} className="text-primary" /> Despacho por PostGIS
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={12} className="text-primary" /> Roster Verificado
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={12} className="text-primary" /> Conexión Institucional
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/contacto?subject=reclamar-perfil"
                className="px-10 py-5 bg-primary hover:bg-foreground text-foreground hover:text-background rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_40px_rgba(236,182,19,0.25)] inline-block w-full md:w-auto text-center"
              >
                Solicitar Acceso S-Class
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
