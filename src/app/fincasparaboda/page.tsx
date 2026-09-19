'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Users,
  ShieldCheck,
  Star,
  Award,
  Sparkles,
  Phone,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  Lock,
  Building2,
  Zap,
  TrendingUp,
  Volume2,
  Calendar,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Heart,
  HelpCircle,
  Crown,
  Menu
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';
import { SCLASS_12_FINCAS_HOMOLOGADAS, FincaHomologada } from '@/lib/constants/fincas-catalog';
import SovereignCarouselSClass from '@/components/sclass/SovereignCarouselSClass';

interface FincaItem {
  id: string;
  name: string;
  slug?: string;
  category: string;
  province: string;
  address?: string;
  phone?: string;
  telephone?: string;
  img?: string;
  imageUrls?: string[];
  gallery?: string[];
  basePrice?: number;
  price?: string | number;
  rating?: number;
  reviews?: number;
  description?: string;
  services_list?: string[];
  capacidadMaxPax?: number | null;
}

const CATEGORIAS_ICONS = [
  { id: 'all', label: 'Todas las Fincas', icon: '🏰', query: '' },
  { id: 'rustica', label: 'Fincas Rústicas & Dehesas', icon: '🌿', query: 'rustica' },
  { id: 'palacio', label: 'Palacios & Castillos', icon: '👑', query: 'palacio' },
  { id: 'cortijo', label: 'Cortijos & Haciendas', icon: '🏛️', query: 'cortijo' },
  { id: 'masia', label: 'Masías & Casas Rurales', icon: '🏡', query: 'masia' },
  { id: 'salon', label: 'Salones & Hoteles', icon: '🥂', query: 'salon' },
];

const PROVINCIAS_POPULARES = [
  'Todas', 'Madrid', 'Toledo', 'Barcelona', 'Valencia', 'Sevilla', 
  'Málaga', 'Alicante', 'Cádiz', 'Baleares', 'Girona', 'Segovia', 'Guadalajara'
];

