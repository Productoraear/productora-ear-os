import React from 'react';
import {
    Globe2, Landmark, HeartHandshake, Gift, Check,
    MessageCircle, ScrollText, Music
} from 'lucide-react';

/**
 * Imán de Diplomacia Cultural & Hermanamiento Municipal.
 *
 * Empaqueta la tesis del CEO: el mariachi es la imagen emblemática más
 * reconocible de la cultura iberoamericana. Apostar por él desde el sector
 * público (embajadas, ministerios de cultura, ayuntamientos y hermanamientos)
 * produce una inversión altamente visible que combate el estigma con
 * patrimonio vivo — sin marketing vacío.
 *
 * Regla de oro: sin promesas falsas. Solo contratos menores reales (Art. 118
 * LCSP), facturación FACe y el protocolo acústico por contexto del SSOT.
 */

interface AudienceTier {
    id: string;
    icon: React.ReactNode;
    audience: string;
    title: string;
    text: string;
    bullets: string[];
    cta: string;
    waMessage: string;
}

const TIERS: AudienceTier[] = [
    {
        id: 'embajadas',
        icon: <Globe2 size={20} />,
        audience: 'Embajadas · Casas de México · Organismos',
        title: 'Soft Power de Alto Impacto Visual',
        text: 'El mariachi es Patrimonio Cultural Inmaterial de la Humanidad (UNESCO 2011) y la imagen musical más reconocible al instante de Iberoamérica. Una recepción con mariachi de gala genera memoria, fotografía y prensa de forma inmediata.',
        bullets: [
            'Repertorio de gala clásico y contemporáneo',
            'Traje de charro de gran gala con botonadura de plata',
            'Protocolo institucional discreto y puntual',
            'Facturación a organismo público (FACe)',
        ],
        cta: 'Coordinar recepción institucional',
        waMessage: 'Hola, represento a una embajada / organismo cultural y queremos un presupuesto desglosado de mariachi de gala para una recepción institucional.',
    },
    {
        id: 'ministerios',
        icon: <Landmark size={20} />,
        audience: 'Ministerios de Cultura · Gobiernos · Ayuntamientos',
        title: 'Producción Integral en Contrato Menor',
        text: 'Del solo artístico al concierto de feria llave en mano. Todo se contrata bajo la figura legal del contrato menor (Art. 118 LCSP, techo preventivo 14.250 €) con memoria desglosada y factura electrónica FACe.',
        bullets: [
            'Solo artístico: mariachi 6-8 músicos',
            'Concierto de plaza: + PA, luces y técnico',
            'Concierto de feria: + escenario cubierto, line-array y generador',
            'Expediente listo para Intervención (memoria + presupuesto)',
        ],
        cta: 'Pedir presupuesto para mi administración',
        waMessage: 'Hola, llamo de un ayuntamiento / ministerio de cultura. Queremos presupuesto desglosado para fiestas o semana cultural (contrato menor Art. 118 LCSP).',
    },
    {
        id: 'hermanamiento',
        icon: <HeartHandshake size={20} />,
        audience: 'Hermanamiento entre Municipios Iberoamericanos',
        title: 'Regala un Concierto al Municipio Hermano',
        text: 'Un municipio que contrata sus fiestas puede regalar una actuación de mariachi a los mayores de otro municipio hermanado. Es cooperación cultural visible, fácil de presupuestar y de alto retorno reputacional para ambos consistorios.',
        bullets: [
            'Actuación para residencias y hogares del jubilado',
            'Formato senior 65-75 dBA (no invasivo, Ley 37/2003)',
            'Certificado de donación / mecenazgo (Ley 49/2002)',
            'Documentación para el acta de hermanamiento',
        ],
        cta: 'Diseñar hermanamiento cultural',
        waMessage: 'Hola, queremos que un municipio regale un concierto de mariachi a los mayores de otro municipio hermanado. ¿Podéis prepararnos la propuesta?',
    },
    {
        id: 'mayores',
        icon: <Gift size={20} />,
        audience: 'Programa “Viaje Musical por la Memoria” (VIMUME)',
        title: 'Un Concierto Regalado a Nuestros Mayores',
        text: 'La vivencia musical con repertorio biográfico emociona y activa la memoria de las personas mayores. Financiable con el 10% del Split Soberano y con deducción fiscal para la entidad que lo patrocina.',
        bullets: [
            'Repertorio biográfico de la época dorada',
            'Protocolo acústico residencial (65-75 dBA)',
            'Financiación social: 10% del Split Soberano 80/10/10',
            'Deducción fiscal Ley 49/2002 (hasta 80% IRPF)',
        ],
        cta: 'Patrocinar una sesión para mayores',
        waMessage: 'Hola, queremos patrocinar o regalar una sesión del programa Viaje Musical por la Memoria a una residencia o centro de mayores.',
    },
];

