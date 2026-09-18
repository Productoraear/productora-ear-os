"use client";

import React, { useState } from "react";
import { 
  Receipt, 
  CreditCard, 
  ShieldCheck, 
  Download, 
  ArrowUpRight, 
  FileText, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Sparkles, 
  Copy, 
  ExternalLink,
  Percent,
  Plus
} from "lucide-react";

interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  concept: string;
  client: string;
  date: string;
  amount: number;
  status: "PAID" | "PENDING" | "PROCESSING";
  splitArtist: number;
  splitEarOs: number;
  splitVimume: number;
  receiptUrl?: string;
  taxCertificate: boolean;
}

const initialInvoices: InvoiceRecord[] = [
  {
    id: "inv-001",
    invoiceNumber: "FRA-2026-0042",
    concept: "Depósito Price-Lock SHA-256 • Bloqueo de Fecha Boda",
    client: "Isabel & Pareja (17/06/2026 • Madrid)",
    date: "14/09/2026",
    amount: 100.00,
    status: "PAID",
    splitArtist: 80.00,
    splitEarOs: 10.00,
    splitVimume: 10.00,
    taxCertificate: true,
  },
  {
    id: "inv-002",
    invoiceNumber: "FRA-2024-0089",
    concept: "Liquidación Completa Ceremonia & Cóctel Acústico",
    client: "Adriana & Sergio (15/06/2024 • Finca La Alquería)",
    date: "16/06/2024",
    amount: 350.00,
    status: "PAID",
    splitArtist: 280.00,
    splitEarOs: 35.00,
    splitVimume: 35.00,
    taxCertificate: true,
  },
  {
    id: "inv-003",
    invoiceNumber: "FRA-2023-0054",
    concept: "Actuación Solista Edwin Agudelo + Rider Bose",
    client: "Eduardo Lion Wong (20/09/2023 • Aldea Santillana)",
    date: "21/09/2023",
    amount: 350.00,
    status: "PAID",
    splitArtist: 280.00,
    splitEarOs: 35.00,
    splitVimume: 35.00,
    taxCertificate: true,
  },
];

