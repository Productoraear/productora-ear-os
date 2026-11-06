'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Bot,
  Activity,
  Settings,
  CreditCard,
  Table2,
  Kanban,
  BarChart3,
  Smartphone,
  ShoppingCart,
  Lock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Terminal,
  Layers,
  ChevronRight,
  Clock,
  UserCheck,
  Sliders,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  SAFE_LCSP_CEILING_EUR,
  LIMITE_SPL_DB,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';
import { SovereignAnalyticsKitView } from '@/components/harvested/SovereignAnalyticsKitView';
import { SovereignKanbanKitView } from '@/components/harvested/SovereignKanbanKitView';
import { SovereignDataTableKitView } from '@/components/harvested/SovereignDataTableKitView';
import { SovereignAiChatAndToolCallsKitView } from '@/components/harvested/SovereignAiChatAndToolCallsKitView';
import { SovereignSettingsKitView } from '@/components/harvested/SovereignSettingsKitView';
import { AgentMonitorCeoWorkspace } from '@/components/admin/AgentMonitorCeoWorkspace';
import { SovereignMobileOnboardingAndPaywall } from '@/components/onboarding/SovereignMobileOnboardingAndPaywall';
import { SovereignCollectiveEventBuilder } from '@/components/checkout/SovereignCollectiveEventBuilder';

export type KitKey =
  | 'chat_ia'
  | 'tool_calls'
  | 'agent_monitor'
  | 'settings'
  | 'billing'
  | 'data_table'
  | 'kanban'
  | 'analytics'
  | 'mobile_onboarding'
  | 'checkout';

interface KitManifest {
  key: KitKey;
  number: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  componentsCount: number;
  components: string[];
}

const KITS: KitManifest[] = [
  {
    key: 'chat_ia',
    number: '01',
    name: 'Kit de Chat de IA',
    description: 'Hilo conversacional en streaming con compositor de indicaciones y citas de fuentes SSOT.',
    icon: Bot,
    componentsCount: 7,
    components: ['Hilo de chat', 'Mensaje streaming', 'Compositor', 'Chips de sugerencia', 'Barra lateral', 'Acciones', 'Citas SSOT'],
  },
  {
    key: 'tool_calls',
    number: '02',
    name: 'Kit de Llamadas de Herramientas',
    description: 'Tarjetas de ejecución agéntica, puertas de aprobación humana y trazabilidad de razonamiento.',
    icon: Terminal,
    componentsCount: 6,
    components: ['Tarjeta de tool call', 'Solicitud de aprobación', 'Resultados ACID', 'Pasos razonamiento', 'Tarjeta error', 'Chips herramientas'],
  },
  {
    key: 'agent_monitor',
    number: '03',
    name: 'Kit de Monitorización de Agentes',
    description: 'Telemetría de agentes en vivo, medidor de costes de tokens, cola de tareas y checkpoints.',
    icon: Activity,
    componentsCount: 7,
    components: ['Lista de sesiones', 'Línea de tiempo', 'Puerta aprobación', 'Medidor de costes', 'Cola tasks_queue', 'Checkpoints', 'Registro en vivo'],
  },
  {
    key: 'settings',
    number: '04',
    name: 'Kit de Configuración',
    description: 'Panel de seguridad 2FA, preferencias de notificación, claves API y zona de peligro.',
    icon: Settings,
    componentsCount: 6,
    components: ['Formulario perfil', 'Panel seguridad 2FA', 'Preferencias notificaciones', 'Miembros e invitaciones', 'Claves API', 'Zona de peligro'],
  },
  {
    key: 'billing',
    number: '05',
    name: 'Kit de Facturación y Uso',
    description: 'Control de suscripciones, reparto soberano 80/10/10, facturas B2B/B2G y recarga Stripe.',
    icon: CreditCard,
    componentsCount: 6,
    components: ['Plan actual', 'Medidores de uso', 'Tabla de facturas', 'Método de pago', 'Modal actualización', 'Recarga de créditos'],
  },
  {
    key: 'data_table',
    number: '06',
    name: 'Kit de Tabla de Datos',
    description: 'Portafolio de proveedores y fincas en 52 provincias con filtros, agrupación y edición en línea.',
    icon: Table2,
    componentsCount: 6,
    components: ['Barra de filtros', 'Gestor de columnas', 'Edición inline', 'Acciones masivas', 'Filas agrupadas', 'Paginación server'],
  },
  {
    key: 'kanban',
    number: '07',
    name: 'Kit Kanban',
    description: 'Tablero de producción de eventos (Montaje, Soundcheck, Gala, Liquidación) con drag-and-drop.',
    icon: Kanban,
    componentsCount: 6,
    components: ['Tablero kanban', 'Detalles de bolo', 'Vista lista', 'Línea temporal', 'Filtros de tablero', 'Selector asignatarios'],
  },
  {
    key: 'analytics',
    number: '08',
    name: 'Kit de Gráficos y Análisis',
    description: 'Visualizadores SVG accesibles para presión sonora dB SPL, SROI clínico 4.85x y conversión.',
    icon: BarChart3,
    componentsCount: 7,
    components: ['Gráfico área SPL', 'Gráfico barras SROI', 'Anillo split 80/10/10', 'Embudo leads', 'Mapa calor acústico', 'Tarjetas KPI', 'Comparativa periodos'],
  },
  {
    key: 'mobile_onboarding',
    number: '09',
    name: 'Kit de Incorporación Móvil & Muro de Pago',
    description: 'Cuestionario de eventos, creador de riders acústicos, preautorización Stripe y nota de Edwin Agudelo.',
    icon: Smartphone,
    componentsCount: 7,
    components: ['Cuestionario objetivos', 'Creador de planes', 'Permisos de audio', 'Prueba social', 'Nota del fundador', 'Línea de tiempo', 'Muro de pago'],
  },
  {
    key: 'checkout',
    number: '10',
    name: 'Kit de Pago S-Class',
    description: 'Cajón de carrito recuperable, pasos de fianza deducible de 100 €, upsell de sonido y recibo claro.',
    icon: ShoppingCart,
    componentsCount: 6,
    components: ['Cajón del carrito', 'Pasos de pago', 'Métodos de pago', 'Resumen pedido', 'Modal de upsell', 'Confirmación de orden'],
  },
];

