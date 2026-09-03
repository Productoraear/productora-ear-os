'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NeuralGraph from '@/components/neural/NeuralGraph';
import RoleHUD from '@/components/neural/RoleHUD';
import RoleInspector from '@/components/neural/RoleInspector';
import TransmutationGesture from '@/components/neural/TransmutationGesture';
import CinematicHeroSClass from '@/components/sclass/CinematicHeroSClass';
import InstantNeuralTunnelModal from '@/components/sclass/InstantNeuralTunnelModal';
import { useNeuralTunnelStore } from '@/store/useNeuralTunnelStore';
import { RoleKey, TaxonomyNode, ROLE_DEFINITIONS } from '@/types/neural';
import {
  Sparkles,
  Activity,
  Layers,
  ArrowUpRight,
  Sliders
} from 'lucide-react';

export default function Home() {
  const { openTunnel } = useNeuralTunnelStore();
  const [navMode, setNavMode] = useState<'neural' | 'traditional'>('neural');
  const [selectedRole, setSelectedRole] = useState<RoleKey | null>(null);
  const [selectedNode, setSelectedNode] = useState<TaxonomyNode | null>(null);
  const [assistantModalOpen, setAssistantModalOpen] = useState(false);
  const [assistantContext, setAssistantContext] = useState<string>('Visión General de Productora EAR');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'assistant' | 'user'; text: string }>>([
    {
      role: 'assistant',
      text: 'Bienvenido al núcleo neural de Productora EAR OS. Selecciona un eje en el grafo o en el HUD para desplegar sus subnodos y montar el contexto operativo.'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');

  // Persistencia de modo de navegación
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('ear-nav-mode') as 'neural' | 'traditional' | null;
      if (savedMode) setNavMode(savedMode);
    }
  }, []);

  const handleToggleNavMode = () => {
    setNavMode((prev) => {
      const next = prev === 'neural' ? 'traditional' : 'neural';
      if (typeof window !== 'undefined') {
        localStorage.setItem('ear-nav-mode', next);
      }
      return next;
    });
  };

  // Listener para eventos de rol y asistente
  useEffect(() => {
    const handleRoleEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{
        role: RoleKey;
        nodeId?: string;
        label?: string;
        openChat?: boolean;
      }>;
      const { role, label, openChat } = customEvent.detail;
      setSelectedRole(role);
      setAssistantContext(label || ROLE_DEFINITIONS[role]?.label || role);

      if (openChat) {
        setAssistantModalOpen(true);
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: `Contexto montado: ${ROLE_DEFINITIONS[role]?.label.toUpperCase()}. ¿Deseas consultar sobre honorarios de artistas, garantías acústicas Bose, tramitación B2G Art. 118 LCSP o el protocolo VIMUME?`
          }
        ]);
      }
    };

    const handleOpenAssistant = () => {
      setAssistantModalOpen(true);
    };

    window.addEventListener('ear-role-selected', handleRoleEvent);
    window.addEventListener('ear-open-assistant', handleOpenAssistant);

    return () => {
      window.removeEventListener('ear-role-selected', handleRoleEvent);
      window.removeEventListener('ear-open-assistant', handleOpenAssistant);
    };
  }, []);

  const handleSelectRole = (role: RoleKey | null) => {
    setSelectedRole(role);
    if (!role) {
      setSelectedNode(null);
      setAssistantContext('Visión General de Productora EAR');
    } else {
      setAssistantContext(ROLE_DEFINITIONS[role].label);
    }
  };

  const handleSelectNode = (node: TaxonomyNode | null) => {
    setSelectedNode(node);
    if (node && node.role !== 'root') {
      setSelectedRole(node.role);
      setAssistantContext(node.label);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery;
    setInputQuery('');
    setChatMessages((prev) => [...prev, { role: 'user', text: userText }]);

    setTimeout(() => {
      let responseText = '';
      if (selectedRole === 'artistas') {
        responseText = `[ARQUITECTURA ARTISTAS]: Split oficial garantizado del 80% neto para el artista, rider acústico de 12 W/pax (Bose F1/S1 Pro, Shure Beta 87A) y gestión de liquidaciones con validación SHA-256.`;
      } else if (selectedRole === 'instituciones') {
        responseText = `[PROTOCOLO B2G]: Tramitación ágil de contrato menor conforme al Art. 118 LCSP (< 15.000,00 €). Presupuesto preventivo al 95% (14.250,00 €) con memoria técnica compilada en 24h.`;
      } else if (selectedRole === 'vimume') {
        responseText = `[PROTOCOLO VIMUME]: Estimulación neuroacústica con frecuencias a 40 Hz Gamma (< 75 dB SPL en residencias). El colibrí de Sebastián Díaz revitalizando recuerdos en el piloto de 5 centros.`;
      } else if (selectedRole === 'eventos') {
        responseText = `[PRODUCCIÓN EVENTOS]: Cierre con depósito de 100,00 € en Stripe y bloqueo de tarifa Price-Lock SHA-256 válido durante 72h. Logística de 1,50 €/km a partir de km 50 desde Hub Méntrida.`;
      } else if (selectedRole === 'empresas') {
        responseText = `[RED EMPRESAS B2B]: Directorio de proveedores verificados en dos pasos (2FA), comisión de recomendación directa del 10% y contratación sin fricción burocrática.`;
      } else {
        responseText = `[NÚCLEO EAR OS]: Red neuronal activa sincronizada con los 5 ejes operativos. Haz clic en cualquiera de los 5 nodos para desplegar sus subnodos.`;
      }

      setChatMessages((prev) => [...prev, { role: 'assistant', text: responseText }]);
    }, 450);
  };

  return (
    <main className="relative w-screen min-h-screen overflow-x-hidden bg-[#030305] text-white font-sans selection:bg-[#ecb613] selection:text-black">
      {/* Reconocedor Gestual Móvil (8 segundos continuos para transmutar modo) */}
      <TransmutationGesture
        currentMode={navMode}
        onToggleMode={handleToggleNavMode}
      />

      {/* 1. Header Global Vanguardista con Switch de Modo (PC & Mobile) */}
      <header className="fixed top-0 left-0 right-0 z-40 pointer-events-none p-4 md:p-6 flex items-center justify-between">
        {/* Identidad de Marca */}
        <div className="pointer-events-auto flex items-center gap-3 bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full shadow-lg">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ecb613] animate-ping" />
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm tracking-tight text-white font-mono">PRODUCTORA</span>
            <span className="font-bold text-sm tracking-tight text-[#ecb613] font-mono">EAR</span>
            <span className="text-[10px] text-zinc-500 font-mono ml-1 hidden sm:inline">OS v2.4</span>
          </div>
        </div>

        {/* Telemetría Central (Visible en desktop modo neural) */}
        {navMode === 'neural' && (
          <div className="pointer-events-auto hidden lg:flex items-center gap-3 bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full shadow-lg text-xs font-mono">
            <div className="flex items-center gap-2 text-zinc-400">
              <Activity size={13} className="text-emerald-400 animate-pulse" />
              <span className="text-[11px] tracking-wider text-emerald-300">NODO CORE // 5 EJES</span>
            </div>
            <span className="text-white/20">•</span>
            <span className="text-[11px] text-zinc-400">CLIC PARA EXPANDIR SUBNODOS</span>
          </div>
        )}

        {/* Selector Vanguardista de Modo (PC / Desktop) & Accesos */}
        <div className="pointer-events-auto flex items-center gap-2.5">
          {/* Botón Sutil y Vanguardista de Transmutación de Navegación */}
          <button
            type="button"
            onClick={handleToggleNavMode}
            title={navMode === 'neural' ? 'Cambiar a Navegación Clásica de 5 Ejes' : 'Cambiar a Navegación Neuronal'}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/60 hover:bg-white/10 backdrop-blur-xl border border-white/15 text-xs font-mono transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)] group hover:scale-[1.02]"
          >
            {navMode === 'neural' ? (
              <>
                <Layers size={13} className="text-zinc-400 group-hover:text-white transition-colors" />
                <span className="text-zinc-300 group-hover:text-white text-[11px] font-semibold hidden sm:inline">
                  PANTALLA CLÁSICA
                </span>
              </>
            ) : (
              <>
                <Activity size={13} className="text-[#ecb613] animate-pulse" />
                <span className="text-white text-[11px] font-semibold hidden sm:inline">
                  MODO NEURAL
                </span>
              </>
            )}
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-zinc-400 uppercase font-mono">
              SWITCH
            </span>
          </button>

          <button
            type="button"
            onClick={() => openTunnel()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#ecb613] hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-[0_0_25px_rgba(236,182,19,0.35)] hover:scale-105 cursor-pointer font-mono"
            title="Abrir Túnel Neural S-Class con Atmósferas y Deslizadores"
          >
            <Sliders size={13} className="text-black" />
            <span>TÚNEL S-CLASS</span>
          </button>
        </div>
      </header>

      {/* ================= CONTENIDO SEGÚN MODO ================= */}

      {navMode === 'neural' ? (
        /* MODO 1: RED NEURONAL INTERACTIVA A PANTALLA COMPLETA */
        <div className="relative w-screen h-screen overflow-hidden">
          {/* Canvas 2D + Spring Physics */}
          <div className="absolute inset-0 z-10 w-full h-full">
            <NeuralGraph
              selectedRole={selectedRole}
              selectedNodeId={selectedNode?.id || null}
              onSelectRole={handleSelectRole}
              onSelectNode={handleSelectNode}
              className="w-full h-full"
            />
          </div>

          {/* Panel Lateral / Inspector de Rol al Expandir */}
          {selectedRole && (
            <div className="absolute top-20 right-4 md:right-8 z-30 pointer-events-none max-w-full">
              <RoleInspector
                selectedRole={selectedRole}
                selectedNode={selectedNode}
                onClose={() => {
                  setSelectedRole(null);
                  setSelectedNode(null);
                }}
                onSelectSubNode={(node) => setSelectedNode(node)}
              />
            </div>
          )}

          {/* HUD Flotante Minimalista de los 5 Roles */}
          <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none">
            <RoleHUD
              selectedRole={selectedRole}
              onSelectRole={handleSelectRole}
            />
          </div>
        </div>
      ) : (
        /* MODO 2: PANTALLA CLÁSICA S-CLASS (ÚNICA Y EXCLUSIVAMENTE LOS 5 EJES PRINCIPALES) */
        <div className="relative min-h-screen pt-4 pb-12 flex flex-col justify-between animate-in fade-in duration-300">
          <CinematicHeroSClass />
        </div>
      )}

      {/* 4. Modal / Drawer del Asistente Local */}
      {assistantModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#0a0b10] border border-white/10 rounded-2xl p-6 shadow-[0_25px_70px_rgba(0,0,0,0.9)] flex flex-col gap-4 max-h-[85vh]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613]">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">ASISTENTE LOCAL EAR OS</h3>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    Contexto: <span className="text-[#ecb613]">{assistantContext}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAssistantModalOpen(false)}
                className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[360px] no-scrollbar">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#ecb613] text-black font-medium'
                        : 'bg-white/[0.04] border border-white/10 text-zinc-200 font-mono'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-white/10">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={`Pregunta sobre ${assistantContext}...`}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ecb613] font-mono transition-colors"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#ecb613] hover:bg-[#d4a30e] text-black font-bold text-xs rounded-xl font-mono transition-colors"
              >
                ENVIAR
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🚀 TÚNEL NEURAL S-CLASS GLOBAL */}
      <InstantNeuralTunnelModal />
    </main>
  );
}
