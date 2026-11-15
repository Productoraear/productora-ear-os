'use client';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * PROVIDER UNIVERSAL COCKPIT — CENTRO DE MANDO SOBERANO S-CLASS
 * ════════════════════════════════════════════════════════════════════════════
 * Master Cockpit inspirado en Spotify for Artists para proveedores de EAR OS.
 * Unifica:
 *   1. Selector de las 8 categorías del Caballo de Troya.
 *   2. Inspector y editor de la Ficha Universal de 380 campos tipados con
 *      búsqueda en vivo y agrupación por secciones.
 *   3. Seating Planner (Estándar Pulpetti) embebido con presets para Eduardo
 *      Martínez (Ezkertza Berria 350 pax / Otzarreta 220 pax).
 *   4. Matriz de Capacidades de Plataforma bajo Default-Deny (Google Business,
 *      Bodas.net, Instagram, WhatsApp, Webhooks).
 *   5. Agenda Soberana, feed iCal bidireccional y depósito Price-Lock (100 €).
 *   6. Política de Automatización y Handoff Humano HITL (5% a 90%).
 *   7. Doctrina de Contact-Gate y CTA a Centralita (+34 693 693 048).
 *
 * Directiva UNSLOP:
 *   · Fondo OLED #030305 / #050507.
 *   · Acento único Oro #ecb613.
 *   · Cero emojis en interfaz: iconos SVG puros de lucide-react.
 *   · Cero w-screen (w-full overflow-x-hidden).
 * ════════════════════════════════════════════════════════════════════════════
 */

import React, { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  Printer,
  FileText,
  Building2,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  DollarSign,
  ExternalLink,
  Eye,
  EyeOff,
  Flower2,
  Layers,
  Lock,
  Music,
  PhoneCall,
  Radio,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed,
  Wand2,
  UserPlus,
} from 'lucide-react';
import {
  CENTRALITA_EAR_OS,
  DEPOSITO_STRIPE_EUR,
  SPLIT_SOBERANO,
} from '@/lib/constants/ear-os-ssot';
import {
  buildProviderFieldSet,
  groupProviderFields,
  type ProviderFieldDef,
  type ProviderFieldGroup,
} from '@/lib/providers/provider-field-catalog';
import {
  mapTrojanCategoryToCatalog,
  ProviderProfileCategoryEnum,
  type ProviderProfileCategory,
} from '@/lib/providers/trojan-horse-schema';
import { savePortalProviderProfileAction } from '@/app/actions/portal-provider-actions';
import SeatingPlanner from '@/components/seating/SeatingPlanner';
import { SovereignWhatsAppButton } from '@/components/shared/SovereignWhatsAppButton';
import { TrojanOnboardingModal } from './TrojanOnboardingModal';
import { ProviderDossierPrintable, type ProviderDossierData } from './ProviderDossierPrintable';

export interface ProviderUniversalCockpitProps {
  readonly initialSlug?: string;
  readonly initialBusinessName?: string;
  readonly initialCategory?: ProviderProfileCategory;
  readonly initialTier?: 'DIRECTORY_UNCLAIMED' | 'CLAIMED_PRO' | 'SOVEREIGN_FOUNDER';
  readonly initialValues?: Record<string, string>;
}

const CATEGORY_METADATA: Readonly<
  Record<
    ProviderProfileCategory,
    { readonly label: string; readonly icon: React.ComponentType<{ size?: number; className?: string }>; readonly description: string }
  >
> = Object.freeze({
  FINCA_ALQUILER: {
    label: 'Finca / Espacio Singular',
    icon: Building2,
    description: 'Espacios de celebración, masías, pazos y salones independientes con plano de mesas.',
  },
  RESTAURANTE_BODA: {
    label: 'Restaurante para Bodas',
    icon: UtensilsCrossed,
    description: 'Restaurantes con menús de temporada, exclusividad de fecha y salones de banquete.',
  },
  CATERING_BODA: {
    label: 'Catering & Alta Gastronomía',
    icon: UtensilsCrossed,
    description: 'Logística in situ, menús de temporada, intolerancias y ratio 1 camarero/10 pax.',
  },
  MUSICA_DIRECTO: {
    label: 'Música en Directo / Artista',
    icon: Music,
    description: 'Solistas, dúos, mariachi de gala y orquestas con rider acústico e iluminación.',
  },
  FOTOGRAFIA_VIDEO: {
    label: 'Fotografía & Cinematografía',
    icon: Camera,
    description: 'Reportajes integrales Día D, equipo dual de respaldo y entrega en 30-60 días.',
  },
  FLORISTERIA_DECORACION: {
    label: 'Floristería & Arte Floral',
    icon: Flower2,
    description: 'Montajes ceremoniales, ramos de novia, centros de banquete y desmontaje coordinado.',
  },
  WEDDING_PLANNER: {
    label: 'Wedding Planner & Protocolo',
    icon: Sparkles,
    description: 'Dirección integral del Día D, escaleta de timing y coordinación de proveedores.',
  },
  SERVICIOS_COMPLEMENTARIOS: {
    label: 'Animación & Servicios Auxiliares',
    icon: Radio,
    description: 'Sonido, iluminación espectacular, fotomatón, photocall y transporte de invitados.',
  },
});

