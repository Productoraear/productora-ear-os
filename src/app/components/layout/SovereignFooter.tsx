'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Search, 
  ShieldCheck, 
  Phone, 
  Sparkles, 
  Compass, 
  ChevronDown, 
  ChevronUp,
  Volume2
} from 'lucide-react';
import { PROVINCIAS_52_GRAPH } from '@/lib/constants/seo-data-hydrated';

type RegionTab = 'TODAS' | 'CENTRO' | 'SUR' | 'ESTE' | 'NORTE' | 'INSULAR';

export default function SovereignFooter() {
  const [activeRegion, setActiveRegion] = useState<RegionTab>('TODAS');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Convertimos el grafo en un array plano ordenado alfabéticamente
  const allProvinces = useMemo(() => {
    return Object.values(PROVINCIAS_52_GRAPH).sort((a, b) => a.name.localeCompare(b.name, 'es'));
  }, []);

  // Filtrado por región y búsqueda en tiempo real
  const filteredProvinces = useMemo(() => {
    return allProvinces.filter((prov) => {
      const matchesRegion = activeRegion === 'TODAS' || prov.region === activeRegion;
      const matchesSearch = searchQuery.trim() === '' || 
        prov.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prov.capital.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prov.community.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRegion && matchesSearch;
    });
  }, [allProvinces, activeRegion, searchQuery]);

  // Si no está expandido y no hay búsqueda activa, mostramos un slice representativo inicial
  const displayedProvinces = useMemo(() => {
    if (isExpanded || searchQuery.trim().length > 0 || activeRegion !== 'TODAS') {
      return filteredProvinces;
    }
    return filteredProvinces.slice(0, 24);
  }, [filteredProvinces, isExpanded, searchQuery, activeRegion]);

  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-16 pb-28 text-white selection:bg-[#ecb613] selection:text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* FILA SUPERIOR: MARCA, SERVICIOS & ATENCIÓN */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-8 border-b border-white/10">
          
          {/* COLUMNA 1: IDENTIDAD SOBERANA */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#ecb613] text-black flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(236,182,19,0.4)]">
                EAR
              </div>
              <h3 className="text-xl font-bold font-syne uppercase tracking-wider text-white">
                Productora EAR
              </h3>
            </div>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
              Diseño, producción y ejecución de eventos de alto impacto. Desde bodas exclusivas y galas corporativas hasta licitaciones institucionales (B2G) y conciertos de conservatorio.
            </p>
            <div className="pt-2 space-y-2">
              <div className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                <MapPin size={13} className="text-[#ecb613]" />
                <span>Hub Operativo: Méntrida (Toledo) · Radio Km 0</span>
              </div>
              <a 
                href="tel:+34693693048"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#ecb613]/50 text-[#ecb613] font-mono text-xs font-bold transition-all"
              >
                <Phone size={13} />
                <span>Atención Directa: +34 693 693 048</span>
              </a>
            </div>
          </div>

          {/* COLUMNA 2: SERVICIOS */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#ecb613] flex items-center gap-1.5">
              <Sparkles size={13} />
              <span>Servicios & Líneas</span>
            </h4>
            <ul className="space-y-2 text-xs font-mono text-zinc-400">
              <li><Link href="/bodas" className="hover:text-white transition-colors">Bodas & Particulares</Link></li>
              <li><Link href="/alquiler-equipos-sonido-audiovisuales" className="hover:text-white transition-colors">Alquiler de Audiovisuales</Link></li>
              <li><Link href="/arsenal/luces-navidad" className="hover:text-white transition-colors">Luces de Navidad 2026 (530 Refs)</Link></li>
              <li><Link href="/ocasiones/ayuntamientos" className="hover:text-white transition-colors">Fiestas Patronales & B2G</Link></li>
              <li><Link href="/catering-brasas" className="hover:text-white transition-colors">Catering & Brasas Showcooking</Link></li>
              <li><Link href="/vimume" className="hover:text-white transition-colors">Proyecto VIMUME Neuroacústica</Link></li>
              <li><Link href="/academia" className="hover:text-white transition-colors">EAR Academy :: Talent Campus</Link></li>
            </ul>
          </div>

          {/* COLUMNA 3: GARANTÍAS Y PROTOCOLOS */}
          <div className="md:col-span-5 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck size={13} />
              <span>Gobernanza & Protocolos Técnicos</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-zinc-400">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-white font-bold block">Presión 12 W/pax</span>
                <p className="text-[10px] text-zinc-500 leading-tight">Columnas Bose F1 Model 812 y microfonía Shure Beta 87A.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-white font-bold block">Art. 118 LCSP B2G</span>
                <p className="text-[10px] text-zinc-500 leading-tight">Techo menor ajustado a &lt; 14.250 € para contratos públicos.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-white font-bold block">Split Soberano</span>
                <p className="text-[10px] text-zinc-500 leading-tight">80% Artista / 10% EAR OS / 10% VIMUME en cada actuación.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-white font-bold block">Stripe Price-Lock</span>
                <p className="text-[10px] text-zinc-500 leading-tight">Depósito de 100,00 € con firma criptográfica SHA-256 (48h).</p>
              </div>
            </div>
          </div>

        </div>

        {/* 🗺️ MATRIZ TERRITORIAL DE COBERTURA SOBERANA (100% ESPAÑA - 52 ENTIDADES) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#ecb613]">
                <Compass size={14} />
                <span>Red Territorial de Cobertura Soberana (52 Provincias // 100% España)</span>
              </div>
              <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                Despliegue operativo y logística desde el Hub Central en Méntrida (Toledo). Tarifas y homologación garantizadas en todas las demarcaciones.
              </p>
            </div>

            {/* BUSCADOR EN TIEMPO REAL */}
            <div className="relative w-full sm:w-64 shrink-0">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar provincia o comunidad..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#ecb613] text-xs text-white font-mono placeholder:text-zinc-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* TABS DE REGIONES */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white/[0.02] border border-white/5 w-fit text-[11px] font-mono">
            {[
              { id: 'TODAS', label: `Todas (52)` },
              { id: 'CENTRO', label: 'Centro (11)' },
              { id: 'SUR', label: 'Sur (12)' },
              { id: 'ESTE', label: 'Este (8)' },
              { id: 'NORTE', label: 'Norte (18)' },
              { id: 'INSULAR', label: 'Insular (3)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveRegion(tab.id as RegionTab)}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeRegion === tab.id
                    ? 'bg-[#ecb613] text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* GRID DE LAS 52 PROVINCIAS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 pt-1">
            {displayedProvinces.map((prov) => (
              <Link
                key={prov.slug}
                href={`/bodas/${prov.slug}/eventos`}
                className="p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-[#ecb613]/40 transition-all group block"
                title={`Servicios de producción, música y sonido en ${prov.name} (${prov.community}) - ${prov.distanceFromHubKm} km`}
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold text-zinc-300 group-hover:text-[#ecb613] transition-colors truncate">
                  <span className="truncate">{prov.name}</span>
                  <span className="text-[9px] text-zinc-500 shrink-0 ml-1">{prov.distanceFromHubKm}km</span>
                </div>
                <div className="text-[9px] font-mono text-zinc-500 truncate mt-0.5 group-hover:text-zinc-400">
                  {prov.community}
                </div>
              </Link>
            ))}
          </div>

          {/* BOTÓN VER TODAS / CONTRAER CUANDO NO HAY BÚSQUEDA ACTIVA */}
          {searchQuery.trim() === '' && activeRegion === 'TODAS' && (
            <div className="text-center pt-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp size={14} />
                    <span>Mostrar Menos</span>
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} />
                    <span>Ver las 52 Provincias de España ({allProvinces.length})</span>
                  </>
                )}
              </button>
            </div>
          )}

        </div>

        {/* PIE DE PÁGINA INFERIOR */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-zinc-500">
          <div>
            © {new Date().getFullYear()} Productora EAR. Todos los derechos reservados. Infraestructura Soberana S-Class.
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/aviso-legal" className="hover:text-zinc-300 transition-colors">Aviso Legal</Link>
            <Link href="/privacidad" className="hover:text-zinc-300 transition-colors">Privacidad</Link>
            <Link href="/cookies" className="hover:text-zinc-300 transition-colors">Cookies</Link>
            <Link href="/calculadora" className="text-[#ecb613] hover:underline">Cotizador en Tiempo Real</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
