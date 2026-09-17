"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Crown,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Building2,
  Music,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Search,
  Zap,
  Volume2,
  Users,
  ExternalLink,
  Lock,
  PhoneCall,
  CalendarCheck,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { SCLASS_12_FINCAS_HOMOLOGADAS, FincaHomologada } from '@/lib/constants/fincas-catalog';
import { CENTRALITA } from '@/lib/phone-constants';

export default function FincasSClassPage() {
  const [formData, setFormData] = useState({
    nombreFinca: '',
    ubicacion: '',
    contacto: '',
    email: '',
    capacidad: ''
  });
  const [submitted, setSubmitted] = useState(false);

  // Estados del Buscador y Filtros del Catálogo Sincronizado
  const [selectedProvincia, setSelectedProvincia] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredFincas = useMemo(() => {
    return SCLASS_12_FINCAS_HOMOLOGADAS.filter((finca) => {
      const matchProv = selectedProvincia === 'Todas' || finca.provincia === selectedProvincia;
      const matchSearch =
        searchQuery.trim() === '' ||
        finca.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        finca.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        finca.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchProv && matchSearch;
    });
  }, [selectedProvincia, searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#030305] text-[#fcfbf9] font-sans selection:bg-[#ecb613] selection:text-black w-full overflow-x-hidden">
      {/* Top S-Class Bar */}
      <div className="bg-[#050507] border-b border-[#1A1A24] py-2 px-6 text-xs text-zinc-400 flex justify-between items-center tracking-wider uppercase">
        <span className="flex items-center gap-2 text-[#ecb613] font-mono">
          <Crown className="w-4 h-4" /> fincasparaboda.com // Productora EAR S-Class
        </span>
        <span className="hidden md:inline font-mono text-[11px] text-zinc-500">
          Madrid • Toledo • Guadalajara • 12 Fincas Homologadas • Split 80/10/10
        </span>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28 px-6 md:px-12 border-b border-[#1A1A24] bg-gradient-to-b from-[#08080C] to-[#030305]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#ecb613]/5 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D0D15] border border-[#ecb613]/30 text-[#ecb613] text-xs font-semibold uppercase tracking-widest shadow-lg">
            <Sparkles className="w-3.5 h-3.5" /> Red Oficial Sincronizada con Productora EAR
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white">
            Tu Finca No Es Un Salón Vacío.<br />
            <span className="bg-gradient-to-r from-[#ecb613] via-[#f59e0b] to-[#d97706] bg-clip-text text-transparent">
              Es el Escenario de una Leyenda.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto font-light leading-relaxed">
            Conectamos fincas singulares en Madrid, Toledo y Zona Centro con parejas y directores de eventos de alto nivel, fusionando arquitectura patrimonial con la producción técnica y acústica en directo (Bose F1 812, Shure Beta 87A y Edwin Agudelo en vivo).
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="#catalogo-fincas" 
              className="inline-flex items-center justify-center gap-3 bg-[#ecb613] hover:bg-[#d9a40e] text-[#050507] font-extrabold px-8 py-4 rounded-xl transition-all shadow-[0_0_30px_rgba(236,182,19,0.3)] hover:scale-[1.02] cursor-pointer font-mono text-sm uppercase tracking-wider"
            >
              Explorar 12 Fincas Homologadas <ArrowRight className="w-4 h-4" />
            </a>
            <Link 
              href="/proveedores?cat=finca" 
              className="inline-flex items-center justify-center gap-2 bg-[#0D0D15] hover:bg-[#141420] text-zinc-200 border border-[#262638] font-semibold px-8 py-4 rounded-xl transition-all font-mono text-sm"
            >
              <Layers className="w-4 h-4 text-[#ecb613]" /> Directorio de Proveedores (10.322 Fincas)
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-[#1A1A24] max-w-4xl mx-auto text-center">
            <div className="p-4 rounded-xl bg-[#09090F] border border-[#1A1A24]">
              <div className="text-2xl md:text-3xl font-black text-white font-mono">12</div>
              <div className="text-xs text-zinc-400 uppercase tracking-wider mt-1">Fincas Certificadas</div>
            </div>
            <div className="p-4 rounded-xl bg-[#09090F] border border-[#1A1A24]">
              <div className="text-2xl md:text-3xl font-black text-[#ecb613] font-mono">12 W/pax</div>
              <div className="text-xs text-zinc-400 uppercase tracking-wider mt-1">Rider Bose S-Class</div>
            </div>
            <div className="p-4 rounded-xl bg-[#09090F] border border-[#1A1A24]">
              <div className="text-2xl md:text-3xl font-black text-[#10B981] font-mono">&lt; 88 dBA</div>
              <div className="text-xs text-zinc-400 uppercase tracking-wider mt-1">Blindaje Acústico</div>
            </div>
            <div className="p-4 rounded-xl bg-[#09090F] border border-[#1A1A24]">
              <div className="text-2xl md:text-3xl font-black text-white font-mono">80/10/10</div>
              <div className="text-xs text-zinc-400 uppercase tracking-wider mt-1">Split Soberano</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN SINCRONIZADA: CATÁLOGO DE 12 FINCAS HOMOLOGADAS ── */}
      <section id="catalogo-fincas" className="py-20 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-mono text-[#ecb613] uppercase tracking-[0.25em] block mb-2">
              SSOT S-CLASS // INFRAESTRUCTURA TÉCNICA CERTIFICADA
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Red Oficial de Fincas Homologadas
            </h2>
            <p className="text-zinc-400 text-sm mt-2 max-w-2xl">
              Cada finca cuenta con acometida CETAC trifásica independiente, póliza de Responsabilidad Civil de hasta 1.000.000 €, calibración acústica con sonómetro CESVA y liquidación garantizada en 7 días hábiles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['Todas', 'Madrid', 'Toledo', 'Guadalajara'].map((prov) => (
              <button
                key={prov}
                onClick={() => setSelectedProvincia(prov)}
                className={`px-4 py-2 rounded-lg text-xs font-mono transition-all ${
                  selectedProvincia === prov
                    ? 'bg-[#ecb613] text-[#050507] font-bold shadow-md shadow-[#ecb613]/20'
                    : 'bg-[#0D0D15] text-zinc-400 border border-[#1A1A24] hover:text-white hover:border-zinc-700'
                }`}
              >
                {prov}
              </button>
            ))}
          </div>
        </div>

        {/* Buscador de Fincas */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar finca por nombre, municipio o especificaciones técnicas..."
            className="w-full bg-[#09090F] border border-[#222230] rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ecb613] transition-colors"
          />
        </div>

        {/* Grid de Fincas S-Class */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFincas.map((finca) => (
            <div
              key={finca.id}
              className="rounded-2xl border border-[#1A1A24] bg-[#09090F] p-6 flex flex-col justify-between hover:border-[#ecb613]/50 transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
                      {finca.provincia} • {finca.distanciaHubMentridaKm} km Hub
                    </span>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#ecb613] transition-colors mt-2">
                      {finca.name}
                    </h3>
                    <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-1 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500" /> {finca.location}
                    </p>
                  </div>
                  <ShieldCheck className="w-6 h-6 text-[#10B981] shrink-0" />
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {finca.description}
                </p>

                {/* Especificaciones Técnicas */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#1A1A24] text-[11px] font-mono">
                  <div className="p-2 rounded-lg bg-[#050507] border border-[#14141E]">
                    <span className="text-zinc-500 block text-[10px]">CAPACIDAD</span>
                    <span className="text-white font-bold">{finca.capacidadMaxPax} Pax</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#050507] border border-[#14141E]">
                    <span className="text-zinc-500 block text-[10px]">POTENCIA</span>
                    <span className="text-[#ecb613] font-bold">{finca.potenciaKw} kW ({finca.tomaElectrica.split(' ')[0]})</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#050507] border border-[#14141E]">
                    <span className="text-zinc-500 block text-[10px]">LÍMITE SPL</span>
                    <span className="text-[#10B981] font-bold">{finca.limiteAcustico.interiorDBA} dBA Interior</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#050507] border border-[#14141E]">
                    <span className="text-zinc-500 block text-[10px]">PÓLIZA RC</span>
                    <span className="text-white font-bold">{(finca.polizaRC.coberturaEuros / 1000).toFixed(0)}k € {finca.polizaRC.aseguradora.split(' ')[0]}</span>
                  </div>
                </div>

                {/* Servicios coordinados */}
                <div className="pt-2">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1.5">
                    Servicios Homologados:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {finca.serviciosCoordinados.slice(0, 3).map((serv) => (
                      <span
                        key={serv}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#12121D] border border-[#1F1F2E] text-zinc-300"
                      >
                        {serv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botones de Acción Inmediata */}
              <div className="pt-6 mt-6 border-t border-[#1A1A24] space-y-2.5">
                <a
                  href={`https://wa.me/34693693048?text=${encodeURIComponent(
                    `Hola Edwin, solicito verificar fecha y disponibilidad técnica para ${finca.name} (${finca.location}) a través de fincasparaboda.com.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-lg bg-[#ecb613] hover:bg-[#d9a40e] text-[#050507] font-bold text-xs flex items-center justify-center gap-2 transition-all font-mono"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  Consultar Disponibilidad (WhatsApp)
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={`/proveedores?cat=finca&q=${encodeURIComponent(finca.name)}`}
                    className="py-2 px-2.5 rounded-lg border border-[#262638] bg-[#050507] hover:border-zinc-500 text-[11px] font-mono text-zinc-300 flex items-center justify-center gap-1.5 transition-all text-center"
                  >
                    <Layers className="w-3 h-3 text-[#ecb613]" /> Ficha Proveedor
                  </Link>

                  <a
                    href={CENTRALITA.tel}
                    className="py-2 px-2.5 rounded-lg border border-[#262638] bg-[#050507] hover:border-[#ecb613]/50 text-[11px] font-mono text-[#ecb613] flex items-center justify-center gap-1.5 transition-all text-center"
                  >
                    <PhoneCall className="w-3 h-3" /> Centralita 24/7
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFincas.length === 0 && (
          <div className="py-16 text-center space-y-3 bg-[#09090F] rounded-2xl border border-[#1A1A24]">
            <Building2 className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-zinc-400 text-sm">No se encontraron fincas con los filtros seleccionados.</p>
            <button
              onClick={() => {
                setSelectedProvincia('Todas');
                setSearchQuery('');
              }}
              className="text-xs text-[#ecb613] hover:underline font-mono"
            >
              Restablecer filtros de búsqueda
            </button>
          </div>
        )}
      </section>

      {/* ── GATEWAY TRIPARTITO: DIRECTORIO, COMPARADOR B2B Y PORTAL FINCAS ── */}
      <section className="py-16 px-6 md:px-12 bg-[#06060A] border-y border-[#1A1A24]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-mono text-[#ecb613] uppercase tracking-[0.25em]">
              ECOSISTEMA INTEGRAL SOBERANO
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              Conexión Directa con Toda la Red de Proveedores EAR OS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/proveedores?cat=finca"
              className="p-6 rounded-2xl border border-[#1F1F2E] bg-[#09090F] hover:border-[#ecb613]/60 transition-all group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/20 flex items-center justify-center text-[#ecb613] group-hover:scale-105 transition-transform">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#ecb613] transition-colors">
                  Directorio Soberano de Fincas
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Accede a las 10.322 fincas y espacios singulares indexados en España con filtros por dehesa, cortijo, castillo, masía y salones.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-mono text-[#ecb613] font-bold">
                Explorar Directorio <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/fincas/portal-demostrativo"
              className="p-6 rounded-2xl border border-[#1F1F2E] bg-[#09090F] hover:border-[#10B981]/60 transition-all group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981] group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#10B981] transition-colors">
                  Portal Demostrativo B2B
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Comparador demoledor frente a directorios tradicionales, telemetría acústica y auditoría de rentabilidad por boda.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-mono text-[#10B981] font-bold">
                Ver Métricas Financieras <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/fincas"
              className="p-6 rounded-2xl border border-[#1F1F2E] bg-[#09090F] hover:border-[#00E5FF]/60 transition-all group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF] group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#00E5FF] transition-colors">
                  Portal de Afiliación B2B
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Simulador de comisiones anuales (10% a 15%), liquidación en &lt;= 7 días y onboarding express en 15 minutos.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-mono text-[#00E5FF] font-bold">
                Acceder a Afiliación <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Manifiesto Section */}
      <section id="manifiesto" className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="bg-[#09090F] border border-[#1A1A24] p-8 md:p-12 rounded-2xl relative shadow-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#ecb613]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center space-y-4 mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#ecb613] font-mono">
              Filosofía & Moat Estético
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white">El Despertar del Espacio Exclusivo</h2>
          </div>

          <blockquote className="border-l-4 border-[#ecb613] pl-6 my-6 italic text-zinc-200 text-lg md:text-xl font-light leading-relaxed">
            &ldquo;Una finca no es solo un entorno con historia y naturaleza; es el santuario donde la vida de dos personas se convierte en leyenda. El mercado masivo os ha tratado como almacenes de bodas en serie.&rdquo;
          </blockquote>

          <div className="space-y-4 text-zinc-300 font-light leading-relaxed text-sm sm:text-base">
            <p>
              Creemos firmemente que la excelencia arquitectónica y paisajística no debe competir en un escaparate impersonal de descuentos y leads masificados. Las parejas de este segmento buscan un refugio donde respirar exclusividad, emoción y arte absoluto.
            </p>
            <p>
              <strong className="text-white font-medium">fincasparaboda.com</strong> rompe el molde. Unimos la majestuosidad de vuestras fincas con la curaduría artística de Productora EAR, creando una simbiosis perfecta donde el entorno natural y la ejecución sonora se funden en una experiencia inolvidable.
            </p>
          </div>
        </div>
      </section>

      {/* Value Prop Grid */}
      <section className="py-20 px-6 md:px-12 bg-[#050507] border-t border-b border-[#1A1A24]">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <span className="text-xs font-bold text-[#ecb613] uppercase tracking-wider font-mono">
              Arquitectura de Conversión
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Por qué las fincas líderes abandonan los directorios masivos
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#09090F] border border-[#1A1A24] p-8 rounded-2xl space-y-4 hover:border-[#ecb613]/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#ecb613]/10 flex items-center justify-center text-[#ecb613] group-hover:bg-[#ecb613] group-hover:text-[#050507] transition-all">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Cero Fricción & Leads Calificados</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Filtramos rigurosamente el tráfico. Conectamos tu espacio exclusivamente con parejas con alta capacidad presupuestaria y alineadas con el lujo experiencial.
              </p>
            </div>

            <div className="bg-[#09090F] border border-[#1A1A24] p-8 rounded-2xl space-y-4 hover:border-[#ecb613]/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#ecb613]/10 flex items-center justify-center text-[#ecb613] group-hover:bg-[#ecb613] group-hover:text-[#050507] transition-all">
                <Music className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">El Efecto Compuesto del Arte</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Una finca gana un 40% más de retención y recuerdo emocional cuando se acompaña de producción artística y técnica en directo (tenores, boleros, rider Shure/Bose).
              </p>
            </div>

            <div className="bg-[#09090F] border border-[#1A1A24] p-8 rounded-2xl space-y-4 hover:border-[#ecb613]/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#ecb613]/10 flex items-center justify-center text-[#ecb613] group-hover:bg-[#ecb613] group-hover:text-[#050507] transition-all">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Visibilidad de Autor</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Tu propiedad no aparece en listas impersonales. Se presenta mediante storytelling cinematográfico que realza la singularidad de tu patrimonio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section id="solicitud" className="py-24 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="bg-gradient-to-b from-[#0D0D15] to-[#06060A] border border-[#ecb613]/30 p-8 md:p-14 rounded-3xl shadow-2xl relative">
          <div className="text-center space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ecb613] bg-[#ecb613]/10 px-4 py-1 rounded-full font-mono">
              <Crown className="w-3.5 h-3.5" /> Fase de Selección y Homologación Técnica
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Solicita tu plaza como Finca Homologada S-Class
            </h2>
            <p className="text-zinc-400 max-w-lg mx-auto text-sm">
              Seleccionamos estrictamente espacios singulares en la zona centro (Madrid, Toledo y Guadalajara) para su homologación acústica y comercial.
            </p>
          </div>

          {submitted ? (
            <div className="bg-[#0c1f13] border border-[#10B981] p-8 rounded-2xl text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto" />
              <h3 className="text-2xl font-bold text-white">Solicitud Recibida Correctamente</h3>
              <p className="text-zinc-300 text-sm max-w-md mx-auto">
                Tu postulación para <strong className="text-[#ecb613]">{formData.nombreFinca || 'tu finca'}</strong> ha sido registrada en el núcleo de EAR OS. Nuestro gabinete técnico se pondrá en contacto en menos de 24 horas.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2 font-mono">
                    <Building2 className="w-4 h-4 text-[#ecb613]" /> Nombre de la Finca
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ej. Finca El Romero"
                    value={formData.nombreFinca}
                    onChange={(e) => setFormData({...formData, nombreFinca: e.target.value})}
                    className="w-full bg-[#050507] border border-[#262638] focus:border-[#ecb613] rounded-xl px-4 py-3 text-white placeholder-zinc-600 outline-none transition-all text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2 font-mono">
                    <MapPin className="w-4 h-4 text-[#ecb613]" /> Ubicación (Provincia / Zona)
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ej. Illescas, Toledo / Madrid Sur"
                    value={formData.ubicacion}
                    onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                    className="w-full bg-[#050507] border border-[#262638] focus:border-[#ecb613] rounded-xl px-4 py-3 text-white placeholder-zinc-600 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2 font-mono">
                    <Phone className="w-4 h-4 text-[#ecb613]" /> Teléfono de Contacto
                  </label>
                  <input 
                    type="tel" 
                    required
                    placeholder="+34 600 000 000"
                    value={formData.contacto}
                    onChange={(e) => setFormData({...formData, contacto: e.target.value})}
                    className="w-full bg-[#050507] border border-[#262638] focus:border-[#ecb613] rounded-xl px-4 py-3 text-white placeholder-zinc-600 outline-none transition-all text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2 font-mono">
                    <Mail className="w-4 h-4 text-[#ecb613]" /> Correo Electrónico
                  </label>
                  <input 
                    type="email" 
                    required
                    placeholder="propietario@tu-finca.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-[#050507] border border-[#262638] focus:border-[#ecb613] rounded-xl px-4 py-3 text-white placeholder-zinc-600 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold font-mono">
                  Capacidad Estimada de Invitados & Estilo Arquitectónico
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. 300 invitados / Invernadero señorial con jardines exteriores"
                  value={formData.capacidad}
                  onChange={(e) => setFormData({...formData, capacidad: e.target.value})}
                  className="w-full bg-[#050507] border border-[#262638] focus:border-[#ecb613] rounded-xl px-4 py-3 text-white placeholder-zinc-600 outline-none transition-all text-sm"
                />
              </div>

              <div className="pt-4 text-center">
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#ecb613] via-[#f59e0b] to-[#ecb613] hover:opacity-95 text-[#050507] font-extrabold py-4 px-8 rounded-xl transition-all shadow-[0_0_30px_rgba(236,182,19,0.3)] text-sm tracking-wider uppercase cursor-pointer font-mono"
                >
                  Enviar Solicitud de Homologación
                </button>
                <p className="text-[11px] text-zinc-500 mt-3 font-mono">
                  Al enviar este formulario, aceptas los criterios S-Class de Productora EAR (RC &gt;= 300k, Acometida CETAC y Split 80/10/10).
                </p>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Footer S-Class */}
      <footer className="border-t border-[#1A1A24] bg-[#050507] py-12 px-6 text-center text-xs text-zinc-500 space-y-4">
        <div className="flex justify-center items-center gap-2 text-[#ecb613] font-semibold font-mono">
          <Crown className="w-4 h-4" /> Productora EAR • Infraestructura S-Class // fincasparaboda.com
        </div>
        <p className="font-mono text-[11px]">
          &copy; 2026 fincasparaboda.com • Todos los derechos reservados. Operado desde el Hub Logístico de Méntrida, Toledo.
        </p>
        <div className="flex justify-center items-center gap-4 text-xs font-mono text-zinc-400 pt-2">
          <span>Centralita: {CENTRALITA.display}</span>
          <span>•</span>
          <span>Stripe Price-Lock: 100,00 €</span>
          <span>•</span>
          <span>Rider Acústico: 12 W/pax</span>
        </div>
      </footer>
    </div>
  );
}
