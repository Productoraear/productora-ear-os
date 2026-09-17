"use client";

import React, { useState } from 'react';
import { 
  PhoneCall, TrendingUp, Video, ShieldCheck, 
  CheckCircle2, AlertTriangle, Play, Sparkles, MessageSquare, 
  Terminal, DollarSign, Users, Award, FileText, ChevronRight
} from 'lucide-react';
import { SSOT_PROVIDER_METRICS } from '@/lib/constants/SClassNexus';

export type OperationalRole = 'call_center' | 'marketing' | 'video_prod' | 'ceo_governance';

export default function OperationalTrainingManual() {
  const [activeRole, setActiveRole] = useState<OperationalRole>('call_center');
  const [activeObjectionIndex, setActiveObjectionIndex] = useState<number>(0);
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(id);
    setTimeout(() => setCopiedScript(null), 2500);
  };

  const OBJECTIONS_CALL_CENTER = [
    {
      objection: '“Ya estoy pagando en Bodas.net y recibo solicitudes allí.”',
      responseScript:
        '“Lo entendemos perfectamente. La diferencia es que en Bodas.net pagas una tarifa fija mensual compitiendo con otros 40 proveedores por el mismo lead que luego no responde. En EAR OS nosotros te entregamos el cliente con fecha cerrada, fianza de 100€ ya cobrada y tú ingresas el 80% neto directo a tu cuenta sin cuota mensual ni permanencia.”',
      focus: 'Eliminar el coste publicitario fijo y garantizar dinero en mano.'
    },
    {
      objection: '“¿Por qué pedís un depósito de 100 € antes de hablar?”',
      responseScript:
        '“Porque el tiempo de nuestros artistas y el de los novios es sagrado. El depósito de 100€ bloquea la fecha con un hash SHA-256 criptográfico para que nadie más pueda quitarles el día. Si por causa mayor no hubiera disponibilidad, se reintegra en 24h. Cero cancelaciones fantasma.”',
      focus: 'Filtro de seriedad y Price-Lock inmutable.'
    },
    {
      objection: '“¿Quién me garantiza que el mariachi o el solista van a sonar bien?”',
      responseScript:
        '“Todos nuestros artistas están auditados bajo el Rider Acústico S-Class (12 W/pax) con equipos Bose F1 / S1 Pro y microfonía Shure. Además, en residencias VIMUME cumplimos el protocolo neuroacústico a <75 dB SPL para evitar cualquier sanción o molestia.”',
      focus: 'Blindaje de calidad técnica y reputación.'
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* HEADER BANNER CON CONTEO CANÓNICO SSOT */}
      <div className="p-6 md:p-8 rounded-[2rem] bg-[#050508] border border-[#ecb613]/30 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/20 text-[#ecb613] text-[10px] font-mono uppercase tracking-[0.3em] mb-3">
              <ShieldCheck size={12} />
              DOCTRINA OPERATIVA 2030-2050 // SSOT MILITAR
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-syne uppercase text-white tracking-tight">
              Manual Interactivo de Operaciones EAR OS
            </h1>
            <p className="text-xs sm:text-sm text-white/50 max-w-2xl mt-1 font-sans">
              Entrenamiento exhaustivo para agentes, growth marketers, técnicos de campo y dirección general. Cero improvisaciones.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#030305] border border-white/10 text-right space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">
              Bóveda Canónica Auditada
            </span>
            <div className="text-3xl font-bold font-mono text-[#ecb613]">
              {SSOT_PROVIDER_METRICS.TOTAL_PROVIDERS_FORMATTED}
            </div>
            <span className="text-[10px] font-mono text-emerald-400 block">
              Proveedores Sincronizados (Exit Code 0)
            </span>
          </div>
        </div>
      </div>

      {/* TABS DE SELECCIÓN DE ROL */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-syne">
        {[
          { id: 'call_center' as OperationalRole, label: 'Agentes Centralita', icon: PhoneCall, color: '#ecb613' },
          { id: 'marketing' as OperationalRole, label: 'Marketing & Growth', icon: TrendingUp, color: '#00E5FF' },
          { id: 'video_prod' as OperationalRole, label: 'Grabación 4K & VIMUME', icon: Video, color: '#a855f7' },
          { id: 'ceo_governance' as OperationalRole, label: 'Dirección & CEO', icon: Award, color: '#10B981' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeRole === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveRole(tab.id)}
              className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                isActive
                  ? 'bg-white/10 border-white/30 text-white shadow-xl'
                  : 'bg-[#050508] border-white/5 text-white/50 hover:text-white hover:border-white/15'
              }`}
            >
              <div
                className="p-2.5 rounded-xl border"
                style={{
                  backgroundColor: `${tab.color}15`,
                  borderColor: `${tab.color}40`,
                  color: tab.color
                }}
              >
                <Icon size={18} />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold block">{tab.label}</span>
                <span className="text-[10px] font-mono text-white/40 block uppercase tracking-wider">
                  Protocolo Activo
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* CONTENIDO MODULAR SEGÚN ROL */}

      {/* 1. AGENTES CENTRALITA */}
      {activeRole === 'call_center' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Guion de Llamada de 3 Minutos */}
            <div className="lg:col-span-7 rounded-[2rem] bg-[#050508] border border-white/10 p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#ecb613]">
                    SCRIPT DE CIERRE TELEFÓNICO
                  </div>
                  <h3 className="text-lg font-bold font-syne text-white mt-1">
                    Estructura Militar de 3 Minutos
                  </h3>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(
                      'Hola, te llamo de Productora EAR para confirmar la disponibilidad de tu evento. Te comento: tu presupuesto es cerrado, fianza de 100€ en Stripe y el resto se liquida el día del bolo. ¿Te paso el enlace de Price-Lock a tu WhatsApp?',
                      'call-script'
                    )
                  }
                  className="px-3 py-1.5 rounded-lg border border-[#ecb613]/30 bg-[#ecb613]/10 text-[#ecb613] text-xs font-mono uppercase cursor-pointer hover:bg-[#ecb613]/20"
                >
                  {copiedScript === 'call-script' ? '¡Copiado!' : 'Copiar Guion'}
                </button>
              </div>

              <div className="space-y-4 text-xs font-sans text-white/70 leading-relaxed">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="font-mono font-bold text-[#ecb613] text-[11px] uppercase block">
                    Minuto 0:00 - 0:45 // Validación de Fecha y Finca
                  </span>
                  <p>
                    “Buenos días/tardes [Nombre]. Te llamo de Coordinación Artística de Productora EAR. Veo que tienes fecha el [Día] en [Finca/Localidad]. Te confirmo que tenemos el equipo libre y el rider acústico homologado para ese espacio.”
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="font-mono font-bold text-[#ecb613] text-[11px] uppercase block">
                    Minuto 0:45 - 1:45 // Desglose sin Letra Pequeña
                  </span>
                  <p>
                    “El precio es cerrado: incluye desplazamiento desde nuestra base oficial, sonido profesional Bose y 2 pases con el repertorio que tú elijas. Cero costes ocultos por kilometraje de última hora.”
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="font-mono font-bold text-[#ecb613] text-[11px] uppercase block">
                    Minuto 1:45 - 3:00 // Cierre Price-Lock de 100 €
                  </span>
                  <p>
                    “Para que no pierdas el día, te envío por WhatsApp el enlace seguro de Stripe con el depósito de 100€. En cuanto lo ingresas, se bloquea la fecha con firma digital y te asignamos el teléfono directo del director musical. ¿Te viene bien recibirlo ahora?”
                  </p>
                </div>
              </div>
            </div>

            {/* Simulador de Manejo de Objeciones */}
            <div className="lg:col-span-5 rounded-[2rem] bg-[#030305] border border-[#ecb613]/30 p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="border-b border-white/10 pb-4">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#ecb613]">
                    ENTRENAMIENTO INTERACTIVO
                  </span>
                  <h3 className="text-lg font-bold font-syne text-white mt-1">
                    Objeciones Más Frecuentes
                  </h3>
                </div>

                <div className="flex gap-2">
                  {OBJECTIONS_CALL_CENTER.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveObjectionIndex(idx)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono cursor-pointer transition-all ${
                        activeObjectionIndex === idx
                          ? 'bg-[#ecb613] text-black font-bold'
                          : 'bg-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      Objeción {idx + 1}
                    </button>
                  ))}
                </div>

                <div className="space-y-3 pt-2">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 block mb-1">
                      El Cliente dice:
                    </span>
                    <p className="text-sm font-semibold text-white italic">
                      {OBJECTIONS_CALL_CENTER[activeObjectionIndex].objection}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#ecb613] block mb-1">
                      Respuesta Maestra S-Class:
                    </span>
                    <p className="text-xs text-white/90 leading-relaxed font-sans">
                      {OBJECTIONS_CALL_CENTER[activeObjectionIndex].responseScript}
                    </p>
                    <div className="mt-3 pt-2 border-t border-[#ecb613]/20 text-[10px] font-mono text-white/50">
                      🎯 Foco psicológico: {OBJECTIONS_CALL_CENTER[activeObjectionIndex].focus}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  copyToClipboard(
                    OBJECTIONS_CALL_CENTER[activeObjectionIndex].responseScript,
                    'obj-script'
                  )
                }
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-mono uppercase tracking-wider text-white transition-all cursor-pointer"
              >
                {copiedScript === 'obj-script' ? '¡Argumento Copiado!' : 'Copiar Argumento de Cierre'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MARKETING & GROWTH */}
      {activeRole === 'marketing' && (
        <div className="rounded-[2rem] bg-[#050508] border border-white/10 p-6 md:p-8 space-y-6">
          <div className="border-b border-white/5 pb-4">
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#00E5FF]">
              GROWTH ACCELERATION // pSEO + PAID ACQUISITION
            </div>
            <h3 className="text-xl font-bold font-syne text-white mt-1">
              Estrategia de Dominación Territorial
            </h3>
            <p className="text-xs text-white/50">
              Conversión de tráfico orgánico y de pago en conversaciones de WhatsApp en menos de 60 segundos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="text-[#00E5FF] font-bold uppercase text-[11px]">
                1. Arquitectura pSEO Provincial
              </div>
              <p className="text-white/60 font-sans leading-relaxed">
                Generación dinámica de landings para las 52 provincias españolas y principales capitales europeas. Cada página vinculada al cálculo geodésico desde el hub más cercano.
              </p>
              <div className="p-2 rounded bg-black/40 text-[10px] text-white/50">
                URL Pattern: /mariachis/madrid, /mariachis/toledo
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="text-[#00E5FF] font-bold uppercase text-[11px]">
                2. Meta & TikTok Ads Directo a WA
              </div>
              <p className="text-white/60 font-sans leading-relaxed">
                Campañas de vídeo con pruebas reales de sonido, directos sin auto-tune y llamada a la acción con mensaje pre-rellenado hacia el +34 693 693 048.
              </p>
              <div className="p-2 rounded bg-black/40 text-[10px] text-white/50">
                KPI North Star: CAC &lt; 18 € por fianza de 100 €
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="text-[#00E5FF] font-bold uppercase text-[11px]">
                3. Alianzas con Fincas (10% Afiliación)
              </div>
              <p className="text-white/60 font-sans leading-relaxed">
                Integración del Portal Demostrativo para dueños de fincas (/fincas/portal-demostrativo) con foso anti-multas acústicas y liquidación automática de comisiones.
              </p>
              <div className="p-2 rounded bg-black/40 text-[10px] text-white/50">
                Split Ledger: 80% Músico / 10% Finca / 10% EAR OS
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. GRABACIÓN 4K & VIMUME */}
      {activeRole === 'video_prod' && (
        <div className="rounded-[2rem] bg-[#050508] border border-white/10 p-6 md:p-8 space-y-6">
          <div className="border-b border-white/5 pb-4">
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#a855f7]">
              CAMPO & PRODUCCIÓN AUDIOVISUAL BROADCAST
            </div>
            <h3 className="text-xl font-bold font-syne text-white mt-1">
              Protocolo de Rodaje y Entregables ESG en 48 Horas
            </h3>
            <p className="text-xs text-white/50">
              Grabación en bodas de gala y residencias VIMUME respetando la intimidad y el RGPD
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
              <h4 className="font-mono font-bold text-[#a855f7] uppercase text-[11px]">
                Checklist de Rodaje en Fincas y Eventos
              </h4>
              <ul className="space-y-2 text-white/70 font-sans">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#a855f7] shrink-0 mt-0.5" />
                  <span>Cámara principal 4K 10-bit en C-Log / S-Log para etalonaje cinematográfico.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#a855f7] shrink-0 mt-0.5" />
                  <span>Grabación multipista de audio directo desde mesa de sonido (sin eco de sala).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#a855f7] shrink-0 mt-0.5" />
                  <span>Tomas de reacción espontánea de los novios o invitados clave.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
              <h4 className="font-mono font-bold text-[#a855f7] uppercase text-[11px]">
                Entregables para Patrocinadores RSC VIMUME
              </h4>
              <ul className="space-y-2 text-white/70 font-sans">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#a855f7] shrink-0 mt-0.5" />
                  <span>Vídeo-resumen de 90 segundos con cortinilla y branding del sponsor corporativo.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#a855f7] shrink-0 mt-0.5" />
                  <span>Autorizaciones RGPD / LOPDGDD firmadas por familiares de residentes mayores.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#a855f7] shrink-0 mt-0.5" />
                  <span>Entrega en almacenamiento soberano en menos de 48 horas tras la sesión.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 4. DIRECCIÓN & CEO */}
      {activeRole === 'ceo_governance' && (
        <div className="rounded-[2rem] bg-[#050508] border border-white/10 p-6 md:p-8 space-y-6">
          <div className="border-b border-white/5 pb-4">
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#10B981]">
              GOBERNANZA ESTRATÉGICA & VETO SUPREMO
            </div>
            <h3 className="text-xl font-bold font-syne text-white mt-1">
              Doctrina del Fundador y Principios Inmutables
            </h3>
            <p className="text-xs text-white/50">
              Reglas de negocio blindadas que ningún agente o empleado puede alterar bajo ninguna circunstancia
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <span className="text-white/40 uppercase text-[10px] block">Split Soberano</span>
              <div className="text-xl font-bold text-white">80 / 10 / 10</div>
              <p className="text-[11px] text-white/50">80% Artista, 10% EAR OS, 10% VIMUME</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <span className="text-white/40 uppercase text-[10px] block">Price-Lock Stripe</span>
              <div className="text-xl font-bold text-[#ecb613]">100,00 €</div>
              <p className="text-[11px] text-white/50">Depósito inmutable previo a cualquier servicio</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <span className="text-white/40 uppercase text-[10px] block">Límite B2G LCSP</span>
              <div className="text-xl font-bold text-[#00E5FF]">&lt; 14.250 €</div>
              <p className="text-[11px] text-white/50">Adjudicación directa preventiva Art. 118</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <span className="text-white/40 uppercase text-[10px] block">Repo Purista</span>
              <div className="text-xl font-bold text-emerald-400">&lt; 50 MB</div>
              <p className="text-[11px] text-white/50">Git sin binarios pesados (Exit Code 0)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
