'use client';

import { useMemo, useState } from 'react';
import {
  Calculator,
  MapPin,
  CheckCircle2,
  Ticket,
  ShieldCheck,
  CalendarClock,
  AlertTriangle,
} from 'lucide-react';
import {
  calculateSolistaQuote,
  validarCuponAfiliado,
  SUELO_SOLISTA_EUR,
  TARIFA_SOLISTA_EUR,
  KM_INCLUIDOS,
  COSTE_KM_ADICIONAL_EUR,
  RESERVA_PCT,
  CONDICIONES_CONTRATO_SOLISTA,
  type AfiliadoCupon,
} from '@/lib/pricing/solista-pricing';

/** Formato monetario canÃ³nico es-ES (2 decimales, coma decimal). */
const eur = (value: number): string =>
  `${new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)} â‚¬`;

/** Fecha larga es-ES o texto honesto si no hay fecha vÃ¡lida. */
const fechaLarga = (iso: string): string => {
  if (!iso) return 'pendiente de fijar fecha';
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return 'pendiente de fijar fecha';
  return parsed.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
};

interface EdwinPricingEngineProps {
  /**
   * PadrÃ³n de afiliados activos resuelto SERVER-SIDE y pasado como prop.
   * Si se omite, el simulador opera SIN cupones vÃ¡lidos (fail-closed): nunca
   * inventa cÃ³digos ni descuenta por un cÃ³digo que no exista en disco.
   */
  afiliados?: readonly AfiliadoCupon[];
  /** Fecha del evento (YYYY-MM-DD) para la fecha lÃ­mite de liquidaciÃ³n. */
  fechaEvento?: string;
}


