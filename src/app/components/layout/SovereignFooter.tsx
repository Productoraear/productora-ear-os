'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, 
  Search, 
  ShieldCheck, 
  Phone, 
  Sparkles, 
  Compass, 
  ChevronDown, 
  ChevronUp, 
  Volume2,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  MessageCircle,
  Mail,
  ArrowUpRight,
  Lock
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
    <footer className="bg-[#030305] border-t border-white/10 pt-16 pb-28 text-white selection:bg-[#FF2B44] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* 💎 FILA SUPERIOR: ESTRUCTURA SOBERANA DE 4 COLUMNAS (CUADERNO DE MARCA OFICIAL) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-10 border-b border-white/10">
          
          {/* COLUMNA 1: IDENTIDAD & LOGOTIPO DEL DIAMANTE EAR */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-2xl overflow-hidden border border-[#FF2B44]/70 shadow-[0_0_20px_rgba(255,43,68,0.45)] bg-black shrink-0">
                <Image 
                  src="/images/brand/ear_logo_official_diamond.png" 
                  alt="Productora EAR Logotipo Oficial Diamante"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-black font-syne uppercase tracking-wider text-white leading-none">
                  PRODUCTORA <span className="text-[#FF2B44]">EAR</span>
                </h3>
                <span className="text-[10px] font-mono tracking-widest text-[#00E5FF] uppercase block mt-0.5">
                  OS V2.4 // S-CLASS
                </span>
              </div>
            </div>
            
            <p className="text-[#ecb613] text-xs font-mono italic font-medium">
              &ldquo;Mensajes de calidad para una sociedad de calidad&rdquo;
            </p>

            <p className="text-zinc-400 text-xs leading-relaxed">
              Infraestructura invisible de los eventos más memorables. Diseño, producción técnica, rider acústico de 12 W/pax y contratación artística soberana con split 80/10/10.
            </p>

            {/* REDES OPERATIVAS SOBERANAS */}
            <div className="pt-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-2">
                Redes Operativas
              </span>
              <div className="flex items-center gap-2">
                <a 
                  href="https://instagram.com/productoraear" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Instagram de Productora EAR"
                  className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#FF2B44]/70 hover:bg-[#FF2B44]/20 hover:text-[#FF2B44] text-zinc-400 flex items-center justify-center transition-all"
                >
                  <Instagram size={15} />
                </a>
                <a 
                  href="https://facebook.com/productoraear" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Facebook de Productora EAR"
                  className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#00E5FF]/70 hover:bg-[#00E5FF]/20 hover:text-[#00E5FF] text-zinc-400 flex items-center justify-center transition-all"
                >
                  <Facebook size={15} />
                </a>
                <a 
                  href="https://linkedin.com/company/productoraear" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="LinkedIn de Productora EAR"
                  className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#00E5FF]/70 hover:bg-[#00E5FF]/20 hover:text-[#00E5FF] text-zinc-400 flex items-center justify-center transition-all"
                >
                  <Linkedin size={15} />
                </a>
                <a 
                  href="https://youtube.com/@productoraear" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="YouTube de Productora EAR"
                  className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#FF2B44]/70 hover:bg-[#FF2B44]/20 hover:text-[#FF2B44] text-zinc-400 flex items-center justify-center transition-all"
                >
                  <Youtube size={15} />
                </a>
                <a 
                  href="https://wa.me/34693693048?text=Hola%20Productora%20EAR,%20deseo%20consultar%20sobre%20un%20evento" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="WhatsApp Oficial de Productora EAR"
                  className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-400 text-emerald-400 flex items-center justify-center transition-all"
                >
                  <MessageCircle size={15} />
                </a>
              </div>
            </div>
          </div>

          {/* COLUMNA 2: ACCESO RÁPIDO & LOS 5 EJES */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF2B44] flex items-center gap-1.5">
              <Sparkles size={13} />
              <span>Ejes & Ecosistema</span>
            </h4>
            <ul className="space-y-2 text-xs font-mono text-zinc-400">
              <li>
                <Link href="/artistas" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>Artistas (Split 80% Neto)</span>
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#FF2B44]" />
                </Link>
              </li>
              <li>
                <Link href="/eventos" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>Eventos & Bodas (12 W/pax)</span>
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#f59e0b]" />
                </Link>
              </li>
              <li>
                <Link href="/proveedores" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>Empresas & Fincas B2B</span>
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#10b981]" />
                </Link>
              </li>
              <li>
                <Link href="/ayuntamientos" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>Instituciones (Art. 118 LCSP)</span>
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#06b6d4]" />
                </Link>
              </li>
              <li>
                <Link href="/vimume" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span className="text-[#00E5FF] font-semibold">Proyecto VIMUME (40 Hz)</span>
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#00E5FF]" />
                </Link>
              </li>
              <li className="pt-2 border-t border-white/5">
                <Link href="/about" className="hover:text-white transition-colors">Quiénes Somos // Manifiesto</Link>
              </li>
              <li>
                <Link href="/alianzas" className="hover:text-white transition-colors">Alianzas & Directorio Homologado</Link>
              </li>
              <li>
                <Link href="/academia" className="hover:text-white transition-colors">EAR Academy :: Talent Campus</Link>
              </li>
            </ul>
          </div>

          {/* COLUMNA 3: CONVERSIÓN & GOBERNANZA S-CLASS */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#00E5FF] flex items-center gap-1.5">
              <ShieldCheck size={13} />
              <span>Gobernanza & Cierre</span>
            </h4>

            {/* CTA DESTACADO DE CONVERSIÓN */}
            <Link
              href="/calculadora"
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF2B44] via-[#E11D48] to-[#9F1239] text-white font-mono text-xs font-bold shadow-[0_0_25px_rgba(255,43,68,0.35)] hover:scale-[1.02] transition-transform group"
            >
              <span className="flex items-center gap-2">
                <Lock size={13} />
                <span>COTIZADOR CON PRICE-LOCK</span>
              </span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <div className="space-y-1.5 text-[11px] font-mono text-zinc-400 pt-1">
              <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-white font-bold block">Split Soberano</span>
                <p className="text-[10px] text-zinc-500 leading-tight">80% Artista / 10% EAR OS / 10% VIMUME en cada actuación.</p>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-white font-bold block">Presión 12 W/pax</span>
                <p className="text-[10px] text-zinc-500 leading-tight">Bose F1 Model 812 & Shure Beta 87A homologados.</p>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-white font-bold block">Stripe Price-Lock</span>
                <p className="text-[10px] text-zinc-500 leading-tight">Depósito de 100,00 € con firma SHA-256 válida 72h.</p>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-white font-bold block">Art. 118 LCSP B2G</span>
                <p className="text-[10px] text-zinc-500 leading-tight">Contrato menor acotado a &lt; 14.250 € preventivo.</p>
              </div>
            </div>
          </div>

          {/* COLUMNA 4: CONTACTO OFICIAL & HUB MÉNTRIDA */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#ecb613] flex items-center gap-1.5">
              <MapPin size={13} />
              <span>Hub Central & Contacto</span>
            </h4>

            <div className="space-y-2.5 text-xs font-mono text-zinc-400">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-white font-bold block">Sede Operativa</span>
                <p className="text-[11px] text-zinc-400 leading-tight">
                  Calle de la Tórtola 5<br />
                  45280 Méntrida, Toledo (España)
                </p>
                <p className="text-[10px] text-zinc-500 mt-1">Radio Km 0 desde Hub Central</p>
              </div>

              <div className="space-y-1.5">
                <a 
                  href="tel:+34693693048"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF2B44]/50 text-white hover:text-[#FF2B44] text-xs font-bold transition-all"
                >
                  <Phone size={13} className="text-[#FF2B44]" />
                  <span>+34 693 693 048</span>
                </a>

                <a 
                  href="mailto:productoraear@gmail.com"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#00E5FF]/50 text-white hover:text-[#00E5FF] text-xs font-bold transition-all"
                >
                  <Mail size={13} className="text-[#00E5FF]" />
                  <span>productoraear@gmail.com</span>
                </a>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[10px] text-zinc-500 space-y-0.5">
                <p><span className="text-zinc-400 font-bold">Logística S-Class:</span> 1,50 €/km (&gt; 50 km)</p>
                <p><span className="text-zinc-400 font-bold">Suplemento Hotel:</span> +120 € (&gt; 200 km / fin &ge; 03:00)</p>
                <p><span className="text-zinc-400 font-bold">Disponibilidad:</span> Soporte 24/7 en producción</p>
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
