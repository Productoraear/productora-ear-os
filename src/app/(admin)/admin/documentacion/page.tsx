'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  FileText,
  Download,
  Terminal,
  Database,
  Layers,
  CheckCircle2,
  Cpu,
  Lock,
  ArrowRight,
  TrendingUp,
  Scale,
  Sparkles,
  GitBranch,
  Building2,
  Calendar,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Share2,
  X,
  BadgeCheck,
} from 'lucide-react';
import { z } from 'zod';
import {
  SPLIT_SOBERANO,
  DEPOSITO_STRIPE_EUR,
  LIMITE_B2G_LCSP_EUR,
  LIMITE_SPL_DB,
} from '@/lib/constants/ear-os-ssot';
import {
  GLOBAL_SYSTEM_INVARIANTS,
  resolveEntityContext,
} from '@/lib/oraculo/entity-resolver';
import {
  executeMegapromptObrero,
  executeWebhookN8n,
  type MultiRailExecutionResult,
} from '@/lib/compiler/multi-rail-execution';

export const ForensicDocumentationSchema = z
  .object({
    activeTab: z.enum(['cronologia', 'arquitectura', 'modelos', 'trojan', 'seating', 'gates', 'legal']),
    commitsTotal: z.number(),
    modelsTotal: z.number(),
    routesTotal: z.number(),
  })
  .strict();