export function EdwinPricingEngine({ afiliados = [], fechaEvento = '' }: EdwinPricingEngineProps) {
  const [distanciaKm, setDistanciaKm] = useState<number>(0);
  const [horaFin, setHoraFin] = useState<string>('02:00');
  const [cupon, setCupon] = useState<string>('');
  const [cuponAplicado, setCuponAplicado] = useState<string>('');

  const horaFinNum = useMemo(() => {
    const match = horaFin.match(/^(\d{1,2})(?::(\d{2}))?$/);
    if (!match) return undefined;
    const hours = Number(match[1]);
    const minutes = match[2] === undefined ? 0 : Number(match[2]);
    return hours + minutes / 60;
  }, [horaFin]);

  const validacion = useMemo(
    () => validarCuponAfiliado(cuponAplicado, afiliados),
    [cuponAplicado, afiliados],
  );

  const quote = useMemo(
    () =>
      calculateSolistaQuote({
        distanciaKm,
        horaFin: horaFinNum,
        cupon: cuponAplicado,
        afiliados,
        fechaEvento,
      }),
    [distanciaKm, horaFinNum, cuponAplicado, afiliados, fechaEvento],
  );

  const aplicarCupon = () => setCuponAplicado(cupon.trim().toUpperCase());
  const quitarCupon = () => {
    setCupon('');
    setCuponAplicado('');
  };

  return (
    <div
      role="group"
      aria-label="Cotizador instantáneo Edwin Agudelo"
      className="bg-[#0a0a0f] border border-white/10 rounded-3xl p-6 max-w-lg w-full text-white shadow-2xl"
    >
      <h3 className="text-xl font-black mb-1 uppercase text-[#ecb613] flex items-center gap-2">
        <Calculator size={20} aria-hidden="true" focusable="false" /> Cotización Instantánea
      </h3>
      <p className="text-[11px] text-white/40 mb-6 font-mono">
        {CONDICIONES_CONTRATO_SOLISTA.concepto}
      </p>

      {/* Tarifa estándar canónica y suelo alcanzable con cupón */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-4 rounded-xl border border-[#ecb613]/40 bg-[#ecb613]/5">
          <span className="block text-[10px] text-white/50 uppercase tracking-wider font-bold">
            Tarifa estándar mínima
          </span>
          <span className="block text-xl font-black text-white">{eur(TARIFA_SOLISTA_EUR)}</span>
          <span className="block text-[10px] text-white/40">{KM_INCLUIDOS} km incluidos</span>
        </div>
        <div className="p-4 rounded-xl border border-white/10 bg-black/50">
          <span className="block text-[10px] text-white/50 uppercase tracking-wider font-bold">
            Suelo con cupón
          </span>
          <span className="block text-xl font-black text-white">{eur(SUELO_SOLISTA_EUR)}</span>
          <span className="block text-[10px] text-white/40">Pack Solista Premium</span>
        </div>
      </div>

      {/* Cupón de afiliado / redes */}
      <div className="mb-6 space-y-2">
        <label
          htmlFor="edwin-cupon"
          className="block text-xs text-white/50 uppercase tracking-wider font-bold"
        >
          Código de afiliado / redes
        </label>
        <div className="flex gap-2">
          <input
            id="edwin-cupon"
            type="text"
            inputMode="text"
            autoComplete="off"
            value={cupon}
            onChange={(e) => setCupon(e.target.value.toUpperCase())}
            placeholder="EAR-EZKERTZA-1234"
            aria-describedby="edwin-cupon-estado"
            className="flex-1 min-w-0 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono uppercase focus:outline-none focus:border-[#ecb613] focus-visible:ring-2 focus-visible:ring-[#ecb613]"
          />
          {cuponAplicado ? (
            <button
              type="button"
              onClick={quitarCupon}
              className="px-4 py-3 rounded-xl border border-white/10 bg-black/50 text-white/70 text-xs font-mono font-bold hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]"
            >
              Quitar
            </button>
          ) : (
            <button
              type="button"
              onClick={aplicarCupon}
              disabled={cupon.trim().length === 0}
              className="px-4 py-3 rounded-xl bg-[#ecb613] text-black text-xs font-mono font-black uppercase disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]"
            >
              Aplicar
            </button>
          )}
        </div>

        <div id="edwin-cupon-estado" aria-live="polite" className="text-[11px] font-mono">
          {!cuponAplicado && (
            <span className="text-white/40 flex items-start gap-1.5">
              <Ticket size={12} className="shrink-0 mt-0.5" aria-hidden="true" focusable="false" />
              Coordinadores de boda y fincas pueden darse de alta y obtienen un código canjeable.
            </span>
          )}
          {cuponAplicado && validacion.valido && (
            <span className="text-emerald-400 flex items-start gap-1.5">
              <CheckCircle2
                size={12}
                className="shrink-0 mt-0.5"
                aria-hidden="true"
                focusable="false"
              />
              Cupón válido{validacion.afiliadoNombre ? ` · ${validacion.afiliadoNombre}` : ''} ·
              Pack Solista Premium aplicado.
            </span>
          )}
          {cuponAplicado && !validacion.valido && (
            <span className="text-[#FF2B44] flex items-start gap-1.5">
              <AlertTriangle
                size={12}
                className="shrink-0 mt-0.5"
                aria-hidden="true"
                focusable="false"
              />
              Código no válido ({validacion.motivo}). Se cotiza a tarifa estándar.
            </span>
          )}
        </div>
      </div>

      {/* Desplazamiento y hora de fin */}
      <div className="space-y-4 mb-6">
        <div>
          <label
            htmlFor="edwin-distancia"
            className="block text-xs text-white/50 uppercase tracking-wider font-bold mb-2"
          >
            Desplazamiento desde el Hub Méntrida
          </label>
          <div className="flex items-center gap-3">
            <input
              id="edwin-distancia"
              type="range"
              min={0}
              max={500}
              step={5}
              value={distanciaKm}
              onChange={(e) => setDistanciaKm(Number(e.target.value))}
              aria-valuemin={0}
              aria-valuemax={500}
              aria-valuenow={distanciaKm}
              aria-valuetext={`${distanciaKm} kilómetros`}
              className="flex-1 accent-[#ecb613] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] rounded"
            />
            <span className="w-20 text-right font-mono text-sm text-white">{distanciaKm} km</span>
          </div>
          <div className="flex items-start gap-2 text-[10px] text-white/40 mt-2">
            <MapPin size={12} className="shrink-0 mt-0.5" aria-hidden="true" focusable="false" />
            <p>
              {KM_INCLUIDOS} km incluidos en la tarifa · {eur(COSTE_KM_ADICIONAL_EUR)}/km
              adicional a partir del km {KM_INCLUIDOS + 1}.
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor="edwin-hora-fin"
            className="block text-xs text-white/50 uppercase tracking-wider font-bold mb-2"
          >
            Hora de finalización
          </label>
          <input
            id="edwin-hora-fin"
            type="time"
            value={horaFin}
            onChange={(e) => setHoraFin(e.target.value)}
            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-[#ecb613] focus-visible:ring-2 focus-visible:ring-[#ecb613]"
          />
          <p className="text-[10px] text-white/40 mt-2">
            {CONDICIONES_CONTRATO_SOLISTA.suplementoHotel}
          </p>
        </div>
      </div>

      {/* DESGLOSE TRANSACCIONAL COMPLETO (resumen previo al pago) */}
      <div
        role="region"
        aria-label="Resumen del presupuesto estimado antes del pago"
        aria-live="polite"
        className="bg-black/60 rounded-xl p-4 mb-6 border border-white/5 space-y-3 text-xs font-mono"
      >
        <div className="flex justify-between gap-3 text-white/60">
          <span>Show Solista Premium (1 hora)</span>
          <span className="text-white shrink-0">{eur(quote.tarifaBaseEur)}</span>
        </div>

        {quote.descuentoAfiliadoEur > 0 && (
          <div className="flex justify-between gap-3 text-emerald-400">
            <span>
              Descuento {quote.packPromocional} ({quote.cuponCodigo})
            </span>
            <span className="shrink-0">-{eur(quote.descuentoAfiliadoEur)}</span>
          </div>
        )}

        <div className="flex justify-between gap-3 text-white/60">
          <span>
            Kilometraje incluido ({quote.kmIncluidos} km)
            {quote.kmAdicionales > 0 ? ` + ${quote.kmAdicionales} km adicionales` : ''}
          </span>
          <span className="text-white shrink-0">
            {quote.costeKmAdicionalEur > 0 ? eur(quote.costeKmAdicionalEur) : 'Incluido'}
          </span>
        </div>

        {quote.suplementoHotelEur > 0 && (
          <div className="flex justify-between gap-3 text-white/60">
            <span>Suplemento hotelero</span>
            <span className="text-white shrink-0">{eur(quote.suplementoHotelEur)}</span>
          </div>
        )}

        <div className="flex justify-between items-end pt-3 border-t border-white/10">
          <span className="font-bold text-white/70">Total presupuestado</span>
          <span
            className="text-3xl font-black text-white"
            aria-label={`Total presupuestado: ${quote.totalEur} euros`}
          >
            {eur(quote.totalEur)}
          </span>
        </div>

        <div className="flex justify-between gap-3 text-[#ecb613] font-bold">
          <span>Reserva hoy ({(RESERVA_PCT * 100).toFixed(0)}%)</span>
          <span className="shrink-0">{eur(quote.reservaEur)}</span>
        </div>
        <div className="flex justify-between gap-3 text-white/70">
          <span>
            Liquidación del resto
            <span className="block text-[10px] text-white/40">
              Límite: {fechaLarga(quote.fechaLimiteLiquidacion)}
            </span>
          </span>
          <span className="shrink-0">{eur(quote.liquidacionEur)}</span>
        </div>
      </div>

      {/* Cláusulas contractuales completas */}
      <div className="space-y-2 text-[10px] text-white/50 mb-6">
        <div className="flex items-start gap-2">
          <CalendarClock
            size={12}
            className="shrink-0 mt-0.5"
            aria-hidden="true"
            focusable="false"
          />
          <p>{CONDICIONES_CONTRATO_SOLISTA.reserva}</p>
        </div>
        <div className="flex items-start gap-2">
          <ShieldCheck
            size={12}
            className="shrink-0 mt-0.5"
            aria-hidden="true"
            focusable="false"
          />
          <p>{CONDICIONES_CONTRATO_SOLISTA.cancelacion}</p>
        </div>
        <div className="flex items-start gap-2">
          <AlertTriangle
            size={12}
            className="shrink-0 mt-0.5"
            aria-hidden="true"
            focusable="false"
          />
          <p>{CONDICIONES_CONTRATO_SOLISTA.fuerzaMayor}</p>
        </div>
      </div>

      <button
        type="button"
        aria-label={`Bloquear fecha con reserva de ${quote.reservaEur} euros`}
        className="w-full py-4 bg-[#ecb613] hover:brightness-110 text-black font-black uppercase text-sm rounded-xl transition-all shadow-lg shadow-[#ecb613]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f]"
      >
        Bloquear Fecha · Reserva {eur(quote.reservaEur)}
      </button>
    </div>
  );
}

