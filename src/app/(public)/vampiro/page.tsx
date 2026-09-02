'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Database, Shield, Search, Sliders, ExternalLink, 
  ArrowRight, Phone, CheckCircle2, TrendingUp, Sparkles,
  Volume2, Lightbulb, Car, Building2, MapPin, Tag, Cpu
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';

// Datos estáticos del arsenal vampirizado para navegación instantánea de alta velocidad
const SONOMUSIC_FEATURED = [
  {
    id: 'sonomusic-pack-discomovil-1',
    title: 'Pack Discomóvil 1 · Alta Fidelidad',
    category: 'Discomóvil & Sonido',
    originalPrice: 360,
    earPrice: 432,
    markup: '+20% (Servicio Homologado)',
    specs: '2x Cajas Activas 1000W + Cabina DJ + Micrófono Shure Inalámbrico',
    status: 'DISPONIBLE INMEDIATO',
    idealFor: 'Bodas hasta 120 pax / Cócteles'
  },
  {
    id: 'sonomusic-pack-discomovil-2',
    title: 'Pack Discomóvil 2 · Subgrave & Iluminación DMX',
    category: 'Discomóvil & Luces',
    originalPrice: 580,
    earPrice: 696,
    markup: '+20% (Servicio Homologado)',
    specs: '2x Top 1200W + 1x Subgrave 18" + 4x Focos LED + Puente Truss 3m',
    status: 'ALTA DEMANDA',
    idealFor: 'Bodas 150-250 pax / Fiestas privadas'
  },
  {
    id: 'sonomusic-line-array-gala',
    title: 'Sistema Line Array Gala Exterior',
    category: 'Sonorización Masiva',
    originalPrice: 1200,
    earPrice: 1440,
    markup: '+20% (Servicio Homologado)',
    specs: 'Sistema Curvo 8000W RMS + Microfonía UHF Diversity + Técnico FOH',
    status: 'DISPONIBLE INMEDIATO',
    idealFor: 'Plazas Mayores / Festivales / Fiestas Patronales'
  },
  {
    id: 'sonomusic-pack-acustico-edwin',
    title: 'Rider Especial Acústico Edwin Agudelo',
    category: 'Rider Solista S-Class',
    originalPrice: 450,
    earPrice: 350,
    markup: '-22% (Tarifa Soberana Directa)',
    specs: 'Bose F1 Model 812 + Microfonía Shure Beta 87A de Conservatorio',
    status: 'EXCLUSIVO PRODUCTORA EAR',
    idealFor: 'Ceremonias / Cóctel de Alto Ticket'
  }
];

const B2G_LIGHTING_FEATURED = [
  {
    ref: 'NAV-2025-ARCH-01',
    title: 'Arco Monumental LED Calle Real',
    municipality: 'Navalcarnero / Méntrida',
    specs: 'Micro-LED blanco cálido 4000K, estructura de aluminio reforzado IP65',
    budgetTier: 'Art. 118 LCSP (< 15.000 €)',
    energySavings: '85% vs Bombilla Tradicional'
  },
  {
    ref: 'NAV-2025-PLAZA-02',
    title: 'Cortina Lumínica Fachada Consistorial',
    municipality: 'Madrid Suroeste',
    specs: '12.000 microleds con controlador DMX programable y efectos sutiles',
    budgetTier: 'Art. 118 LCSP (< 15.000 €)',
    energySavings: 'Ahorro Certificado A++'
  },
  {
    ref: 'NAV-2025-TREE-03',
    title: 'Abeto Monumental 12 Metros 3D',
    municipality: 'Plaza Mayor',
    specs: 'Estructura transitable interior con iluminación estroboscópica dorada',
    budgetTier: 'Licitación Menor Directa',
    energySavings: 'Consumo < 2.2 kW'
  }
];

const TRANSPORT_VIP_FEATURED = [
  {
    id: 'mercedes-v-class-black',
    title: 'Mercedes-Benz Clase V · Black Edition VIP',
    capacity: '7 Pasajeros VIP + Equipaje de Gira',
    specs: 'Asientos de cuero Nappa, cristales tintados, Wi-Fi 5G, Chófer con traje',
    application: 'Traslado de Solistas, Autoridades y Parejas Nupciales'
  },
  {
    id: 'mercedes-s-class-limo',
    title: 'Mercedes-Benz Clase S · Presidencial',
    capacity: '3 Pasajeros VIP de Estado',
    specs: 'Suspensión neumática activa, climatización bizona y protocolo diplomático',
    application: 'Recepción de Embajadas y Galas de Estado'
  }
];

