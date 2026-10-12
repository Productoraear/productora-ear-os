import React from 'react';
import { Landmark, Check, FileText, MessageCircle } from 'lucide-react';

/**
 * Tarifas de producción para ayuntamientos (contrato menor, Art. 118 LCSP).
 * Rangos de referencia de mercado orientativos (sin IVA) para justificar el
 * presupuesto en la memoria del expediente. Precio final siempre por presupuesto
 * desglosado: NO hay checkout automático en esta vertical.
 */
interface ProductionTier {
  id: string;
  name: string;
  scope: string;
  includes: string[];
  rangeEUR: [number, number];
}

const PRODUCTION_TIERS: ProductionTier[] = [
  {
    id: 'artistico',
    name: 'Mariachi — Solo Artístico',
    scope: 'El ayuntamiento aporta escenario y sonido',
    includes: ['Mariachi de 6-8 músicos, 90 min', 'Rider técnico enviado con antelación', 'Desplazamiento incluido en el presupuesto'],
    rangeEUR: [1200, 2500],
  },
  {
    id: 'plaza',
    name: 'Concierto de Plaza',
    scope: 'Mariachi + sonido e iluminación para plaza mediana',
    includes: ['Mariachi de 8 músicos', 'PA para 500-1.500 personas + técnico', 'Iluminación básica y mesa de control', 'Montaje y desmontaje'],
    rangeEUR: [3500, 7000],
  },
  {
    id: 'feria',
    name: 'Concierto de Feria — Producción Integral',
    scope: 'Llave en mano para ferias y fiestas patronales',
    includes: ['Mariachi monumental 10-12 músicos', 'Escenario cubierto 8x6 m', 'PA line-array + monitores + 2 técnicos', 'Iluminación de espectáculo y generador si hace falta', 'Coordinación con policía local y plan de seguridad'],
    rangeEUR: [8000, 14000],
  },
];

// Referencias de mercado (orientativas) para la memoria justificativa del expediente.
const MARKET_REFERENCES: { item: string; rangeEUR: string }[] = [
  { item: 'Escenario cubierto 8x6 m (día, montaje incl.)', rangeEUR: '1.500 – 3.500 €' },
  { item: 'Sonido line-array para plaza + técnicos', rangeEUR: '1.800 – 4.500 €' },
  { item: 'Iluminación de espectáculo + operador', rangeEUR: '800 – 2.500 €' },
  { item: 'Grupo electrógeno (si no hay acometida)', rangeEUR: '300 – 900 €' },
  { item: 'Mariachi 10-12 músicos (actuación)', rangeEUR: '1.800 – 3.500 €' },
];

const fmt = (n: number) => n.toLocaleString('es-ES');

export default function MariachiB2GProduction() {
  const wa = encodeURIComponent(
    'Hola, llamo de un ayuntamiento / comisión de fiestas. Queremos presupuesto desglosado de mariachi para fiestas patronales (contrato menor). Fecha y municipio: '
  );
  return (
    <div id="ayuntamientos" className="space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-mono uppercase tracking-[0.25em]">
          <Landmark size={14} />
          Ayuntamientos · Ferias · Fiestas Patronales
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-syne uppercase text-white tracking-tight">
          Del Mariachi a la Producción Integral
        </h2>
        <p className="text-sm sm:text-base text-white/60 font-sans">
          Un mariachi solo rara vez supera los 2.500 €. Cuando el municipio necesita escenario, sonido de plaza, luces y técnicos,
          lo contratamos todo en un único contrato menor (Art. 118 LCSP, por debajo del umbral legal de servicios) con presupuesto desglosado y factura FACe.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PRODUCTION_TIERS.map((t) => (
          <div key={t.id} className="rounded-3xl bg-[#060609] border border-white/10 p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-lg font-bold font-syne text-white">{t.name}</h3>
              <p className="text-xs text-white/50">{t.scope}</p>
              <div className="text-2xl font-black font-mono text-[#00E5FF]">
                {fmt(t.rangeEUR[0])} – {fmt(t.rangeEUR[1])} €
              </div>
              <p className="text-[10px] font-mono text-white/40">Rango orientativo sin IVA · precio final por presupuesto</p>
              <ul className="space-y-2 text-xs text-white/70">
                {t.includes.map((i) => (
                  <li key={i} className="flex gap-2"><Check size={14} className="text-[#00E5FF] shrink-0 mt-0.5" />{i}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-[#050508] border border-white/10 p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-3">
          <h3 className="text-lg font-bold font-syne text-white flex items-center gap-2">
            <FileText size={18} className="text-[#00E5FF]" /> Referencias de mercado para la memoria del expediente
          </h3>
          <table className="w-full text-xs font-mono">
            <tbody>
              {MARKET_REFERENCES.map((r) => (
                <tr key={r.item} className="border-b border-white/5">
                  <td className="py-2 text-white/70">{r.item}</td>
                  <td className="py-2 text-right text-white">{r.rangeEUR}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[10px] text-white/40">Valores orientativos de mercado en España (sin IVA). Varían según aforo, distancia y fecha.</p>
        </div>
        <div className="space-y-4 text-sm text-white/70">
          <p>Te entregamos el paquete documental listo para el expediente:</p>
          <ul className="space-y-2 text-xs">
            <li className="flex gap-2"><Check size={14} className="text-[#00E5FF]" />Presupuesto desglosado por partidas</li>
            <li className="flex gap-2"><Check size={14} className="text-[#00E5FF]" />Ficha técnica y rider (festejos 90-102 dBA, con limitador si se exige)</li>
            <li className="flex gap-2"><Check size={14} className="text-[#00E5FF]" />Factura electrónica a través de FACe</li>
          </ul>
          <a
            href={`https://wa.me/34693693048?text=${wa}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#00E5FF] hover:bg-cyan-300 text-black font-mono text-xs uppercase font-bold tracking-wider transition-all"
          >
            <MessageCircle size={14} /> Pedir presupuesto para mi municipio
          </a>
        </div>
      </div>
    </div>
  );
}
