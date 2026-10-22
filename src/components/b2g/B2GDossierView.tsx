"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Landmark, Printer, CheckCircle, FileText } from "lucide-react";

interface DesgloseEconomico {
  techoPresupuestario: number;
  ofertaBase: number;
  porcentajeTecho: string;
  iva21: number;
  totalLicitable: number;
}

interface ImpactoSocialODS {
  ods3: string;
  ods8: string;
  ods11: string;
}

export interface ExpedienteB2G {
  expedienteId: string;
  municipio: string;
  codigoDIR3: string;
  cpv: string;
  objeto: string;
  marcoLegal: string;
  desgloseEconomico: DesgloseEconomico;
  impactoSocialODS2030: ImpactoSocialODS;
  memoriasIncluidas: string[];
  generadoEn: string;
}

interface DossierResponse {
  success?: boolean;
  expediente?: ExpedienteB2G;
  error?: string;
}

interface B2GDossierViewProps {
  initialExpediente?: ExpedienteB2G;
  municipio?: string;
  presupuestoMax?: number;
}

const DEFAULT_CEILING_EUR = 14250;

const eur = (value: number): string =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value);

const PRINT_CSS = `
@media print {
  @page { margin: 18mm; }
  body { background: #ffffff !important; }
  .b2g-no-print { display: none !important; }
  .b2g-sheet { background: #ffffff !important; color: #000000 !important; border: none !important; backdrop-filter: none !important; padding: 0 !important; }
  .b2g-sheet * { color: #000000 !important; border-color: #999999 !important; background: transparent !important; }
  .b2g-section { break-inside: avoid; }
}
`;

export function B2GDossierView({
  initialExpediente,
  municipio = "Ayuntamiento de Toledo",
  presupuestoMax = DEFAULT_CEILING_EUR,
}: B2GDossierViewProps): React.JSX.Element {
  const [expediente, setExpediente] = useState<ExpedienteB2G | null>(initialExpediente ?? null);
  const [loading, setLoading] = useState<boolean>(!initialExpediente);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (signal?: AbortSignal): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/b2g/dossier-generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ municipio, presupuestoMax }),
          signal,
        });
        const data = (await res.json()) as DossierResponse;
        if (!res.ok || !data.expediente) {
          throw new Error(data.error ?? "Respuesta inválida del despachador B2G");
        }
        setExpediente(data.expediente);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    },
    [municipio, presupuestoMax]
  );

  useEffect(() => {
    if (initialExpediente) return;
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [initialExpediente, load]);

  const handlePrint = (): void => {
    window.print();
  };

  return (
    <div className="w-full overflow-x-hidden">
      <style>{PRINT_CSS}</style>

      <div className="b2g-no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs uppercase tracking-widest text-[#00E5FF]">
          Contratación menor · LCSP Art. 118
        </p>
        <button
          type="button"
          onClick={handlePrint}
          disabled={!expediente}
          className="inline-flex items-center gap-2 rounded-3xl border border-[#00E5FF]/40 bg-[#09090d]/80 px-6 py-3 text-sm font-semibold text-[#00E5FF] backdrop-blur-md transition-all duration-300 ease-out hover:scale-105 hover:bg-[#00E5FF]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Printer className="h-4 w-4" aria-hidden="true" />
          Imprimir / Guardar en PDF
        </button>
      </div>

      {loading && (
        <div role="status" aria-live="polite" className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-10 text-center text-white/70 backdrop-blur-md">
          Generando expediente oficial…
        </div>
      )}

      {error && !loading && (
        <div role="alert" className="b2g-no-print rounded-3xl border border-[#FF2B44]/40 bg-[#09090d]/80 p-8 text-center backdrop-blur-md">
          <p className="mb-4 text-[#FF2B44]">{error}</p>
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-3xl border border-white/10 px-5 py-2 text-sm text-white transition-all duration-300 ease-out hover:bg-white/10"
          >
            Reintentar
          </button>
        </div>
      )}

      {expediente && !loading && (
        <article
          className="b2g-sheet rounded-3xl border border-white/10 bg-[#09090d]/80 p-8 text-white backdrop-blur-md md:p-12"
          aria-label={`Expediente ${expediente.expedienteId}`}
        >
          <header className="b2g-section mb-8 flex items-start justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-4">
              <Landmark className="h-10 w-10 text-[#ecb613]" aria-hidden="true" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{expediente.municipio}</h1>
                <p className="text-sm text-white/70">Expediente de Contratación Menor de Servicios</p>
              </div>
            </div>
            <div className="text-right font-mono text-xs text-white/70">
              <p>{expediente.expedienteId}</p>
              <p>DIR3: {expediente.codigoDIR3}</p>
              <p>{new Date(expediente.generadoEn).toLocaleDateString("es-ES")}</p>
            </div>
          </header>

          <section className="b2g-section mb-8">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <FileText className="h-5 w-5 text-[#ecb613]" aria-hidden="true" />
              Objeto del contrato
            </h2>
            <p className="text-white/85">{expediente.objeto}</p>
            <p className="mt-3 text-sm text-white/70"><strong>CPV:</strong> {expediente.cpv}</p>
            <p className="text-sm text-white/70"><strong>Marco legal:</strong> {expediente.marcoLegal}</p>
          </section>

          <section className="b2g-section mb-8">
            <h2 className="mb-3 text-lg font-semibold">Desglose económico</h2>
            <table className="w-full border-collapse text-sm">
              <tbody>
                <tr className="border-b border-white/10"><th scope="row" className="py-2 text-left font-normal text-white/70">Techo presupuestario</th><td className="py-2 text-right font-mono">{eur(expediente.desgloseEconomico.techoPresupuestario)}</td></tr>
                <tr className="border-b border-white/10"><th scope="row" className="py-2 text-left font-normal text-white/70">Oferta base ({expediente.desgloseEconomico.porcentajeTecho} del techo)</th><td className="py-2 text-right font-mono">{eur(expediente.desgloseEconomico.ofertaBase)}</td></tr>
                <tr className="border-b border-white/10"><th scope="row" className="py-2 text-left font-normal text-white/70">IVA 21%</th><td className="py-2 text-right font-mono">{eur(expediente.desgloseEconomico.iva21)}</td></tr>
                <tr><th scope="row" className="py-2 text-left font-semibold">Total licitable</th><td className="py-2 text-right font-mono text-lg font-bold text-[#ecb613]">{eur(expediente.desgloseEconomico.totalLicitable)}</td></tr>
              </tbody>
            </table>
          </section>

          <section className="b2g-section mb-8">
            <h2 className="mb-3 text-lg font-semibold">Pliego de prescripciones técnicas y memorias</h2>
            <ul className="space-y-2">
              {expediente.memoriasIncluidas.map((memoria) => (
                <li key={memoria} className="flex items-start gap-2 text-sm text-white/85">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#ecb613]" aria-hidden="true" />
                  <span>{memoria}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="b2g-section">
            <h2 className="mb-3 text-lg font-semibold">Justificación de impacto social VIMUME (ODS 3, 8 y 11)</h2>
            <ul className="space-y-2 text-sm text-white/85">
              <li><strong>ODS 3:</strong> {expediente.impactoSocialODS2030.ods3}</li>
              <li><strong>ODS 8:</strong> {expediente.impactoSocialODS2030.ods8}</li>
              <li><strong>ODS 11:</strong> {expediente.impactoSocialODS2030.ods11}</li>
            </ul>
          </section>
        </article>
      )}
    </div>
  );
}

export default B2GDossierView;