const SAMPLE_VAMPIRIZED_PROVIDERS = [
  { name: 'Sonomusic Sonido e Iluminación', category: 'Sonido Profesional', province: 'Madrid', rating: 4.9, token: 'EAR-GHOST-SONOMUSIC-01' },
  { name: 'Finca La Alquería de Mentrida', category: 'Fincas & Espacios', province: 'Toledo', rating: 4.8, token: 'EAR-GHOST-TOLEDO-4421' },
  { name: 'Demetrio Iluminación Festiva', category: 'Alumbrado B2G', province: 'Madrid', rating: 5.0, token: 'EAR-GHOST-DEMETRIO-B2G' },
  { name: 'Quality VIP Solutions Transfers', category: 'Transporte VIP', province: 'Madrid', rating: 4.9, token: 'EAR-GHOST-QVIP-009' },
  { name: 'Blanco Fotógrafos Alta Gama', category: 'Fotografía Nupcial', province: 'Badajoz', rating: 5.0, token: 'EAR-GHOST-BLANCO-331' },
  { name: 'Catering Sensaciones Imperial', category: 'Catering de Gala', province: 'Madrid', rating: 4.7, token: 'EAR-GHOST-CAT-8891' },
  { name: 'Mariachi Tenampa de Madrid', category: 'Música en Directo', province: 'Madrid', rating: 4.9, token: 'EAR-GHOST-MARIACHI-02' },
  { name: 'Pantallas LED VisualPro 4K', category: 'Audiovisuales', province: 'Valencia', rating: 4.8, token: 'EAR-GHOST-LED-VAL-901' },
];

