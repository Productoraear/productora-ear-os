'use client';

/**
 * 👑 EAR OS V2 — VISTA PÚBLICA INTERACTIVA DE PROPUESTA S-CLASS
 * ------------------------------------------------------------------
 * Interfaz interactiva para el cliente (novios / organizadores).
 * Permite alternar opcionales en vivo con recálculo determinista en céntimos,
 * firma digital manuscrita y pasarela de depósito Stripe 100 € con Price-Lock.
 */

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  Printer,
  ShieldCheck,
  Sparkles,
  CreditCard,
  FileCheck2,
  HeartHandshake,
} from 'lucide-react';
import type { SovereignProposal, ProposalLineItem } from '@/lib/proposals/proposal-types';
import { calcularTotalesPropuesta, formatoEuros } from '@/lib/proposals/proposal-calculator';
import { ProposalSignatureCanvas } from './ProposalSignatureCanvas';

interface ProposalInteractiveClientProps {
  propuestaInicial: SovereignProposal;
}

export function ProposalInteractiveClient({ propuestaInicial }: ProposalInteractiveClientProps) {
  const [propuesta, setPropuesta] = useState<SovereignProposal>(propuestaInicial);
  const [isSigningOpen, setIsSigningOpen] = useState(false);
  const [updatingOptionId, setUpdatingOptionId] = useState<string | null>(null);

  // Recálculo determinista
  const totales = useMemo(() => {
    return calcularTotalesPropuesta(propuesta.lineas, propuesta.ivaPct, propuesta.descuentoPct);
  }, [propuesta.lineas, propuesta.ivaPct, propuesta.descuentoPct]);

  const lineasFijas = propuesta.lineas.filter(l => !l.esOpcional);
  const lineasOpcionales = propuesta.lineas.filter(l => l.esOpcional);

  const handleToggleOption = async (lineaId: string, actual: boolean) => {
    setUpdatingOptionId(lineaId);
    const nuevoEstado = !actual;

    // Actualización optimista
    setPropuesta(prev => ({
      ...prev,
      lineas: prev.lineas.map(l =>
        l.id === lineaId ? { ...l, seleccionada: nuevoEstado } : l
      ),
    }));

    try {
      await fetch('/api/proposals/option-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: propuesta.token,
          lineaId,
          seleccionada: nuevoEstado,
        }),
      });
    } catch {
      // Revertir en fallo
      setPropuesta(prev => ({
        ...prev,
        lineas: prev.lineas.map(l =>
          l.id === lineaId ? { ...l, seleccionada: actual } : l
        ),
      }));
    } finally {
      setUpdatingOptionId(null);
    }
  };

  const handleSignatureSuccess = () => {
    setIsSigningOpen(false);
    setPropuesta(prev => ({
      ...prev,
      estado: 'ganado',
      firma: {
        fecha: new Date().toLocaleDateString('es-ES'),
        hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        ip: 'Firmado Digitalmente',
        dispositivo: 'Navegador Web S-Class',
        pngBase64: '',
      },
    }));
  };

  const handleStripeCheckout = () => {
    // Redirige al checkout con Price-Lock
    window.location.href = `/api/stripe/checkout?token=${propuesta.token}&type=proposal_deposit`;
  };

  return (
    <div className="w-full min-h-screen bg-[#030305] text-white selection:bg-[#ecb613] selection:text-black">
      {/* Barra superior de acciones para móvil y escritorio */}
      <nav className="no-imprimir sticky top-0 z-40 border-b border-[#ecb613]/20 bg-[#050507]/90 backdrop-blur-md px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono tracking-widest uppercase text-neutral-400">
              Propuesta Oficial #{propuesta.numero}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-lg border border-white/10 hover:border-[#ecb613]/50 text-neutral-300 hover:text-white transition-colors"
              title="Descargar o Imprimir PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
            {propuesta.estado !== 'ganado' ? (
              <button
                onClick={() => setIsSigningOpen(true)}
                className="px-4 py-1.5 rounded-lg bg-[#ecb613] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#d8a40f] transition-all shadow-md shadow-[#ecb613]/20"
              >
                Firmar Propuesta
              </button>
            ) : (
              <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Aceptada & Firmada
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* Contenedor central del dossier */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Cabecera de la propuesta */}
        <header data-seccion="cabecera" className="border-b border-white/10 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-mono font-semibold tracking-widest text-[#ecb613] uppercase">
                Productora EAR · Infraestructura Audiovisual S-Class
              </span>
              <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold text-white font-syne tracking-tight">
                {propuesta.titulo}
              </h1>
              <p className="mt-2 text-sm text-neutral-400">
                Propuesta técnica personalizada para {propuesta.cliente.nombre}.
              </p>
            </div>

            <div className="bg-[#08080c] border border-white/10 rounded-xl p-4 text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-neutral-300">
                <Calendar className="w-4 h-4 text-[#ecb613]" />
                <span>Fecha evento: <strong className="text-white">{propuesta.cliente.fechaEvento}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <MapPin className="w-4 h-4 text-[#ecb613]" />
                <span>Espacio: <strong className="text-white">{propuesta.cliente.fincaOEspacio}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <Users className="w-4 h-4 text-[#ecb613]" />
                <span>Aforo estimado: <strong className="text-white">{propuesta.cliente.paxEstimado} pax</strong></span>
              </div>
            </div>
          </div>
        </header>

        {/* Resumen & Rider Acústico */}
        <section data-seccion="resumen" className="mt-8 rounded-2xl border border-[#ecb613]/20 bg-[#060609] p-6">
          <div className="flex items-center gap-2 text-sm font-bold text-[#ecb613] uppercase tracking-wider font-mono">
            <Sparkles className="w-4 h-4" />
            Compromiso de Calidad Acústica S-Class
          </div>
          <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Toda la producción cuenta con microfonía inalámbrica profesional (Shure Beta 87A), columnas activas de alta presión sonora Bose F1 / S1 Pro ajustadas a 12 W/pax y técnico residente durante toda la duración del servicio.
          </p>
        </section>

        {/* Partidas fijas de la propuesta */}
        <section data-seccion="capitulos" className="mt-8">
          <h2 className="text-sm font-mono uppercase tracking-widest text-neutral-400">
            Servicios Principales Incluidos
          </h2>
          <div className="mt-4 space-y-3">
            {lineasFijas.map((linea) => (
              <div
                key={linea.id}
                className="flex items-start justify-between gap-4 p-4 rounded-xl border border-white/10 bg-[#07070b] hover:border-white/20 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-[#ecb613] border border-white/10">
                      {linea.capitulo}
                    </span>
                    <h3 className="text-sm sm:text-base font-semibold text-white truncate">
                      {linea.descripcion}
                    </h3>
                  </div>
                  {linea.motivoIa && (
                    <p className="mt-1 text-xs text-amber-400 font-mono">
                      {linea.motivoIa}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-sm sm:text-base font-bold font-mono text-white">
                    {formatoEuros(linea.totalCéntimos)}
                  </span>
                  <span className="block text-[10px] text-neutral-400">
                    Base sin IVA
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Partidas opcionales interactivas */}
        {lineasOpcionales.length > 0 && (
          <section data-seccion="opcionales" className="mt-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-mono uppercase tracking-widest text-[#ecb613]">
                  Opciones y Servicios Adicionales (Configurables)
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Marca o desmarca los extras según tus preferencias. El importe total se actualiza al instante.
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {lineasOpcionales.map((linea) => {
                const isSelected = linea.seleccionada;
                const isBusy = updatingOptionId === linea.id;

                return (
                  <div
                    key={linea.id}
                    onClick={() => handleToggleOption(linea.id, isSelected)}
                    className={`cursor-pointer flex items-center justify-between gap-4 p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-[#ecb613] bg-[#ecb613]/5 shadow-lg shadow-[#ecb613]/5'
                        : 'border-white/10 bg-[#07070b]/60 hover:border-white/25 opacity-80'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          isSelected
                            ? 'bg-[#ecb613] border-[#ecb613] text-black'
                            : 'border-neutral-500 bg-transparent'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-4 h-4" />}
                      </div>

                      <div className="min-w-0">
                        <span className="text-[10px] font-mono uppercase text-neutral-400">
                          {linea.capitulo} · Opcional
                        </span>
                        <h4 className={`text-sm sm:text-base font-medium ${isSelected ? 'text-white font-semibold' : 'text-neutral-300'}`}>
                          {linea.descripcion}
                        </h4>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-sm sm:text-base font-bold font-mono ${isSelected ? 'text-[#ecb613]' : 'text-neutral-400'}`}>
                        +{formatoEuros(linea.totalCéntimos)}
                      </span>
                      <span className="block text-[10px] text-neutral-400">
                        {isBusy ? 'Actualizando...' : isSelected ? 'Añadido' : 'No incluido'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Desglose total y Split Soberano */}
        <section data-seccion="total" className="mt-12 rounded-2xl border border-[#ecb613]/30 bg-[#08080d] p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Split Soberano 80/10/10 Badge */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#ecb613] font-bold">
                <HeartHandshake className="w-4 h-4 text-emerald-400" />
                Split Soberano 80/10/10 & Retorno Social VIMUME
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                El <strong>80%</strong> de tu presupuesto retribuye directamente a los músicos y técnicos ejecutores en digna retribución sin intermediarios parasitarios. El <strong>10%</strong> financia sesiones de neuro-musicoterapia VIMUME (Ley 49/2002 con SROI 4.85x) y el <strong>10%</strong> cubre la pasarela técnica y soporte EAR OS.
              </p>
              <div className="flex items-center gap-4 text-xs font-mono text-neutral-400 pt-1">
                <span>Artista: <strong className="text-white">{formatoEuros(totales.split.artistaCéntimos)}</strong></span>
                <span>EAR OS: <strong className="text-white">{formatoEuros(totales.split.earOsCéntimos)}</strong></span>
                <span>VIMUME: <strong className="text-emerald-400">{formatoEuros(totales.split.vimumeCéntimos)}</strong></span>
              </div>
            </div>

            {/* Total final */}
            <div className="bg-[#040406] border border-white/10 rounded-xl p-6 text-right space-y-2">
              <div className="flex justify-between text-xs text-neutral-400">
                <span>Base Imponible:</span>
                <span className="font-mono text-white">{formatoEuros(totales.baseCéntimos)}</span>
              </div>
              <div className="flex justify-between text-xs text-neutral-400">
                <span>IVA ({totales.ivaPct}%):</span>
                <span className="font-mono text-white">{formatoEuros(totales.ivaImporteCéntimos)}</span>
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                <span className="text-sm font-bold uppercase tracking-wider text-neutral-200">
                  Total Presupuesto:
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#ecb613] font-mono">
                  {formatoEuros(totales.totalCéntimos)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Firma & Depósito Stripe 100€ */}
        <section data-seccion="firma" className="mt-8 rounded-2xl border border-white/10 bg-[#07070b] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-white font-syne">
                Formalización y Bloqueo de Fecha
              </h3>
              <p className="mt-1 text-xs text-neutral-400 max-w-lg">
                Bloquea el rider técnico y los artistas para el <strong>{propuesta.cliente.fechaEvento}</strong> en <strong>{propuesta.cliente.fincaOEspacio}</strong> formalizando la fianza de 100 € en Stripe bajo Price-Lock SHA-256.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {propuesta.estado !== 'ganado' ? (
                <button
                  onClick={() => setIsSigningOpen(true)}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <FileCheck2 className="w-4 h-4 text-[#ecb613]" />
                  1. Firmar Digitalmente
                </button>
              ) : (
                <div className="px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Firmado el {propuesta.firma?.fecha} a las {propuesta.firma?.hora}
                </div>
              )}

              <button
                onClick={handleStripeCheckout}
                className="px-6 py-3 rounded-xl bg-[#ecb613] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-[#d8a40f] flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#ecb613]/20 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                Bloquear Fecha (100 € Stripe)
              </button>
            </div>
          </div>
        </section>

        {/* Modal de Firma Manuscrita */}
        {isSigningOpen && (
          <ProposalSignatureCanvas
            token={propuesta.token}
            totalFormateado={formatoEuros(totales.totalCéntimos)}
            onFirmadoExitoso={handleSignatureSuccess}
            onCancelar={() => setIsSigningOpen(false)}
          />
        )}
      </main>
    </div>
  );
}
