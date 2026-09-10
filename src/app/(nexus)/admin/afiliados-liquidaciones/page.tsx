"use client";

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, ShieldCheck, DollarSign, FileText, 
  CheckCircle2, AlertCircle, Clock, Download, Zap
} from 'lucide-react';

export default function LiquidacionCeroFriccionPage() {
  const liquidaciones = [
    { ref: 'LIQ-9921', partner: 'Finca Histórica Méntrida', evento: 'Boda M&J (24/09)', base: 4500, comision: 450, status: 'Pendiente Pago', date: 'Vence en 48h' },
    { ref: 'LIQ-9920', partner: 'Palacio Villafiel', evento: 'Gala B2B Institucional', base: 12000, comision: 1200, status: 'Pagado', date: 'Procesado (Stripe)' },
    { ref: 'LIQ-9919', partner: 'Atelier Bodas Madrid VIP', evento: 'Boda Express', base: 2800, comision: 224, status: 'Pagado', date: 'Procesado (Transferencia)' },
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-[#fcfbf9] p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Cabecera */}
        <header className="flex justify-between items-center border-b border-[#1f1f1f] pb-4">
          <Link href="/admin" className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400 hover:text-[#8e44ad] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Centro de Mando
          </Link>
          <div className="flex items-center gap-2 bg-[#0a1a0f] border border-[#27ae60]/40 px-3 py-1 rounded-lg text-xs font-mono text-[#27ae60]">
            <span className="w-2 h-2 rounded-full bg-[#27ae60] animate-pulse" /> Cámara de Compensación Activa
          </div>
        </header>

        {/* Título de Sección */}
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full mb-3">
            <DollarSign className="w-3.5 h-3.5" /> Tesorería B2B
          </div>
          <h1 className="text-3xl font-black text-white">Liquidación Cero-Fricción</h1>
          <p className="text-gray-400 text-sm mt-1">Clearing house para comisiones de prescriptores. Ejecución de pagos y generación de autofacturas.</p>
        </div>

        {/* Dashboard Financiero Superior */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#080808] border border-[#1f1f1f] p-6 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Clock className="w-16 h-16" /></div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Pendiente de Liquidar</span>
            <div className="text-3xl font-black text-amber-400 mt-2">450,00 €</div>
            <p className="text-[10px] text-gray-500 font-mono mt-1">1 orden en cola (SLA: 72h)</p>
          </div>
          
          <div className="bg-[#080808] border border-[#1f1f1f] p-6 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><CheckCircle2 className="w-16 h-16" /></div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Liquidado (YTD)</span>
            <div className="text-3xl font-black text-emerald-400 mt-2">1.424,00 €</div>
            <p className="text-[10px] text-gray-500 font-mono mt-1">2 órdenes procesadas con éxito</p>
          </div>

          <div className="bg-[#080808] border border-[#1f1f1f] p-6 rounded-xl relative overflow-hidden border-t-2 border-t-[#8e44ad]">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Zap className="w-16 h-16" /></div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Flujo Stripe Connect</span>
            <div className="text-xl font-bold text-white mt-2">Modo Híbrido</div>
            <p className="text-[10px] text-gray-500 font-mono mt-2">SEPA + Tarjeta Soportado</p>
          </div>
        </div>

        {/* Libro Mayor (Ledger) de Órdenes */}
        <div className="bg-[#080808] border border-[#1f1f1f] rounded-xl overflow-hidden mt-6">
          <div className="p-4 border-b border-[#1f1f1f] flex justify-between items-center bg-[#0c0c0c]">
            <h3 className="text-sm font-bold text-white">Libro de Órdenes de Compensación</h3>
            <button className="flex items-center gap-2 text-[10px] uppercase font-bold text-gray-400 hover:text-white transition-colors bg-[#141414] border border-[#222] px-3 py-1.5 rounded">
              <Download className="w-3 h-3" /> Exportar CSV
            </button>
          </div>
          
          <table className="w-full text-left text-xs">
            <thead className="text-gray-500 uppercase tracking-wider font-mono text-[10px] bg-[#080808]">
              <tr>
                <th className="px-6 py-4">Ref. / Fecha</th>
                <th className="px-6 py-4">Beneficiario (Partner)</th>
                <th className="px-6 py-4">Evento Base</th>
                <th className="px-6 py-4">Comisión Emitida</th>
                <th className="px-6 py-4">Estado SLA</th>
                <th className="px-6 py-4 text-right">Ejecución</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141414]">
              {liquidaciones.map((liq, idx) => (
                <tr key={idx} className="hover:bg-[#111] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white font-mono">{liq.ref}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{liq.date}</div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-300">{liq.partner}</td>
                  <td className="px-6 py-4 text-gray-400">{liq.evento} <br/><span className="text-[9px] text-gray-600 font-mono">Base: {liq.base}€</span></td>
                  <td className="px-6 py-4">
                    <span className="font-black text-lg text-white">{liq.comision} €</span>
                  </td>
                  <td className="px-6 py-4">
                    {liq.status === 'Pagado' ? (
                      <span className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-bold uppercase"><CheckCircle2 className="w-3.5 h-3.5" /> Procesado</span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-amber-500 text-[10px] font-bold uppercase"><AlertCircle className="w-3.5 h-3.5 animate-pulse" /> Pendiente</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {liq.status === 'Pagado' ? (
                      <button className="text-gray-500 hover:text-white transition-colors" title="Descargar Autofactura">
                        <FileText className="w-4 h-4 ml-auto" />
                      </button>
                    ) : (
                      <button className="bg-amber-500 text-black px-3 py-1.5 rounded text-[10px] font-bold hover:bg-amber-400 transition-colors">
                        Emitir Pago
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      </div>
    </div>
  );
}