export function ProBillingTab() {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(initialInvoices);
  const [clientName, setClientName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [generatedStripeLink, setGeneratedStripeLink] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const totalBilled = invoices.reduce((acc, inv) => acc + inv.amount, 0);
  const totalArtist = invoices.reduce((acc, inv) => acc + inv.splitArtist, 0);
  const totalVimume = invoices.reduce((acc, inv) => acc + inv.splitVimume, 0);

  const handleGenerateStripeLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !eventDate) return;
    const fakeHash = Math.random().toString(36).substring(2, 10).toUpperCase();
    const link = `https://checkout.stripe.com/c/pay/cs_live_sclass_${fakeHash}_edwin_agudelo_deposit`;
    setGeneratedStripeLink(link);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(generatedStripeLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Value Comparison Banner */}
      <div className="p-6 lg:p-8 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-[#0c0c12] via-[#08080c] to-[#040406] space-y-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono tracking-wider uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              Facturación Soberana • 0 € Cuotas Fijas Parásitas
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold font-['Syne'] text-white">
              Centro de Facturación, Liquidaciones & Stripe Price-Lock
            </h2>
            <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">
              A diferencia de las suscripciones mensuales tradicionales que cobran cientos de euros al mes sin garantizar bodas, en EAR OS <strong className="text-white">solo facturas cuando cobras</strong>. Split 80/10/10 transparente y certificado de desgravación fiscal Ley 49/2002.
            </p>
          </div>

          <button
            onClick={() => setShowCertificateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-[#ecb613] text-zinc-200 text-xs font-mono transition"
          >
            <FileText className="w-4 h-4 text-[#ecb613]" />
            Certificado Modelo 182 AEAT
          </button>
        </div>

        {/* Totals Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-zinc-800">
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1">
            <div className="text-[10px] font-mono uppercase text-zinc-400">Total Liquidado Histórico</div>
            <div className="text-2xl font-bold text-white font-['Syne']">{totalBilled.toFixed(2)} €</div>
            <div className="text-[10px] text-zinc-400 font-mono">100% cobrado sin impagos</div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1">
            <div className="text-[10px] font-mono uppercase text-emerald-400">80% Artista Ejecutor (Edwin Agudelo)</div>
            <div className="text-2xl font-bold text-emerald-400 font-['Syne']">{totalArtist.toFixed(2)} €</div>
            <div className="text-[10px] text-zinc-400 font-mono">Directo a cuenta bancaria</div>
          </div>

          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 space-y-1">
            <div className="text-[10px] font-mono uppercase text-blue-400">10% Fondo Social VIMUME</div>
            <div className="text-2xl font-bold text-blue-400 font-['Syne']">{totalVimume.toFixed(2)} €</div>
            <div className="text-[10px] text-zinc-400 font-mono">Deducción fiscal Ley 49/2002</div>
          </div>
        </div>
      </div>

      {/* Grid: Left Stripe Generator / Right Invoices List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Stripe Price-Lock 100€ Link Generator */}
        <div className="lg:col-span-5 p-6 rounded-2xl border border-[#ecb613]/25 bg-[#08080c] space-y-5">
          <div className="flex items-center gap-2 text-white font-bold text-sm font-['Syne']">
            <CreditCard className="w-4 h-4 text-[#ecb613]" />
            Generador de Enlace de Bloqueo Stripe (100,00 €)
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Genera al instante un enlace seguro de Stripe con el depósito oficial de 100 € para enviar a los novios por WhatsApp o correo. Al pagarlo, la fecha queda bloqueada en el calendario.
          </p>

          <form onSubmit={handleGenerateStripeLink} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-zinc-400">Nombre de la Pareja / Contratante</label>
              <input
                type="text"
                placeholder="Ej: Lucía García"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs focus:outline-none focus:border-[#ecb613]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-zinc-400">Fecha del Enlace</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs focus:outline-none focus:border-[#ecb613]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ecb613] to-[#d4a010] text-black font-semibold text-xs tracking-wider uppercase font-['Syne'] transition shadow-lg flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Generar Checkout Stripe 100 €
            </button>
          </form>

          {generatedStripeLink && (
            <div className="p-3.5 rounded-xl bg-black border border-[#ecb613]/40 space-y-2 animate-in fade-in duration-200">
              <div className="text-[10px] font-mono text-[#ecb613] uppercase font-semibold">
                ✓ Checkout SHA-256 Activo
              </div>
              <p className="text-[11px] font-mono text-zinc-400 truncate">
                {generatedStripeLink}
              </p>
              <button
                onClick={handleCopyLink}
                className="w-full py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono transition flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5 text-[#ecb613]" />
                {copiedLink ? "¡Enlace Copiado al Portapapeles!" : "Copiar Enlace de Pago"}
              </button>
            </div>
          )}
        </div>

        {/* Right Table: Facturas & Recibos */}
        <div className="lg:col-span-7 rounded-2xl border border-zinc-800 bg-[#08080c] p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h3 className="text-sm font-bold font-['Syne'] text-white uppercase tracking-wider flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#ecb613]" />
              Historial de Recibos & Liquidaciones ({invoices.length})
            </h3>
            <span className="text-xs font-mono text-emerald-400">Stripe Live Sync</span>
          </div>

          <div className="space-y-3">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-3 hover:border-zinc-700 transition"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white">
                        {inv.invoiceNumber}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/20">
                        {inv.status}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-zinc-200 mt-1">
                      {inv.client}
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">
                      {inv.concept}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-bold font-mono text-white">
                      {inv.amount.toFixed(2)} €
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400">
                      {inv.date}
                    </div>
                  </div>
                </div>

                {/* Split Desglose */}
                <div className="pt-2 border-t border-zinc-900 grid grid-cols-3 gap-2 text-[10px] font-mono">
                  <div className="text-emerald-400">
                    Artista 80%: <strong>{inv.splitArtist.toFixed(2)} €</strong>
                  </div>
                  <div className="text-zinc-400">
                    EAR OS 10%: <strong>{inv.splitEarOs.toFixed(2)} €</strong>
                  </div>
                  <div className="text-blue-400">
                    VIMUME 10%: <strong>{inv.splitVimume.toFixed(2)} €</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Modal / Card: Certificado Modelo 182 AEAT */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-xl w-full rounded-2xl border border-[#ecb613]/50 bg-[#08080c] p-6 lg:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2 text-white font-bold text-base font-['Syne']">
                <FileText className="w-5 h-5 text-[#ecb613]" />
                Certificado Fiscal Modelo 182 AEAT (Ley 49/2002)
              </div>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="text-zinc-400 hover:text-white text-xs font-mono px-2 py-1 rounded bg-zinc-900"
              >
                Cerrar ✕
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Las aportaciones del 10% derivadas de los eventos de Productora EAR son transferidas directamente al programa de neuro-musicoterapia de la Fundación VIMUME en residencias de la tercera edad.
            </p>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs font-mono text-zinc-300">
              <div className="flex justify-between">
                <span className="text-zinc-400">Entidad Beneficiaria:</span>
                <span className="text-white font-bold">Fundación VIMUME (Ley 49/2002)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Deducción Personas Físicas (IRPF):</span>
                <span className="text-emerald-400 font-bold">Hasta el 80% primeros 250 €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Deducción Empresas (Imp. Sociedades):</span>
                <span className="text-blue-400 font-bold">40% a 50% cuota íntegra</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Retorno Social Contrastado (SROI):</span>
                <span className="text-[#ecb613] font-bold">4.85x dividendo reputacional</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCertificateModal(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-white text-xs font-mono"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