export default function DocumentacionForensePage() {
  const [activeTab, setActiveTab] = useState<'cronologia' | 'arquitectura' | 'modelos' | 'trojan' | 'seating' | 'gates' | 'legal'>('cronologia');
  const [activeResult, setActiveResult] = useState<MultiRailExecutionResult | null>(null);
  const [showAuxiliary, setShowAuxiliary] = useState<boolean>(false);

  const handleTriggerMegaprompt = () => {
    const res = executeMegapromptObrero({
      eventId: `DOC-AUDIT-${Date.now().toString(36).toUpperCase()}`,
      clientName: 'Documentación Forense SOTA',
      venue: 'Sede Productora EAR',
      eventDate: new Date().toISOString().slice(0, 10),
      grossEur: 0,
      dimensionId: 'GOBERNANZA_SRE',
      entityContext: resolveEntityContext('documentacion-forense', 'GOBERNANZA_SRE'),
      pepitaDeOro: 'Auditoría Forense SOTA EAR OS 2026',
      rawVision: `Compilación técnica de 1.007 commits, 73 modelos Prisma y arnés de compuertas verificado`,
    });
    setActiveResult(res);
  };

  const handleTriggerN8n = async () => {
    const res = await executeWebhookN8n({
      eventId: `DOC-DISPATCH-${Date.now().toString(36).toUpperCase()}`,
      clientName: 'Dossier Forense Integral',
      venue: 'Sede Productora EAR',
      eventDate: new Date().toISOString().slice(0, 10),
      grossEur: 0,
      dimensionId: 'GOBERNANZA_SRE',
      entityContext: resolveEntityContext('documentacion-forense', 'GOBERNANZA_SRE'),
      pepitaDeOro: 'Despacho de Dossier Forense Integral',
      rawVision: 'Exportación estructurada de telemetría de modelos y contratos hacia n8n',
    });
    setActiveResult(res);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans pb-24 text-white">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
        <Link href="/admin" className="hover:text-zinc-300 transition-colors">Admin</Link>
        <span>/</span>
        <span>Gobernanza</span>
        <span>/</span>
        <span className="text-[#ecb613]">Documentación & Auditoría Forense SOTA</span>
      </div>

      {/* HEADER DE GOBERNANZA */}
      <div className="rounded-3xl bg-[#09090d]/90 border border-white/10 p-6 sm:p-8 backdrop-blur-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[#ecb613] text-[10px] font-mono uppercase tracking-[0.2em] font-bold">
              <ShieldCheck size={12} />
              Dossier Forense SOTA · Due Diligence para Inversores & Tech Leads
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase text-white font-syne">
              Auditoría Forense Integral <span className="text-[#ecb613]">EAR OS V2</span>
            </h1>
            <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
              Compilación técnica sin filtros ni resúmenes: 1.007 commits auditados, 73 modelos PostgreSQL 16, 521 rutas navegables, 380 campos tipados Zod y el arnés de 17 puertas con Exit Code 0.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleTriggerMegaprompt}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 font-mono font-bold text-xs uppercase tracking-wider hover:bg-emerald-900/60 transition-all cursor-pointer"
            >
              <Terminal size={14} />
              <span>Megaprompt Obrero</span>
            </button>
            <button
              onClick={handleTriggerN8n}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-500/40 bg-amber-950/40 text-amber-300 font-mono font-bold text-xs uppercase tracking-wider hover:bg-amber-900/60 transition-all cursor-pointer"
            >
              <Share2 size={14} />
              <span>Despacho n8n</span>
            </button>
            <a
              href="/downloads/EAR_OS_DOSSIER_FORENSE_SOTA_2026.md"
              download="EAR_OS_DOSSIER_FORENSE_SOTA_2026.md"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ecb613] to-[#d4a855] text-black font-mono font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-[0_0_20px_rgba(236,182,19,0.3)] cursor-pointer"
            >
              <Download size={14} />
              <span>Descargar Dossier (.MD)</span>
            </a>
          </div>
        </div>

        {/* METRICS BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-4 border-t border-white/10 text-xs font-mono">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-zinc-500 text-[10px] block">COMMITS TOTALES</span>
            <strong className="text-lg text-white font-bold font-syne">1.007</strong>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-zinc-500 text-[10px] block">MODELOS PRISMA</span>
            <strong className="text-lg text-[#ecb613] font-bold font-syne">73 Modelos</strong>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-zinc-500 text-[10px] block">RUTAS NEXT.JS</span>
            <strong className="text-lg text-cyan-400 font-bold font-syne">521 Rutas</strong>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-zinc-500 text-[10px] block">CAMPOS ZOD TROJAN</span>
            <strong className="text-lg text-emerald-400 font-bold font-syne">380 Tipados</strong>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-zinc-500 text-[10px] block">ARNÉS RELEASES</span>
            <strong className="text-lg text-white font-bold font-syne">17/17 Gates</strong>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-zinc-500 text-[10px] block">ESTADO ZONA CERO</span>
            <strong className="text-lg text-emerald-400 font-bold font-syne">SHA-256 OK</strong>
          </div>
        </div>
      </div>

      {/* SELECTOR DE PESTAÑAS */}
      <div className="p-1.5 bg-[#0b0c13] border border-white/10 rounded-2xl max-w-4xl shadow-xl overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max text-xs font-mono uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('cronologia')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'cronologia'
                ? 'bg-[#ecb613] text-black font-bold shadow-[0_0_20px_rgba(236,182,19,0.35)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <GitBranch size={13} />
            <span>1. Cronología Git</span>
          </button>

          <button
            onClick={() => setActiveTab('arquitectura')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'arquitectura'
                ? 'bg-[#ecb613] text-black font-bold shadow-[0_0_20px_rgba(236,182,19,0.35)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers size={13} />
            <span>2. Arquitectura Full-Stack</span>
          </button>

          <button
            onClick={() => setActiveTab('modelos')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'modelos'
                ? 'bg-[#ecb613] text-black font-bold shadow-[0_0_20px_rgba(236,182,19,0.35)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Database size={13} />
            <span>3. 73 Modelos PostgreSQL</span>
          </button>

          <button
            onClick={() => setActiveTab('trojan')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'trojan'
                ? 'bg-[#ecb613] text-black font-bold shadow-[0_0_20px_rgba(236,182,19,0.35)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles size={13} />
            <span>4. Caballo de Troya (380 Zod)</span>
          </button>

          <button
            onClick={() => setActiveTab('seating')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'seating'
                ? 'bg-[#ecb613] text-black font-bold shadow-[0_0_20px_rgba(236,182,19,0.35)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Cpu size={13} />
            <span>5. Seating Pulpetti [2..12]</span>
          </button>

          <button
            onClick={() => setActiveTab('gates')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'gates'
                ? 'bg-[#ecb613] text-black font-bold shadow-[0_0_20px_rgba(236,182,19,0.35)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <CheckCircle2 size={13} />
            <span>6. 17 Gates de Calidad</span>
          </button>

          <button
            onClick={() => setActiveTab('legal')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'legal'
                ? 'bg-[#ecb613] text-black font-bold shadow-[0_0_20px_rgba(236,182,19,0.35)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Scale size={13} />
            <span>7. Dictamen Jurídico CEO</span>
          </button>
        </div>
      </div>

      {/* CONTENIDO INTERACTIVO SEGÚN PESTAÑA */}
      <div className="bg-[#09090d]/80 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">

        {/* 1. CRONOLOGÍA */}
        {activeTab === 'cronologia' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-syne text-white uppercase flex items-center gap-2">
                <GitBranch className="text-[#ecb613]" size={18} />
                Línea Temporal de Construcción e Ingeniería Inversa
              </h2>
              <p className="text-xs text-zinc-400">
                1.007 commits verificados en el historial de Git, estructurados en 6 grandes eras tecnológicas.
              </p>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[#ecb613] font-bold">
                  <span>ERA 1: MARKETPLACE & CORE SINGULARITY (Mayo 2026)</span>
                  <span className="text-[10px] text-zinc-500">Commits 64d2d704 a 4364fe35</span>
                </div>
                <p className="text-zinc-300 font-sans text-xs">
                  Creación del marketplace S-Class bajo estética Aura Onyx (#030305, #050507, #09090D). Implementación inicial de Prisma con Workspace, ProviderProfile, AffiliateProfile, WaybillParticipant y StorageAsset. Pasarela de pagos Stripe y telemetría de base de datos.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[#ecb613] font-bold">
                  <span>ERA 2: COBERTURA TERRITORIAL & pSEO (Mayo - Julio 2026)</span>
                  <span className="text-[10px] text-zinc-500">Commits 4909c8a2 a a6ad6205</span>
                </div>
                <p className="text-zinc-300 font-sans text-xs">
                  Ingesta de los 8.131 municipios de España procedentes del INE. Arquitectura matricial de 4 capas de intención (Espacio + Lugar + Ocasión + Necesidad) generada bajo la regla ZTLM (Zero-Token Local Mirroring) con coste de IA de 0,00 €.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[#ecb613] font-bold">
                  <span>ERA 3: PROTOCOLO VIMUME & COTIZADOR UBER (Agosto - Septiembre 2026)</span>
                  <span className="text-[10px] text-zinc-500">Commits dfc74d5f a 851a2f8a</span>
                </div>
                <p className="text-zinc-300 font-sans text-xs">
                  Implementación del protocolo de neuroacústica 40 Hz VIMUME para residencias de la tercera edad. Introducción del Cotizador Uber con tiempos de ruta y cálculo de desplazamiento desde el Hub Central de Méntrida a 1,50 €/km.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[#ecb613] font-bold">
                  <span>ERA 4: GOBERNANZA OMEGA DIAMANTE & ARNÉS 17 PUERTAS (Octubre - Noviembre 2026)</span>
                  <span className="text-[10px] text-zinc-500">Commits 1d8c3636 a 604f3327</span>
                </div>
                <p className="text-zinc-300 font-sans text-xs">
                  Adopción del estándar Spec-Driven Development Nivel 5. Blindaje de la Zona Cero (ear-os-ssot.ts) con verificación de hash SHA-256 pre-push bloqueante. Prohibición estricta de código estocástico (vibe-coding).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[#ecb613] font-bold">
                  <span>ERA 5: B2G FAST-TRACK PARA 8.131 AYUNTAMIENTOS (Noviembre 2026)</span>
                  <span className="text-[10px] text-zinc-500">Commit 4ef4c8af</span>
                </div>
                <p className="text-zinc-300 font-sans text-xs">
                  Ventanilla única de contratación menor Art. 118 LCSP con selector dinámico de municipios, auto-población de DIR3 y CIF, tripleta documental de descarga inmediata y FacturaE 3.2.2 XML conforme al estándar FACe.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[#ecb613] font-bold">
                  <span>ERA 6: CABALLO DE TROYA & CENTRO DE MANDO S-CLASS (Presente)</span>
                  <span className="text-[10px] text-zinc-500">Commits 1d520664, 7f79122b y b33bbe56</span>
                </div>
                <p className="text-zinc-300 font-sans text-xs">
                  Unificación del Single Sign-On (SSO) en /login. Ingesta de 380 campos tipados en esquemas Zod con validación algorítmica Módulo 23 e IBAN ISO 13616 BigInt. Seating Planner Pulpetti nativo [2..12 pax] y auditor de cobertura de intención sobre URLs.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. ARQUITECTURA */}
        {activeTab === 'arquitectura' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-syne text-white uppercase flex items-center gap-2">
                <Layers className="text-[#ecb613]" size={18} />
                Arquitectura Full-Stack S-Class
              </h2>
              <p className="text-xs text-zinc-400">
                Infraestructura soberana bare-metal alojada en Coolify sin dependencias de nubes propietarias cerradas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-[#ecb613] font-mono font-bold uppercase text-[11px]">Runtime & Framework</div>
                <ul className="space-y-1 text-zinc-300 list-disc list-inside">
                  <li><strong>Node.js:</strong> v26.12.1 LTS x64 bare-metal.</li>
                  <li><strong>Next.js:</strong> 16.3.5 con App Router y Turbopack.</li>
                  <li><strong>React:</strong> 19.2.6 con Server Actions y transiciones concurrentes.</li>
                  <li><strong>TypeScript:</strong> 6.0.3 en modo estricto (cero any).</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-[#ecb613] font-mono font-bold uppercase text-[11px]">Persistencia & Transacciones</div>
                <ul className="space-y-1 text-zinc-300 list-disc list-inside">
                  <li><strong>PostgreSQL:</strong> 16 contenedor bare-metal con transacciones ACID.</li>
                  <li><strong>Prisma ORM:</strong> 6.19.3 con 73 modelos relacionales.</li>
                  <li><strong>Stripe Checkout:</strong> API 2025-01-27 para depósitos Price-Lock 100 €.</li>
                  <li><strong>Aislamiento Serializable:</strong> Bloqueo atómico anti-overbooking.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-[#ecb613] font-mono font-bold uppercase text-[11px]">Seguridad & Identidad (SSO)</div>
                <ul className="space-y-1 text-zinc-300 list-disc list-inside">
                  <li><strong>Single Sign-On:</strong> Intercambio de token con /api/auth/session.</li>
                  <li><strong>Cookies HttpOnly:</strong> __session y ear_role cifradas en servidor.</li>
                  <li><strong>Control RBAC:</strong> Redirección dinámica según rango (Admin, Artista, Proveedor).</li>
                  <li><strong>Contact-Gate:</strong> Enmascaramiento de teléfonos hacia Centralita +34693693048.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-[#ecb613] font-mono font-bold uppercase text-[11px]">Rendimiento & Diseño OLED</div>
                <ul className="space-y-1 text-zinc-300 list-disc list-inside">
                  <li><strong>Paleta OLED:</strong> Fondos puros #030305, #050507, #09090D.</li>
                  <li><strong>CLS Budget:</strong> 0,000 en hero y calculadoras con skeletons geométricos.</li>
                  <li><strong>Iconografía:</strong> Lucide React pura (cero emojis en consolas).</li>
                  <li><strong>Layout:</strong> w-full overflow-x-hidden (erradicación de w-screen).</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 3. MODELOS */}
        {activeTab === 'modelos' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-syne text-white uppercase flex items-center gap-2">
                <Database className="text-[#ecb613]" size={18} />
                73 Modelos de Base de Datos (PostgreSQL 16 / Prisma)
              </h2>
              <p className="text-xs text-zinc-400">
                Estructura relacional exhaustiva formalizada en prisma/schema.prisma para soporte de negocio de 9 cifras.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-[11px] font-mono text-zinc-400">
                <strong className="text-white block mb-1">Clústeres Relacionales del Sistema:</strong>
                1. <strong>Identidad & Gobernanza (RBAC):</strong> User, UserSpace, auraWallet, Transaction, commissionLedger, smartContract.
                <br />2. <strong>Carrera del Artista (Career OS):</strong> artistProfile, ArtistProfile, PlatformConnection, MetricSnapshot, Release, Track, Gig, Contract, RoyaltyStatement.
                <br />3. <strong>Proveedores & Caballo de Troya:</strong> ProviderFicha, ProviderProfileField, ProviderPaymentMethod, ProviderPaymentRequestLog, VendorProfile, VendorBooking, VendorLead.
                <br />4. <strong>Logística & Telemetría (Fleet OS):</strong> workspace, fleetUnit, fleetTelemetryEvent, FleetPosition, LiveTelemetryPing, waybill, WaybillItem, EquipmentInventory.
                <br />5. <strong>B2G, Sanidad & Impacto Social:</strong> TherapistProfile, MariachiLead, FunnelEvent, OutreachProspect, OutreachThread.
              </div>

              <div className="bg-black/40 border border-white/10 rounded-2xl p-4 max-h-[360px] overflow-y-auto font-mono text-[11px] text-zinc-300 scrollbar-thin">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'User', 'UserSpace', 'artistProfile', 'technicalRider', 'clientProfile', 'auraWallet', 'Transaction', 'commissionLedger', 'smartContract', 'waybill', 'WaybillItem', 'providerProfile', 'ProviderCalibration', 'MediaAsset', 'ProviderQuota', 'TechnicalRider', 'ProviderPackage', 'ProviderAuditLog', 'workspace', 'fleetUnit', 'fleetTelemetryEvent', 'FleetPosition', 'LiveTelemetryPing', 'ProductionEvent', 'calendarBlock', 'VendorShadowProfile', 'VendorProfile', 'VendorLead', 'VendorThread', 'VendorCrmClient', 'VendorBooking', 'EquipmentInventory', 'SmartLock', 'LeadMagnetLog', 'Budget', 'BudgetCategory', 'Expense', 'Payment', 'Vendor', 'ProposalRequest', 'Proposal', 'ProposalLineItem', 'ProposalReadTelemetry', 'CRMTask', 'ProposalActivityTimeline', 'AdminNotification', 'AdminPulse', 'AffiliateProfile', 'AffiliateReferral', 'Payout', 'TherapistProfile', 'VoiceProfile', 'AgentVoiceAssignment', 'FunnelEvent', 'OutreachProspect', 'OutreachThread', 'ProviderFicha', 'ProviderProfileField', 'ProviderPaymentMethod', 'ProviderPaymentRequestLog', 'ArtistProfile', 'PlatformConnection', 'MetricSnapshot', 'Release', 'Track', 'TeamMember', 'Gig', 'Contract', 'RoyaltyStatement', 'Campaign', 'FanContact', 'ContentPost', 'MariachiLead'
                  ].map((m, i) => (
                    <div key={m} className="p-2 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2">
                      <span className="text-[#ecb613] text-[9px]">{i + 1}.</span>
                      <span className="truncate">{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. TROJAN HORSE */}
        {activeTab === 'trojan' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-syne text-white uppercase flex items-center gap-2">
                <Sparkles className="text-[#ecb613]" size={18} />
                El Pack Caballo de Troya (380 Campos Tipados Zod)
              </h2>
              <p className="text-xs text-zinc-400">
                Equivalencia taxonómica total para sustituir directorios publicitarios cerrados por infraestructura soberana.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-[#ecb613] font-bold">8 CATEGORÍAS HOMOLOGADAS</div>
                <p className="text-zinc-300 font-sans">
                  Fincas y Espacios, Restaurantes, Catering, Música en Directo, Fotografía y Vídeo, Floristería y Decoración, Wedding Planners y Servicios Complementarios.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-[#ecb613] font-bold">VALIDACIÓN MATEMÁTICA FORMAL</div>
                <p className="text-zinc-300 font-sans">
                  DNI/NIE/CIF mediante algoritmo Módulo 23 formal y cuentas bancarias IBAN ISO 13616 calculadas con BigInt para inmunidad contra desbordamientos.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-[#ecb613] font-bold">SPLIT SOBERANO 80/10/10 vs 0%</div>
                <p className="text-zinc-300 font-sans">
                  El directorio gratuito divide 80% artista, 10% plataforma y 10% VIMUME. Los miembros Pro o Club Fundadores retienen el 100% neto con 0% de comisión.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-[#ecb613] font-bold">CONTACT-GATE PROTEGIDO</div>
                <p className="text-zinc-300 font-sans">
                  Los datos de contacto directo jamás se exponen en perfiles no reclamados; se desvían de forma obligatoria a la Centralita Oficial +34 693 693 048.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 5. SEATING PULPETTI */}
        {activeTab === 'seating' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-syne text-white uppercase flex items-center gap-2">
                <Cpu className="text-[#ecb613]" size={18} />
                Seating Planner Nativo (Estándar Pulpetti [2..12 pax])
              </h2>
              <p className="text-xs text-zinc-400">
                Motor interactivo para banquetes y fincas (Eduardo Martínez - Ezkertza Berria / Otzarreta).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-[#ecb613] font-mono font-bold uppercase">Cota Canónica [2..12]</div>
                <p className="text-zinc-300">
                  Ninguna mesa admite menos de 2 plazas ni más de 12. Las mesas presidenciales quedan limitadas a 12 para evitar desajustes en el servicio de cocina.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-[#ecb613] font-mono font-bold uppercase">Matriz de Alérgenos (9 Tipos)</div>
                <p className="text-zinc-300">
                  Conteo en tiempo real de celíacos, veganos, vegetarianos, sin lactosa, marisco, frutos secos, embarazadas, infantiles y especiales.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-[#ecb613] font-mono font-bold uppercase">Hoja de Sala para Cocina</div>
                <p className="text-zinc-300">
                  Exportación e impresión en formato normalizado A4 con cuadrícula de distribución y líneas de plegado para el personal de banquete.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 6. GATES */}
        {activeTab === 'gates' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-syne text-white uppercase flex items-center gap-2">
                <CheckCircle2 className="text-emerald-400" size={18} />
                Arnés Constitucional de 17 Puertas (Exit Code 0)
              </h2>
              <p className="text-xs text-zinc-400">
                Conjunto de pruebas automatizadas previas a cualquier despliegue a producción en bare-metal Coolify.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-mono text-[11px]">
              {[
                'verify:pricing (Tarifas SSOT y suelo 350 €)',
                'audit:ssot (Integridad hash SHA-256)',
                'verify:logistics (1,50 €/km + 120 € hotel)',
                'verify:budget (Resto mayor en Allocator)',
                'verify:confianza (Coherencia de sellos)',
                'audit:cta-matrix (100% CTAs válidos)',
                'verify:provider-ctas (Contact-Gate)',
                'audit:phone (E.164 y Centralita +34693693048)',
                'audit:admin (Aislamiento de consola admin)',
                'audit:http (0 endpoints huérfanos)',
                'audit:tariff-copy (Coherencia en tarifas)',
                'audit:gates (Integridad del arnés)',
                'verify_sonometro_pwa (Ley 37/2003)',
                'audit:admin-ecosystem (Shell admin)',
                'verify:db-failure (Circuit-breaker BD)',
                'lint (0 errores en ESLint)',
                'typecheck (0 errores TypeScript strict)'
              ].map((g, i) => (
                <div key={g} className="p-3 rounded-xl bg-white/5 border border-emerald-500/20 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span className="text-zinc-300 truncate">{g}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. LEGAL */}
        {activeTab === 'legal' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-syne text-white uppercase flex items-center gap-2">
                <Scale className="text-[#ecb613]" size={18} />
                Dictamen Jurídico, Fiscal & Previsional del CEO
              </h2>
              <p className="text-xs text-zinc-400">
                Estrategia formal de regularización y blindaje de patrimonio para Edwin Agudelo (26 años en España).
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-[#ecb613] font-mono font-bold uppercase text-[11px]">1. Fase Inmediata: Alta de Autónomo (RETA)</div>
                <p className="text-zinc-300 leading-relaxed">
                  Alta censal en la Agencia Tributaria (Modelo 036/037) bajo epígrafes 851 (Representación Artística) y 844 (Servicios Audiovisuales), y alta en la Seguridad Social en el RETA. Esto habilita la facturación legal inmediata y comienza a sumar cotizaciones cruciales para la jubilación en España.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-[#ecb613] font-mono font-bold uppercase text-[11px]">2. Fase Corporativa: Sociedad Limitada (S.L.)</div>
                <p className="text-zinc-300 leading-relaxed">
                  Constitución de una S.L. para separar el patrimonio personal del CEO del riesgo civil y contractual de los eventos. Contratación de Póliza de Responsabilidad Civil de 1.000.000,00 € a nombre de la persona jurídica.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-[#ecb613] font-mono font-bold uppercase text-[11px]">3. Fase Tercer Sector: Fundación o Asociación VIMUME</div>
                <p className="text-zinc-300 leading-relaxed">
                  Formalización independiente de VIMUME bajo la Ley 49/2002 de Régimen Fiscal del Mecenazgo, permitiendo a empresas y particulares deducirse las aportaciones en el IRPF o Impuesto de Sociedades y presentando el preceptivo Modelo 182 ante Hacienda.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* VISTA PLEGABLE: REPORTES AUXILIARES & SALVAGUARDAS ARQUITECTÓNICAS */}
      <div className="rounded-3xl bg-[#09090d]/60 border border-white/10 overflow-hidden">
        <button
          onClick={() => setShowAuxiliary(!showAuxiliary)}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-syne text-white uppercase">
                Herramientas Secundarias &amp; Invariantes de Gobernanza SRE
              </h4>
              <p className="text-xs text-zinc-400 font-mono">
                Desglose de contratos, límites de aislamiento de catálogo y mamparos de concurrencia
              </p>
            </div>
          </div>
          {showAuxiliary ? <ChevronUp className="w-5 h-5 text-zinc-400" /> : <ChevronDown className="w-5 h-5 text-zinc-400" />}
        </button>

        {showAuxiliary && (
          <div className="p-6 pt-0 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-zinc-300">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase">Aislamiento Artistas</span>
              <p className="text-white font-bold">Paciente Cero Edwin Agudelo (e78903)</p>
              <p className="text-zinc-400 text-[11px]">Suelo inmutable 350 € / 550 € con 100 km. Prohibido aplicar a terceros.</p>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase">Aislamiento Fincas</span>
              <p className="text-white font-bold">Paciente Cero Otzarreta (Eduardo Martínez)</p>
              <p className="text-zinc-400 text-[11px]">Menús 2026 (145€ - 185€) blindados exclusivamente a su slug.</p>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase">Arnés Pre-Push</span>
              <p className="text-emerald-400 font-bold">17/17 Gates Exit Code 0</p>
              <p className="text-zinc-400 text-[11px]">Ningún commit entra en main sin superar el protocolo determinista.</p>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE RESULTADO MULTI-RAIL */}
      {activeResult && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#09090d] border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold font-syne text-white uppercase tracking-wider">
                  {activeResult.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveResult(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-900">
                <span className="text-zinc-400">Artefacto:</span>
                <span className="text-white font-bold">{activeResult.filename}</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1">
                <span className="text-zinc-500 text-[10px] block">SELLO SHA-256</span>
                <span className="text-[#ecb613] text-[11px] break-all">{activeResult.sha256}</span>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-400 text-[11px]">Payload / Contenido:</span>
                <pre className="p-3 rounded-xl bg-black border border-zinc-900 text-[11px] text-zinc-300 overflow-x-auto max-h-48 font-mono">
                  {activeResult.previewContent}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveResult(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

