import type { Metadata } from 'next';
import Link from 'next/link';
import {
  readEvidenceLedger,
  type EvidenceClaim,
  type EvidenceState,
} from '@/lib/evidence/evidence-ledger';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * U13 · /confianza — REGISTRO PÚBLICO DE PRUEBAS (.clinerules §4)
 * ════════════════════════════════════════════════════════════════════════════
 * Una fila = una promesa + su estado + la URL donde se prueba + la fecha.
 * La página NO tiene copy comercial: si una promesa no tiene evidencia en el
 * ledger, no se publica como verificada. Se genera en build desde
 * `.antigravity/evidence/ledger.jsonl` y se sirve como HTML estático: cero
 * JavaScript, cero lógica en el cliente, cero datos personales.
 * ════════════════════════════════════════════════════════════════════════════
 */

// Prerenderizada en build: el ledger se lee una vez y su contenido viaja en el HTML.
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Confianza verificable · Registro público de pruebas | EAR OS',
  description:
    'Cada promesa de EAR OS con su estado, la URL donde se prueba y la fecha de medición. Sin evidencia no hay fila publicada.',
  alternates: {
    canonical: 'https://www.productoraear.com/confianza',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Confianza verificable · Registro público de pruebas',
    description: 'Promesa, estado, URL de prueba y fecha. Verificable hasta el último byte.',
    url: 'https://www.productoraear.com/confianza',
    type: 'website',
  },
};

const ledger = readEvidenceLedger();

interface StateStyle {
  label: string;
  badge: string;
  dot: string;
  description: string;
}

const STATE_STYLES: Record<EvidenceState, StateStyle> = {
  FACHADA: {
    label: 'Fachada',
    badge: 'border-[#FF2B44]/50 bg-[#FF2B44]/12 text-[#ff8d99]',
    dot: 'bg-[#FF2B44]',
    description: 'La interfaz responde, pero el motor o la escritura no existe. Se trata como defecto, no como pendiente.',
  },
  SOSPECHOSO: {
    label: 'Sospechoso',
    badge: 'border-[#ecb613]/50 bg-[#ecb613]/12 text-[#f5cf5b]',
    dot: 'bg-[#ecb613]',
    description: 'Evidencia parcial o contradictoria: existe prueba, pero no cubre toda la promesa.',
  },
  SIN_EVIDENCIA: {
    label: 'Sin evidencia',
    badge: 'border-white/15 bg-white/5 text-[#a1a1aa]',
    dot: 'bg-[#71717a]',
    description: 'Todavía no existe un comando que lo pruebe. Vale cero puntos, no "casi".',
  },
  VERIFICADO: {
    label: 'Verificado',
    badge: 'border-white/20 bg-white/[0.07] text-[#f5f5f7]',
    dot: 'bg-[#f5f5f7]',
    description: 'Medido en producción con su comando, su código de salida y su hash.',
  },
};

function shortHash(value: string | null): string {
  if (value === null) return '—';
  return value.length > 16 ? `${value.slice(0, 16)}…` : value;
}

function shortDate(value: string | null): string {
  if (value === null) return '—';
  return value.replace('T', ' ').replace('Z', ' UTC');
}

function formatBytes(value: number | null): string {
  if (value === null) return '—';
  return `${value.toLocaleString('es-ES')} B`;
}

