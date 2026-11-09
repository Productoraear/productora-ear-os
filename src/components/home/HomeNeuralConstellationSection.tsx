'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import NeuralGraph from '@/components/neural/NeuralGraph';
import NodeInspector from '@/components/neural/NodeInspector';
import { TaxonomyNode, RoleKey } from '@/types/neural';
import {
  Compass,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Heart,
  Music4,
  CalendarCheck2,
  Building2,
  Landmark,
  Maximize2,
  RotateCcw,
} from 'lucide-react';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  SAFE_LCSP_CEILING_EUR,
  LIMITE_SPL_DB,
} from '@/lib/constants/ear-os-ssot';

interface RoleCardMeta {
  role: RoleKey;
  label: string;
  badge: string;
  color: string;
  borderColor: string;
  glowColor: string;
  icon: React.ComponentType<{ className?: string }>;
  headline: string;
  detail: string;
  metric: string;
  route: string;
  actionText: string;
}

const ROLE_CARDS: RoleCardMeta[] = [
  {
    role: 'vimume',
    label: 'Proyecto VIMUME',
    badge: 'Neuroacústica 40 Hz',
    color: '#8b5cf6',
    borderColor: 'rgba(139, 92, 246, 0.4)',
    glowColor: 'rgba(139, 92, 246, 0.2)',
    icon: Heart,
    headline: 'Estimulación Cognitiva para Mayores',
    detail: 'Protocolo no invasivo para residencias y centros de día con retorno social certificado.',
    metric: '4.85x SROI · 80% Deducible',
    route: '/vimume',
    actionText: 'Dossier Clínico',
  },
  {
    role: 'artistas',
    label: 'Artistas S-Class',
    badge: 'Split 80/10/10 Inviolable',
    color: '#ecb613',
    borderColor: 'rgba(236, 182, 19, 0.4)',
    glowColor: 'rgba(236, 182, 19, 0.2)',
    icon: Music4,
    headline: 'Edwin Agudelo & Roster de Gala',
    detail: 'Voz lírica y agrupaciones folclóricas de élite contratadas directo sin intermediarios.',
    metric: `Suelo ${TARIFA_BASE_SOLISTA_EUR.toFixed(2)} € · 0% Comisión`,
    route: '/artistas',
    actionText: 'Explorar Roster',
  },
  {
    role: 'eventos',
    label: 'Eventos 360 & Sonorización',
    badge: 'Ley 37/2003 del Ruido',
    color: '#06b6d4',
    borderColor: 'rgba(6, 182, 212, 0.4)',
    glowColor: 'rgba(6, 182, 212, 0.2)',
    icon: CalendarCheck2,
    headline: 'Producción & Acústica Telemática',
    detail: 'Equipos homologados con limitador telemático para fiestas sin cortes a las 2:00 AM.',
    metric: `< ${LIMITE_SPL_DB} dB SPL · 12 W/pax`,
    route: '/eventos',
    actionText: 'Presupuestar',
  },
  {
    role: 'empresas',
    label: 'Fincas & Recintos B2B',
    badge: '52 Provincias',
    color: '#10b981',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    glowColor: 'rgba(16, 185, 129, 0.2)',
    icon: Building2,
    headline: 'Catálogo Soberano de Espacios',
    detail: 'Fincas y hoteles con calibración acústica garantizada y fianza deducible vía Stripe.',
    metric: `Fianza ${DEPOSITO_STRIPE_EUR} € Deducible`,
    route: '/fincas',
    actionText: 'Ver Fincas',
  },
  {
    role: 'instituciones',
    label: 'Instituciones B2G',
    badge: 'LCSP Art. 118',
    color: '#3b82f6',
    borderColor: 'rgba(59, 130, 246, 0.4)',
    glowColor: 'rgba(59, 130, 246, 0.2)',
    icon: Landmark,
    headline: 'Fast-Track para Ayuntamientos',
    detail: 'Contratos menores < 14.250 € con memoria técnica, justificación de exclusividad y CPVs.',
    metric: `< ${SAFE_LCSP_CEILING_EUR.toLocaleString('es-ES')} € Contrato Menor`,
    route: '/licitaciones',
    actionText: 'Vía Municipal',
  },
];