interface PlatformCapabilityItem {
  readonly platformId: string;
  readonly label: string;
  readonly category: string;
  readonly state: 'conectada' | 'solo_lectura' | 'sin_api_publica';
  readonly actions: readonly string[];
  readonly fallbackPath: string | null;
  readonly reason: string;
}

const PROVIDER_CAPABILITIES: readonly PlatformCapabilityItem[] = Object.freeze([
  {
    platformId: 'google-business',
    label: 'Google Business Profile',
    category: 'Presencia Local & SEO',
    state: 'solo_lectura',
    actions: ['leer_resenas', 'ver_visitas'],
    fallbackPath: 'Actualización de horarios y fotos mediante Google Business Console',
    reason:
      'Google My Business API v4 requiere cuenta verificada y cuota aprobada. Acceso de solo lectura para métricas y reputación.',
  },
  {
    platformId: 'bodas-net',
    label: 'Bodas.net / WeddingWire',
    category: 'Directorio Publicitario',
    state: 'sin_api_publica',
    actions: ['exportar_lead_csv', 'paridad_380_campos'],
    fallbackPath:
      'Sincronización bidireccional mediante importador CSV / iCal de EAR OS sin cuotas abusivas (1.500€-6.000€/año)',
    reason:
      'Bodas.net no expone API pública de escritura ni gestión transaccional. Opera como jardín publicitario cerrado.',
  },
  {
    platformId: 'instagram',
    label: 'Instagram Professional',
    category: 'Portfolio Multimedia',
    state: 'solo_lectura',
    actions: ['leer_metricas', 'sincronizar_portfolio'],
    fallbackPath:
      'Publicación manual vía Meta Business Suite · Sincronización de feed vía Graph API',
    reason:
      'Instagram Graph API permite lectura de catálogo y métricas con cuenta profesional de creador o empresa.',
  },
  {
    platformId: 'whatsapp',
    label: 'WhatsApp Business API & Concierge',
    category: 'Conversacional Autónomo',
    state: 'conectada',
    actions: ['cualificar_lead', 'consultar_agenda', 'despachar_dossier'],
    fallbackPath: null,
    reason:
      'Conexión activa mediante webhook oficial n8n y arnés de gobernanza con escalado HITL obligatorio (5% al 90%).',
  },
  {
    platformId: 'webhooks',
    label: 'Webhooks Salientes & n8n Automation',
    category: 'Infraestructura Transaccional',
    state: 'conectada',
    actions: ['disparar_presupuesto', 'notificar_deposito', 'sincronizar_ical'],
    fallbackPath: null,
    reason:
      'Endpoints seguros con firma HMAC SHA-256 para eventos de reserva, depósitos Price-Lock y entrega multimedia.',
  },
]);