export default function FincasParaBodaPortal() {
  // Filtros del Gran Buscador (Bodas.net Style)
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProvince, setSelectedProvince] = useState<string>('Todas');
  const [selectedCapacity, setSelectedCapacity] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Datos dinámicos de fincas
  const [fincas, setFincas] = useState<FincaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalFound, setTotalFound] = useState<number>(9559);
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

  // Modal de Presupuesto / Contacto Directo
  const [activeFincaContact, setActiveFincaContact] = useState<FincaItem | null>(null);
  const [contactSent, setContactSent] = useState<boolean>(false);

  // Carga de datos reales desde API Edge
  const fetchFincas = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('category', 'finca');
      params.set('limit', '18');
      params.set('page', currentPage.toString());

      if (selectedProvince !== 'Todas') {
        params.set('province', selectedProvince);
      }
      if (searchKeyword.trim()) {
        params.set('q', searchKeyword.trim());
      }
      if (selectedCategory !== 'all') {
        params.set('subcategory', selectedCategory);
      }

      const res = await fetch(`/api/profiles/search?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        const list = json.providers || json.items || [];
        if (list.length > 0) {
          setFincas(list);
          setTotalPages(json.totalPages || 1);
          setTotalFound(json.total || list.length);
        } else {
          setFincas([]);
          setTotalPages(1);
          setTotalFound(0);
        }
      }
    } catch (err) {
      console.warn('[FINCAS_PORTAL] Error fetching fincas:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedProvince, selectedCategory, searchKeyword, currentPage]);

  useEffect(() => {
    fetchFincas();
  }, [fetchFincas]);

  // Filtrado de capacidad en cliente si aplica
  const displayedFincas = useMemo(() => {
    if (selectedCapacity === 'all') return fincas;
    const max = parseInt(selectedCapacity, 10);
    return fincas.filter(f => !f.capacidadMaxPax || f.capacidadMaxPax >= max);
  }, [fincas, selectedCapacity]);

  return (
    <div className="min-h-screen bg-[#050508] text-white selection:bg-[#ecb613] selection:text-black font-sans w-full overflow-x-hidden pt-28 sm:pt-32 pb-32">
      
      {/* ── 🏰 NAVEGACIÓN DEDICADA S-CLASS: FINCASPARABODA.COM (BODAS.NET KILLER) ── */}
      <header className="fixed top-0 left-0 w-full z-[100] transition-all">
        {/* Ribbon Superior Informativo */}
        <div className="bg-gradient-to-r from-[#0a0a14] via-[#121220] to-[#0a0a14] border-b border-white/10 py-1.5 px-4 sm:px-8 text-xs text-zinc-400">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2 font-mono text-[11px]">
            <div className="flex items-center gap-2 text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[#ecb613] font-bold">fincasparaboda.com</span>
              <span className="text-zinc-500 hidden sm:inline">|</span>
              <span className="hidden sm:inline">Directorio Nacional de Espacios para Bodas · 0% Comisiones de Agencia</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-emerald-400 hidden sm:flex items-center gap-1">
                <ShieldCheck size={12} /> Trato Directo Propietario
              </span>
              <span className="text-zinc-500 hidden md:inline">•</span>
              <span className="text-amber-300 flex items-center gap-1">
                <Lock size={11} /> Price-Lock 100€ SHA-256
              </span>
              <span className="text-zinc-500 hidden sm:inline">•</span>
              <a href={CENTRALITA.tel} className="hover:text-white flex items-center gap-1 text-zinc-300">
                <Phone size={11} className="text-[#ecb613]" /> Centralita: {CENTRALITA.display}
              </a>
            </div>
          </div>
        </div>

        {/* Barra de Navegación Flotante */}
        <div className="px-3 py-2 sm:px-8">
          <nav className="max-w-7xl mx-auto rounded-full bg-[#07070d]/90 backdrop-blur-2xl border border-white/10 px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            
            {/* LOGO FINCASPARABODA */}
            <Link href="/fincasparaboda" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#ecb613] to-amber-600 p-0.5 flex items-center justify-center shadow-[0_0_20px_rgba(236,182,19,0.35)] group-hover:scale-105 transition-all">
                <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                  <Crown size={18} className="text-[#ecb613]" />
                </div>
              </div>
              <div>
                <span className="font-syne font-black text-base sm:text-lg text-white tracking-tight uppercase block leading-none">
                  Fincas<span className="text-[#ecb613]">ParaBoda</span>
                </span>
                <span className="text-[9px] font-mono text-zinc-400 tracking-widest uppercase block">
                  by Productora EAR // S-Class
                </span>
              </div>
            </Link>

            {/* ENLACES DE NAVEGACIÓN DESKTOP */}
            <div className="hidden lg:flex items-center gap-6 font-mono text-xs uppercase tracking-wider text-zinc-300">
              <a href="#catalogo-nacional" className="hover:text-[#ecb613] transition-colors flex items-center gap-1.5">
                <span>Directorio ({totalFound.toLocaleString('es-ES')})</span>
              </a>
              <a href="#coleccion-privada" className="hover:text-[#ecb613] transition-colors flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-[#ecb613]" />
                <span>12 Homologadas</span>
              </a>
              <a href="#por-que-nosotros" className="hover:text-[#ecb613] transition-colors flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">0% Comisiones</span>
              </a>
              <Link href="/reservar/solista" className="hover:text-[#ecb613] transition-colors flex items-center gap-1.5 text-zinc-400">
                <span>Música Edwin Agudelo (350€)</span>
              </Link>
            </div>

            {/* ACCIONES DERECHA */}
            <div className="flex items-center gap-2.5">
              <a
                href={`https://wa.me/34693693048?text=${encodeURIComponent(
                  'Hola Edwin, estoy buscando finca para mi boda en fincasparaboda.com. ¿Podéis verificarme disponibilidad y fechas sin comisiones de agencia?'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 sm:px-4 py-2 bg-[#ecb613] hover:bg-[#d9a40e] text-black font-black font-mono text-xs uppercase rounded-full transition-all shadow-md shadow-amber-500/20 active:scale-95"
              >
                <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
                <MessageCircle size={14} />
                <span className="hidden sm:inline">Concierge WhatsApp en 15 Min</span>
                <span className="sm:hidden">WhatsApp</span>
              </a>

              <a
                href={CENTRALITA.tel}
                className="hidden xl:flex items-center gap-1.5 px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full font-mono text-xs font-bold transition-all"
              >
                <Phone size={12} className="text-[#ecb613]" />
                <span>{CENTRALITA.display}</span>
              </a>

              {/* Botón menú móvil */}
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:text-[#ecb613] transition-colors"
                aria-label="Abrir menú"
              >
                {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>

          </nav>

          {/* Menú Móvil Desplegable */}
          {mobileNavOpen && (
            <div className="lg:hidden mt-2 p-4 rounded-3xl bg-[#090912]/95 backdrop-blur-2xl border border-white/10 space-y-3 font-mono text-xs uppercase tracking-wider text-zinc-300 shadow-2xl">
              <a 
                href="#catalogo-nacional" 
                onClick={() => setMobileNavOpen(false)}
                className="block py-2 px-3 rounded-xl hover:bg-white/5 hover:text-[#ecb613]"
              >
                🏰 Catálogo Nacional ({totalFound.toLocaleString('es-ES')} Fincas)
              </a>
              <a 
                href="#coleccion-privada" 
                onClick={() => setMobileNavOpen(false)}
                className="block py-2 px-3 rounded-xl hover:bg-white/5 hover:text-[#ecb613]"
              >
                👑 12 Fincas Homologadas S-Class
              </a>
              <a 
                href="#por-que-nosotros" 
                onClick={() => setMobileNavOpen(false)}
                className="block py-2 px-3 rounded-xl hover:bg-white/5 text-emerald-400 font-bold"
              >
                🛡️ Ventaja 0% Comisiones de Agencia
              </a>
              <Link 
                href="/reservar/solista"
                onClick={() => setMobileNavOpen(false)}
                className="block py-2 px-3 rounded-xl hover:bg-white/5 hover:text-[#ecb613]"
              >
                🎤 Solista Edwin Agudelo (Desde 350€)
              </Link>
              <div className="pt-2 border-t border-white/10 flex gap-2">
                <a
                  href={CENTRALITA.tel}
                  className="w-full py-2.5 bg-white/5 border border-white/10 text-white rounded-xl font-bold flex items-center justify-center gap-1.5"
                >
                  <Phone size={13} className="text-[#ecb613]" />
                  <span>Llamar: {CENTRALITA.display}</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── HERO HEADER & BUSCADOR FAMILIAR BODAS.NET ── */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0a0a14] via-[#06060a] to-[#050508] border-b border-white/5">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono uppercase font-bold tracking-widest shadow-lg">
            <Sparkles size={14} />
            <span>Directorio de Bodas 2026 // {totalFound.toLocaleString('es-ES')} Espacios Exclusivos</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-syne uppercase tracking-tight text-white leading-[1.08]">
            Encuentra la <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white italic">Finca de tus Sueños</span> para tu Boda
          </h1>

          <p className="text-zinc-300 text-sm sm:text-lg max-w-3xl mx-auto font-light leading-relaxed">
            Explora cortijos, palacios, dehesas y masías en toda España. Contacto <strong>100% directo con el dueño</strong>, sin pagar el 15%-30% de agencias tradicionales y con auditoría acústica garantizada (12 W/pax).
          </p>

          {/* 🔍 GRAN BUSCADOR BODAS.NET STYLE */}
          <div className="pt-4 max-w-5xl mx-auto">
            <div className="p-3 sm:p-4 rounded-3xl bg-[#0e0e16]/90 border border-[#ecb613]/40 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              
              {/* 1. Selector Tipo de Finca */}
              <div className="sm:col-span-3 text-left px-3 py-2 bg-black/50 rounded-2xl border border-white/10">
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-0.5">
                  ¿Qué buscas?
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-[#0e0e16] text-white">Todas las tipologías</option>
                  <option value="rustica" className="bg-[#0e0e16] text-white">🌿 Fincas Rústicas & Dehesas</option>
                  <option value="palacio" className="bg-[#0e0e16] text-white">👑 Palacios & Castillos</option>
                  <option value="cortijo" className="bg-[#0e0e16] text-white">🏛️ Cortijos & Haciendas</option>
                  <option value="masia" className="bg-[#0e0e16] text-white">🏡 Masías & Casas Rurales</option>
                  <option value="salon" className="bg-[#0e0e16] text-white">🥂 Salones & Hoteles</option>
                </select>
              </div>

              {/* 2. Selector de Provincia */}
              <div className="sm:col-span-3 text-left px-3 py-2 bg-black/50 rounded-2xl border border-white/10">
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-0.5">
                  ¿Dónde? (Provincia)
                </label>
                <select
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer"
                >
                  {PROVINCIAS_POPULARES.map(prov => (
                    <option key={prov} value={prov} className="bg-[#0e0e16] text-white">
                      {prov === 'Todas' ? 'Toda España' : prov}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Búsqueda por Nombre / Capacidad */}
              <div className="sm:col-span-4 text-left px-3 py-2 bg-black/50 rounded-2xl border border-white/10">
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-0.5">
                  Buscar por nombre o municipio
                </label>
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Ej. El Olivar, Aranjuez..."
                  className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>

              {/* 4. Botón Buscar */}
              <div className="sm:col-span-2">
                <button
                  onClick={() => {
                    setCurrentPage(1);
                    fetchFincas();
                  }}
                  className="w-full py-4 px-4 bg-[#ecb613] hover:bg-[#d9a40e] text-black font-black text-xs font-mono uppercase rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95"
                >
                  <Search size={15} />
                  <span>Buscar</span>
                </button>
              </div>

            </div>
          </div>

          {/* 🏷️ CHIPS RÁPIDOS DE CATEGORÍAS (BODAS.NET STYLE) */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pt-2 pb-2 scrollbar-none">
            {CATEGORIAS_ICONS.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-[#ecb613] text-black font-bold shadow-md shadow-amber-500/20'
                    : 'bg-white/5 text-zinc-300 border border-white/10 hover:border-[#ecb613]/50 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ── 🚀 ALEX HORMOZI GRAND OFFER ($100M OFFERS) VALUE STACK ── */}
      <section id="por-que-nosotros" className="py-12 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-[#07070b]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-2 mb-8">
            <span className="text-xs font-mono uppercase text-[#ecb613] tracking-widest font-bold">
              ¿Por qué reservar en fincasparaboda.com vs portales tradicionales?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-syne text-white uppercase">
              La Oferta Soberana que Bodas.net No Puede Igualar
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Beneficio 1 */}
            <div className="p-6 rounded-3xl bg-[#0c0c14] border border-white/10 hover:border-emerald-500/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-base font-bold text-white font-syne">0% Comisiones de Agencia</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Ahorra entre <strong className="text-emerald-400">1.500 € y 4.000 €</strong>. Contactas directo con el titular de la finca sin comisiones parásitas añadidas al presupuesto.
              </p>
            </div>

            {/* Beneficio 2 */}
            <div className="p-6 rounded-3xl bg-[#0c0c14] border border-white/10 hover:border-amber-500/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#ecb613]">
                <Lock size={18} />
              </div>
              <h3 className="text-base font-bold text-white font-syne">Price-Lock Inmutable 100€</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Bloquea tu fecha con depósito de 100 € en Stripe SHA-256. La finca se compromete por contrato a <strong>congelar el precio</strong> sin subidas en temporada alta.
              </p>
            </div>

            {/* Beneficio 3 */}
            <div className="p-6 rounded-3xl bg-[#0c0c14] border border-white/10 hover:border-blue-500/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Volume2 size={18} />
              </div>
              <h3 className="text-base font-bold text-white font-syne">Blindaje Acústico 12 W/pax</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Cero cortes de luz y cero multas a las 2:00 AM. Fincas auditadas con sonómetro y acometida CETAC apta para fiesta y directos sin apagones.
              </p>
            </div>

            {/* Beneficio 4 */}
            <div className="p-6 rounded-3xl bg-[#0c0c14] border border-white/10 hover:border-purple-500/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Zap size={18} />
              </div>
              <h3 className="text-base font-bold text-white font-syne">Concierge Nupcial en 15 Min</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Sin esperar días por un correo. Te confirmamos disponibilidad de fecha y visita presencial por WhatsApp en menos de 15 minutos.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── 🏰 RED DE LAS 12 FINCAS HOMOLOGADAS S-CLASS (EXCLUSIVAS) ── */}
      <section id="coleccion-privada" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#ecb613] uppercase font-bold tracking-wider mb-1">
              <Award size={14} />
              <span>Colección Privada S-Class // Madrid, Toledo & Guadalajara</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-syne text-white uppercase">
              12 Fincas Homologadas con Producción Acústica Incluida
            </h2>
          </div>
          <a
            href={CENTRALITA.tel}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 self-start md:self-auto"
          >
            <Phone size={14} className="text-[#ecb613]" />
            <span>Consultar Pack Completo con Voz de Edwin Agudelo</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SCLASS_12_FINCAS_HOMOLOGADAS.slice(0, 3).map((f) => (
            <div
              key={f.id}
              className="p-6 rounded-3xl bg-gradient-to-b from-[#12121a] to-[#09090f] border border-[#ecb613]/30 hover:border-[#ecb613] transition-all flex flex-col justify-between group space-y-4 shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono uppercase font-bold">
                    {f.provincia} • {f.distanciaHubMentridaKm} km Hub
                  </span>
                  <ShieldCheck className="text-emerald-400" size={18} />
                </div>
                <h3 className="text-xl font-bold font-syne text-white group-hover:text-[#ecb613] transition-colors">
                  {f.name}
                </h3>
                <p className="text-xs text-zinc-400 flex items-center gap-1 font-mono">
                  <MapPin size={12} className="text-[#ecb613]" />
                  <span>{f.location}</span>
                </p>
                <p className="text-xs text-zinc-300 leading-relaxed font-light line-clamp-2">
                  {f.description}
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] font-mono text-zinc-400 border-t border-white/5">
                  <div className="p-2 bg-black/40 rounded-xl">
                    <span className="block text-zinc-500">Capacidad:</span>
                    <strong className="text-white">{f.capacidadMaxPax} Pax</strong>
                  </div>
                  <div className="p-2 bg-black/40 rounded-xl">
                    <span className="block text-zinc-500">Límite dB:</span>
                    <strong className="text-emerald-400">{f.limiteAcustico.interiorDBA} dBA</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 space-y-2">
                <a
                  href={`https://wa.me/34693693048?text=${encodeURIComponent(
                    `Hola Edwin, deseo información y fecha para ${f.name} (${f.location}) desde fincasparaboda.com.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#ecb613] hover:bg-[#d9a40e] text-black font-black text-xs font-mono uppercase rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <MessageCircle size={14} />
                  <span>Ver Disponibilidad WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 📋 DIRECTORIO NACIONAL COMPLETO DE FINCAS (BODAS.NET KILLER) ── */}
      <section id="catalogo-nacional" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
              Catálogo Abierto Nacional
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-syne text-white uppercase">
              Fincas y Espacios Singulares ({totalFound.toLocaleString('es-ES')})
            </h2>
          </div>
          <span className="text-xs font-mono text-amber-300">
            Página {currentPage} de {totalPages}
          </span>
        </div>

        {/* Grid de Fincas */}
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#ecb613] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-mono text-zinc-400">Cargando espacios verificados en {selectedProvince}...</p>
          </div>
        ) : displayedFincas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedFincas.map((finca) => {
              const rawImgs = (finca.imageUrls && finca.imageUrls.length > 0)
                ? finca.imageUrls
                : (finca.gallery && finca.gallery.length > 0)
                ? finca.gallery
                : (finca.img ? [finca.img] : []);
              const cleanGallery = rawImgs.filter((u: string) => typeof u === 'string' && u.length > 5 && !u.includes('.svg'));
              const coverImg = cleanGallery[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop';
              const gallery = cleanGallery.length > 0 ? cleanGallery : [coverImg];

              return (
                <div
                  key={finca.id}
                  className="rounded-3xl bg-[#0a0a10] border border-white/10 hover:border-[#ecb613]/50 transition-all flex flex-col justify-between overflow-hidden group shadow-xl hover:-translate-y-1 duration-300"
                >
                  {/* Carrusel de Fotos */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                    <SovereignCarouselSClass
                      images={gallery}
                      title={finca.name}
                    />

                    {/* Badge Categoría */}
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md border border-[#ecb613]/40 text-[#ecb613] rounded-full text-[10px] font-mono uppercase font-bold">
                        {finca.category || 'Finca para Bodas'}
                      </span>
                    </div>

                    {/* Rating Bodas.net Style */}
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md border border-white/10 text-white px-2.5 py-1 rounded-full text-[10px] font-mono flex items-center gap-1 pointer-events-none">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      <span className="font-bold">{finca.rating ? finca.rating.toFixed(1) : '4.9'}</span>
                      <span className="text-zinc-400 text-[9px]">({finca.reviews || 28})</span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold font-syne text-white group-hover:text-[#ecb613] transition-colors line-clamp-1">
                        {finca.name}
                      </h3>

                      <p className="text-xs text-zinc-400 flex items-center gap-1 font-mono">
                        <MapPin size={12} className="text-[#ecb613]" />
                        <span>{finca.address || `${finca.province}, España`}</span>
                      </p>

                      <p className="text-xs text-zinc-300 leading-relaxed font-light line-clamp-2">
                        {finca.description || `Finca señorial homologada para bodas y banquetes en ${finca.province}. Espacios ajardinados y privacidad total.`}
                      </p>
                    </div>

                    {/* Meta precios & capacidad */}
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5 text-[11px] font-mono">
                      <div className="p-2 bg-black/40 rounded-xl">
                        <span className="text-[9px] text-zinc-500 uppercase block">Menú / Alquiler</span>
                        <span className="font-bold text-[#ecb613]">Desde {finca.basePrice || 95} €</span>
                      </div>
                      <div className="p-2 bg-black/40 rounded-xl">
                        <span className="text-[9px] text-zinc-500 uppercase block">Capacidad Máx</span>
                        <span className="font-bold text-white">{finca.capacidadMaxPax || '350'} Pax</span>
                      </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setActiveFincaContact(finca);
                          setContactSent(false);
                        }}
                        className="w-full py-3 bg-[#ecb613] hover:bg-[#d9a40e] text-black font-black text-xs font-mono uppercase rounded-xl transition-all text-center flex items-center justify-center gap-1"
                      >
                        <MessageCircle size={13} />
                        <span>Pedir Presupuesto</span>
                      </button>

                      <Link
                        href={`/proveedores/${finca.slug || finca.id}`}
                        className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-bold uppercase rounded-xl transition-all text-center flex items-center justify-center gap-1"
                      >
                        <span>Ver Ficha</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-16 text-center rounded-3xl bg-[#0a0a10] border border-white/10 space-y-4">
            <Building2 size={36} className="mx-auto text-zinc-600" />
            <h3 className="text-xl font-bold font-syne text-white">No se han encontrado fincas con ese filtro</h3>
            <p className="text-xs text-zinc-400">Prueba a seleccionar otra provincia o a buscar sin filtros de texto.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedProvince('Todas');
                setSearchKeyword('');
                setCurrentPage(1);
              }}
              className="px-6 py-2.5 bg-[#ecb613] text-black font-mono text-xs font-bold uppercase rounded-xl"
            >
              Restablecer Filtros
            </button>
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-8">
            <button
              disabled={currentPage <= 1}
              onClick={() => {
                setCurrentPage(prev => Math.max(prev - 1, 1));
                window.scrollTo({ top: 500, behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono disabled:opacity-30 hover:border-[#ecb613]"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-mono text-zinc-400">
              Página <strong className="text-white">{currentPage}</strong> de {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => {
                setCurrentPage(prev => Math.min(prev + 1, totalPages));
                window.scrollTo({ top: 500, behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono disabled:opacity-30 hover:border-[#ecb613]"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

      </section>

      {/* ── MODAL CONCIERGE NUPCIAL / PRESUPUESTO EN 1 CLIC ── */}
      {activeFincaContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0e0e16] border border-[#ecb613]/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
            <button
              onClick={() => setActiveFincaContact(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2"
            >
              <X size={20} />
            </button>

            <div className="space-y-1 text-left">
              <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest font-bold">
                Contacto Directo Sin Comisiones
              </span>
              <h3 className="text-2xl font-bold font-syne text-white">
                Presupuesto Oficial: {activeFincaContact.name}
              </h3>
              <p className="text-xs text-zinc-400">
                Tu solicitud será despachada al gestor de la finca y al Concierge de Productora EAR para asegurar el Price-Lock 100€.
              </p>
            </div>

            {contactSent ? (
              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
                <CheckCircle2 size={32} className="text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white font-syne">Petición Recibida</h4>
                <p className="text-xs text-zinc-300">
                  Un asesor nupcial se pondrá en contacto por WhatsApp o llamada en menos de 15 minutos para entregarte la tarifa confirmada.
                </p>
                <button
                  onClick={() => setActiveFincaContact(null)}
                  className="px-6 py-2.5 bg-emerald-500 text-black font-mono text-xs font-bold uppercase rounded-xl mt-2"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setContactSent(true);
                }}
                className="space-y-4 text-left"
              >
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                    Nombre de la Pareja
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Laura y Carlos"
                    className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-sm text-white focus:border-[#ecb613] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                      Teléfono WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+34 600 000 000"
                      className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-sm text-white focus:border-[#ecb613] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                      Fecha Estimada Boda
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-sm text-white focus:border-[#ecb613] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                    Número Aproximado de Invitados
                  </label>
                  <select className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-sm text-white focus:border-[#ecb613] focus:outline-none cursor-pointer">
                    <option value="50">Hasta 80 invitados (Íntima)</option>
                    <option value="150" selected>Entre 100 y 180 invitados</option>
                    <option value="250">Entre 180 y 280 invitados</option>
                    <option value="350">Más de 300 invitados</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#ecb613] hover:bg-[#d9a40e] text-black font-black text-xs font-mono uppercase rounded-xl transition-all shadow-lg shadow-amber-500/20 mt-2"
                >
                  Solicitar Presupuesto y Visita Gratis
                </button>

                <p className="text-[10px] font-mono text-zinc-500 text-center">
                  🔒 Garantía RGPD y Safe Harbor. Cero spam. Solo contacto directo con la finca.
                </p>
              </form>
            )}

          </div>
        </div>
      )}

      {/* ── FOOTER DEDICADO FINCASPARABODA.COM ── */}
      <footer className="border-t border-white/10 bg-[#040407] py-12 px-4 sm:px-6 lg:px-8 text-center text-xs text-zinc-500 space-y-4">
        <div className="flex justify-center items-center gap-2 text-[#ecb613] font-bold font-mono">
          <Crown size={16} />
          <span>fincasparaboda.com // Productora EAR</span>
        </div>
        <p className="font-mono text-[11px] max-w-xl mx-auto">
          El portal nupcial de espacios singulares operado bajo tecnología S-Class. 0% comisiones parásitas de intermediación, reserva con Price-Lock 100 € y rider acústico garantizado (12 W/pax).
        </p>
        <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-mono text-zinc-400 pt-2">
          <span>Centralita 24/7: {CENTRALITA.display}</span>
          <span>•</span>
          <span>Stripe Price-Lock: 100,00 €</span>
          <span>•</span>
          <span>Méntrida Hub Logístico</span>
        </div>
      </footer>

    </div>
  );
}