export default function MariachiCulturalDiplomacy() {
    return (
        <div id="diplomacia-cultural" className="space-y-10">
            <div className="text-center max-w-3xl mx-auto space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono uppercase tracking-[0.25em]">
                    <Globe2 size={14} />
                    Diplomacia Cultural · Soft Power · Hermanamiento
                </div>
                <h2 className="text-3xl sm:text-5xl font-black font-syne uppercase text-white tracking-tight">
                    Del Escenario a la <span className="text-[#ecb613]">Marca País</span>
                </h2>
                <p className="text-sm sm:text-base text-white/60 font-sans leading-relaxed">
                    El mariachi no es solo música: es la figura emblemática más reconocible de la cultura iberoamericana.
                    Apostar por él desde el sector público es invertir en una imagen altamente visible que proyecta
                    patrimonio vivo y contrarresta los relatos que solo hablan de violencia.
                </p>
            </div>

            {/* Manifiesto de lo que NO hacemos (realismo) */}
            <div className="rounded-3xl bg-[#050508] border border-white/10 p-6 md:p-8">
                <div className="flex items-start gap-3">
                    <ScrollText size={20} className="text-[#ecb613] shrink-0 mt-1" />
                    <div className="space-y-2 text-sm text-white/70">
                        <h3 className="font-bold font-syne text-white text-base">Nuestra doctrina de dato verificado en el sector público</h3>
                        <p>
                            No prometemos despachos en minutos ni cifras sin fuente. Cada propuesta institucional nace de un
                            presupuesto desglosado validado con 2-3 proveedores reales, del rider acústico que corresponde al
                            contexto (festejos, plaza, residencia) y de la figura legal correcta: contrato menor Art. 118 LCSP y factura FACe.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {TIERS.map((t) => (
                    <div
                        key={t.id}
                        className="rounded-3xl bg-[#060609] border border-white/10 hover:border-[#ecb613]/40 p-6 md:p-8 flex flex-col justify-between space-y-5 transition-all duration-300"
                    >
                        <div className="space-y-3">
                            <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#ecb613]">
                                {t.icon}
                                {t.audience}
                            </span>
                            <h3 className="text-lg sm:text-xl font-black font-syne uppercase text-white">{t.title}</h3>
                            <p className="text-xs sm:text-sm text-white/60 font-sans leading-relaxed">{t.text}</p>
                            <ul className="space-y-2 pt-1">
                                {t.bullets.map((b) => (
                                    <li key={b} className="flex gap-2 text-xs text-white/70">
                                        <Check size={14} className="text-[#ecb613] shrink-0 mt-0.5" />
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <a
                            href={`https://wa.me/34693693048?text=${encodeURIComponent(t.waMessage)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#ecb613] hover:bg-amber-400 text-black font-mono text-xs uppercase font-bold tracking-wider transition-all"
                        >
                            <MessageCircle size={14} /> {t.cta}
                        </a>
                    </div>
                ))}
            </div>

            {/* Cierre: un solo ecosistema */}
            <div className="rounded-3xl bg-gradient-to-r from-[#0d0d15] via-[#09090e] to-[#0d0d15] border border-white/10 p-6 md:p-8 space-y-3 text-center">
                <Music size={22} className="text-[#ecb613] mx-auto" />
                <p className="text-sm text-white/70 max-w-3xl mx-auto font-sans leading-relaxed">
                    Un mismo ecosistema cubre la recepción de una embajada, el concierto de una feria patronal y la sesión
                    regalada a los mayores de un municipio hermano. Sin intermediarios: producción, facturación FACe e
                    impacto social en una sola factura.
                </p>
            </div>
        </div>
    );
}