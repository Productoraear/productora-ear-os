"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Users,
  CreditCard,
  TrendingUp,
  Activity,
  Calendar,
  Wallet,
  QrCode,
  ArrowUpRight,
  ArrowDownLeft,
  ShoppingCart,
  RefreshCcw,
  Sparkles,
  Search,
  Landmark,
  Truck,
  Compass,
  Mic,
  Phone,
  Radio,
  Flame,
  Zap,
  Shield,
  ShieldCheck,
  ChevronRight,
  Award,
  Layers,
  HeartHandshake,
  BarChart3,
  ExternalLink
} from 'lucide-react';
import { PROVIDERS_GRAND_TOTAL, formatProviderCount, formatProviderBadge } from '@/lib/constants/providers-manifest';
import ScraperLiveMonitorWidget from '@/components/admin/ScraperLiveMonitorWidget';

const GRAND_TOTAL_FORMATTED = formatProviderCount(PROVIDERS_GRAND_TOTAL);
const GRAND_TOTAL_BADGE = formatProviderBadge(PROVIDERS_GRAND_TOTAL);

// ============================================================================
// CATMİN 21ST.DEV // 22 URLS OFICIALES DE EAR OS
// ============================================================================
const ALL_ADMIN_DIRECT_URLS = [
  // NÚCLEO Y SIMULACIÓN
  { category: "Núcleo & Simulación", name: "🗺️ Mapa & Simulador S-Class", url: "/admin/simulador", badge: "21ST.DEV", desc: "Simulador de eventos, Split 80/10/10, logística Méntrida y los 5 dominios.", icon: Compass },
  { category: "Núcleo & Simulación", name: "Omni-Cockpit Central", url: "/admin", badge: "CORE", desc: "Panel de control central, KPIs de negocio y telemetría GPU local.", icon: ShieldCheck },
  { category: "Núcleo & Simulación", name: "Simulador HTML Standalone", url: "/simulador-ear-os.html", badge: "HTML5", desc: "Vista interactiva de vanguardia inspirada en templates 21st.dev.", icon: ExternalLink },
  { category: "Núcleo & Simulación", name: "Manual de Operaciones 360", url: "/admin/manual-operaciones", badge: "DOCTRINA", desc: "Protocolos canónicos para ventas, call center, grabación y contingencias.", icon: Award },
  { category: "Núcleo & Simulación", name: "Aura Cinematic Portfolio", url: "/aura", badge: "AURA S-CLASS", desc: "Showcase cinematográfico con partículas GPU, audio lírico y física interactiva.", icon: Sparkles },

  // VENTAS, LEADS & CONVERSIÓN
  { category: "Ventas & Conversión", name: "Call Center Outbound", url: "/admin/call-center", badge: GRAND_TOTAL_BADGE, desc: "Despacho telefónico con clon soberano sanitizado y 19.608 registros.", icon: Phone },
  { category: "Ventas & Conversión", name: "Centralita WhatsApp", url: "/admin/whatsapp", badge: "693 048", desc: "Monitor de mensajes directos y cierre de depósitos vía WhatsApp.", icon: Radio },
  { category: "Ventas & Conversión", name: "Scala Leads & Sourcing", url: "/admin/sourcing", badge: "LEADS", desc: "Prospección automática y absorción de centros senior y fincas.", icon: Flame },
  { category: "Ventas & Conversión", name: "Directorio Proveedores CDN", url: "/admin/proveedores", badge: `${GRAND_TOTAL_BADGE} CDN`, desc: "Fichas públicas de proveedores y homologación técnica.", icon: Users },
  { category: "Ventas & Conversión", name: "Omni Training Center", url: "/admin/training", badge: "SALES", desc: "Academia de ventas, scripts comerciales y manejo de objeciones.", icon: Award },

  // FINANZAS, LEGAL & INSTITUCIONAL
  { category: "Finanzas & Legal B2G", name: "B2G & Licitaciones <14.250€", url: "/admin/licitaciones", badge: "LEGAL", desc: "Contratos menores Art. 118 LCSP y pliegos acústicos <75 dB SPL.", icon: Landmark },
  { category: "Finanzas & Legal B2G", name: "Tesorería & Stripe Price-Lock", url: "/admin/tesoreria", badge: "100€", desc: "Depósitos inmutables de 100 €, pasarela Stripe y ledger de tesorería.", icon: CreditCard },
  { category: "Finanzas & Legal B2G", name: "Red de Afiliados y Fincas", url: "/admin/afiliados", badge: "SPLIT 80/10/10", desc: "Gestión de partners nupciales y liquidación de comisiones del 10%.", icon: HeartHandshake },
  { category: "Finanzas & Legal B2G", name: "Flota & Logística Méntrida", url: "/admin/flota", badge: "KM 0", desc: "Calculadora de distancias, portes 1,50 €/km y estado de vehículos.", icon: Truck },

  // INTELIGENCIA, IA & CONSOLAS DIRECTAS
  { category: "Inteligencia & GPU", name: "Voice Studio IA", url: "/admin/voice-studio", badge: "GPU 24GB", desc: "Modelos de voz locales operando en la AMD RX 7900 XTX.", icon: Mic },
  { category: "Inteligencia & GPU", name: "Meta-Compiler (Vibe Coding)", url: "/admin/compiler", badge: "DAG", desc: "Orquestador de micro-servicios y compilación reactiva.", icon: Zap },
  { category: "Inteligencia & GPU", name: "Journey Heatmap UX", url: "/admin/journey-heatmap", badge: "HEATMAP", desc: "Mapas de calor y telemetría de interacción de usuarios.", icon: Activity },
  { category: "Inteligencia & GPU", name: "Consola Sentinel ZTM", url: "/admin/sentinel", badge: "ZERO-TKN", desc: "Protección contra saturación de memoria de Ollama.", icon: Shield },
  { category: "Inteligencia & GPU", name: "Centro de Mando & Skills", url: "/admin/command-center", badge: "ROOT", desc: "Gobernanza del sistema y catálogo de skills autónomos.", icon: ShieldCheck },
  { category: "Inteligencia & GPU", name: "Radar de Demanda Directo", url: "/radar", badge: "EXP", desc: "Consola de radar de demanda y palabras clave nupciales.", icon: BarChart3 },
  { category: "Inteligencia & GPU", name: "Agent Skills Directo", url: "/agent-skills", badge: "SKILLS", desc: "Directorio de habilidades de los agentes autónomos.", icon: Layers },
  { category: "Inteligencia & GPU", name: "Voice Studio Directo", url: "/voice-studio", badge: "DIRECT", desc: "Consola de voz desacoplada para locuciones y grabaciones.", icon: Mic },
  { category: "Inteligencia & GPU", name: "Sourcing Directo", url: "/sourcing", badge: "DIRECT", desc: "Consola independiente de captura masiva de proveedores.", icon: Flame }
];