function ClaimRow({ claim }: { claim: EvidenceClaim }) {
  const style = STATE_STYLES[claim.state];
  return (
    <tr className="border-t border-white/5 align-top transition-colors duration-300 hover:bg-white/[0.03]">
      <td className="py-5 pr-4">
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${style.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
          {style.label}
        </span>
      </td>
      <td className="py-5 pr-4">
        <p className="m-0 text-[15px] leading-relaxed text-[#f5f5f7]">
          {claim.promise ?? 'Sin descripción registrada en el ledger'}
        </p>
        <p className="m-0 mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[#71717a]">
          {claim.id}
        </p>
        {claim.note !== null && (
          <p className="m-0 mt-2 text-[12px] leading-relaxed text-[#a1a1aa]">{claim.note}</p>
        )}
        {claim.downgraded && claim.downgradeReason !== null && (
          <p className="m-0 mt-2 text-[12px] leading-relaxed text-[#f5cf5b]">
            Estado degradado por el validador: {claim.downgradeReason}
          </p>
        )}
      </td>
      <td className="py-5 pr-4">
        {claim.url !== null ? (
          <a
            href={claim.url}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-[12px] text-[#ecb613] underline decoration-[#ecb613]/30 underline-offset-2 transition-colors duration-300 hover:decoration-[#ecb613]"
          >
            {claim.url}
          </a>
        ) : (
          <span className="text-[12px] text-[#71717a]">sin URL de prueba</span>
        )}
        {claim.cmd !== null && (
          <p className="m-0 mt-2 break-words font-mono text-[11px] leading-relaxed text-[#a1a1aa]">
            {claim.cmd}
          </p>
        )}
        <p className="m-0 mt-2 font-mono text-[11px] text-[#71717a]">
          exit={claim.exit ?? '—'}
          {claim.httpStatus !== null ? ` · http=${claim.httpStatus}` : ''}
          {claim.bytes !== null ? ` · ${formatBytes(claim.bytes)}` : ''}
        </p>
        {claim.sha256 !== null && (
          <p className="m-0 mt-1 break-all font-mono text-[11px] text-[#71717a]" title={claim.sha256}>
            sha256={shortHash(claim.sha256)}
          </p>
        )}
      </td>
      <td className="py-5 whitespace-nowrap font-mono text-[11px] text-[#a1a1aa]">{shortDate(claim.ts)}</td>
    </tr>
  );
}

export default function ConfianzaPage() {
  const totalActive = ledger.activeClaims.length;

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-[#030305] text-[#f5f5f7] px-6 py-12">
      <section className="mx-auto w-full max-w-6xl">
        <header className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-[#a1a1aa] mb-3">
            EAR OS · Superficie de verdad pública
          </p>
          <h1 className="m-0 text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-[-0.03em] font-semibold">
            Confianza verificable
          </h1>
          <p className="mt-4 mb-0 text-[#a1a1aa] text-lg leading-relaxed max-w-3xl">
            Una fila por promesa. Estado, URL donde se prueba y fecha de la medición.
            Si una promesa no tiene evidencia, no aparece aquí como verificada.
          </p>
        </header>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(['VERIFICADO', 'SOSPECHOSO', 'FACHADA', 'SIN_EVIDENCIA'] as const).map((state) => {
            const style = STATE_STYLES[state];
            return (
              <div
                key={state}
                className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 transition-all duration-300 hover:border-white/20"
              >
                <p className="m-0 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#a1a1aa]">
                  <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
                  {style.label}
                </p>
                <p className="m-0 mt-2 text-3xl font-semibold tracking-tight">{ledger.counts[state]}</p>
                <p className="m-0 mt-1 text-[12px] leading-relaxed text-[#71717a]">{style.description}</p>
              </div>
            );
          })}
        </div>

        {ledger.deployBlocked && (
          <div className="mb-6 rounded-3xl border border-[#FF2B44]/40 bg-[#FF2B44]/[0.06] p-6">
            <h2 className="m-0 text-lg font-semibold tracking-tight text-[#ff8d99]">
              Deploy bloqueado por el ledger
            </h2>
            <p className="m-0 mt-2 text-[13px] leading-relaxed text-[#d4d4d8]">
              Un registro con una fachada abierta, una fila degradada o una anomalía de formato no
              puede publicarse como verdad. El bloqueo es el mensaje, no un fallo del sistema.
            </p>
            <ul className="m-0 mt-4 space-y-2 pl-5 text-[13px] leading-relaxed text-[#d4d4d8]">
              {ledger.blockReasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-6 rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 sm:p-8">
          <h2 className="m-0 text-lg font-semibold tracking-tight">Procedencia de esta página</h2>
          <dl className="m-0 mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.2em] text-[#71717a]">Fuente</dt>
              <dd className="m-0 mt-1 break-all font-mono text-[12px] text-[#d4d4d8]">{ledger.ledgerPath}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.2em] text-[#71717a]">Modo</dt>
              <dd className="m-0 mt-1 font-mono text-[12px] text-[#d4d4d8]">
                {ledger.mode} · probed={String(ledger.probed)} · source={ledger.source}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.2em] text-[#71717a]">Última evidencia</dt>
              <dd className="m-0 mt-1 font-mono text-[12px] text-[#d4d4d8]">{shortDate(ledger.ledgerUpdatedAt)}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-[10px] uppercase tracking-[0.2em] text-[#71717a]">sha256 del ledger</dt>
              <dd className="m-0 mt-1 break-all font-mono text-[12px] text-[#d4d4d8]">
                {ledger.ledgerSha256 ?? '—'}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.2em] text-[#71717a]">Tamaño</dt>
              <dd className="m-0 mt-1 font-mono text-[12px] text-[#d4d4d8]">{formatBytes(ledger.ledgerBytes)}</dd>
            </div>
          </dl>
          <p className="m-0 mt-5 text-[12px] leading-relaxed text-[#71717a]">
            Generada en cada build desde el fichero anterior. Sin JavaScript en el cliente y sin datos
            personales: la página no puede mentir por cálculo, solo por omisión — y la omisión se publica aquí.
          </p>
        </div>
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 sm:p-8">
          <h2 className="m-0 text-lg font-semibold tracking-tight">Registro de promesas</h2>
          <p className="m-0 mt-1 text-[12px] text-[#71717a]">
            {totalActive} fila(s) vigente(s) · ordenadas por gravedad, nunca por conveniencia.
          </p>

          {totalActive === 0 ? (
            <p className="m-0 mt-6 text-[13px] leading-relaxed text-[#a1a1aa]">
              El ledger no contiene ninguna fila publicable. Esta página no afirma nada: un registro
              vacío vale cero, no vale verde.
            </p>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <caption className="sr-only">
                  Registro público de promesas de EAR OS con su estado, prueba y fecha
                </caption>
                <thead>
                  <tr className="text-[10px] uppercase tracking-[0.2em] text-[#71717a]">
                    <th scope="col" className="pb-3 pr-4 font-medium">Estado</th>
                    <th scope="col" className="pb-3 pr-4 font-medium">Promesa</th>
                    <th scope="col" className="pb-3 pr-4 font-medium">Prueba</th>
                    <th scope="col" className="pb-3 font-medium">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.activeClaims.map((claim) => (
                    <ClaimRow key={claim.id} claim={claim} />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {ledger.anomalies.length > 0 && (
            <div className="mt-6 rounded-2xl border border-[#ecb613]/30 bg-[#ecb613]/[0.05] p-4">
              <h3 className="m-0 text-[13px] font-semibold tracking-tight text-[#f5cf5b]">
                {ledger.anomalies.length} anomalía(s) de formato (no publicadas)
              </h3>
              <ul className="m-0 mt-2 space-y-1 pl-5 font-mono text-[11px] leading-relaxed text-[#a1a1aa]">
                {ledger.anomalies.map((anomaly) => (
                  <li key={`${anomaly.line}-${anomaly.reason}`}>
                    línea {anomaly.line}: {anomaly.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {ledger.retiredClaims.length > 0 && (
            <div className="mt-6">
              <h3 className="m-0 text-[13px] font-semibold tracking-tight text-[#a1a1aa]">
                Historial retirado por supersedes ({ledger.retiredClaims.length})
              </h3>
              <ul className="m-0 mt-2 space-y-1 pl-5 text-[12px] leading-relaxed text-[#71717a]">
                {ledger.retiredClaims.map((claim) => (
                  <li key={`${claim.id}-${claim.ts}`}>
                    <span className="font-mono">{claim.id}</span> · {claim.state} · {shortDate(claim.ts)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="mt-6 rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 sm:p-8">
          <h2 className="m-0 text-lg font-semibold tracking-tight">Cómo se audita esto</h2>
          <p className="m-0 mt-2 text-[13px] leading-relaxed text-[#a1a1aa]">
            El registro es append-only: una corrección se añade como fila nueva con
            <span className="font-mono"> supersedes</span>, nunca reescribiendo la anterior. El gate
            <span className="font-mono"> npm run verify:confianza</span> devuelve Exit Code 0 solo si
            no hay fachadas activas ni filas degradadas.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/reservar/solista"
              className="inline-flex items-center justify-center rounded-2xl bg-white text-[#030305] px-6 py-3 text-sm font-semibold transition-all duration-300 hover:bg-[#e5e5e7] hover:scale-[1.02]"
            >
              Reservar con depósito deducible
            </Link>
            <Link
              href="/precios"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-transparent text-[#f5f5f7] px-6 py-3 text-sm font-semibold transition-all duration-300 hover:border-white/30 hover:bg-white/5"
            >
              Ver precios certificados
            </Link>
          </div>
        </div>


      </section>
    </main>
  );
}
