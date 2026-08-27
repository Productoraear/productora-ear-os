"use client";

import React from 'react';
import { 
  Cake, Heart, Sparkles, Users, Award, Video, 
  CheckCircle2, ArrowRight, ShieldCheck, Clock, Crown, Phone, MessageCircle, Gift, Star
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';

interface HistoricalService {
  id: string;
  title: string;
  badge: string;
  priceTag: string;
  icon: React.ReactNode;
  subtitle: string;
  description: string;
  highlights: string[];
  repertoire: string;
  quoteSlug: string;
}

const HISTORICAL_SERVICES: HistoricalService[] = [
  {
    id: 'cumpleanos',
    title: 'Mariachis para Cumpleaños',
    badge: 'Sorpresa Emocional',
    priceTag: 'Desde 350 € · Solista / 750 € Quinteto',
    icon: <Cake className="text-[#ecb613]" size={28} />,
    subtitle: 'Impacto directo en ventana, balcón, restaurante o salón',
    description: 'La sorpresa definitiva para celebrar la vida. Llegada milimétricamente cronometrada para irrumpir cantando "Las Mañanitas" en el instante exacto. Ramo de flores o sombrero charro disponible con bono.',
    highlights: [
      'Entrada sorpresa coordinada en secreto',
      'Las Mañanitas, El Rey, Cielito Lindo y dedicatoria emotiva',
      'Sesión de fotos de recuerdo con trajes charros de gran gala',
      'Sonorización Bose HiFi incluida (cero distorsión acústica)'
    ],
    repertoire: 'Las Mañanitas, En Tu Día, El Rey, Felicidades, Cielito Lindo',
    quoteSlug: 'cumpleanos'
  },
  {
    id: 'bodas',
    title: 'Regalo de Boda & Compromiso',
    badge: 'Máxima Distinción',
    priceTag: 'Desde 350 € · Solista / 750 € Quinteto 5M',
    icon: <Heart className="text-[#ecb613]" size={28} />,
    subtitle: 'La serenata inolvidable para la ceremonia o el cóctel',
    description: 'Un regalo de alta etiqueta para los novios. Irrupción mágica tras el "Sí, quiero", apertura del cóctel en jardines o explosión de alegría en la barra libre.',
    highlights: [
      'Repertorio lírico romántico de autor con voz de tenor',
      'Sonorización invisible Bose F1 sin cables a la vista',
      'Coordinación total con wedding planners y fincas',
      'Seguro de Responsabilidad Civil de 300.000 € incluido'
    ],
    repertoire: 'Si Nos Dejan, Motivos, Sabes Una Cosa, Bésame Mucho, Volver Volver',
    quoteSlug: 'bodas'
  },
  {
    id: 'cancion-video-personalizado',
    title: 'Canción & Vídeo Dedicatoria 4K',
    badge: 'Exclusivo Estudio de Grabación',
    priceTag: '150 € (O GRATIS con Cupón EDWIN150)',
    icon: <Video className="text-[#ecb613]" size={28} />,
    subtitle: 'Composición inédita con la historia y nombres del homenajeado',
    description: 'Un regalo eterno. Edwin Agudelo compone e interpreta en estudio profesional una canción personalizada con las anécdotas, nombres y fechas de tu ser querido, entregada en vídeo 4K de alta definición.',
    highlights: [
      'Letra inédita y arreglos orquestales a medida en estudio',
      'Vídeo dedicatoria cinematográfica 4K con fotos familiares',
      'Entrega digital exprés por enlace privado o proyección en vivo',
      '100% bonificable con el cupón EDWIN150-COMPLEMENTOS'
    ],
    repertoire: 'Canción Inédita Personalizada o Clásicos con Dedicatoria',
    quoteSlug: 'cancion-personalizada'
  },
  {
    id: 'madre-padre',
    title: 'Día de la Madre y del Padre',
    badge: 'Gratitud Familiar',
    priceTag: 'Desde 350 € · Incluye Ramo Floral con Cupón',
    icon: <Users className="text-[#ecb613]" size={28} />,
    subtitle: 'El abrazo musical que agradece toda una vida',
    description: 'Homenaje de profunda emoción para padres y abuelos. Canciones que tocan la fibra más íntima y celebran el esfuerzo de toda una familia reunida en torno a la música tradicional.',
    highlights: [
      'Interpretación estelar de "Algún Día Mamá" por Edwin Agudelo',
      'Repertorio nostálgico de la época dorada mexicana',
      'Ambiente entrañable y cercano para todas las edades',
      'Adaptable a domicilios, jardines, residencias o restaurantes'
    ],
    repertoire: 'Amor Eterno, Mi Querido Viejo, Algún Día Mamá, Madrecita Querida',
    quoteSlug: 'dia-de-la-madre'
  },
  {
    id: 'caballo',
    title: 'Show Cantando a Caballo',
    badge: 'Espectáculo Ecuestre Único',
    priceTag: 'Consultar Fechas y Finca',
    icon: <Award className="text-[#ecb613]" size={28} />,
    subtitle: 'Fusión de alta escuela ecuestre y mariachi de gala',
    description: 'Un espectáculo único en Europa. Edwin Agudelo fusiona la doma clásica con el mariachi imperial a lomos de caballos de pura raza española y aztecas.',
    highlights: [
      'Paso español, piaffé y reverencia al compás de la trompeta',
      'Montura charra artesanal y traje de gran gala bordado',
      'Sonorización inalámbrica Shure Axient anti-viento',
      'Ideal para plazas de toros, fincas y festejos patronales'
    ],
    repertoire: 'El Patas Blancas, Caballo Prieto Azabache, La Mula Bronca, El Rey',
    quoteSlug: 'show-caballo'
  },
  {
    id: 'quince-anos',
    title: 'Quinceañeras & Aniversarios de Oro',
    badge: 'Rito de Gala Tradicional',
    priceTag: 'Desde 350 € · Solista / 750 € Quinteto',
    icon: <Sparkles className="text-[#ecb613]" size={28} />,
    subtitle: 'El protocolo solemne y emotivo para fechas históricas',
    description: 'El homenaje más solemne y alegre para celebrar los 15 años o los 50 años de matrimonio. Entrada triunfal con el vals tradicional y entrega de recuerdos.',
    highlights: [
      'Vals de gala con el padre y padrinos en directo',
      'Serenata de entrega de ramo y sombrero charro',
      'Formación de etiqueta con botonadura de plata',
      'Show bailable para encender la fiesta con los invitados'
    ],
    repertoire: 'Quince Primaveras, De Niña a Mujer, Mi Niña Bonita, Danzón N° 2',
    quoteSlug: 'quince-anos'
  },
  {
    id: 'serenata-virtual',
    title: 'Serenata Virtual & Streaming HD',
    badge: 'Conexión Sin Fronteras',
    priceTag: 'Desde 120 € · En Directo 100% Interactivo',
    icon: <Video className="text-[#ecb613]" size={28} />,
    subtitle: 'Videollamada en directo con el homenajeado en cualquier parte del mundo',
    description: 'Un detalle especial para la persona que quieres, amas y admiras desde cualquier rincón del planeta. Edwin Agudelo conecta en directo vía Zoom, Meet o WhatsApp interpretando las canciones más emotivas con dedicatoria personalizada.',
    highlights: [
      'Conexión privada en alta fidelidad de audio y vídeo HD',
      'Interpretación de 3 a 5 canciones con dedicatoria personalizada',
      'Participación de familiares conectados desde diferentes países',
      'Grabación íntegra de la sesión en MP4 para recuerdo eterno'
    ],
    repertoire: 'Las Mañanitas, Cielito Lindo, Si Nos Dejan, Motivos, El Rey',
    quoteSlug: 'serenata-virtual'
  },
  {
    id: 'cancion-personalizada',
    title: 'Canción Inédita Personalizada',
    badge: 'Obra de Autor Registrada',
    priceTag: '150 € · Grabación en Estudio',
    icon: <Heart className="text-[#ecb613]" size={28} />,
    subtitle: 'Composición musical exclusiva con los nombres y anécdotas de tu historia',
    description: 'Un regalo diferente y exclusivo que llega directo al corazón. Edwin Agudelo escribe e interpreta una canción única basada en vuestra historia de amor, gratitud o superación, grabada profesionalmente con arreglos de conservatorio.',
    highlights: [
      'Entrevista previa para capturar anécdotas, nombres y fechas clave',
      'Composición y producción en estudio con masterización profesional',
      'Entrega de audio WAV/MP3 de alta resolución y letra en pergamino digital',
      '100% canjeable como complemento en eventos presenciales'
    ],
    repertoire: 'Composición Original a Medida · Arreglos de Tenor y Cuerdas',
    quoteSlug: 'cancion-personalizada'
  }
];

const VALUE_PROPOSITIONS = [
  {
    icon: <Heart size={20} className="text-[#ecb613]" />,
    title: 'Empatía y Repertorio a Medida',
    desc: 'Cada homenaje es único. Acordamos contigo el orden de los temas y los momentos clave para asegurar lágrimas de emoción y diversión.'
  },
  {
    icon: <Clock size={20} className="text-[#ecb613]" />,
    title: 'Exclusividad en la Fecha (Sin Prisas)',
    desc: 'No solapamos actuaciones a contrarreloj. Bloqueamos el tiempo necesario para que tu evento disfrute de toda la atención que merece.'
  },
  {
    icon: <ShieldCheck size={20} className="text-[#ecb613]" />,
    title: 'Garantía 0 Fallos & Trajes de Gala',
    desc: 'Botonaduras de plata auténticas, músicos de conservatorio y sonido Bose HiFi 12 W/pax. La opción mejor valorada de España (4.9★).'
  }
];

const COMPETITOR_COMPARISON = [
  {
    feature: 'Formato Mínimo Mariachi Completo',
    edwin: '5 Músicos de Conservatorio Garantizados (750 €)',
    others: 'Envían 2 o 3 aficionados sin trompeta'
  },
  {
    feature: 'Transparencia de Tarifas',
    edwin: 'Tarifas Públicas Cerradas (Solista 350 € / Quinteto 750 €)',
    others: 'Precios ocultos que inflan al llegar al evento'
  },
  {
    feature: 'Canción Inédita & Vídeo 4K de Regalo',
    edwin: 'Sí (Bono 150 € con cupón EDWIN150)',
    others: 'No disponible / Cobran extras abusivos'
  },
  {
    feature: 'Sonorización Profesional',
    edwin: 'Bose HiFi / Line Array 12 W/pax + Micros Shure',
    others: 'Altavoces portátiles a batería con distorsión'
  },
  {
    feature: 'Seguro de Responsabilidad Civil',
    edwin: 'Cobertura oficial de 300.000 € para fincas y salas',
    others: 'Sin seguro legal para eventos'
  }
];

export const EdwinServicesGrid: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-[#050505] relative overflow-hidden">
      {/* Glow ambiental */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-[#ecb613]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        
        {/* CABECERA */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#ecb613]/30 bg-[#ecb613]/10 text-[#ecb613] text-[9px] font-black uppercase tracking-[0.4em]">
            <Crown size={14} /> La Opción Nº 1 Más Recomendada en Google
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white font-syne">
            Servicios Exclusivos de <span className="text-[#ecb613]">Edwin Agudelo</span>
          </h2>
          <p className="text-white/60 text-sm md:text-base leading-relaxed">
            Desde canciones personalizadas en estudio y serenatas íntimas hasta espectáculos ecuestres a caballo. Dos décadas de trayectoria intachable en España y Europa.
          </p>
        </div>

        {/* PILARES DE VALOR ÉTICO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VALUE_PROPOSITIONS.map((val, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-3xl bg-[#09090d] border border-white/5 space-y-3 relative overflow-hidden group hover:border-[#ecb613]/30 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                {val.icon}
              </div>
              <h4 className="text-sm font-black uppercase tracking-tight text-white font-syne">
                {val.title}
              </h4>
              <p className="text-xs text-white/50 leading-relaxed">
                {val.desc}
              </p>
            </div>
          ))}
        </div>

        {/* GRID DE LOS 6 SERVICIOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {HISTORICAL_SERVICES.map((srv) => (
            <div
              key={srv.id}
              className="rounded-[2.5rem] bg-[#09090d] border border-white/10 p-8 flex flex-col justify-between hover:border-[#ecb613]/40 transition-all duration-300 group hover:shadow-[0_15px_50px_rgba(236,182,19,0.1)] relative overflow-hidden"
            >
              {/* Resplandor hover */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#ecb613]/10 blur-[80px] rounded-full group-hover:opacity-100 opacity-0 transition-opacity" />

              <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {srv.icon}
                  </div>
                  <span className="text-[8px] font-mono font-black uppercase tracking-widest text-[#ecb613] bg-[#ecb613]/10 border border-[#ecb613]/20 px-3 py-1 rounded-full">
                    {srv.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white font-syne">
                    {srv.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase text-[#ecb613] font-bold">
                      {srv.priceTag}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono uppercase text-white/40 font-bold">
                    {srv.subtitle}
                  </p>
                </div>

                <p className="text-white/60 text-xs leading-relaxed">
                  {srv.description}
                </p>

                {/* Highlights */}
                <div className="space-y-2 pt-4 border-t border-white/5">
                  {srv.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-[11px] text-white/70">
                      <CheckCircle2 size={13} className="text-[#ecb613] shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* Repertorio clave */}
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[8px] font-mono uppercase text-white/40 block font-bold">Repertorio & Estilo</span>
                  <span className="text-[10px] text-[#ecb613] font-mono italic block">{srv.repertoire}</span>
                </div>
              </div>

              {/* Botones de Conversión Rápida (Llamada + WhatsApp) */}
              <div className="pt-6 mt-6 border-t border-white/5 space-y-2 relative z-10">
                <a
                  href={`https://wa.me/34693693048?text=Hola%20Edwin,%20deseo%20reservar%20${encodeURIComponent(srv.title)}%20y%20aplicar%20el%20bono%20de%20150€%20EDWIN150-COMPLEMENTOS`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-95 shadow-[0_4px_15px_rgba(37,211,102,0.2)]"
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp Inmediato</span>
                </a>

                <a
                  href={CENTRALITA.tel}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-[#ecb613] hover:text-black hover:border-[#ecb613] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Phone size={13} />
                  <span>Llamar al +34 693 693 048</span>
                </a>
              </div>

            </div>
          ))}
        </div>

        {/* TABLA COMPARATIVA GOOGLE TOP 10 (POR QUÉ SOMOS LA OPCIÓN Nº 1) */}
        <div className="p-8 md:p-12 rounded-[2.5rem] bg-[#09090d] border border-[#ecb613]/20 space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 text-[#ecb613] text-xs font-mono font-bold uppercase tracking-widest">
              <Star size={14} className="fill-[#ecb613]" /> Comparativa de Calidad Real en Google España
            </div>
            <h3 className="text-2xl md:text-4xl font-black uppercase text-white font-syne">
              ¿Por qué Edwin Agudelo es la <span className="text-[#ecb613]">Elección Segura</span>?
            </h3>
            <p className="text-white/60 text-xs md:text-sm">
              Frente a ofertas dudosas de internet, blindamos cada contratación con contrato legal, trajes charros auténticos y puntualidad matemática.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-white/50 font-mono uppercase text-[10px]">
                  <th className="py-4 px-4">Garantía de Servicio</th>
                  <th className="py-4 px-4 text-[#ecb613] font-bold">👑 Edwin Agudelo / Productora EAR</th>
                  <th className="py-4 px-4 text-white/40">Otros Mariachis en Internet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {COMPETITOR_COMPARISON.map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 font-bold text-white font-syne">{row.feature}</td>
                    <td className="py-4 px-4 text-emerald-400 font-medium">{row.edwin}</td>
                    <td className="py-4 px-4 text-white/40 italic">{row.others}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CTA FINAL DE LLAMADA INMEDIATA */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs text-white/80 font-mono">
                Línea Directa Abierta: <strong>+34 693 693 048</strong> • Reserva tu fecha antes de que se agote.
              </span>
            </div>
            <a
              href="tel:+34693693048"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#ecb613] to-[#d4a010] text-black font-black text-xs uppercase tracking-wider hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_4px_20px_rgba(236,182,19,0.3)]"
            >
              <Phone size={15} />
              <span>Llamar Directamente a Edwin</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
