/**
 * 🧪 VERIFICACIÓN DEL MOTOR TARIFARIO DEL SOLISTA (DIRECTIVA CEO)
 * ============================================================================
 * Prueba ejecutable del contrato comercial vigente:
 *   · Tarifa estándar mínima: 550,00 € con 100 km incluidos.
 *   · Suelo inviolable: 350,00 € solo con cupón de afiliado válido.
 *   · Reserva de bloqueo: 50% del total (reserva + liquidación = total).
 *   · Cupón FAIL-CLOSED: código inexistente/inactivo ⇒ sin descuento.
 *
 * Uso: node ./node_modules/tsx/dist/cli.mjs scripts/verify_solista_pricing.ts
 * Coste: $0,00 · sin red · sin base de datos.
 * ============================================================================
 */

import {
  calculateSolistaQuote,
  validarCuponAfiliado,
  normalizarCodigoCupon,
  SUELO_SOLISTA_EUR,
  TARIFA_SOLISTA_EUR,
  KM_INCLUIDOS,
  type AfiliadoCupon,
} from '../src/lib/pricing/solista-pricing';

let passed = 0;
const failures: string[] = [];

function check(name: string, condition: boolean, detail?: string): void {
  if (condition) {
    passed += 1;
    console.log(`  OK  ${name}`);
  } else {
    failures.push(`${name}${detail ? ` -> ${detail}` : ''}`);
    console.log(`  FAIL ${name}${detail ? ` -> ${detail}` : ''}`);
  }
}

const AFILIADOS: AfiliadoCupon[] = [
  { affiliateCode: 'EAR-EZKERTZA-1234', name: 'Ezkertza Berria', status: 'ACTIVE_HOMOLOGATED' },
  { affiliateCode: 'EAR-FINCA-SOL-5678', name: 'Finca El Sol', status: 'ACTIVE' },
  { affiliateCode: 'EAR-BAJA-9999', name: 'Afiliado Suspendido', status: 'SUSPENDED' },
];


console.log('── 1. TARIFA ESTÁNDAR SIN CUPÓN ──');
{
  const quote = calculateSolistaQuote({ distanciaKm: 0 });
  check('tarifa de lista = 550,00 €', quote.tarifaBaseEur === TARIFA_SOLISTA_EUR, `${quote.tarifaBaseEur}`);
  check('descuento = 0,00 €', quote.descuentoAfiliadoEur === 0, `${quote.descuentoAfiliadoEur}`);
  check('total = 550,00 €', quote.totalEur === 550, `${quote.totalEur}`);
  check('km incluidos = 100', quote.kmIncluidos === KM_INCLUIDOS, `${quote.kmIncluidos}`);
  check('km adicionales = 0', quote.kmAdicionales === 0, `${quote.kmAdicionales}`);
  check('sin pack promocional', quote.packPromocional === null);
}

console.log('── 2. CUPON VALIDO -> PACK SOLISTA PREMIUM (350,00 EUR) ──');
{
  const quote = calculateSolistaQuote({
    distanciaKm: 0,
    cupon: 'ear-ezkertza-1234',
    afiliados: AFILIADOS,
  });
  check('descuento = 200,00 €', quote.descuentoAfiliadoEur === 200, `${quote.descuentoAfiliadoEur}`);
  check('total = 350,00 € (suelo)', quote.totalEur === SUELO_SOLISTA_EUR, `${quote.totalEur}`);
  check('pack = Pack Solista Premium', quote.packPromocional === 'Pack Solista Premium');
  check('cupon normalizado', quote.cuponCodigo === 'EAR-EZKERTZA-1234', `${quote.cuponCodigo}`);
  check('total nunca bajo el suelo', quote.totalEur >= SUELO_SOLISTA_EUR);
}