export function ProviderUniversalCockpit({
  initialSlug = 'eduardo-martinez',
  initialBusinessName = 'Restaurante Otzarreta / Ezkertza Berria',
  initialCategory = 'FINCA_ALQUILER',
  initialTier = 'CLAIMED_PRO',
  initialValues = {},
}: ProviderUniversalCockpitProps) {
  const [activeTab, setActiveTab] = useState<'cockpit' | 'campos' | 'seating' | 'agenda' | 'capacidades'>('cockpit');
  const [selectedCategory, setSelectedCategory] = useState<ProviderProfileCategory>(initialCategory);
  const [providerSlug, setProviderSlug] = useState<string>(initialSlug);
  const [businessName, setBusinessName] = useState<string>(initialBusinessName);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isDossierView, setIsDossierView] = useState(false);
  const [membershipTier] = useState<string>(initialTier);

  // Catálogo SSOT de campos tipados
  const catalogKey = useMemo(() => mapTrojanCategoryToCatalog(selectedCategory), [selectedCategory]);
  const fieldSet = useMemo(() => buildProviderFieldSet(catalogKey), [catalogKey]);
  const groupedFields = useMemo(() => groupProviderFields(fieldSet), [fieldSet]);

  // Estado del editor de campos
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [initialSnapshot, setInitialSnapshot] = useState<Record<string, string>>(initialValues);
  const [activeGroupId, setActiveGroupId] = useState<string>(groupedFields[0]?.group.id ?? 'identidad');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  // Presets de Seating Planner para Eduardo Martínez
  const [seatingPreset, setSeatingPreset] = useState<{
    readonly key: 'ezkertza' | 'otzarreta' | 'custom';
    readonly name: string;
    readonly pax: number;
    readonly capacity: number;
  }>({
    key: 'otzarreta',
    name: 'Banquete Otzarreta (Zarautz)',
    pax: 140,
    capacity: 220,
  });

  // Claves modificadas (dirty state)
  const dirtyKeys = useMemo(() => {
    const dirty: string[] = [];
    for (const key of Object.keys(values)) {
      if ((values[key] ?? '') !== (initialSnapshot[key] ?? '')) {
        dirty.push(key);
      }
    }
    return dirty;
  }, [values, initialSnapshot]);

  const handleFieldChange = useCallback((fieldKey: string, nextValue: string) => {
    setValues((prev) => ({ ...prev, [fieldKey]: nextValue }));
    setSaveFeedback(null);
  }, []);

  const handleSaveFields = async () => {
    if (dirtyKeys.length === 0) return;
    setIsSaving(true);
    setSaveFeedback(null);
    try {
      const result = await savePortalProviderProfileAction(providerSlug, selectedCategory, values);
      setInitialSnapshot({ ...values });
      setSaveFeedback(`Guardado completado: ${result.written} campos guardados en PostgreSQL 16.`);
    } catch (err: unknown) {
      setSaveFeedback(err instanceof Error ? err.message : 'Error al guardar los datos.');
    } finally {
      setIsSaving(false);
    }
  };

  // Filtrado de campos por texto de búsqueda
  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length === 0) return groupedFields;
    return groupedFields
      .map(({ group, fields }) => ({
        group,
        fields: fields.filter(
          (field) =>
            field.label.toLowerCase().includes(q) ||
            field.key.toLowerCase().includes(q) ||
            (field.hint && field.hint.toLowerCase().includes(q)),
        ),
      }))
      .filter(({ fields }) => fields.length > 0);
  }, [groupedFields, searchQuery]);

  const activeGroup = useMemo(
    () => groupedFields.find((g) => g.group.id === activeGroupId) ?? groupedFields[0],
    [groupedFields, activeGroupId],
  );

  const whatsappHref = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hola Centralita EAR OS, solicito soporte técnico sobre mi Centro de Mando Soberano (${businessName}).`,
  )}`;

  const iCalUrl = `/api/calendar/proveedor/${providerSlug}/ical`;

  const isVenueOrCatering =
    selectedCategory === 'FINCA_ALQUILER' ||
    selectedCategory === 'RESTAURANTE_BODA' ||
    selectedCategory === 'CATERING_BODA';

  return (
    <div className="w-full overflow-x-hidden min-h-screen bg-[#030305] text-white selection:bg-[#ecb613] selection:text-black">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-32 space-y-8">

        {/* 1. CABECERA INSTITUCIONAL S-CLASS */}
        <header className="rounded-3xl border border-white/10 bg-[#09090d]/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[#ecb613] text-[10px] font-mono uppercase tracking-[0.2em] font-bold">
                <Sparkles size={12} className="text-[#ecb613]" />
                PACK CABALLO DE TROYA · CENTRO DE MANDO SOBERANO
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-syne">
                {businessName}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
                Paridad taxonómica de 380 campos tipados Zod, Seating Planner Pulpetti integrado, agenda iCal anti-overbooking y 0% de comisión en mediación directa.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
                <span className="h-2 w-2 rounded-full bg-[#57d99a] animate-pulse" />
                <span className="text-zinc-400">Nivel:</span>
                <span className="text-[#ecb613] font-bold uppercase">{membershipTier}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsDossierView(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/15 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
              >
                <Printer size={14} className="text-[#ecb613]" />
                <span>Dossier A4</span>
              </button>
              <button
                type="button"
                onClick={() => setIsOnboardingOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-[#ecb613]/20 hover:from-amber-500/30 hover:to-[#ecb613]/30 text-[#ecb613] border border-[#ecb613]/40 text-xs font-mono uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(236,182,19,0.15)]"
              >
                <UserPlus size={14} />
                <span>Alta Caballo de Troya</span>
              </button>
              <SovereignWhatsAppButton
                url={whatsappHref}
                category="Soporte Centro de Mando Proveedores"
                providerName={businessName}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 text-xs font-mono uppercase tracking-wider transition-all"
              >
                <PhoneCall size={14} className="text-[#ecb613]" />
                <span>Centralita {CENTRALITA_EAR_OS}</span>
              </SovereignWhatsAppButton>
              <Link
                href={`/proveedores/${providerSlug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ecb613] hover:bg-[#ffd24d] text-black font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(236,182,19,0.3)]"
              >
                <span>Ficha Pública</span>
                <ExternalLink size={13} />
              </Link>
            </div>
          </div>

          {/* SELECTOR DE LAS 8 CATEGORÍAS DEL CABALLO DE TROYA */}
          <div className="border-t border-white/10 pt-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 uppercase tracking-wider">
              <span>Gremio y Especialidad (8 Categorías Caballo de Troya)</span>
              <span className="text-[#ecb613] font-bold">380 Campos Tipados</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {(Object.keys(CATEGORY_METADATA) as ProviderProfileCategory[]).map((catKey) => {
                const meta = CATEGORY_METADATA[catKey];
                const IconComponent = meta.icon;
                const isSelected = selectedCategory === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(catKey);
                      setSaveFeedback(null);
                    }}
                    className={`flex flex-col items-center justify-center text-center p-2.5 rounded-xl border text-xs font-mono transition-all ${
                      isSelected
                        ? 'border-[#ecb613] bg-[#ecb613]/15 text-white shadow-[0_0_15px_rgba(236,182,19,0.2)]'
                        : 'border-white/10 bg-black/40 text-zinc-400 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    <IconComponent size={16} className={isSelected ? 'text-[#ecb613]' : 'text-zinc-500'} />
                    <span className="mt-1 text-[10px] uppercase font-bold tracking-tight line-clamp-1">
                      {meta.label.split('/')[0].trim()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* 2. BARRA DE NAVEGACIÓN PRINCIPAL */}
        <nav aria-label="Secciones del Centro de Mando" className="p-1.5 bg-[#0b0c13] border border-white/10 rounded-2xl shadow-xl">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('cockpit')}
              className={`px-3 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                activeTab === 'cockpit'
                  ? 'bg-[#ecb613] text-black font-bold shadow-[0_0_20px_rgba(236,182,19,0.35)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Radio size={14} />
              <span>Resumen</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('campos')}
              className={`px-3 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 relative ${
                activeTab === 'campos'
                  ? 'bg-[#ecb613] text-black font-bold shadow-[0_0_20px_rgba(236,182,19,0.35)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers size={14} />
              <span>Ficha 380 Campos</span>
              {dirtyKeys.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-[#FF2B44] text-white text-[9px] rounded-full font-bold">
                  {dirtyKeys.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('seating')}
              className={`px-3 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                activeTab === 'seating'
                  ? 'bg-[#ecb613] text-black font-bold shadow-[0_0_20px_rgba(236,182,19,0.35)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <UtensilsCrossed size={14} />
              <span>Seating Pulpetti</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('agenda')}
              className={`px-3 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                activeTab === 'agenda'
                  ? 'bg-[#ecb613] text-black font-bold shadow-[0_0_20px_rgba(236,182,19,0.35)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calendar size={14} />
              <span>Agenda iCal</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('capacidades')}
              className={`px-3 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                activeTab === 'capacidades'
                  ? 'bg-[#ecb613] text-black font-bold shadow-[0_0_20px_rgba(236,182,19,0.35)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck size={14} />
              <span>Capacidades</span>
            </button>
          </div>
        </nav>

        {/* 3. CONTENIDO SEGÚN PESTAÑA */}

        {/* TAB 1: COCKPIT / RESUMEN S-CLASS */}
        {activeTab === 'cockpit' && (
          <div className="space-y-6">
            {/* Bento Grid Principal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Tarjeta 1: Paridad 380 Campos */}
              <div className="rounded-2xl border border-white/10 bg-[#09090d] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613]">
                    <Layers size={18} />
                  </div>
                  <span className="font-mono text-xs text-[#57d99a] font-bold">100% Taxonómico</span>
                </div>
                <h3 className="text-lg font-bold text-white font-syne uppercase">Ficha Universal</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Absorbe la totalidad de campos requeridos por directorios tradicionales (bodas.net, Zankyou) eliminando la fuga publicitaria.
                </p>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">Campos en catálogo:</span>
                  <span className="text-[#ecb613] font-bold">{fieldSet.length} campos</span>
                </div>
              </div>

              {/* Tarjeta 2: Mediación Soberana & Cobro */}
              <div className="rounded-2xl border border-white/10 bg-[#09090d] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF]">
                    <DollarSign size={18} />
                  </div>
                  <span className="font-mono text-xs text-[#00E5FF] font-bold">0% Comisión Pro</span>
                </div>
                <h3 className="text-lg font-bold text-white font-syne uppercase">Garantía Financiera</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Cobro del 100% garantizado antes de iniciar el servicio. Sin comisiones abusivas en planes Pro/Fundadores (neto íntegro para el titular).
                </p>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">Depósito Price-Lock:</span>
                  <span className="text-[#ecb613] font-bold">{DEPOSITO_STRIPE_EUR.toFixed(2)} €</span>
                </div>
              </div>

              {/* Tarjeta 3: Agente Autónomo & Handoff HITL */}
              <div className="rounded-2xl border border-white/10 bg-[#09090d] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-[#57d99a]/10 border border-[#57d99a]/30 text-[#57d99a]">
                    <ShieldCheck size={18} />
                  </div>
                  <span className="font-mono text-xs text-[#57d99a] font-bold">Doctrina 5%–90%</span>
                </div>
                <h3 className="text-lg font-bold text-white font-syne uppercase">Atención y Cierre</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  El agente conversacional resuelve del 5% al 90% de consultas técnicas de aforo y fechas. Cierre contractual estrictamente humano bilateral.
                </p>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">Contacto protegido:</span>
                  <span className="text-[#ecb613] font-bold">{CENTRALITA_EAR_OS}</span>
                </div>
              </div>
            </div>

            {/* Banner de Seating Planner para Eduardo Martínez / Venues */}
            {isVenueOrCatering && (
              <div className="rounded-3xl border border-[#ecb613]/30 bg-gradient-to-r from-[#0e0e14] to-[#141209] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 text-[10px] font-mono text-[#ecb613] uppercase font-bold tracking-widest">
                    <UtensilsCrossed size={12} />
                    Integración Pulpetti de Sala & Banquetes
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-syne uppercase text-white">
                    Plano de Mesas & Menús de Temporada Activo
                  </h3>
                  <p className="text-xs text-zinc-400 max-w-2xl">
                    Herramienta de distribución métrica espacial para Ezkertza Berria (350 pax) y Otzarreta (220 pax). Mesas de 2 a 12 comensales, gestión de alérgenos y exportación A4 para cocina.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('seating')}
                  className="shrink-0 px-6 py-3 rounded-xl bg-[#ecb613] hover:bg-[#ffd24d] text-black font-bold text-xs font-mono uppercase tracking-wider transition-all"
                >
                  Abrir Seating Planner
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INSPECTOR Y EDITOR 380 CAMPOS */}
        {activeTab === 'campos' && (
          <div className="space-y-6">
            {/* Barra superior de control: búsqueda y guardado */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl border border-white/10 bg-[#09090d]">
              <div className="relative flex-1 max-w-md">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar entre los 380 campos..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ecb613] font-mono"
                />
              </div>

              <div className="flex items-center gap-3">
                {dirtyKeys.length > 0 && (
                  <span className="text-xs font-mono text-[#FF2B44] font-bold">
                    {dirtyKeys.length} campos sin guardar
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleSaveFields}
                  disabled={dirtyKeys.length === 0 || isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ecb613] hover:bg-[#ffd24d] text-black font-bold text-xs font-mono uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSaving ? <RefreshCw size={13} className="animate-spin" /> : <Save size={13} />}
                  <span>{isSaving ? 'Guardando en BD...' : 'Guardar Ficha'}</span>
                </button>
              </div>
            </div>

            {saveFeedback && (
              <div
                className={`p-4 rounded-xl border text-xs font-mono ${
                  saveFeedback.includes('Guardado')
                    ? 'border-[#57d99a]/40 bg-[#57d99a]/10 text-[#57d99a]'
                    : 'border-[#FF2B44]/40 bg-[#FF2B44]/10 text-[#FF2B44]'
                }`}
              >
                {saveFeedback}
              </div>
            )}

            {/* Layout dos columnas: navegación por grupos y campos */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

              {/* Columna lateral: Grupos de campos */}
              <div className="rounded-2xl border border-white/10 bg-[#09090d] p-3 space-y-1 max-h-[70vh] overflow-y-auto">
                <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                  Grupos ({filteredGroups.length})
                </div>
                {filteredGroups.map(({ group, fields }) => {
                  const isCurrent = activeGroupId === group.id;
                  const groupDirtyCount = fields.filter((f) => dirtyKeys.includes(f.key)).length;
                  return (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => setActiveGroupId(group.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-mono transition-all ${
                        isCurrent
                          ? 'bg-[#ecb613]/15 border border-[#ecb613]/40 text-white font-bold'
                          : 'text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'
                      }`}
                    >
                      <span className="truncate">{group.label}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {groupDirtyCount > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full bg-[#FF2B44] text-white text-[8px] font-bold">
                            {groupDirtyCount}
                          </span>
                        )}
                        <span className="text-[10px] text-zinc-600">{fields.length}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Columna principal: Lista de campos del grupo activo */}
              <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-[#09090d] p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {activeGroup && (
                  <div className="border-b border-white/10 pb-4 space-y-1">
                    <h3 className="text-lg font-bold text-white font-syne uppercase">
                      {activeGroup.group.label}
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono">
                      {activeGroup.group.description}
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {(searchQuery.trim().length > 0
                    ? filteredGroups.flatMap((g) => g.fields)
                    : activeGroup?.fields ?? []
                  ).map((fieldDef) => {
                    const isDirty = dirtyKeys.includes(fieldDef.key);
                    const currentValue = values[fieldDef.key] ?? '';
                    return (
                      <div
                        key={fieldDef.key}
                        className={`p-4 rounded-xl border transition-all ${
                          isDirty
                            ? 'border-[#ecb613]/50 bg-[#ecb613]/5'
                            : 'border-white/5 bg-black/40 hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4 mb-2">
                          <label
                            htmlFor={`field-${fieldDef.key}`}
                            className="text-xs font-mono font-bold text-white uppercase tracking-tight flex items-center gap-2"
                          >
                            <span>{fieldDef.label}</span>
                            {fieldDef.sensitive && (
                              <span title="Dato sensible protegido por Contact-Gate" className="text-[#FF2B44]">
                                <Lock size={11} />
                              </span>
                            )}
                            {fieldDef.publicVisible ? (
                              <span title="Visible en ficha pública" className="text-zinc-500">
                                <Eye size={11} />
                              </span>
                            ) : (
                              <span title="Uso interno operativo" className="text-zinc-600">
                                <EyeOff size={11} />
                              </span>
                            )}
                          </label>
                          <span className="font-mono text-[9px] text-zinc-600 truncate">{fieldDef.key}</span>
                        </div>

                        {fieldDef.hint && (
                          <p className="text-[11px] text-zinc-500 mb-2 leading-relaxed">{fieldDef.hint}</p>
                        )}

                        {fieldDef.type === 'boolean' ? (
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                handleFieldChange(
                                  fieldDef.key,
                                  currentValue === 'true' ? 'false' : 'true',
                                )
                              }
                              className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                                currentValue === 'true'
                                  ? 'bg-[#57d99a] text-black'
                                  : 'bg-white/10 text-zinc-400 hover:text-white'
                              }`}
                            >
                              {currentValue === 'true' ? 'Activado / Sí' : 'Desactivado / No'}
                            </button>
                          </div>
                        ) : fieldDef.type === 'textarea' || fieldDef.type === 'list' ? (
                          <textarea
                            id={`field-${fieldDef.key}`}
                            value={currentValue}
                            onChange={(e) => handleFieldChange(fieldDef.key, e.target.value)}
                            rows={3}
                            placeholder={fieldDef.type === 'list' ? 'Un valor por línea...' : 'Describa el detalle...'}
                            className="w-full p-2.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white placeholder:text-zinc-700 font-mono focus:outline-none focus:border-[#ecb613]"
                          />
                        ) : fieldDef.options && fieldDef.options.length > 0 ? (
                          <select
                            id={`field-${fieldDef.key}`}
                            value={currentValue}
                            onChange={(e) => handleFieldChange(fieldDef.key, e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-[#ecb613]"
                          >
                            <option value="">Seleccione una opción...</option>
                            {fieldDef.options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            id={`field-${fieldDef.key}`}
                            type={fieldDef.type === 'number' || fieldDef.type === 'currency' ? 'number' : 'text'}
                            value={currentValue}
                            onChange={(e) => handleFieldChange(fieldDef.key, e.target.value)}
                            placeholder={fieldDef.label}
                            className="w-full p-2.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white font-mono placeholder:text-zinc-700 focus:outline-none focus:border-[#ecb613]"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SEATING PLANNER PULPETTI INTEGRADO */}
        {activeTab === 'seating' && (
          <div className="space-y-6">
            {/* Presets para Eduardo Martínez */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl border border-white/10 bg-[#09090d]">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#ecb613] font-bold">
                  Presets Canónicos · Eduardo Martínez
                </span>
                <p className="text-xs text-zinc-400">
                  Configuración rápida de aforo para los salones de Ezkertza Berria y Restaurante Otzarreta.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setSeatingPreset({
                      key: 'ezkertza',
                      name: 'Banquete Ezkertza Berria (Derio)',
                      pax: 280,
                      capacity: 350,
                    })
                  }
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider border transition-all ${
                    seatingPreset.key === 'ezkertza'
                      ? 'border-[#ecb613] bg-[#ecb613]/20 text-white font-bold'
                      : 'border-white/10 bg-black/40 text-zinc-400 hover:text-white'
                  }`}
                >
                  Ezkertza Berria (350 pax)
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSeatingPreset({
                      key: 'otzarreta',
                      name: 'Banquete Otzarreta (Zarautz)',
                      pax: 140,
                      capacity: 220,
                    })
                  }
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider border transition-all ${
                    seatingPreset.key === 'otzarreta'
                      ? 'border-[#ecb613] bg-[#ecb613]/20 text-white font-bold'
                      : 'border-white/10 bg-black/40 text-zinc-400 hover:text-white'
                  }`}
                >
                  Otzarreta (220 pax)
                </button>
              </div>
            </div>

            {/* Montaje reactivo del SeatingPlanner */}
            <div className="rounded-3xl border border-white/10 bg-[#060608] p-2 sm:p-4 overflow-hidden">
              <SeatingPlanner
                key={`${seatingPreset.key}-${seatingPreset.pax}`}
                initialPax={seatingPreset.pax}
                initialVenueCapacity={seatingPreset.capacity}
                initialShape="round"
                initialEventName={seatingPreset.name}
                catalogValueEur="190.00"
                depositEur={`${DEPOSITO_STRIPE_EUR.toFixed(2)} €`}
                phoneE164={CENTRALITA_EAR_OS}
              />
            </div>
          </div>
        )}

        {/* TAB 4: AGENDA SOBERANA & BLOQUEO ATÓMICO */}
        {activeTab === 'agenda' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Feed iCal bidireccional */}
              <div className="rounded-2xl border border-white/10 bg-[#09090d] p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613]">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-syne uppercase">Feed iCal Bidireccional</h3>
                    <p className="text-xs text-zinc-400">Sincronización RFC 5545 con Google Calendar y Apple Calendar</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                    Endpoint de Sincronización Privado:
                  </label>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-black/80 border border-white/10 font-mono text-xs text-zinc-300">
                    <span className="truncate">{iCalUrl}</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  Las fechas bloqueadas en su agenda externa se sincronizan automáticamente evitando overbooking. Cualquier reserva confirmada en EAR OS emite un evento VEVENT con confirmación criptográfica SHA-256.
                </p>
              </div>

              {/* Depósito Price-Lock y Split Soberano */}
              <div className="rounded-2xl border border-white/10 bg-[#09090d] p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#57d99a]/10 border border-[#57d99a]/30 text-[#57d99a]">
                    <DollarSign size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-syne uppercase">Price-Lock & Liquidación</h3>
                    <p className="text-xs text-zinc-400">Gobernanza Financiera SSOT</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 text-xs font-mono">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-zinc-400">Fianza Price-Lock Estándar:</span>
                    <span className="text-[#ecb613] font-bold">{DEPOSITO_STRIPE_EUR.toFixed(2)} €</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-zinc-400">Comisión Plan Pro / Fundadores:</span>
                    <span className="text-[#57d99a] font-bold">0% (100% Neto)</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-zinc-400">Split Directorio Gratuito:</span>
                    <span className="text-zinc-300">
                      {Math.round(SPLIT_SOBERANO.artista * 100)}% Proveedor ·{' '}
                      {Math.round(SPLIT_SOBERANO.earOs * 100)}% Plataforma ·{' '}
                      {Math.round(SPLIT_SOBERANO.vimume * 100)}% VIMUME
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Política de Automatización y Handoff Humano */}
            <div className="rounded-2xl border border-white/10 bg-[#09090d] p-6 space-y-4">
              <h3 className="text-base font-bold text-white font-syne uppercase flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#ecb613]" />
                Límites de Automatización Agéntica (WhatsApp & Concierge)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
                <div className="p-3 rounded-xl border border-[#FF2B44]/30 bg-[#FF2B44]/5 space-y-1">
                  <span className="text-xs font-mono font-bold text-[#FF2B44]">5% (HITL Total)</span>
                  <p className="text-[11px] text-zinc-400">Litigios, cancelaciones y contratos B2G &gt; 5.000 €.</p>
                </div>
                <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-1">
                  <span className="text-xs font-mono font-bold text-amber-400">25% (Revisión)</span>
                  <p className="text-[11px] text-zinc-400">Fianza Stripe Price-Lock y logística &gt; 300 km.</p>
                </div>
                <div className="p-3 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-1">
                  <span className="text-xs font-mono font-bold text-blue-400">60% (Semi-Autónomo)</span>
                  <p className="text-[11px] text-zinc-400">Cotizaciones express y dossier multimedia a socios Pro.</p>
                </div>
                <div className="p-3 rounded-xl border border-[#57d99a]/30 bg-[#57d99a]/5 space-y-1">
                  <span className="text-xs font-mono font-bold text-[#57d99a]">90% (Supervisado)</span>
                  <p className="text-[11px] text-zinc-400">FAQ de catálogo, aforos, horarios y disponibilidad.</p>
                </div>
                <div className="p-3 rounded-xl border border-zinc-500/30 bg-zinc-500/5 space-y-1">
                  <span className="text-xs font-mono font-bold text-zinc-400">0% (Prohibición)</span>
                  <p className="text-[11px] text-zinc-400">Cierre de contrato sin consentimiento bilateral humano.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: MATRIZ DE CAPACIDADES DE PLATAFORMA */}
        {activeTab === 'capacidades' && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4 space-y-1">
              <h2 className="text-xl font-black font-syne uppercase text-white">
                Matriz de Capacidades de Plataforma (Default-Deny)
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                Transparencia radical inspirada en Spotify for Artists: si no existe API pública, se declara sin_api_publica. Cero botones simulados.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PROVIDER_CAPABILITIES.map((cap) => {
                const stateBadge =
                  cap.state === 'conectada'
                    ? { bg: 'bg-[#57d99a]/15 text-[#57d99a] border-[#57d99a]/40', label: 'Conectada (API Activa)' }
                    : cap.state === 'solo_lectura'
                    ? { bg: 'bg-blue-500/15 text-blue-400 border-blue-500/40', label: 'Solo Lectura' }
                    : { bg: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/40', label: 'Sin API Pública' };

                return (
                  <div key={cap.platformId} className="rounded-2xl border border-white/10 bg-[#09090d] p-6 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold tracking-wider">
                          {cap.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold uppercase ${stateBadge.bg}`}>
                          {stateBadge.label}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white font-syne">{cap.label}</h3>

                      <p className="text-xs text-zinc-400 leading-relaxed">{cap.reason}</p>

                      {cap.fallbackPath && (
                        <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 space-y-1">
                          <span className="text-[9px] font-mono uppercase text-[#ecb613] font-bold">Vía Operativa:</span>
                          <p className="text-[11px] text-zinc-300 font-mono">{cap.fallbackPath}</p>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/5 space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {cap.actions.map((act) => (
                          <span key={act} className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-mono text-zinc-400">
                            {act}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      <TrojanOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onRegistered={(newSlug, newName, newCategory) => {
          setProviderSlug(newSlug);
          setBusinessName(newName);
          setSelectedCategory(newCategory);
          setSaveFeedback(`Proveedor ${newName} registrado con éxito en modo Caballo de Troya.`);
        }}
      />
    </div>
  );
}