export default function VampiroPage() {
  const [activeTab, setActiveTab] = useState<'sonomusic' | 'providers' | 'b2g' | 'transport'>('sonomusic');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('todas');

  const filteredProviders = useMemo(() => {
    return SAMPLE_VAMPIRIZED_PROVIDERS.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchProv = selectedProvince === 'todas' || p.province.toLowerCase() === selectedProvince.toLowerCase();
      return matchSearch && matchProv;
    });
  }, [searchTerm, selectedProvince]);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-amber-500 selection:text-black pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado Principal */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-widest mb-4">
            <Cpu className="w-3.5 h-3.5" />
            <span>Matriz de Inteligencia de Mercado · EAR OS Arsenal</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight uppercase font-serif">
            El <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">Vampirizador</span>
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-3 leading-relaxed">
            Crawler forense de datos, 13.977 registros auditados, catálogo técnico de equipamiento y blindaje de márgenes sin intermediarios abusivos.
          </p>
        </div>

        {/* ── KPI TELEMETRÍA FORENSE ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center">
            <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400">13.977</div>
            <div className="text-[11px] font-mono text-zinc-400 uppercase mt-1">Proveedores Indexados</div>
          </div>
          <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center">
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">80 / 10 / 10</div>
            <div className="text-[11px] font-mono text-zinc-400 uppercase mt-1">Split Soberano Artista</div>
          </div>
          <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center">
            <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-400">4 Bóvedas</div>
            <div className="text-[11px] font-mono text-zinc-400 uppercase mt-1">Catálogos Técnicos SSOT</div>
          </div>
          <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center">
            <div className="text-2xl sm:text-3xl font-black font-mono text-purple-400">100% Auditado</div>
            <div className="text-[11px] font-mono text-zinc-400 uppercase mt-1">Conformidad LCSP & B2C</div>
          </div>
        </div>

        {/* ── PESTAÑAS DE NAVEGACIÓN DEL ARSENAL ── */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('sonomusic')}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 ${
              activeTab === 'sonomusic'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>Packs Sonido & Discomóvil (Sonomusic)</span>
          </button>

          <button
            onClick={() => setActiveTab('providers')}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 ${
              activeTab === 'providers'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Radar de 13.977 Proveedores</span>
          </button>

          <button
            onClick={() => setActiveTab('b2g')}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 ${
              activeTab === 'b2g'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>Alumbrado Festivo B2G (Demetrio)</span>
          </button>

          <button
            onClick={() => setActiveTab('transport')}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 ${
              activeTab === 'transport'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Flota & Transfers VIP</span>
          </button>
        </div>

        {/* ── CONTENIDO SEGÚN LA PESTAÑA ACTIVA ── */}

        {/* 1. Catálogo Técnico de Sonido (Sonomusic Vampirizado) */}
        {activeTab === 'sonomusic' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-mono text-zinc-300">
                  Tarifas oficiales homologadas mediante inspección forense. Garantía de disponibilidad y precio sin sobrecostes.
                </span>
              </div>
              <Link
                href="/oraculo"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 text-xs font-mono font-bold"
              >
                <span>Calcular en The Oracle</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SONOMUSIC_FEATURED.map((item) => (
                <div 
                  key={item.id}
                  className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-amber-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-zinc-800 text-amber-400 font-bold uppercase">
                        {item.category}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                        {item.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white font-serif mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs font-mono text-zinc-400 mb-4">
                      {item.specs}
                    </p>

                    <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 mb-4 text-[11px] text-zinc-400">
                      <span className="font-bold text-zinc-300">Recomendado para:</span> {item.idealFor}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-zinc-500 line-through">
                        PVP Mercado: {item.originalPrice} €
                      </div>
                      <div className="text-xl font-black font-mono text-white">
                        {item.earPrice} € <span className="text-xs text-amber-400 font-bold">EAR OS</span>
                      </div>
                    </div>
                    <Link
                      href={`/contacto?item=${encodeURIComponent(item.title)}`}
                      className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-amber-500 hover:text-black text-xs font-mono font-bold transition-colors"
                    >
                      Reservar Equipo
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Radar de 13.977 Proveedores */}
        {activeTab === 'providers' && (
          <div className="space-y-6">
            <div className="p-5 rounded-3xl bg-zinc-900/50 border border-zinc-800 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre o sector..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-zinc-300 focus:outline-none focus:border-amber-500"
                >
                  <option value="todas">Todas las Provincias</option>
                  <option value="madrid">Madrid</option>
                  <option value="toledo">Toledo</option>
                  <option value="valencia">Valencia</option>
                  <option value="badajoz">Badajoz</option>
                </select>
                <div className="text-xs font-mono text-zinc-400 flex items-center px-3 bg-zinc-800/40 rounded-xl">
                  {filteredProviders.length} resultados
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredProviders.map((p, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                        {p.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        ★ {p.rating}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-white mb-1">
                      {p.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-3">
                      <MapPin className="w-3 h-3 text-zinc-500" />
                      <span>{p.province}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                    <span className="text-[9px] font-mono text-zinc-500 truncate max-w-[130px]">
                      {p.token}
                    </span>
                    <Link
                      href={`/contacto?provider=${encodeURIComponent(p.name)}`}
                      className="text-[11px] font-mono text-amber-400 hover:text-amber-300 font-bold"
                    >
                      Reclamar / Auditar →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 text-center max-w-xl mx-auto">
              <h4 className="text-sm font-bold text-white font-mono uppercase mb-1">
                ¿Eres Proveedor del Sector y Quieres Homologarte?
              </h4>
              <p className="text-xs text-zinc-400 mb-4">
                Únete a la red soberana EAR OS y recibe peticiones de clientes de alto ticket sin pagar comisiones mensuales.
              </p>
              <Link
                href="/contacto?tipo=proveedor"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase transition-colors"
              >
                <span>Solicitar Alta en el Arsenal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* 3. Alumbrado Festivo B2G (Demetrio) */}
        {activeTab === 'b2g' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-mono text-amber-200">
                  358 Referencias técnicas de alumbrado LED monumental para Fiestas Patronales y Campañas de Navidad B2G.
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                Art. 118 LCSP Menor
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {B2G_LIGHTING_FEATURED.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="text-[10px] font-mono text-zinc-500 mb-1">{item.ref}</div>
                    <h3 className="text-base font-bold text-white font-serif mb-2">
                      {item.title}
                    </h3>
                    <div className="text-xs text-zinc-400 mb-4">
                      {item.specs}
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-zinc-800">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-zinc-500">Contrato:</span>
                      <span className="text-emerald-400 font-bold">{item.budgetTier}</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-zinc-500">Eficiencia:</span>
                      <span className="text-amber-400 font-bold">{item.energySavings}</span>
                    </div>
                    <Link
                      href={`/contacto?b2g=${encodeURIComponent(item.title)}`}
                      className="w-full mt-3 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-amber-500 hover:text-black text-center block text-xs font-mono font-bold transition-colors"
                    >
                      Solicitar Pliego Técnico
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Flota & Transfers VIP */}
        {activeTab === 'transport' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {TRANSPORT_VIP_FEATURED.map((item) => (
                <div
                  key={item.id}
                  className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 text-amber-400 text-[10px] font-mono font-bold uppercase mb-3">
                      <Car className="w-3 h-3" />
                      <span>{item.capacity}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white font-serif mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs font-mono text-zinc-400 mb-4">
                      {item.specs}
                    </p>
                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 mb-4">
                      <span className="font-bold text-white">Uso Operativo:</span> {item.application}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      Servicio con Chófer Certificado
                    </span>
                    <Link
                      href={`/contacto?vehiculo=${encodeURIComponent(item.title)}`}
                      className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-mono font-bold hover:bg-amber-400 transition-colors"
                    >
                      Reservar Flota
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
