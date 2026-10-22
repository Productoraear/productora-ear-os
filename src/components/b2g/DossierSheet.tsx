import React from "react";
import { Landmark, CheckCircle, FileText } from "lucide-react";
import type { ExpedienteB2G } from "./B2GDossierView";

const eur = (value: number): string =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value);

interface RowProps {
  label: string;
  value: string;
  strong?: boolean;
}

function Row({ label, value, strong = false }: RowProps): React.JSX.Element {
  return (
    <tr className="border-b border-white/10">
      <th scope="row" className={`py-2 text-left ${strong ? "font-semibold" : "font-normal text-white/70"}`}>
        {label}
      </th>
      <td className={`py-2 text-right font-mono ${strong ? "text-lg font-bold text-[#ecb613]" : ""}`}>{value}</td>
    </tr>
  );
}

export function DossierSheet({ expediente }: { expediente: ExpedienteB2G }): React.JSX.Element {
  const d = expediente.desgloseEconomico;
  const ods = expediente.impactoSocialODS2030;
  return (
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
        <p className="mt-3 text-sm text-white/70">CPV: {expediente.cpv}</p>
        <p className="text-sm text-white/70">Marco legal: {expediente.marcoLegal}</p>
      </section>

      <section className="b2g-section mb-8">
        <h2 className="mb-3 text-lg font-semibold">Desglose económico</h2>
        <table className="w-full border-collapse text-sm">
          <tbody>
            <Row label="Techo presupuestario" value={eur(d.techoPresupuestario)} />
            <Row label={`Oferta base (${d.porcentajeTecho} del techo)`} value={eur(d.ofertaBase)} />
            <Row label="IVA 21%" value={eur(d.iva21)} />
            <Row label="Total licitable" value={eur(d.totalLicitable)} strong />
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
          <li><strong>ODS 3:</strong> {ods.ods3}</li>
          <li><strong>ODS 8:</strong> {ods.ods8}</li>
          <li><strong>ODS 11:</strong> {ods.ods11}</li>
        </ul>
      </section>
    </article>
  );
}

export default DossierSheet;
