import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  MapPin, 
  Volume2, 
  Phone, 
  Sparkles, 
  Radio, 
  Crown,
  ChevronRight
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';
import { PROVINCIAS, SERVICIOS } from '@/lib/constants/seo-data';

const PRIORITY_PROVINCES = new Set(['madrid', 'barcelona', 'valencia', 'sevilla', 'toledo']);

export default function SovereignFooter() {
  return (
    <footer 
      className="w-full bg-[#050508] border-t border-white/10 text-white pt-16 pb-28 px-4 sm:px-8 font-sans relative z-10 overflow-hidden min-h-[500px]"
      aria-label="Pie de Página Soberano Productora EAR"
    >
      {/* Background ambient gold aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-radial from-[#ecb613]/5 via-transparent to-transparent blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* 1. HEADER & BRAND SOBERANO */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/5">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
                <Crown size={18} />
              </div>
              <span className="font-syne font-black text-xl tracking-wider uppercase text-white">
                PRODUCTORA <span className="text-[#ecb613]">EAR</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-white/60 max-w-lg leading-relaxed">
              Infraestructura y Sistema Operativo para Bodas de Alta Distinción, Eventos Corporativos y Licitaciones Públicas B2G. Producción acústica calibrada a 12 W/pax y gestión de talento soberano sin intermediarios pasivos.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                <Radio size={10} className="animate-pulse" />
                <span>Nodo Central Madrid / Cobertura Nacional</span>
              </div>
            </div>
          </div>

          {/* Quick Vertical Links */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#ecb613]">
              Infraestructura
            </h4>
            <nav aria-label="Enlaces de Infraestructura">
              <ul className="space-y-2 text-xs text-white/70">
                <li>
                  <Link 
                    href="/bodas" 
                    prefetch={true}
                    aria-label="Ir a la Experiencia Nupcial"
                    className="hover:text-white hover:text-[#ecb613] transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight size={12} className="text-[#ecb613]" /> Experiencia Nupcial
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/arsenal" 
                    prefetch={true}
                    aria-label="Ir al Arsenal Técnico y Pantallas LED"
                    className="hover:text-white hover:text-[#ecb613] transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight size={12} className="text-[#ecb613]" /> Arsenal Técnico & Pantallas
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/empresarios" 
                    prefetch={true}
                    aria-label="Ir a Consultoría Empresarios B2B"
                    className="hover:text-white hover:text-[#ecb613] transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight size={12} className="text-[#ecb613]" /> Consultoría Empresarios B2B
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/the-signal" 
                    prefetch={false}
                    aria-label="Ir a The Signal Captación de Artistas"
                    className="hover:text-white hover:text-[#ecb613] transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight size={12} className="text-[#ecb613]" /> The Signal (Captación Artistas)
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/vimume" 
                    prefetch={false}
                    aria-label="Ir a VIMUME Neuroestimulación 40Hz"
                    className="hover:text-white hover:text-[#ecb613] transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight size={12} className="text-[#ecb613]" /> VIMUME (Neuroestimulación 40Hz)
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Contacto & Centralita Directa */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#ecb613]">
              Contacto Soberano
            </h4>
            <p className="text-xs text-white/60">
              Atención directa con la Dirección Técnica de Edwin Agudelo:
            </p>
            <a
              href="https://wa.me/34693693048"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contactar con la centralita de WhatsApp al +34 693 693 048"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-[#ecb613] hover:text-black border border-white/10 hover:border-[#ecb613] text-xs font-mono font-bold uppercase transition-all cursor-pointer"
            >
              <Phone size={13} />
              <span>+34 693 693 048</span>
            </a>
          </div>

        </div>

        {/* 2. MATRIZ TERRITORIAL PROGRAMÁTICA (PRE-FETCHING ESTRATÉGICO) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#ecb613] font-bold">
              <MapPin size={14} />
              <span>Red Territorial de Cobertura Oficial en España</span>
            </div>
            <span className="text-[10px] font-mono text-white/40">52 Nodos Provinciales Activos</span>
          </div>

          <nav aria-label="Red de Provincias Oficiales">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2 text-[11px] font-mono text-white/60">
              {PROVINCIAS.slice(0, 48).map((prov) => {
                const formattedName = prov
                  .split('-')
                  .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(' ');
                const isPriority = PRIORITY_PROVINCES.has(prov);

                return (
                  <Link
                    key={prov}
                    href={`/bodas/${prov}/dj-eventos`}
                    prefetch={isPriority}
                    aria-label={`Servicios de bodas y eventos en ${formattedName}`}
                    className="p-2 rounded-lg bg-white/[0.02] hover:bg-[#ecb613]/10 hover:text-[#ecb613] border border-white/5 hover:border-[#ecb613]/30 transition-colors truncate text-left"
                    title={`Bodas y Eventos en ${formattedName}`}
                  >
                    {formattedName}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* 3. MATRIZ DE SERVICIOS POR PROVINCIA DESTACADA */}
        <div className="space-y-4 pt-4">
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
            Rutas de Alta Demanda Nupcial & Corporativa:
          </div>

          <nav aria-label="Rutas de Alta Demanda">
            <div className="flex flex-wrap gap-2 text-[10px] font-mono text-white/50">
              <Link href="/bodas/madrid/dj-eventos" prefetch={true} aria-label="DJ Bodas Madrid" className="hover:text-[#ecb613] transition-colors">
                DJ Bodas Madrid
              </Link>
              <span>•</span>
              <Link href="/bodas/madrid/sonido-iluminacion" prefetch={true} aria-label="Sonido e Iluminación Madrid" className="hover:text-[#ecb613] transition-colors">
                Sonido e Iluminación Madrid
              </Link>
              <span>•</span>
              <Link href="/bodas/barcelona/musica-directo" prefetch={true} aria-label="Música en Directo Barcelona" className="hover:text-[#ecb613] transition-colors">
                Música en Directo Barcelona
              </Link>
              <span>•</span>
              <Link href="/bodas/valencia/mariachis-boda" prefetch={true} aria-label="Mariachis Valencia" className="hover:text-[#ecb613] transition-colors">
                Mariachis Valencia
              </Link>
              <span>•</span>
              <Link href="/bodas/sevilla/fotografo-boda" prefetch={true} aria-label="Fotógrafo Sevilla" className="hover:text-[#ecb613] transition-colors">
                Fotógrafo Sevilla
              </Link>
              <span>•</span>
              <Link href="/bodas/malaga/saxofonista-eventos" prefetch={false} aria-label="Saxofonista Málaga" className="hover:text-[#ecb613] transition-colors">
                Saxofonista Málaga
              </Link>
              <span>•</span>
              <Link href="/bodas/toledo/animacion-fiesta" prefetch={true} aria-label="Animación Toledo" className="hover:text-[#ecb613] transition-colors">
                Animación Toledo
              </Link>
              <span>•</span>
              <Link href="/bodas/alicante/dj-eventos" prefetch={false} aria-label="DJ Alicante" className="hover:text-[#ecb613] transition-colors">
                DJ Alicante
              </Link>
            </div>
          </nav>
        </div>

        {/* 4. COPYRIGHT & LEGALES */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5 text-[11px] font-mono text-white/40">
          <div>
            © {new Date().getFullYear()} Productora EAR S.L. Todos los derechos reservados.
          </div>

          <div className="flex items-center gap-6">
            <Link href="/terminos-del-servicio" prefetch={false} aria-label="Términos del Servicio" className="hover:text-white transition-colors">
              Términos del Servicio
            </Link>
            <Link href="/politica-de-privacidad" prefetch={false} aria-label="Política de Privacidad" className="hover:text-white transition-colors">
              Política de Privacidad
            </Link>
            <Link href="/sitemap.xml" prefetch={false} aria-label="Sitemap XML" className="hover:text-[#ecb613] transition-colors">
              Sitemap XML
            </Link>
          </div>
        </div>

      </div>

    </footer>
  );
}
