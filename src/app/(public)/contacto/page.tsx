"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MessageSquare, Mail, MapPin, MessageCircle, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/whatsapp';

function ContactoContent() {
  const searchParams = useSearchParams();
  const [redirected, setRedirected] = useState(false);

  // Extract parameters from URL query strings
  const profile = searchParams.get('profile') || searchParams.get('perfil') || searchParams.get('artist') || '';
  const service = searchParams.get('service') || searchParams.get('servicio') || searchParams.get('subject') || '';
  const date = searchParams.get('date') || searchParams.get('fecha') || '';
  const location = searchParams.get('location') || searchParams.get('provincia') || searchParams.get('ciudad') || '';
  const intent = searchParams.get('intent') || searchParams.get('intencion') || 'reserva prioritaria';

  // Generate WhatsApp details using our unified server/client utility
  const { message, url } = generateWhatsAppLink({
    profile,
    service,
    date,
    location,
    intent
  });

  // Perform secure client-side redirection automatically on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = url;
      setRedirected(true);
    }, 1000); // 1-second delay to delight the user with the brand transition
    return () => clearTimeout(timer);
  }, [url]);

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      
      {/* 📬 ABOVE THE FOLD GLOWING CARD */}
      <div className="bg-card border border-border rounded-[3rem] p-8 md:p-12 relative overflow-hidden group shadow-xl transition-all duration-300">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-500/[0.02] blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 space-y-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-primary/10 text-primary border border-primary/25 font-mono inline-block">
                CONEXIÓN DE ALTA PRIORIDAD (S-CLASS)
              </span>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none font-syne text-foreground">
                Canal <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-amber-500 dark:to-primary">WhatsApp</span> Directo
              </h1>
            </div>
            
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/25 rounded-full text-[9px] font-mono text-green-500 font-bold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-ping" />
              {redirected ? 'REDIRECCIÓN EJECUTADA' : 'CONECTANDO EN VIVO'}
            </div>
          </div>

          {/* REDIRECTION SPINNER / LOADER */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6 text-primary animate-spin" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">Redirigiendo de forma segura a WhatsApp S-Class...</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Si tu navegador bloquea la redirección automática, utiliza el botón táctil masivo de abajo.
              </p>
            </div>
          </div>

          <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl">
            Sin esperas ni formularios. Hemos pre-cargado las especificaciones de su interés en un mensaje seguro. Al hacer clic en el botón inferior, iniciará una conversación de gala directa con nuestro equipo de dirección y coordinación técnica en España.
          </p>

          {/* SPECIFICATION PREVIEW IN THE CARD */}
          {(profile || service || date || location) && (
            <div className="bg-muted border border-border rounded-2xl p-6 text-left space-y-3 max-w-2xl">
              <p className="text-[9px] font-mono font-black uppercase text-muted-foreground/50 tracking-widest border-b border-border pb-2">
                Especificaciones del Match Detectadas:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                {profile && (
                  <div>
                    <span className="text-muted-foreground/40 text-[9px] block uppercase">ARTISTA:</span>
                    <span className="text-primary font-bold">{profile.replace(/-/g, ' ').toUpperCase()}</span>
                  </div>
                )}
                {service && (
                  <div>
                    <span className="text-muted-foreground/40 text-[9px] block uppercase">FORMATO:</span>
                    <span className="text-foreground/80 font-bold">{service.replace(/-/g, ' ').toUpperCase()}</span>
                  </div>
                )}
                {date && (
                  <div>
                    <span className="text-muted-foreground/40 text-[9px] block uppercase">FECHA:</span>
                    <span className="text-foreground/80 font-bold">{date}</span>
                  </div>
                )}
                {location && (
                  <div>
                    <span className="text-muted-foreground/40 text-[9px] block uppercase">UBICACIÓN:</span>
                    <span className="text-foreground/80 font-bold">{location.replace(/-/g, ' ').toUpperCase()}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MAIN MASSIVE CTA ABOVE THE FOLD */}
          <div className="pt-4">
            <a 
              href={url}
              className="inline-flex w-full md:w-auto items-center justify-center gap-4 px-10 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_15px_40px_rgba(34,197,94,0.25)] text-xs md:text-sm"
            >
              <MessageCircle size={22} className="fill-white/10" />
              Iniciar Chat de Reserva
              <ArrowRight size={18} />
            </a>
          </div>

          {/* PRELOADED TEXT PREVIEW */}
          <div className="space-y-2 max-w-2xl text-left border-t border-border pt-6">
            <span className="text-[8px] font-mono text-muted-foreground/40 uppercase tracking-widest block">Mensaje estructurado listo para envío:</span>
            <div className="bg-background border border-border rounded-xl p-4 text-[10px] text-muted-foreground leading-relaxed font-mono whitespace-pre-line max-h-36 overflow-y-auto">
              {message}
            </div>
          </div>

        </div>
      </div>

      {/* STICKY BOTTOM ACTION BAR FOR MOBILE */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur-xl border-t border-border z-50 md:hidden flex justify-between items-center gap-4">
        <div className="flex flex-col">
          <span className="text-[8px] text-primary font-black uppercase tracking-widest">PRODUCTORA EAR</span>
          <span className="text-[10px] text-muted-foreground font-bold font-mono">
            {profile ? profile.substring(0, 16) + '...' : 'Canal Directo'}
          </span>
        </div>
        <a 
          href={url}
          className="flex-1 py-4 bg-green-500 hover:bg-green-400 text-white text-center font-black uppercase tracking-wider text-[10px] rounded-xl flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(34,197,94,0.3)]"
        >
          <MessageCircle size={16} />
          Chatear en WhatsApp
        </a>
      </div>

      {/* SECONDARY INFO CHANNELS */}
      <div className="grid md:grid-cols-2 gap-6 pb-12">
        <div className="p-8 bg-card border border-border rounded-[2rem] space-y-4 hover:border-primary/20 transition-colors shadow-md">
          <Mail className="text-primary" size={24} />
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Email de Respaldo</p>
          <p className="text-base font-bold text-foreground">hola@productoraear.com</p>
        </div>
        <div className="p-8 bg-card border border-border rounded-[2rem] space-y-4 hover:border-primary/20 transition-colors shadow-md">
          <MapPin className="text-primary" size={24} />
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Oficina Técnica</p>
          <p className="text-base font-bold text-foreground">Madrid, España</p>
        </div>
      </div>

    </div>
  );
}

export default function ContactoPage() {
  return (
    <main className="bg-background text-foreground min-h-screen selection:bg-primary/30 relative">
      
      {/* Background Decor */}
      <div className="absolute inset-0 bg-gradient-to-br from-card via-background to-card pointer-events-none z-0 opacity-40" />

      <section className="pt-32 pb-20 px-6 relative overflow-hidden z-10">
        
        {/* Glow ambient background element */}
        <div className="absolute top-0 right-0 p-32 opacity-[0.03] pointer-events-none text-primary">
          <MessageSquare size={400} />
        </div>

        <Suspense fallback={
          <div className="max-w-4xl mx-auto text-center py-20">
            <span className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin inline-block mb-4" />
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Inicializando canal seguro...</p>
          </div>
        }>
          <ContactoContent />
        </Suspense>

      </section>
    </main>
  );
}
