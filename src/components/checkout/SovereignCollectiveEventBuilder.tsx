'use client';

import React from 'react';
import {
  Building2,
  Mic2,
  Speaker,
  UtensilsCrossed,
  Sparkles,
  Flower2,
  Bus,
  Car,
  Camera,
  Video,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useCart, EventServiceCategory } from '@/components/checkout/CartContext';
import { DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';
import { TARIFA_SOLISTA_EUR, KM_INCLUIDOS } from '@/lib/pricing/solista-pricing';

export interface EventServicePill {
  id: string;
  category: EventServiceCategory;
  title: string;
  providerName: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  priceEur: number;
  horquilla: string;
  badge?: string;
  popular?: boolean;
}

/**
 * AISLAMIENTO DE CATÁLOGO (directiva CEO · cero contaminación del simulador).
 *
 * Edwin Agudelo es Paciente Cero de la vertical MÚSICA y JAMÁS debe aparecer
 * cuando la categoría seleccionada no es musical (fincas, restaurantes,
 * catering, floristería, transporte...). Esta función es la única autoridad
 * que decide si su casilla se renderiza.
 */
export function isMusicCategory(category: EventServiceCategory | 'ALL' | null | undefined): boolean {
  return category === 'artista';
}

/**
 * Filtra el catálogo aplicando el aislamiento por categoría:
 *  · sin categoría (`null`/`undefined`) ⇒ catálogo completo (modo escaparate),
 *  · categoría MÚSICA (`artista`) ⇒ todo el catálogo, con Edwin visible,
 *  · cualquier otra categoría concreta ⇒ solo sus casillas y NUNCA Edwin,
 *  · categoría `ALL` (búsqueda general) ⇒ todo el catálogo salvo Edwin.
 */
export function selectVisibleServices(
  services: readonly EventServicePill[],
  category: EventServiceCategory | 'ALL' | null | undefined,
): EventServicePill[] {
  // Modo escaparate: sin categoría declarada no se aísla nada.
  if (category === null || category === undefined) {
    return [...services];
  }

  const musicAllowed = isMusicCategory(category);

  return services.filter((service) => {
    const isSovereignArtist = SOVEREIGN_ARTIST_PROVIDER_IDS.has(service.id);

    // Un artista de la casa jamás aparece fuera de la vertical de música.
    if (isSovereignArtist && !musicAllowed) return false;

    // `ALL` = búsqueda general: se muestra todo el catálogo restante.
    if (category === 'ALL') return true;

    // Categoría concreta: solo las casillas de esa categoría.
    return service.category === category;
  });
}

/** Identificadores canónicos del solista de la casa (Paciente Cero). */
const SOVEREIGN_ARTIST_PROVIDER_IDS: ReadonlySet<string> = new Set(['edwin-agudelo-solista']);


const DEFAULT_COLLECTIVE_SERVICES: EventServicePill[] = [
  {
    id: 'finca-ezkertza-berria',
    category: 'finca',
    title: 'Finca & Caserío Vasco Señorial',
    providerName: 'Restaurante Ezkertza Berria (Derio)',
    description: '1 Solo Evento al Día · 200 pax en banquete, jardines ceremoniales y parking 150 plazas.',
    icon: Building2,
    priceEur: 1200,
    horquilla: '1.000 € - 2.500 €',
    badge: '1 Boda / Día',
    popular: true,
  },
  {
    id: 'edwin-agudelo-solista',
    category: 'artista',
    title: 'Edwin Agudelo · Tenor Solista S-Class',
    providerName: 'Edwin Agudelo (Tenor)',
    description: `Voz lírica en directo para ceremonia y cóctel de gala. Calibración < 75 dB SPL. ${KM_INCLUIDOS} km incluidos.`,
    icon: Mic2,
    priceEur: TARIFA_SOLISTA_EUR,
    horquilla: `${TARIFA_SOLISTA_EUR.toFixed(2).replace('.', ',')} € Tarifa estándar`,
    badge: 'Solista de la Casa',
    popular: true,
  },
  {
    id: 'arsenal-sonido-bose',
    category: 'sonido_audiovisual',
    title: 'Arsenal Técnico · Sonorización Bose F1',
    providerName: 'EAR Audiovisual Hub',
    description: 'Hardware line array 12 W/pax, microfonía Shure inalámbrica y limitador telemático Ley 37/2003.',
    icon: Speaker,
    priceEur: 450,
    horquilla: '350 € - 750 €',
    badge: 'Ley de Ruido OK',
    popular: true,
  },
  {
    id: 'catering-brasa-eduardo',
    category: 'catering_gastronomia',
    title: 'Gastronomía & Brasa de Encina',
    providerName: 'Eduardo Martínez Asador',
    description: 'Menú nupcial al carbón: rodaballo salvaje, chuleta madurada y cóctel de bienvenida.',
    icon: UtensilsCrossed,
    priceEur: 2400,
    horquilla: '100 € - 173 € / pax',
    badge: 'Carbón al Minuto',
    popular: true,
  },
  {
    id: 'coordinador-boda-360',
    category: 'coordinador_boda',
    title: 'Coordinador de Boda & Protocolo 360',
    providerName: 'Conserjería Nupcial EAR',
    description: 'Gestión in situ de proveedores, timing de novios, entrada civil y resolución de imprevistos.',
    icon: Sparkles,
    priceEur: 490,
    horquilla: '400 € - 800 €',
    badge: 'Cero Estrés',
    popular: true,
  },
  {
    id: 'decoracion-floral-arco',
    category: 'flores_decoracion',
    title: 'Arte Floral & Pérgola Civil',
    providerName: 'Floristería Asociada',
    description: 'Arco nupcial personalizado, prendidos, centros de mesa de gala y ramo de novia.',
    icon: Flower2,
    priceEur: 650,
    horquilla: '500 € - 1.200 €',
    badge: 'Flor Fresca',
  },
  {
    id: 'autobus-transporte-invitados',
    category: 'autobus_transporte',
    title: 'Autobús para Invitados (55 Plazas)',
    providerName: 'Flota Regional Homologada',
    description: 'Ruta ida y vuelta desde ciudad hasta la finca. Conductores profesionales con espera de fiesta.',
    icon: Bus,
    priceEur: 520,
    horquilla: '450 € - 700 €',
    badge: 'Retorno Seguro',
    popular: true,
  },
  {
    id: 'coche-nupcial-clasico',
    category: 'coche_nupcial',
    title: 'Coche Clásico Nupcial con Chófer',
    providerName: 'Carros Señoriales VIP',
    description: 'Salida desde casa de los novios, llegada a la iglesia/ceremonia y traslado fotográfico.',
    icon: Car,
    priceEur: 380,
    horquilla: '300 € - 600 €',
    badge: 'Chófer Uniformado',
  },
  {
    id: 'fotografia-video-cinematic',
    category: 'fotografia_video',
    title: 'Reportaje Foto & Cine Nupcial 4K',
    providerName: 'Estudio Audiovisual Asociado',
    description: 'Cobertura día completo (preparativos hasta baile), entrega en galería nube y tráiler en 10 días.',
    icon: Camera,
    priceEur: 1450,
    horquilla: '1.200 € - 2.500 €',
    badge: 'Entrega 4K',
  },
  {
    id: 'plataforma-360-video',
    category: 'animacion_360',
    title: 'Plataforma Giratoria 360 & Efectos',
    providerName: 'ShowTech Animación',
    description: 'Vídeos slow-motion instantáneos por código QR para los invitados con atrezo premium.',
    icon: Video,
    priceEur: 390,
    horquilla: '350 € - 550 €',
    badge: 'Furor en Fiesta',
  },
];

const CATEGORY_DEFAULT_ICONS: Record<EventServiceCategory, React.ComponentType<{ className?: string }>> = {
  finca: Building2,
  artista: Mic2,
  sonido_audiovisual: Speaker,
  catering_gastronomia: UtensilsCrossed,
  coordinador_boda: Sparkles,
  flores_decoracion: Flower2,
  autobus_transporte: Bus,
  coche_nupcial: Car,
  fotografia_video: Camera,
  animacion_360: Video,
  vimume: Sparkles,
  evento: Building2,
};

interface SovereignCollectiveEventBuilderProps {
  customServices?: EventServicePill[];
  title?: string;
  subtitle?: string;
  venueName?: string;
  /**
   * Categoría de servicio seleccionada por el cliente. Es el interruptor del
   * aislamiento: si NO es música, Edwin Agudelo nunca se renderiza.
   * `undefined`/`'ALL'` deja el catálogo completo como escaparate.
   */
  activeCategory?: EventServiceCategory | 'ALL' | null;
}

export function SovereignCollectiveEventBuilder({
  customServices,
  title = 'Configura el Banquete Perfecto sin Fuga de Tiempo',
  subtitle = 'Selecciona las necesidades de tu celebración. EAR OS calcula la horquilla real, suma los proveedores en un solo expediente y bloquea la fecha con un único depósito Stripe deducible.',
  venueName,
  activeCategory = null,
}: SovereignCollectiveEventBuilderProps) {
  const { items, addItem, removeItem, setIsOpen, subtotalEur, fianzaStripeEur, totalProvidersCount } = useCart();
  const catalog = customServices && customServices.length > 0 ? customServices : DEFAULT_COLLECTIVE_SERVICES;

  // AISLAMIENTO DE ESTADO: el catálogo visible se deriva de la categoría.
  // Ningún artista se precarga por defecto: si la categoría no es música,
  // la casilla de Edwin Agudelo no existe en el DOM.
  const services = selectVisibleServices(catalog, activeCategory);

  // Alcance declarado del expediente (finca/espacio anfitrión, si lo hay).
  const scopeLabel = venueName ? `Expediente vinculado a ${venueName}` : 'Expediente multi-proveedor';

  const isSelected = (id: string) => items.some((i) => i.id === id);

  const toggleService = (service: EventServicePill) => {
    if (isSelected(service.id)) {
      removeItem(service.id);
    } else {
      addItem({
        id: service.id,
        name: service.title,
        category: service.category,
        providerName: service.providerName,
        unitPriceEur: service.priceEur,
        description: service.description,
        badge: service.badge,
        metadata: { aforo: 150 },
      });
    }
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 sm:p-10 backdrop-blur-2xl my-12 space-y-8 font-sans shadow-2xl">
      {/* Cabecera Dinámica del Constructor Colectivo */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#ecb613]" />
            <span>ARQUITECTURA DE EVENTO MULTI-PROVEEDOR · {services.length} CASILLAS INTELIGENTES</span>
          </div>
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{scopeLabel}</p>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl font-sans">
            {subtitle}
          </p>
        </div>

        {/* Resumen flotante de selección colectiva */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-[#ecb613]/30 flex items-center gap-4 shrink-0">
          <div>
            <div className="text-[10px] font-mono text-zinc-400 uppercase">Proveedores Coordinados</div>
            <div className="text-xl font-bold font-mono text-white">
              {totalProvidersCount} / {services.length} Servicios
            </div>
            <div className="text-xs font-mono text-[#ecb613] font-bold">
              Subtotal: {subtotalEur.toLocaleString('es-ES')} €
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#ecb613] text-zinc-950 font-bold text-xs font-mono uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
          >
            Ver Bolsa ({items.length})
          </button>
        </div>
      </div>

      {/* Grid Dinámico y Adaptable de Casillas de Selección de Servicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => {
          const Icon = service.icon || CATEGORY_DEFAULT_ICONS[service.category] || Sparkles;
          const active = isSelected(service.id);

          return (
            <div
              key={service.id}
              onClick={() => toggleService(service)}
              className={`relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-4 select-none ${
                active
                  ? 'bg-amber-950/20 border-[#ecb613] shadow-lg shadow-[#ecb613]/10 scale-[1.01]'
                  : 'bg-zinc-900/60 border-white/5 hover:border-white/20 hover:bg-zinc-900/90'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      active
                        ? 'bg-[#ecb613] text-zinc-950 font-bold'
                        : 'bg-white/5 text-zinc-400 border border-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex items-center gap-2">
                    {service.badge && (
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/5 text-zinc-300 border border-white/10">
                        {service.badge}
                      </span>
                    )}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                        active
                          ? 'bg-[#ecb613] border-[#ecb613] text-zinc-950'
                          : 'border-white/20 text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white font-display">{service.title}</h3>
                  <div className="text-[11px] font-mono text-[#ecb613] mt-0.5">{service.providerName}</div>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-sans">{service.description}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-zinc-500 text-[10px] block">Horquilla Estimada</span>
                  <span className="text-zinc-200 font-bold">{service.horquilla}</span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-500 text-[10px] block">En Pack</span>
                  <span className="text-[#ecb613] font-extrabold">{service.priceEur.toLocaleString('es-ES')} €</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dock de Cierre de Expediente Colectivo */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-zinc-900 via-[#141209] to-zinc-900 border border-[#ecb613]/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-mono text-[#ecb613]">
            <ShieldCheck className="w-4 h-4" />
            <span>UN SOLO CONTRATO · EXPEDIENTE CENTRALIZADO</span>
          </div>
          <h4 className="text-lg font-bold text-white">
            {items.length} Servicios Seleccionados · Reserva de {fianzaStripeEur.toFixed(2)} €
          </h4>
          <p className="text-xs text-zinc-400">
            No tienes que pagar fianzas sueltas a múltiples empresas. La reserva de {fianzaStripeEur.toFixed(2)} € sella la fecha de forma simultánea (deducible del importe final).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="px-6 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs font-bold transition-all border border-white/10"
          >
            Revisar Presupuesto Colectivo
          </button>
          <a
            href="/checkout"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#ecb613] hover:bg-amber-400 text-zinc-950 font-mono text-xs font-extrabold uppercase tracking-wider transition-all shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95"
          >
            <span>Bloquear Fecha VIP ({DEPOSITO_STRIPE_EUR} €)</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