export function HomeNeuralConstellationSection() {
  const [selectedRole, setSelectedRole] = useState<RoleKey | null>(null);
  const [selectedNode, setSelectedNode] = useState<TaxonomyNode | null>(null);

  const activeRole: RoleKey = (selectedRole || (selectedNode?.role !== 'root' && selectedNode?.role ? selectedNode.role : 'artistas')) as RoleKey;

  const handleRoleSelect = (role: RoleKey) => {
    if (selectedRole === role) {
      setSelectedRole(null);
      setSelectedNode(null);
    } else {
      setSelectedRole(role);
      setSelectedNode(null);
    }
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 border-t border-white/10 overflow-hidden">
      {/* Encabezado HorizonX Taste Standard */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-[11px] font-mono uppercase tracking-widest mb-2.5">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Cartografía Interactiva del Ecosistema</span>
          </div>

          <h2 className="text-[20px] font-bold font-syne text-white tracking-tight leading-snug">
            Constelación de Nodos & Servicios Soberanos
          </h2>

          <p className="text-[13px] text-zinc-400 max-w-xl font-montserrat mt-1 leading-relaxed">
            Explora de forma visual e interactiva la conexión entre artistas, fincas, instituciones B2G y sesiones clínicas VIMUME.
          </p>
        </div>

        {/* Botón de Reset de Vista */}
        {selectedRole && (
          <button
            type="button"
            onClick={() => {
              setSelectedRole(null);
              setSelectedNode(null);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/10 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 text-[12px] font-mono transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Restablecer Centro</span>
          </button>
        )}
      </div>

      {/* DASHBOARD BENTO: CANVASCENTRO + TARJETAS DE ACCESO DIRECTO (Elimina el vacío negro) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* COLUMNA IZQUIERDA: CANVAS DEL DIAMANTE S-CLASS (7 Columnas) */}
        <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-zinc-950/90 backdrop-blur-2xl relative overflow-hidden shadow-2xl flex flex-col min-h-[500px]">
          {/* Top Quick Role Tabs */}
          <div className="p-3 sm:p-4 border-b border-white/10 bg-zinc-900/50 flex flex-wrap items-center gap-2 z-20">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider hidden sm:inline">
              Foco:
            </span>
            {ROLE_CARDS.map((card) => {
              const isFocused = selectedRole === card.role;
              return (
                <button
                  key={card.role}
                  type="button"
                  onClick={() => handleRoleSelect(card.role)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                    isFocused
                      ? 'bg-white text-black shadow-md'
                      : 'bg-zinc-800/60 text-zinc-300 hover:text-white hover:bg-zinc-700/60'
                  }`}
                  style={{
                    borderColor: isFocused ? card.color : 'transparent',
                  }}
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: card.color }} />
                  {card.label.split(' ')[0]}
                </button>
              );
            })}
          </div>

          {/* Canvas Interactivo con Auto-Framing */}
          <div className="relative flex-1 w-full min-h-[440px]">
            <NeuralGraph
              selectedRole={selectedRole}
              selectedNodeId={selectedNode ? selectedNode.id : null}
              onSelectRole={setSelectedRole}
              onSelectNode={setSelectedNode}
              className="w-full h-full"
            />

            {/* Hint Flotante */}
            <div className="absolute bottom-3 right-3 z-20 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900/90 border border-white/10 text-[10px] font-mono text-zinc-400 backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Clic en un nodo o tarjeta para inspeccionar</span>
            </div>

            {/* Inspector Overlay si se pincha un nodo */}
            {selectedNode && (
              <div className="absolute bottom-4 left-4 max-w-sm w-full z-30">
                <NodeInspector
                  selectedRole={activeRole}
                  selectedNode={selectedNode}
                  onClose={() => setSelectedNode(null)}
                  onSelectSubNode={(sub) => setSelectedNode(sub)}
                />
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: TELEMETRÍA Y ACCESO POR VERTICAL (5 Columnas) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-2.5">
          {ROLE_CARDS.map((card) => {
            const isSelected = selectedRole === card.role;
            const Icon = card.icon;

            return (
              <button
                key={card.role}
                type="button"
                onClick={() => handleRoleSelect(card.role)}
                aria-pressed={isSelected}
                aria-label={`Seleccionar vertical ${card.label}: ${card.headline}`}
                className={`text-left w-full p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305] ${
                  isSelected
                    ? 'bg-zinc-900/90 border-white/30 shadow-xl'
                    : 'bg-zinc-950/60 hover:bg-zinc-900/50 border-white/10'
                }`}
                style={{
                  borderColor: isSelected ? card.color : 'rgba(255, 255, 255, 0.08)',
                  boxShadow: isSelected ? `0 0 25px ${card.glowColor}` : 'none',
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: `${card.color}20` }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[13px] font-montserrat font-bold text-white">
                      {card.label}
                    </span>
                  </div>

                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                    style={{
                      borderColor: card.borderColor,
                      color: card.color,
                      backgroundColor: `${card.color}15`,
                    }}
                  >
                    {card.badge}
                  </span>
                </div>

                <p className="text-[12px] text-zinc-400 font-montserrat line-clamp-1 mb-2">
                  {card.headline} · {card.detail}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-mono">
                  <span className="text-zinc-300 font-semibold">{card.metric}</span>
                  <Link
                    href={card.route}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-white hover:text-amber-400 transition-colors font-bold"
                  >
                    <span>{card.actionText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