export function SovereignAppUiKitCollection() {
  const [selectedKit, setSelectedKit] = useState<KitKey>('checkout');
  const activeKit = KITS.find((k) => k.key === selectedKit) || KITS[0];

  return (
    <div className="min-h-screen bg-[#030305] text-zinc-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Collection Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 mb-8 border-b border-white/10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-mono uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              HorizonX Collection Architecture · 64 Componentes & 10 Pantallas
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
              App UI Kit Collection · EAR OS v13.0
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-3xl font-sans">
              La biblioteca completa de 64 componentes modulares React 19 y 10 pantallas autónomas gobernadas por los contratos canónicos del SSOT.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/checkout"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(236,182,19,0.3)]"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Ver Checkout en Vivo</span>
            </Link>
          </div>
        </div>

        {/* 1. SELECTOR INTERACTIVO DE LOS 10 KITS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-10">
          {KITS.map((kit) => {
            const isSelected = kit.key === selectedKit;
            const Icon = kit.icon;
            return (
              <button
                key={kit.key}
                type="button"
                onClick={() => setSelectedKit(kit.key)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_25px_rgba(236,182,19,0.2)] scale-[1.02]'
                    : 'border-white/10 bg-zinc-950/60 hover:border-white/20 hover:bg-zinc-900/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-amber-400' : 'text-zinc-500'}`}>
                    KIT {kit.number}
                  </span>
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-900 text-zinc-400'}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-white mb-0.5 truncate">{kit.name}</div>
                  <div className="text-[10px] text-zinc-400 font-mono">{kit.componentsCount} componentes</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* 2. PANTALLA COMPLETA AUTÓNOMA DEL KIT SELECCIONADO */}
        {(() => {
          const ActiveIcon = activeKit.icon;
          return (
            <div className="rounded-3xl border border-white/10 bg-zinc-950/90 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden mb-12">
              {/* Header of Active Kit */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-white/10 gap-4 mb-8">
                <div className="flex items-center gap-3.5">
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    <ActiveIcon className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                        Kit Activo {activeKit.number}
                      </span>
                      <span className="text-zinc-600">·</span>
                      <span className="text-xs font-mono text-zinc-500">React 19 + TypeScript + Motion</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mt-0.5">
                      {activeKit.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-sans max-w-2xl">
                      {activeKit.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-emerald-400">
                    ✓ Producción Certificada
                  </span>
                </div>
              </div>

              {/* Component Grid of Active Kit */}
              <div className="mb-10">
                <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-3">
                  Componentes Modulares Independientes ({activeKit.componentsCount}):
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {activeKit.components.map((comp, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5 flex items-center justify-between text-xs font-mono text-zinc-300 hover:border-amber-500/30 transition-colors"
                    >
                      <span className="truncate">{comp}</span>
                      <span className="text-[10px] text-zinc-500 ml-1">#{idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* VISTA PREVIA INTERACTIVA EN VIVO SEGÚN EL KIT */}
              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/10">
                {/* KIT 10: CHECKOUT */}
                {selectedKit === 'checkout' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
                      <span className="text-amber-400 font-bold">Vista Previa: Pasarela Price-Lock SHA-256</span>
                      <Link href="/checkout" className="text-zinc-400 hover:text-white underline">
                        Abrir Pantalla Completa →
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                      <div className="p-4 rounded-xl bg-zinc-950 border border-white/5">
                        <div className="text-zinc-500 mb-1">Tarifa Base Solista</div>
                        <div className="text-lg font-bold text-white">{TARIFA_BASE_SOLISTA_EUR.toFixed(2)} €</div>
                        <div className="text-[10px] text-zinc-400 mt-1">Edwin Agudelo Tenor</div>
                      </div>
                      <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-500/30">
                        <div className="text-emerald-400 mb-1">Fianza Deducible Stripe</div>
                        <div className="text-lg font-bold text-white">{DEPOSITO_STRIPE_EUR.toFixed(2)} €</div>
                        <div className="text-[10px] text-emerald-400 mt-1">100% deducible en liquidación</div>
                      </div>
                      <div className="p-4 rounded-xl bg-zinc-950 border border-white/5">
                        <div className="text-zinc-500 mb-1">Logística Exenta</div>
                        <div className="text-lg font-bold text-cyan-400">50 km Hub Méntrida</div>
                        <div className="text-[10px] text-zinc-400 mt-1">1,50 €/km adicional</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* KIT 05: BILLING & USAGE */}
                {selectedKit === 'billing' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
                      <span className="text-amber-400 font-bold">Desglose Soberano Inmutable 80/10/10</span>
                      <span className="text-zinc-500">SSOT Verificado</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center font-mono text-xs">
                      <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-500/20">
                        <div className="text-emerald-400 text-lg font-bold">80%</div>
                        <div className="text-white font-bold mt-1">Artista Ejecutor</div>
                        <div className="text-[10px] text-zinc-500">Neto directo sin agencia</div>
                      </div>
                      <div className="p-4 rounded-xl bg-zinc-950 border border-cyan-500/20">
                        <div className="text-cyan-400 text-lg font-bold">10%</div>
                        <div className="text-white font-bold mt-1">EAR OS Infraestructura</div>
                        <div className="text-[10px] text-zinc-500">Servidores & pasarelas</div>
                      </div>
                      <div className="p-4 rounded-xl bg-zinc-950 border border-purple-500/20">
                        <div className="text-purple-400 text-lg font-bold">10%</div>
                        <div className="text-white font-bold mt-1">VIMUME Impacto Social</div>
                        <div className="text-[10px] text-zinc-500">Sesiones 40 Hz mayores</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* KIT 08: ANALYTICS & CHARTS */}
                {selectedKit === 'analytics' && <SovereignAnalyticsKitView />}

                {/* KIT 01 & 02: CHAT IA & TOOL CALLS */}
                {(selectedKit === 'chat_ia' || selectedKit === 'tool_calls') && (
                  <SovereignAiChatAndToolCallsKitView />
                )}

                {/* KIT 03: AGENT MONITOR */}
                {selectedKit === 'agent_monitor' && <AgentMonitorCeoWorkspace />}

                {/* KIT 04: SETTINGS */}
                {selectedKit === 'settings' && <SovereignSettingsKitView />}

                {/* KIT 06: DATA TABLE */}
                {selectedKit === 'data_table' && <SovereignDataTableKitView />}

                {/* KIT 07: KANBAN */}
                {selectedKit === 'kanban' && <SovereignKanbanKitView />}

                {/* KIT 09: MOBILE ONBOARDING & PAYWALL */}
                {selectedKit === 'mobile_onboarding' && <SovereignMobileOnboardingAndPaywall />}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