console.log('── 3. CUPON FAIL-CLOSED (inexistente / inactivo / malformado) ──');
{
  const inexistente = validarCuponAfiliado('EAR-NOEXISTE-0000', AFILIADOS);
  check('inexistente rechazado', inexistente.valido === false && inexistente.motivo === 'NO_EXISTE');

  const inactivo = validarCuponAfiliado('EAR-BAJA-9999', AFILIADOS);
  check('inactivo rechazado', inactivo.valido === false && inactivo.motivo === 'INACTIVO');

  const malformado = validarCuponAfiliado('CHUNGO', AFILIADOS);
  check('malformado rechazado', malformado.valido === false && malformado.motivo === 'FORMATO_INVALIDO');

  const vacio = validarCuponAfiliado('', AFILIADOS);
  check('vacio rechazado', vacio.valido === false && vacio.motivo === 'VACIO');

  const sinPadron = validarCuponAfiliado('EAR-EZKERTZA-1234', []);
  check('sin padron rechazado', sinPadron.valido === false);

  const quoteInvalido = calculateSolistaQuote({
    distanciaKm: 0,
    cupon: 'EAR-NOEXISTE-0000',
    afiliados: AFILIADOS,
  });
  check('cupon invalido cotiza 550,00 €', quoteInvalido.totalEur === 550, `${quoteInvalido.totalEur}`);
}

console.log('── 4. KILOMETRAJE ADICIONAL (100 km incluidos) ──');
{
  const enFranquicia = calculateSolistaQuote({ distanciaKm: 100 });
  check('100 km -> 0,00 € adicionales', enFranquicia.costeKmAdicionalEur === 0, `${enFranquicia.costeKmAdicionalEur}`);

  const excedido = calculateSolistaQuote({ distanciaKm: 200 });
  check('200 km -> 100 km adicionales', excedido.kmAdicionales === 100, `${excedido.kmAdicionales}`);
  check('200 km -> 150,00 € (100 x 1,50)', excedido.costeKmAdicionalEur === 150, `${excedido.costeKmAdicionalEur}`);
  check('total = 700,00 €', excedido.totalEur === 700, `${excedido.totalEur}`);
}

console.log('── 5. RESERVA 50% / LIQUIDACION 50% (suma exacta) ──');
{
  for (const km of [0, 100, 200, 333]) {
    const q = calculateSolistaQuote({ distanciaKm: km });
    const suma = Math.round((q.reservaEur + q.liquidacionEur) * 100);
    const total = Math.round(q.totalEur * 100);
    check(`km=${km}: reserva+liquidacion = total`, suma === total, `${suma} vs ${total}`);
    check(`km=${km}: reserva = 50%`, Math.round(q.reservaEur * 100) === Math.round(total / 2), `${q.reservaEur}`);
  }
}

console.log('── 6. FECHA LIMITE DE LIQUIDACION (72 h antes) ──');
{
  const q = calculateSolistaQuote({ distanciaKm: 0, fechaEvento: '2027-06-15' });
  // La fecha del evento se interpreta en hora local; la liquidación vence
  // exactamente 72 h (3 días) antes de la medianoche de ese día.
  const evento = new Date('2027-06-15T00:00:00').getTime();
  const limite = new Date(q.fechaLimiteLiquidacion).getTime();
  check(
    'fecha limite = evento − 72 h',
    limite === evento - 72 * 60 * 60 * 1000,
    `${q.fechaLimiteLiquidacion}`,
  );
  const sinFecha = calculateSolistaQuote({ distanciaKm: 0 });
  check('sin fecha -> cadena vacia (no inventa)', sinFecha.fechaLimiteLiquidacion === '');
}

console.log('── 7. NORMALIZACION DE CODIGO ──');
{
  check('minusculas -> mayusculas', normalizarCodigoCupon('ear-ekz-1234') === 'EAR-EKZ-1234');
  check('espacios eliminados', normalizarCodigoCupon('  EAR-EKZ-1234  ') === 'EAR-EKZ-1234');
  check('acentos eliminados', normalizarCodigoCupon('EAR-EZKZ-1234') === 'EAR-EZKZ-1234');
}

console.log('');
console.log(`RESULTADO: ${passed} PASS · ${failures.length} FAIL`);
if (failures.length > 0) {
  for (const f of failures) console.error(`   FAIL ${f}`);
  process.exit(1);
}
console.log('OK: Motor tarifario del Solista conforme a la directiva del CEO.');
process.exit(0);
