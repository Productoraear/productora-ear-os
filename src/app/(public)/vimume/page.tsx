'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  ShieldCheck,
  Brain,
  Building2,
  Users,
  Briefcase,
  BookOpen,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Phone,
  MessageCircle
} from 'lucide-react';
import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';

type StakeholderRole = 'terapeuta' | 'director' | 'familia' | 'empresa' | 'investigador';

export default function VimumePortalPage() {
  const [selectedRole, setSelectedRole] = useState<StakeholderRole>('director');
  const [selectedCause, setSelectedCause] = useState<string>('pabellon');

  return (
    <div className="min-h-screen bg-[#030305] text-white selection:bg-[#00E5FF] selection:text-black pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* CABECERA VIMUME CON IDENTIDAD SOCIAL */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4 text-xs font-mono font-medium border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
            <Brain size={13} />
            <span>VIAJE MUSICAL POR LA MEMORIA · NEUROACÚSTICA NO FARMACOLÓGICA</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-serif mb-4 leading-tight">
            Música con Propósito Clínico y Social.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              Estimulación 40 Hz y Serenidad para Mayores.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-8">
            El 10% de cada evento producido por Productora EAR financia sesiones de estimulación neuroacústica en residencias de mayores y personas con deterioro cognitivo.
          </p>

          {/* MANIFIESTO DE RIGOR ÉTICO Y TRANSPARENCIA (CERO VENTA DE HUMO) */}
          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-cyan-500/30 text-left max-w-3xl mx-auto mb-10 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 mb-2">
              <ShieldCheck size={16} />
              <span>MANIFIESTO ÉTICO VIMUME // RIGOR CIENTÍFICO SIN ENGAÑOS</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              En EAR OS y VIMUME <strong>no vendemos milagros ni prometemos curaciones</strong>. La estimulación neuroacústica de 40 Hz es una <strong>línea de investigación no farmacológica</strong> orientada al bienestar emocional, la reducción de agitación y la reconexión de recuerdos mediante la música. Cualquier previsión clínica es una hipótesis de trabajo guiada por profesionales, jamás una promesa médica garantizada.
            </p>
          </div>

          {/* Vídeo Oficial de Edwin Agudelo (De Artista a Empresario Social) */}
          <div className="max-w-3xl mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,229,255,0.15)] bg-black/80 aspect-video mb-12">
            <iframe
              src="https://www.youtube-nocookie.com/embed/qHvmCs0j0OQ?rel=0&modestbranding=1"
              title="De Artista a Empresario con Propósito Social · Edwin Agudelo VIMUME"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            ></iframe>
          </div>
        </div>

        {/* SELECTOR MULTICANAL DE ROLES (ADAPTACIÓN DINÁMICA) */}
        <div className="mb-12">
          <div className="text-center text-xs font-mono text-zinc-400 uppercase tracking-wider mb-4">
            ¿Cómo deseas participar o colaborar con VIMUME?
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-8">
            {[
              { id: 'director', label: 'Directores de Centro', icon: Building2 },
              { id: 'terapeuta', label: 'Terapeutas & Sanitarios', icon: Brain },
              { id: 'familia', label: 'Familias & Domicilio', icon: Users },
              { id: 'empresa', label: 'Empresas & Donantes', icon: Briefcase },
              { id: 'investigador', label: 'Medios & Wiki Científica', icon: BookOpen }
            ].map((tab) => {
              const IconComp = tab.icon;
              const isSelected = selectedRole === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedRole(tab.id as StakeholderRole)}
                  className={`p-3.5 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.25)] scale-105'
                      : 'bg-zinc-900/60 text-zinc-400 border-white/5 hover:bg-zinc-800'
                  }`}
                >
                  <IconComp size={18} className={isSelected ? 'text-cyan-400' : 'opacity-60'} />
                  <span className="text-xs font-bold leading-tight">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* CONTENIDO ADAPTADO POR ROL */}
          <div className="p-6 sm:p-10 rounded-3xl bg-[#09090d]/90 border border-white/10 backdrop-blur-xl shadow-2xl">
            {/* ROL 1: DIRECTOR DE CENTRO */}
            {selectedRole === 'director' && (
              <div className="space-y-6">
                <div className="inline-block px-3 py-1 rounded-md text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Para Directores, Gerentes y Gestores de Residencias
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif">
                  Diferenciación Asistencial y Responsabilidad Social
                </h2>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Ofrece a las familias de tus residentes un servicio pionero que aporta serenidad y bienestar demostrable. Las sesiones de neuroacústica están <strong>subvencionadas por el split del 10% de EAR OS</strong> y permiten deducción fiscal del hasta 80% en IRPF o 40%-50% en Impuesto sobre Sociedades (Modelo 182 AEAT).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-4 rounded-xl bg-zinc-900 border border-white/5">
                    <span className="block text-zinc-400 text-[10px]">Retorno Social:</span>
                    <span className="font-bold text-cyan-400">SROI 4.85x</span>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-900 border border-white/5">
                    <span className="block text-zinc-400 text-[10px]">Deducción Fiscal:</span>
                    <span className="font-bold text-cyan-400">Hasta 80% Modelo 182</span>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-900 border border-white/5">
                    <span className="block text-zinc-400 text-[10px]">Sesión Piloto:</span>
                    <span className="font-bold text-cyan-400">Financiada al 100%</span>
                  </div>
                </div>

                <a
                  href={`https://wa.me/34693693048?text=${encodeURIComponent(
                    'Hola Edwin, soy director de centro y deseo solicitar información para una sesión piloto VIMUME subvencionada.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition-all shadow-lg hover:scale-105"
                >
                  <Sparkles size={14} />
                  <span>Solicitar Sesión Piloto para Residencia</span>
                </a>
              </div>
            )}

            {/* ROL 2: TERAPEUTA */}
            {selectedRole === 'terapeuta' && (
              <div className="space-y-6">
                <div className="inline-block px-3 py-1 rounded-md text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Para Terapeutas Ocupacionales, Psicólogos y Musicoterapeutas
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif">
                  Tu Socio Estratégico en el Acompañamiento Diario
                </h2>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  VIMUME no sustituye tu criterio profesional: es una herramienta amigable que facilita tu trabajo diario. Ponemos a tu disposición frecuencias isocrónicas de 40 Hz no invasivas calibradas para momentos de agitación vespertina (Sundowning) y reconexión emocional.
                </p>

                <div className="space-y-2 text-xs text-zinc-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-cyan-400" />
                    <span>Guías prácticas de intervención sensorial no invasiva.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-cyan-400" />
                    <span>Registro observacional de respuesta emocional del residente.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-cyan-400" />
                    <span>Formación y acompañamiento técnico sin barreras de entrada.</span>
                  </div>
                </div>

                <a
                  href={`https://wa.me/34693693048?text=${encodeURIComponent(
                    'Hola Edwin, soy terapeuta y deseo conocer las herramientas y guías clínicas de VIMUME.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition-all shadow-lg hover:scale-105"
                >
                  <span>Conectar como Terapeuta Colaborador</span>
                </a>
              </div>
            )}

            {/* ROL 3: FAMILIA */}
            {selectedRole === 'familia' && (
              <div className="space-y-6">
                <div className="inline-block px-3 py-1 rounded-md text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Para Familias y Cuidadores en Domicilio o Residencia
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif">
                  Lleva la Música que Amaron a su Corazón
                </h2>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Si tienes a tu padre, madre o abuelo en casa o en una residencia y deseas regalarle una sesión personalizada de música evocadora, VIMUME te acompaña para que experimente momentos de paz, sonrisas y complicidad.
                </p>
                <a
                  href={`https://wa.me/34693693048?text=${encodeURIComponent(
                    'Hola Edwin, deseo consultar cómo llevar una sesión VIMUME para mi familiar.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition-all shadow-lg hover:scale-105"
                >
                  <span>Consultar Sesión para un Familiar</span>
                </a>
              </div>
            )}

            {/* ROL 4: EMPRESA */}
            {selectedRole === 'empresa' && (
              <div className="space-y-6">
                <div className="inline-block px-3 py-1 rounded-md text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Responsabilidad Social Corporativa (RSC) &amp; Donaciones
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif">
                  Financia Sesiones para Pabellones de Bajos Recursos
                </h2>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Tu empresa puede patrocinar sesiones completas para centros sin recursos económicos o pabellones con pacientes de deterioro severo. Certificado oficial de mecenazgo y reporte de impacto social garantizado.
                </p>
                <a
                  href={`https://wa.me/34693693048?text=${encodeURIComponent(
                    'Hola Edwin, represento a una empresa interesada en patrocinar sesiones sociales VIMUME.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition-all shadow-lg hover:scale-105"
                >
                  <span>Patrocinar Sesiones Corporativas</span>
                </a>
              </div>
            )}

            {/* ROL 5: INVESTIGADOR / WIKI */}
            {selectedRole === 'investigador' && (
              <div className="space-y-6">
                <div className="inline-block px-3 py-1 rounded-md text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Repositorio Científico &amp; Medios de Comunicación
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif">
                  Evidencia y Literatura en Estimulación Neuroacústica
                </h2>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Acceso a las bases bibliográficas internacionales sobre frecuencias Gamma (40 Hz), protocolos de estimulación auditiva y estudios clínicos de bienestar en demencia (OMS ICOPE y literatura indexada).
                </p>
                <a
                  href={`https://wa.me/34693693048?text=${encodeURIComponent(
                    'Hola Edwin, soy investigador / periodista y deseo consultar el dossier científico de VIMUME.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition-all shadow-lg hover:scale-105"
                >
                  <span>Solicitar Dossier Científico</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* SELECTOR DE CAUSA BENÉFICA DEL 10% SOCIAL */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950/80 border border-cyan-500/30">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold mb-2">
            <Heart size={14} />
            <span>DESTINO SOBERANO DEL SPLIT BENÉFICO (10% VIMUME)</span>
          </div>
          <h3 className="text-lg font-bold font-serif mb-2">
            ¿A qué causa prefieres destinar el 10% social de tu evento?
          </h3>
          <p className="text-xs text-zinc-400 mb-6">
            Cada cliente que contrata en EAR OS elige a qué área se canaliza su dividendo social.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'pabellon', title: 'Pabellones de Deterioro Severo', desc: 'Centros con pacientes en fases avanzadas que no reciben visitas.' },
              { id: 'domicilio', title: 'Familias con Bajos Recursos', desc: 'Mayores atendidos en hogares particulares sin capacidad económica.' },
              { id: 'rural', title: 'Expansión de Red Rural', desc: 'Llevar sesiones y equipamiento a residencias en pueblos pequeños.' }
            ].map((cause) => (
              <button
                key={cause.id}
                onClick={() => setSelectedCause(cause.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedCause === cause.id
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md'
                    : 'bg-zinc-900/50 border-white/5 text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                <div className="text-xs font-bold mb-1">{cause.title}</div>
                <div className="text-[11px] text-zinc-400 leading-relaxed">{cause.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