export default function CatminAdminDashboardPage() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("TODOS");
  const [searchQuery, setSearchQuery] = useState("");

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  // Filtrado de URLs
  const filteredUrls = useMemo(() => {
    return ALL_ADMIN_DIRECT_URLS.filter((item) => {
      const matchesCategory = selectedCategory === "TODOS" || item.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query) ||
        item.badge.toLowerCase().includes(query) ||
        item.url.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      
      {/* ===================================================================== */}
      {/* 1. HEADER DE PÁGINA (ESTILO CATMÍN TEMPLATE 21ST.DEV)                 */}
      {/* ===================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1a1a24] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span>Admin</span>
            <span>/</span>
            <span className="text-[#ecb613] font-bold">Dashboard S-Class</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-syne uppercase mt-1">
            Omni-Cockpit Soberano
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-[#ecb613]/50 transition-all"
            title="Refrescar Telemetría"
          >
            <RefreshCcw className={`w-4 h-4 text-[#ecb613] ${refreshing ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/admin/simulador"
            className="py-2 px-4 rounded-xl bg-[#ecb613] hover:bg-amber-400 text-black font-extrabold text-xs font-mono uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#ecb613]/20 transition-all"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Abrir Simulador 21st</span>
          </Link>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. CATMÍN ROW 1: 4 TARJETAS KPI DE ALTO IMPACTO                       */}
      {/* ===================================================================== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        
        {/* Card 1: Total Revenue (Facturación Bruta) */}
        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm hover:border-[#ecb613]/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Facturación Bruta (Split)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">0,00 €</div>
          <p className="text-[11px] text-zinc-400 mt-1">0 operaciones liquidadas</p>
          <div className="mt-2 flex items-center text-xs font-mono text-zinc-500 font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            Base Real S-Class (0 Vanidad)
          </div>
        </div>

        {/* Card 2: Bóveda SSOT Proveedores (New Customers) */}
        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm hover:border-[#ecb613]/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Bóveda SSOT Proveedores</span>
            <div className="w-8 h-8 rounded-lg bg-[#ecb613]/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-[#ecb613]" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">{GRAND_TOTAL_FORMATTED}</div>
          <p className="text-[11px] text-zinc-400 mt-1">9.559 Fincas + 10.049 Celebrents</p>
          <div className="mt-2 flex items-center text-xs font-mono text-emerald-400 font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            100% Homologado & Fotos HD
          </div>
        </div>

        {/* Card 3: Depósitos Stripe Price-Lock (Active Accounts) */}
        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm hover:border-[#ecb613]/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Price-Lock Inmutable</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">100,00 €</div>
          <p className="text-[11px] text-zinc-400 mt-1">Depósito por evento en Stripe</p>
          <div className="mt-2 flex items-center text-xs font-mono text-cyan-400 font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            Tarifa Canónica por Reserva
          </div>
        </div>

        {/* Card 4: Licitaciones Menores B2G (Growth Rate) */}
        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm hover:border-[#ecb613]/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Licitaciones Menores B2G</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Landmark className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">&lt; 14.250 €</div>
          <p className="text-[11px] text-zinc-400 mt-1">Art. 118 LCSP (&lt;75 dB SPL)</p>
          <div className="mt-2 flex items-center text-xs font-mono text-purple-400 font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            Límite Legal por Expediente
          </div>
        </div>

      </div>

      {/* ===================================================================== */}
      {/* 2.5. MONITOR DIGITAL DEL SCRAPER NACIONAL EN TIEMPO REAL             */}
      {/* ===================================================================== */}
      <ScraperLiveMonitorWidget />

      {/* ===================================================================== */}
      {/* 3. CATMÍN ROW 2: GRÁFICOS ANALÍTICOS Y BUDGET OVERVIEW (SPLIT 80/10/10) */}
      {/* ===================================================================== */}
      <div className="grid gap-6 xl:grid-cols-3">
        
        {/* Columna Izquierda: 2 Gráficos (Subscriptions Area + Revenue Bars) */}
        <div className="grid gap-6 md:grid-cols-2 xl:col-span-2">
          
          {/* Gráfico 1: Subscriptions / Cierres de Contratos */}
          <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-sm font-medium text-zinc-400">Cierres de Contratos (Galas)</div>
              <div className="text-2xl font-bold font-mono text-white mt-1">0</div>
              <p className="text-xs text-zinc-500">Esperando primeros cierres</p>
            </div>

            {/* SVG Area Chart Reactivo en Cero */}
            <div className="h-32 w-full mt-4 flex items-center justify-center border border-dashed border-zinc-900 rounded-xl">
              <span className="text-[11px] font-mono text-zinc-600">Sin cierres acumulados (0 Galas)</span>
            </div>
          </div>

          {/* Gráfico 2: Total Revenue (Barras Semanales) */}
          <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-sm font-medium text-zinc-400">Facturación Bruta Mensual</div>
              <div className="text-2xl font-bold font-mono text-white mt-1">0,00 €</div>
              <p className="text-xs text-zinc-500">0,00 € devengados este mes</p>
            </div>

            {/* SVG Bar Chart Reactivo en Cero */}
            <div className="h-32 w-full mt-4 flex items-center justify-center border border-dashed border-zinc-900 rounded-xl">
              <span className="text-[11px] font-mono text-zinc-600">0,00 € facturados (Línea base en cero)</span>
            </div>
          </div>

        </div>

        {/* Columna Derecha: Budget Overview // Split Soberano 80/10/10 */}
        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-white font-syne uppercase">Split 80/10/10 Overview</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/30">
                SSOT EN VIVO
              </span>
            </div>
            <div className="flex justify-between items-center text-xs font-mono text-zinc-400 mt-2">
              <span>Total Liquidado</span>
              <span className="font-bold text-white">0,00 € / 0,00 €</span>
            </div>

            {/* Barra Principal de Progreso */}
            <div className="w-full bg-zinc-900 rounded-full h-2 mt-2 overflow-hidden">
              <div className="bg-[#ecb613] h-full rounded-full transition-all duration-500" style={{ width: '0%' }} />
            </div>
            <p className="text-[11px] text-zinc-500 text-right mt-1">0.0% del volumen ejecutado</p>

            {/* Barras Detalladas por Categoría */}
            <div className="space-y-3 mt-4">
              {/* 80% Artista */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-medium">80% Artista (Edwin Agudelo)</span>
                  <span className="text-white">80%</span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: '80%' }} />
                </div>
              </div>

              {/* 10% EAR OS */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#ecb613] font-medium">10% Infraestructura EAR OS</span>
                  <span className="text-white">10%</span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#ecb613] h-full rounded-full" style={{ width: '10%' }} />
                </div>
              </div>

              {/* 10% VIMUME */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-cyan-400 font-medium">10% Impacto Social VIMUME</span>
                  <span className="text-white">10%</span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full" style={{ width: '10%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-900 text-[10px] font-mono text-zinc-500 flex justify-between">
            <span>Certificado Modelo 182 AEAT</span>
            <span className="text-cyan-400">80% Deducible</span>
          </div>
        </div>

      </div>

      {/* ===================================================================== */}
      {/* 4. CATMÍN ROW 3: METAS ESTRATÉGICAS Y FONDOS                          */}
      {/* ===================================================================== */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Milestone 1: Fondo de Reserva Stripe */}
        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Activity className="w-4 h-4" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
                Por Iniciar (0 €)
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Tesorería & Stripe Price-Lock</h3>
              <p className="text-xs text-zinc-400 mt-0.5">3 meses de reservas operativas aseguradas</p>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-zinc-400">
                <span>Progreso</span>
                <span className="text-white font-bold">0%</span>
              </div>
              <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '0%' }} />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-white">0,00 €</span>
              <span className="text-zinc-500">Meta: 15.000 €</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-900">
            <Link
              href="/admin/tesoreria"
              className="w-full flex items-center justify-center gap-1 text-xs font-mono text-zinc-400 hover:text-[#ecb613] transition-colors"
            >
              <span>Ver Ledger de Tesorería</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Milestone 2: Cartera B2G Ayuntamientos */}
        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Landmark className="w-4 h-4" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Por Iniciar (0 €)
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Licitaciones Menores B2G</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Pliegos culturales para consistorios (&lt;14.250 €)</p>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-zinc-400">
                <span>Progreso</span>
                <span className="text-white font-bold">0%</span>
              </div>
              <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '0%' }} />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-white">0,00 €</span>
              <span className="text-zinc-500">Meta: 50.000 €</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-900">
            <Link
              href="/admin/licitaciones"
              className="w-full flex items-center justify-center gap-1 text-xs font-mono text-zinc-400 hover:text-[#ecb613] transition-colors"
            >
              <span>Ver Pliegos B2G</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Milestone 3: Logística & Flota Méntrida */}
        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Truck className="w-4 h-4" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Tarifa Lista (1,50€/km)
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Logística & Portes Méntrida Km 0</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Calculadora 1,50 €/km desde km 50 (+120€ hotel)</p>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-zinc-400">
                <span>Progreso</span>
                <span className="text-white font-bold">0%</span>
              </div>
              <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: '0%' }} />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-white">0,00 €</span>
              <span className="text-zinc-500">Meta: 25.000 €</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-900">
            <Link
              href="/admin/flota"
              className="w-full flex items-center justify-center gap-1 text-xs font-mono text-zinc-400 hover:text-[#ecb613] transition-colors"
            >
              <span>Ver Flota y Portes</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

      {/* ===================================================================== */}
      {/* 5. CATMÍN ROW 4: CUENTAS OPERATIVAS Y ACTIVIDAD RECIENTE (TRANSACCIONES)*/}
      {/* ===================================================================== */}
      <div className="grid gap-6 lg:grid-cols-2">
        
        {/* Card Izquierda: Total Balance y Cuentas Operativas */}
        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] shadow-sm">
          <div className="p-5 border-b border-[#1a1a24]">
            <p className="text-xs text-zinc-400">Balance Operativo Total</p>
            <h2 className="text-3xl font-bold font-mono text-white mt-1">0,00 €</h2>
          </div>

          <div className="p-4 space-y-1">
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 px-2 font-mono">
              Cuentas Soberanas (Split 80/10/10)
            </div>

            {/* Cuenta 1: Edwin Agudelo */}
            <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-900/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Caché Edwin Agudelo (80%)</h3>
                  <p className="text-[11px] text-zinc-500">Retribución solista directa</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-white">0,00 €</span>
            </div>

            {/* Cuenta 2: EAR OS Operaciones */}
            <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-900/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#ecb613]/10 text-[#ecb613]">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">EAR OS Pasarela & CDN (10%)</h3>
                  <p className="text-[11px] text-zinc-500">Mantenimiento y telemetría</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-white">0,00 €</span>
            </div>

            {/* Cuenta 3: Bóveda VIMUME */}
            <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-900/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Bóveda VIMUME Social (10%)</h3>
                  <p className="text-[11px] text-zinc-500">Impacto y sesiones 40 Hz</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-white">0,00 €</span>
            </div>

            {/* Cuenta 4: Stripe Custodia 100€ */}
            <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-900/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Stripe Price-Lock Custodia</h3>
                  <p className="text-[11px] text-zinc-500">Depósitos de 100 € en espera</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-white">0,00 €</span>
            </div>

          </div>
        </div>

        {/* Card Derecha: Últimas Transacciones */}
        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] shadow-sm flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-[#1a1a24] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold font-syne text-white uppercase">Transacciones Recientes</h2>
                <p className="text-xs text-zinc-500">0 operaciones registradas</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                LIBRO LIMPIO (0 €)
              </span>
            </div>

            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-600">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-300">Libro Contable en Espera</p>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
                  Cero transacciones ficticias. El ledger registrará automáticamente cada depósito Stripe (100 €) o contratación con desglose de Split 80/10/10.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-zinc-900">
            <Link
              href="/admin/tesoreria"
              className="w-full py-2 flex items-center justify-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-[#ecb613] bg-zinc-950/60 border border-zinc-800/80 rounded-xl transition-colors"
            >
              <span>Ver Ledger de Tesorería en Tiempo Real</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

      {/* ===================================================================== */}
      {/* 6. CATMÍN ROW 5: DIRECTORIO MAESTRO DE TODAS LAS 22 URLS DEL ADMIN     */}
      {/* ===================================================================== */}
      <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-6 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#ecb613] uppercase tracking-widest">
              <Compass className="w-4 h-4 text-[#ecb613]" />
              Catálogo de Módulos // 22 URLs Verificadas
            </div>
            <h2 className="text-xl font-bold font-syne text-white uppercase mt-1">
              Directorio de Acceso Rápido
            </h2>
          </div>

          {/* Buscador Rápido Catmín */}
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar módulo o ruta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#ecb613] transition-colors"
            />
          </div>
        </div>

        {/* Chips de Categorías */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-900">
          {[
            { id: "TODOS", label: `Todos (${ALL_ADMIN_DIRECT_URLS.length})` },
            { id: "Núcleo & Simulación", label: "Núcleo (5)" },
            { id: "Ventas & Conversión", label: "Ventas (5)" },
            { id: "Finanzas & Legal B2G", label: "Finanzas (4)" },
            { id: "Inteligencia & GPU", label: "Inteligencia (9)" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#ecb613] text-black font-bold shadow-md shadow-[#ecb613]/20'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid de Tarjetas de Módulos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredUrls.map((route, idx) => {
            const Icon = route.icon;
            return (
              <Link
                key={idx}
                href={route.url}
                className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-900 hover:border-[#ecb613]/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover:border-[#ecb613]/40 transition-colors">
                        <Icon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#ecb613] transition-colors" />
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">
                        {route.category.split("&")[0]}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 group-hover:border-[#ecb613]/30 group-hover:text-[#ecb613] transition-colors">
                      {route.badge}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white group-hover:text-[#ecb613] transition-colors">
                    {route.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-1 font-light line-clamp-2">
                    {route.desc}
                  </p>
                </div>

                <div className="pt-2 mt-3 border-t border-zinc-900 flex items-center justify-between text-[10px] font-mono text-zinc-500 group-hover:text-zinc-300">
                  <span className="truncate">{route.url}</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-600 group-hover:text-[#ecb613] transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
