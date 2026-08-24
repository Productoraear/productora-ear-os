'use client';

import React, { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, ShieldCheck, Lock, CreditCard, Calendar, 
  MapPin, CheckCircle2, PhoneCall, Loader2, ArrowRight, 
  Award, Clock, Zap, FileText, ChevronRight
} from 'lucide-react';
import { createVipChauffeurCheckout } from '@/app/actions/vipCheckoutActions';

interface LaserTunnelFunnelProps {
  vertical: string;
  intentSlug: string;
  basePrice: number;
}

interface TierPack {
  id: string;
  name: string;
  subtitle: string;
  badge?: string;
  price: number;
  deposit10: number;
  deposit30: number;
  features: string[];
  recommended?: boolean;
}

export default function LaserTunnelFunnel({ vertical, intentSlug, basePrice }: LaserTunnelFunnelProps) {
  const [selectedTier, setSelectedTier] = useState<string>('gold');
  const [eventDate, setEventDate] = useState<string>('');
  const [city, setCity] = useState<string>('Madrid');
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Generador dinámico de los 3 Packs S-Class según INTENT y vertical
  const packs: TierPack[] = React.useMemo(() => {
    const formattedTitle = intentSlug.replace(/-/g, ' ');
    const slug = (intentSlug || '').toLowerCase();

    // 1. Chófer VIP / Vehículos Nupciales / Mercedes
    if (slug.includes('coche') || slug.includes('chofer') || slug.includes('mercedes') || slug.includes('transporte-vip')) {
      return [
        {
          id: 'bronze',
          name: 'Mercedes Clase E Executive',
          subtitle: 'Traslado Directo Punto a Punto con Chófer',
          price: 180,
          deposit10: 10,
          deposit30: 54,
          features: [
            'Mercedes-Benz Clase E de alta representación',
            'Chófer uniformado con protocolo de apertura',
            'Agua mineral, toallitas y Wi-Fi 5G',
            'Margen de espera de 20 minutos incluido',
            'Garantía Price-Lock 72 horas'
          ]
        },
        {
          id: 'gold',
          name: 'Mercedes Clase S / Maybach Nupcial',
          subtitle: 'Servicio de Boda 4h (Recogida + Ceremonia + Finca)',
          badge: 'MÁS ELEGIDO',
          recommended: true,
          price: 450,
          deposit10: 10,
          deposit30: 135,
          features: [
            'Mercedes Clase S Limousine / Maybach nupcial',
            'Chófer de gala con traje oscuro y guantes',
            'Botella de champán frío para los recién casados',
            'Hasta 4 horas de servicio y 100 km en Madrid',
            'Coordinación con fotógrafo y wedding planner'
          ]
        },
        {
          id: 'platinum',
          name: 'Mercedes Clase V VIP 8h Disposición',
          subtitle: 'Jornada Completa 7 Plazas (Directivos / Giras)',
          badge: 'MÁXIMO ESPACIO',
          price: 850,
          deposit10: 10,
          deposit30: 255,
          features: [
            'Mercedes Clase V Extra Larga (7 Plazas VIP)',
            'Configuración salón vis-à-vis con tomas 230V',
            'Hasta 8 horas de disposición continua',
            'Conductor bilingüe para delegaciones internacionales',
            'Seguro de transporte de pasajeros ampliado'
          ]
        }
      ];
    }

    // 2. Pantallas LED
    if (slug.includes('pantalla') || slug.includes('led')) {
      return [
        {
          id: 'bronze',
          name: 'Tótem LED 4K 65-85"',
          subtitle: 'Punto de Información o Photocall Digital',
          price: 450,
          deposit10: 10,
          deposit30: 135,
          features: [
            'Tótem de diseño vertical ultraplano 4K',
            'Reproductor multimedia USB/HDMI integrado',
            'Transporte y montaje en Madrid incluido',
            'Garantía Price-Lock 72 horas'
          ]
        },
        {
          id: 'gold',
          name: 'Muro LED Interior P2.6 (3x2m)',
          subtitle: 'Escenario, Keynotes y Convenciones',
          badge: 'MÁS ELEGIDO',
          recommended: true,
          price: 1450,
          deposit10: 10,
          deposit30: 435,
          features: [
            'Muro LED P2.6 alta definición (1.000 nits)',
            'Procesador Novastar VX con escalador 4K',
            'Estructura truss autoestable certificada',
            'Técnico operador de vídeo in-situ',
            'Entradas HDMI/SDI redundantes'
          ]
        },
        {
          id: 'platinum',
          name: 'Pantalla Gigante Exterior P3.9 (5x3m)',
          subtitle: 'Festivales, Plazas y Eventos Masivos',
          badge: 'ALTO BRILLO',
          price: 2800,
          deposit10: 10,
          deposit30: 840,
          features: [
            'Cabinets IP65 (>4.500 nits) visibles bajo sol directo',
            'Estructura ground-stack con cálculo de viento',
            'Realización multicámara y streaming en directo',
            'Equipo técnico completo de montaje y emisión'
          ]
        }
      ];
    }

    // 3. Alumbrado Navideño / Luces LCSP
    if (slug.includes('navid') || slug.includes('alumbrado') || slug.includes('luces')) {
      return [
        {
          id: 'bronze',
          name: 'Ambientación Micro-LED Fincas',
          subtitle: 'Cortinas Lumínicas y Arbolado IP67',
          price: 850,
          deposit10: 10,
          deposit30: 255,
          features: [
            'Guirnaldas y cortinas de micro-LED IP67',
            'Montaje profesional con cuadros estancos',
            'Bajo consumo energético A++',
            'Garantía Price-Lock 72 horas'
          ]
        },
        {
          id: 'gold',
          name: 'Proyecto Iluminación 3D Twinkly Pro',
          subtitle: 'Árbol 3D Gigante + Show de Luces Interactivo',
          badge: 'ALTA VISIBILIDAD',
          recommended: true,
          price: 2900,
          deposit10: 10,
          deposit30: 870,
          features: [
            'Árbol cónico 3D o photocall monumental transitable',
            'Animaciones personalizadas con logo o colores de marca',
            'Montaje nocturno sin interferencia comercial',
            'Mantenimiento técnico durante la campaña'
          ]
        },
        {
          id: 'platinum',
          name: 'Licitación Monumental LCSP',
          subtitle: 'Alumbrado Integral de Calles y Plazas (<15k€)',
          badge: 'B2G COMPLIANCE',
          price: 7500,
          deposit10: 10,
          deposit30: 2250,
          features: [
            'Arcos de calle + motivos de farolas + Árbol 10.6m',
            'Memoria técnica visada y seguro RC 600.000 €',
            'Montaje con elevadores homologados y retirada tras Reyes',
            'Factura electrónica en formato FACe'
          ]
        }
      ];
    }

    // 4. VIMUME / Musicoterapia
    if (vertical === 'vimume' || slug.includes('musicoterapia') || slug.includes('envejecimiento')) {
      return [
        {
          id: 'bronze',
          name: 'Sesión Piloto Diagnóstica',
          subtitle: 'Evaluación de Respuesta Neurocognitiva (45 min)',
          price: 290,
          deposit10: 10,
          deposit30: 87,
          features: [
            'Músicoterapeuta acreditado en directo',
            'Cancionero biográfico adaptado a los residentes',
            'Monitores HiFi con volumen regulado (<75 dB)',
            'Informe inicial de impacto emocional'
          ]
        },
        {
          id: 'gold',
          name: 'Ciclo Mensual VIMUME (4 Sesiones)',
          subtitle: 'Programa de Mantenimiento y Estimulación Continua',
          badge: 'RECOMENDADO CENTROS',
          recommended: true,
          price: 990,
          deposit10: 10,
          deposit30: 297,
          features: [
            '4 Sesiones semanales de estimulación evocativa',
            'Telemetría de respuesta afectiva y sociabilidad',
            'Informe evolutivo mensual para el equipo médico',
            'Certificado de buenas prácticas VIMUME'
          ]
        },
        {
          id: 'platinum',
          name: 'Programa Institucional Senior Anual',
          subtitle: 'Implementación Clínica Integral y Conciertos Familiares',
          badge: 'IMPACTO CLÍNICO',
          price: 2400,
          deposit10: 10,
          deposit30: 720,
          features: [
            'Ciclo intensivo trimestral + Concierto intergeneracional',
            'Formación en estimulación musical al personal auxiliar',
            'Estudio de impacto clínico avalado por el comité VIMUME'
          ]
        }
      ];
    }

    // 5. Default Bodas / Música en Directo / Fiestas Privadas y Ocasiones Emocionales
    if (vertical === 'bodas' || slug.includes('mariachi') || slug.includes('serenata') || slug.includes('musica') || slug.includes('directo')) {
      return [
        {
          id: 'bronze',
          name: 'Solista Premium S-Class · Edwin Agudelo',
          subtitle: 'Cumpleaños, Fiestas Privadas, Día de la Madre/Padre & San Valentín',
          badge: 'SERVICIO DESTACADO EMOCIONAL',
          price: 350,
          deposit10: 10,
          deposit30: 105,
          features: [
            'Edwin Agudelo Solista (Voz Principal y Guitarra de Gala)',
            'Sonorización Bose S1 Pro / dB Technologies (12 W/pax)',
            'Repertorio personalizado: Serenatas, Boleros, Rancheras y Pop Latino',
            'Dedicatoria emotiva especial (Día Madre/Padre, Cumpleaños, San Valentín)',
            'Microfonía inalámbrica Shure Beta 87A',
            'Garantía Price-Lock 72h y 0 Fallos'
          ]
        },
        {
          id: 'gold',
          name: 'Quinteto de Gala S-Class (Mínimo 5 Músicos)',
          subtitle: 'Formato Oficial Mínimo de Grupo para Bodas, Fiestas Patronales y Galas',
          badge: 'MÍNIMO 5 MÚSICOS GARANTIZADOS',
          recommended: true,
          price: 750,
          deposit10: 10,
          deposit30: 225,
          features: [
            'Ensamble Oficial de 5 Músicos de Conservatorio',
            'Edwin Agudelo (Voz) + 2 Trompetas + Vihuela + Guitarrón',
            'Trajes Charros de Gran Gala Mexicana / Esmoquin Formal',
            'Sonorización multicanal Bose F1 Model 812 con técnico de audio',
            'Show dinámico interactivo con dedicatorias y pase entre invitados',
            'Seguro de Responsabilidad Civil de 300.000 €'
          ]
        },
        {
          id: 'platinum',
          name: 'Gran Show Orquesta & Mariachi Imperial (7-8 Músicos)',
          subtitle: 'Festivales, Grandes Bodas y Eventos Corporativos Monumentales',
          badge: 'GRAN ESPECTÁCULO',
          price: 1800,
          deposit10: 10,
          deposit30: 540,
          features: [
            'Agrupación completa de 7 a 8 Maestros en directo',
            'Sección completa de cuerdas (Violines), vientos (Trompetas) y ritmo',
            'Montaje de sonido Line Array con microfonía inalámbrica para toda la banda',
            '2 Pases de concierto de gran formato con espectáculo bailable',
            'Coordinación técnica de producción integral'
          ]
        }
      ];
    }

    // 6. Corporativo
    if (vertical === 'corporativo') {
      return [
        {
          id: 'bronze',
          name: 'Corporate Keynote',
          subtitle: 'Atril, Sonorización Vocal y Streaming HD',
          price: basePrice || 500,
          deposit10: 10,
          deposit30: Math.round((basePrice || 500) * 0.3),
          features: [
            'Microfonía Shure Axient Digital (2 Canales)',
            'Consola digital Behringer XR18 y 2 monitores',
            'Técnico de audio presencial durante la ponencia',
            'Factura electrónica con NIF y desglose IVA'
          ]
        },
        {
          id: 'gold',
          name: 'Corporate Summit S-Class',
          subtitle: 'Junta General, Gala Anual o Presentación VIP',
          badge: 'ESTÁNDAR EMPRESA',
          recommended: true,
          price: Math.round((basePrice || 500) * 1.8),
          deposit10: 10,
          deposit30: Math.round((basePrice || 500) * 1.8 * 0.3),
          features: [
            'PA Line Array calibrada con presión 12 W/pax',
            'Pantalla LED P2.9 de alta definición',
            'Línea de retardo acústico y conmutación backup <50ms',
            'SLA de Cero Silencios y Seguro RC 300.000 €'
          ]
        },
        {
          id: 'platinum',
          name: 'Corporate Apex Convention',
          subtitle: 'Convención Multidía & Gala de Entrega de Premios',
          badge: 'BROADCAST 360',
          price: Math.round((basePrice || 500) * 3.5),
          deposit10: 10,
          deposit30: Math.round((basePrice || 500) * 3.5 * 0.3),
          features: [
            'Infraestructura técnica para hasta 1.500 asistentes',
            'Realización multicámara 4K y streaming global',
            'Show musical de cierre con Artistas S-Class',
            'Director técnico y equipo de soporte in-situ'
          ]
        }
      ];
    }

    // Default Fallback
    return [
      {
        id: 'bronze',
        name: 'Pack Básico Garantizado',
        subtitle: `Servicio esencial para ${formattedTitle}`,
        price: basePrice || 350,
        deposit10: 10,
        deposit30: Math.round((basePrice || 350) * 0.3),
        features: [
          'Equipamiento oficial verificado S-Class',
          'Montaje y transporte asegurado',
          'Garantía de precio congelado 72h'
        ]
      },
      {
        id: 'gold',
        name: 'Pack Profesional S-Class',
        subtitle: `Formato recomendado para ${formattedTitle}`,
        badge: 'MÁS POPULAR',
        recommended: true,
        price: Math.round((basePrice || 350) * 1.5),
        deposit10: 10,
        deposit30: Math.round((basePrice || 350) * 1.5 * 0.3),
        features: [
          'Mayor cobertura técnica y asistencia in-situ',
          'Plan B de contingencia técnica sin coste extra',
          'Certificado de cumplimiento y factura oficial'
        ]
      },
      {
        id: 'platinum',
        name: 'Pack Élite Total',
        subtitle: `Máxima potencia y exclusividad para ${formattedTitle}`,
        badge: 'PREMIUM',
        price: Math.round((basePrice || 350) * 2.8),
        deposit10: 10,
        deposit30: Math.round((basePrice || 350) * 2.8 * 0.3),
        features: [
          'Producción técnica integral con stage manager',
          'Atención prioritaria Concierge 24/7',
          'Seguro de cobertura ampliada'
        ]
      }
    ];
  }, [vertical, intentSlug, basePrice]);

  const activePack = packs.find(p => p.id === selectedTier) || packs[1];

  const handleCheckout = (mode: 'LOCK_10EUR' | 'DEPOSIT_30_PERCENT') => {
    setErrorMsg(null);
    startTransition(async () => {
      try {
        const response = await fetch('/api/payments/create-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: mode === 'LOCK_10EUR' ? 10 : activePack.deposit30,
            concept: mode === 'LOCK_10EUR' 
              ? `Price-Lock 72h · ${activePack.name} (${intentSlug.replace(/-/g, ' ')})` 
              : `Depósito Fianza (30%) · ${activePack.name} (${intentSlug.replace(/-/g, ' ')})`,
            metadata: {
              type: 'LASER_TUNNEL_CHECKOUT',
              vertical,
              intentSlug,
              packId: activePack.id,
              packName: activePack.name,
              totalPrice: String(activePack.price),
              depositPaid: String(mode === 'LOCK_10EUR' ? 10 : activePack.deposit30),
              eventDate: eventDate || 'A convenir',
              city: city || 'Madrid',
              providerNif: 'B87910311'
            }
          })
        });

        const data = await response.json();
        if (data?.url) {
          window.location.href = data.url;
        } else {
          throw new Error(data?.details || 'Error generando la pasarela de pago.');
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Error al conectar con la pasarela Stripe.');
      }
    });
  };

  return (
    <section className="w-full max-w-5xl mx-auto my-12 p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#0c0c0c] to-[#050505] border border-[#ecb613]/50 shadow-[0_0_50px_rgba(236,182,19,0.15)] relative overflow-hidden">
      {/* Background Subtle Radial Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#ecb613]/10 blur-[130px] rounded-full pointer-events-none" />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. HEADER TÚNEL LÁSER: ENFOQUE 100% EN CIERRE
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="text-center max-w-2xl mx-auto mb-10 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ecb613]/15 border border-[#ecb613]/40 text-[#ecb613] text-xs font-mono font-bold uppercase tracking-widest mb-3">
          <Zap className="w-3.5 h-3.5 animate-pulse" />
          Túnel de Reserva Rápida S-Class (&lt; 180 Segundos)
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          Selecciona tu Pack y Asegura la Fecha
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400">
          Congela la tarifa y bloquea el equipo técnico con un depósito simbólico de 10 € compensable en factura final.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs">
          {errorMsg}
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. DATOS RÁPIDOS: FECHA Y CIUDAD
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 relative z-10">
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
          <label className="text-xs font-mono text-neutral-300 font-bold uppercase flex items-center gap-1.5 mb-2">
            <Calendar className="w-4 h-4 text-[#ecb613]" /> Fecha del Evento
          </label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ecb613]"
          />
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
          <label className="text-xs font-mono text-neutral-300 font-bold uppercase flex items-center gap-1.5 mb-2">
            <MapPin className="w-4 h-4 text-[#ecb613]" /> Ciudad / Ubicación
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ej. Madrid, Toledo, Barcelona, Finca..."
            className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ecb613]"
          />
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          3. SELECTOR DE PACKS S-CLASS
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 relative z-10">
        {packs.map((pack) => {
          const isSelected = selectedTier === pack.id;
          return (
            <div
              key={pack.id}
              onClick={() => setSelectedTier(pack.id)}
              className={`rounded-3xl p-6 transition-all cursor-pointer flex flex-col justify-between relative border ${
                isSelected
                  ? 'bg-gradient-to-b from-[#18150c] to-[#0d0d0d] border-[#ecb613] shadow-[0_0_30px_rgba(236,182,19,0.25)] ring-2 ring-[#ecb613]'
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20'
              }`}
            >
              {pack.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-[#ecb613] text-black text-[10px] font-black uppercase tracking-wider shadow-md">
                    {pack.badge}
                  </span>
                </div>
              )}

              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-[#ecb613] mb-1 font-bold">
                  {pack.id.toUpperCase()}
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{pack.name}</h3>
                <p className="text-xs text-neutral-400 mb-4">{pack.subtitle}</p>

                <div className="flex items-baseline gap-1.5 mb-6">
                  <span className="text-3xl font-black text-white font-mono">{pack.price} €</span>
                  <span className="text-xs text-neutral-500 font-mono">(Tarifa Oficial)</span>
                </div>

                <div className="space-y-2.5 text-xs text-neutral-300 mb-6">
                  {pack.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#ecb613] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <button
                  type="button"
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#ecb613] text-black shadow-md shadow-[#ecb613]/20'
                      : 'bg-white/5 text-neutral-300 hover:bg-white/10'
                  }`}
                >
                  {isSelected ? 'Pack Seleccionado' : 'Seleccionar Este Pack'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          4. INLINE STRIPE PAYMENT WIDGET (1 CLIC EN LA MISMA PANTALLA)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="p-6 sm:p-8 rounded-3xl bg-black/70 border border-[#ecb613]/40 flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#ecb613] mb-1 font-bold">
            <CreditCard className="w-4 h-4" />
            <span>Pasarela Transaccional Directa Stripe</span>
          </div>
          <h4 className="text-lg font-bold text-white">
            {activePack.name} · {city} {eventDate && `(${eventDate})`}
          </h4>
          <p className="text-xs text-neutral-400 mt-1">
            Total Servicio: <strong className="text-white">{activePack.price} €</strong> · Fianza 30%: <strong className="text-[#ecb613]">{activePack.deposit30} €</strong> · Price-Lock: <strong className="text-[#ecb613]">10 €</strong>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Botón 1: 10 € Price-Lock 72h */}
          <button
            disabled={isPending}
            onClick={() => handleCheckout('LOCK_10EUR')}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-[#ecb613] to-[#d4af37] text-black font-extrabold text-xs sm:text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#ecb613]/25 disabled:opacity-50 font-mono uppercase tracking-wider cursor-pointer"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            Bloquear Fecha (10 € / 72h)
          </button>

          {/* Botón 2: 30% Reserva Garantizada */}
          <button
            disabled={isPending}
            onClick={() => handleCheckout('DEPOSIT_30_PERCENT')}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 border border-white/15 disabled:opacity-50 cursor-pointer"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
            Reserva Formal (30% · {activePack.deposit30} €)
          </button>
        </div>
      </div>

      {/* Trust guarantees bar */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-[11px] text-neutral-400 font-mono relative z-10">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Seguro RC 300.000 € Incluido
        </span>
        <span className="flex items-center gap-1.5">
          <Award className="w-4 h-4 text-[#ecb613]" /> Garantía Mercantil NIF: B87910311
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-blue-400" /> Emisión Inmediata de Certificado WOW
        </span>
      </div>
    </section>
  );
}
