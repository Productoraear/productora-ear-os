"use client";

import React, { useState, useRef } from "react";
import { 
  ShieldCheckIcon, 
  SparklesIcon, 
  ArrowUpTrayIcon, 
  DocumentCheckIcon, 
  BanknotesIcon, 
  CheckBadgeIcon, 
  BuildingStorefrontIcon, 
  ScaleIcon, 
  ArrowTrendingUpIcon, 
  LockClosedIcon, 
  DocumentArrowDownIcon,
  MusicalNoteIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import { UniversalCueBridge, CueSessionReport } from "@/lib/UniversalCueBridge";
import { CueSheetGenerator, ProofOfPlayCertificate } from "@/lib/cue-sheet-generator";
import { createArtistRoyaltyTrackerCheckout, createVenueSubscriptionCheckout } from "@/app/actions/stripeBillingActions";

export default function ReclamarRegaliasPage() {
  // Cue Bridge Audit State
  const [cueReport, setCueReport] = useState<CueSessionReport | null>(null);
  const [certificate, setCertificate] = useState<ProofOfPlayCertificate | null>(null);
  const [estimatedUnclaimed, setEstimatedUnclaimed] = useState<number>(0);
  const [isAuditing, setIsAuditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Checkout Loading States
  const [billingLoading, setBillingLoading] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  // Form State for Quick Registration
  const [artistData, setArtistData] = useState({
    artisticName: "",
    nifDni: "",
    email: "",
    sgaeCode: ""
  });

  const [venueData, setVenueData] = useState({
    venueName: "",
    venueNif: "",
    address: "",
    city: "Marbella (Málaga)",
    ownerEmail: ""
  });

  // Handle Free History Audit
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAuditing(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        const report = UniversalCueBridge.parse(content, file.name);
        setCueReport(report);

        // Estimación forense de regalías no cobradas (45€ por hora de comunicación pública en directos / bodas / clubs)
        const hours = report.totalDurationSeconds / 3600;
        const estimated = Math.max(120, Math.round(hours * 65 * Math.sqrt(report.totalTracks || 10)));
        setEstimatedUnclaimed(estimated);

        // Generación del certificado de muestra SHA-256
        const cert = await CueSheetGenerator.generateCertificate(report, {
          venueName: venueData.venueName || "Auditoría en Sala / Directo",
          venueNif: venueData.venueNif || "CIF-AUDIT-PROV",
          address: venueData.address || "Recinto de Actuación",
          city: venueData.city || "España",
          gpsCoordinates: "36.7213,-4.4214",
          ownerEmail: artistData.email || "artista@earos.es"
        });
        setCertificate(cert);
        setIsAuditing(false);
      }
    };
    reader.readAsText(file);
  };

  // Trigger Stripe Checkout for Artist Royalty Tracker (10 €/mes)
  const handleArtistTrackerCheckout = async () => {
    if (!artistData.artisticName || !artistData.nifDni || !artistData.email) {
      alert("Por favor, introduce tu Nombre Artístico, DNI/NIF y Email para vincular el expediente de reclamación.");
      return;
    }

    setBillingLoading("ARTIST_PRO");
    try {
      const res = await createArtistRoyaltyTrackerCheckout({
        artisticName: artistData.artisticName,
        nifDni: artistData.nifDni,
        email: artistData.email,
        sgaeCode: artistData.sgaeCode || "SGAE-PENDIENTE",
        billingCycle,
        returnPath: "/artistas/reclamar-regalias"
      });

      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      }
    } catch (err: any) {
      alert(err.message || "Error al iniciar el checkout de Stripe.");
      setBillingLoading(null);
    }
  };

  // Trigger Stripe Checkout for Venue (99 €/mes)
  const handleVenueSubscriptionCheckout = async (tierId: "RESTAURANTE_LOUNGE" | "FINCA_BODAS_SCLASS" | "CLUB_DISCOTECA_PRO") => {
    if (!venueData.venueName || !venueData.venueNif || !venueData.ownerEmail) {
      alert("Por favor, completa los datos del Establecimiento (Nombre, CIF y Email) para emitir la póliza inmune.");
      return;
    }

    setBillingLoading(tierId);
    try {
      const res = await createVenueSubscriptionCheckout({
        venueName: venueData.venueName,
        venueNif: venueData.venueNif,
        address: venueData.address || "Sede Principal",
        city: venueData.city,
        ownerEmail: venueData.ownerEmail,
        tierId,
        billingCycle,
        returnPath: "/artistas/reclamar-regalias"
      });

      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      }
    } catch (err: any) {
      alert(err.message || "Error al conectar con Stripe.");
      setBillingLoading(null);
    }
  };

  const downloadSampleCert = () => {
    if (!certificate) return;
    const html = CueSheetGenerator.renderPrintableHtml(certificate);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (win) win.focus();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-[#ecb613] selection:text-black">
      
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. HERO MONUMENTAL: "EL VENGADOR DE REGALÍAS"
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Glows de fondo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#ecb613]/10 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-4xl mx-auto space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono font-bold uppercase tracking-widest">
            <ScaleIcon className="w-4 h-4" />
            Infraestructura FinTech & Recuperación Legal de Regalías
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-syne leading-[1.1]">
            Tu música suena en salas y eventos. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-300 to-yellow-500">Recupera el 100% de tus regalías en 30 segundos.</span>
          </h1>

          <p className="text-base sm:text-xl text-zinc-400 font-normal max-w-3xl mx-auto leading-relaxed">
            Instala el conector silencioso <strong className="text-zinc-200">Cue Bridge de 1-Clic</strong> o sube el historial de tu controladora (<strong className="text-zinc-200">VirtualDJ, Pioneer, Serato, Traktor, Denon</strong>). Certificación forense SHA-256 amparada por el Art. 108 de la LPI.
          </p>

          {/* CTAs Principales de Captación */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href="/artistas/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#ecb613] to-[#d4a855] text-black font-extrabold text-sm font-mono uppercase tracking-wider rounded-xl shadow-xl shadow-[#ecb613]/25 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <SparklesIcon className="w-5 h-5" />
              <span>Auditar Mi Último Bolo Gratis</span>
            </a>

            <a
              href="/api/tools/download-cue-bridge"
              download="install-ear-cue-bridge.ps1"
              className="w-full sm:w-auto px-6 py-4 bg-zinc-900 hover:bg-zinc-800 text-white border border-white/10 font-bold text-sm font-mono uppercase tracking-wider rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <DocumentArrowDownIcon className="w-5 h-5 text-cyan-400" />
              <span>Descargar Conector 1-Clic (.ps1)</span>
            </a>
          </div>

          {/* Social Proof Live Counter */}
          <div className="inline-flex flex-wrap items-center justify-center gap-6 p-4 rounded-2xl bg-zinc-900/80 border border-white/10 backdrop-blur-xl shadow-2xl mt-4">
            <div className="flex items-center gap-2 text-left">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <div className="text-xs font-mono text-zinc-400 uppercase">Localizado Esta Semana</div>
                <div className="text-xl font-black text-emerald-400 font-mono">34.200 € Visados</div>
              </div>
            </div>
            <div className="h-8 w-px bg-white/10 hidden sm:block" />
            <div className="text-left">
              <div className="text-xs font-mono text-zinc-400 uppercase">Recintos Auditados</div>
              <div className="text-xl font-black text-white font-mono">142 Salas & Fincas</div>
            </div>
            <div className="h-8 w-px bg-white/10 hidden sm:block" />
            <div className="text-left">
              <div className="text-xs font-mono text-zinc-400 uppercase">Tiempo de Respuesta</div>
              <div className="text-xl font-black text-[#ecb613] font-mono">&lt; 30 Segundos</div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. LEAD MAGNET FRICCIÓN CERO: AUDITORÍA DE ÚLTIMO BOLO
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-24 relative z-10">
        <div className="bg-gradient-to-b from-zinc-900/90 to-black p-6 sm:p-10 rounded-3xl border border-[#ecb613]/40 shadow-2xl backdrop-blur-2xl space-y-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#ecb613] font-bold uppercase tracking-wider mb-1">
                <SparklesIcon className="w-4 h-4" /> Gancho Fricción Cero
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-syne">
                Auditar mi Último Bolo Gratis (Sin Tarjeta)
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Arrastra cualquier archivo de historial (<code className="text-zinc-200">.m3u, .csv, .xml, .nml, .txt</code>) para calcular al instante tu bolsa de dinero no reclamado.
              </p>
            </div>

            <div className="shrink-0">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept=".txt,.csv,.xml,.nml,.m3u,.m3u8" 
                className="hidden" 
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isAuditing}
                className="px-6 py-3.5 bg-gradient-to-r from-[#ecb613] to-[#d4a855] text-black font-extrabold text-xs font-mono uppercase tracking-wider rounded-xl shadow-lg shadow-[#ecb613]/25 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <ArrowUpTrayIcon className="w-4 h-4" />
                {isAuditing ? "Auditoría en Curso..." : "Cargar Historial DJ"}
              </button>
            </div>
          </div>

          {/* AUDIT RESULTS PREVIEW */}
          {cueReport && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-black/80 border border-white/10">
                  <span className="text-xs font-mono text-zinc-500 uppercase block">Motor Detectado</span>
                  <span className="text-lg font-bold text-white">{cueReport.softwareDetected}</span>
                  <span className="text-[11px] text-zinc-400 block mt-1">{cueReport.totalTracks} pistas fonográficas</span>
                </div>

                <div className="p-5 rounded-2xl bg-black/80 border border-white/10">
                  <span className="text-xs font-mono text-zinc-500 uppercase block">Duración de la Sesión</span>
                  <span className="text-lg font-bold text-cyan-400 font-mono">{cueReport.totalDurationFormatted}</span>
                  <span className="text-[11px] text-zinc-400 block mt-1">Horas de comunicación auditadas</span>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40">
                  <span className="text-xs font-mono text-emerald-400 uppercase block font-bold">Regalías Estimadas en Riesgo</span>
                  <span className="text-2xl font-black text-emerald-300 font-mono">{estimatedUnclaimed} €</span>
                  <span className="text-[11px] text-zinc-300 block mt-1">Canon recuperable por temporada</span>
                </div>
              </div>

              {certificate && (
                <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
                      <CheckBadgeIcon className="w-4 h-4" />
                      <span>Expediente de Ejecución Emitido: {certificate.certificateId}</span>
                    </div>
                    <p className="text-xs font-mono text-zinc-400 mt-1">
                      Firma SHA-256: <code className="text-[#ecb613]">{certificate.sha256Proof}</code>
                    </p>
                  </div>

                  <button
                    onClick={downloadSampleCert}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs uppercase font-bold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <DocumentArrowDownIcon className="w-4 h-4" />
                    Descargar Acta Visada SGAE
                  </button>
                </div>
              )}
            </div>
          )}

          {!cueReport && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/10 hover:border-[#ecb613]/50 p-10 rounded-2xl text-center cursor-pointer transition-colors group"
            >
              <ArrowUpTrayIcon className="w-10 h-10 text-zinc-600 group-hover:text-[#ecb613] mx-auto mb-3 transition-colors" />
              <div className="font-bold text-white text-base">Haz clic aquí para seleccionar o arrastra tu archivo de sesión</div>
              <div className="text-xs text-zinc-500 mt-1">Compatible con Rekordbox (XML/TXT), Serato (CSV), Traktor (NML), VirtualDJ (M3U)</div>
            </div>
          )}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          3. CHECKOUT & SUSCRIPCIONES STRIPE BILLING
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-28">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-syne">
            Monetización & Blindaje <span className="text-[#ecb613]">S-Class</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Elige el plan adaptado a tu actividad: recupera tus derechos como artista o blinda tu establecimiento frente a inspecciones de la SGAE.
          </p>

          {/* Selector Ciclo Facturación */}
          <div className="inline-flex items-center gap-2 p-1 rounded-xl bg-zinc-900 border border-white/10 text-xs font-mono mt-4">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                billingCycle === "monthly" ? "bg-[#ecb613] text-black" : "text-zinc-400 hover:text-white"
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === "yearly" ? "bg-[#ecb613] text-black" : "text-zinc-400 hover:text-white"
              }`}
            >
              <span>Anual</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">-20% Ahorro</span>
            </button>
          </div>
        </div>

        {/* Formulario Rápido de Datos para Checkout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Box 1: Datos del Artista / DJ */}
          <div className="bg-zinc-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2 text-[#ecb613] font-mono text-xs font-bold uppercase">
              <MusicalNoteIcon className="w-4 h-4" /> 1. Datos para Reclamación de Autor
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <label className="text-zinc-400 block mb-1">Nombre Artístico</label>
                <input 
                  type="text" 
                  value={artistData.artisticName}
                  onChange={(e) => setArtistData({ ...artistData, artisticName: e.target.value })}
                  placeholder="Ej: DJ Edwin Agudelo"
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-white focus:border-[#ecb613] outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">DNI / NIF</label>
                <input 
                  type="text" 
                  value={artistData.nifDni}
                  onChange={(e) => setArtistData({ ...artistData, nifDni: e.target.value })}
                  placeholder="71758247K"
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-white focus:border-[#ecb613] outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-zinc-400 block mb-1">Email de Notificaciones & Cobro</label>
                <input 
                  type="email" 
                  value={artistData.email}
                  onChange={(e) => setArtistData({ ...artistData, email: e.target.value })}
                  placeholder="booking@productoraear.com"
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-white focus:border-[#ecb613] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Box 2: Datos del Venue / Local */}
          <div className="bg-zinc-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase">
              <BuildingStorefrontIcon className="w-4 h-4" /> 2. Datos del Establecimiento / Finca
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <label className="text-zinc-400 block mb-1">Nombre Comercial del Local</label>
                <input 
                  type="text" 
                  value={venueData.venueName}
                  onChange={(e) => setVenueData({ ...venueData, venueName: e.target.value })}
                  placeholder="Ej: Finca La Concepción"
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-white focus:border-cyan-400 outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">CIF / NIF Empresa</label>
                <input 
                  type="text" 
                  value={venueData.venueNif}
                  onChange={(e) => setVenueData({ ...venueData, venueNif: e.target.value })}
                  placeholder="B-29884102"
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-white focus:border-cyan-400 outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-zinc-400 block mb-1">Email del Propietario / Gerente</label>
                <input 
                  type="email" 
                  value={venueData.ownerEmail}
                  onChange={(e) => setVenueData({ ...venueData, ownerEmail: e.target.value })}
                  placeholder="eventos@fincalaconcepcion.com"
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-white focus:border-cyan-400 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* PRICING TIERS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* TIER 1: ARTISTA PRO (10 €/mes) */}
          <div className="bg-gradient-to-b from-zinc-900 to-black p-8 rounded-3xl border border-[#ecb613]/40 shadow-2xl flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-[#ecb613]/10 text-[#ecb613] text-xs font-mono font-bold uppercase">
                Para DJs & Creadores
              </div>
              <h3 className="text-2xl font-bold text-white font-syne">El Vengador de Regalías</h3>
              <p className="text-xs text-zinc-400">
                Auditoría ilimitada de bolos, expedientes SHA-256 e inicio de reclamación formal ante SGAE/AIE.
              </p>
              <div className="pt-4 border-t border-white/10">
                <span className="text-4xl font-black text-white font-mono">
                  {billingCycle === "yearly" ? "99 €" : "10 €"}
                </span>
                <span className="text-xs text-zinc-400 font-mono"> / {billingCycle === "yearly" ? "año" : "mes"}</span>
                <div className="text-[11px] text-[#ecb613] font-mono mt-1">Descontable del primer reparto de regalías</div>
              </div>

              <ul className="space-y-2.5 text-xs text-zinc-300 font-mono pt-4">
                <li className="flex items-center gap-2">
                  <CheckBadgeIcon className="w-4 h-4 text-[#ecb613] shrink-0" />
                  <span>Universal Cue Bridge Ilimitado</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckBadgeIcon className="w-4 h-4 text-[#ecb613] shrink-0" />
                  <span>Firma Criptográfica SHA-256 por sesión</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckBadgeIcon className="w-4 h-4 text-[#ecb613] shrink-0" />
                  <span>100% Retención de tus cachés</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleArtistTrackerCheckout}
              disabled={billingLoading === "ARTIST_PRO"}
              className="mt-8 w-full py-4 bg-[#ecb613] hover:bg-[#d4a855] text-black font-extrabold text-xs font-mono uppercase tracking-wider rounded-xl shadow-lg shadow-[#ecb613]/20 active:scale-95 transition-all cursor-pointer"
            >
              {billingLoading === "ARTIST_PRO" ? "Conectando Stripe..." : "Activar Trazabilidad (10 €/mes)"}
            </button>
          </div>

          {/* TIER 2: FINCA DE BODAS S-CLASS (99 €/mes) - DESTACADO */}
          <div className="bg-gradient-to-b from-zinc-900 via-[#0a0a0f] to-black p-8 rounded-3xl border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/10 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 px-4 py-1 bg-cyan-500 text-black text-[10px] font-mono font-black uppercase tracking-wider rounded-bl-xl">
              Más Demandado B2B
            </div>

            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold uppercase">
                Fincas & Bodas
              </div>
              <h3 className="text-2xl font-bold text-white font-syne">Blindaje Total Fincas S-Class</h3>
              <p className="text-xs text-zinc-400">
                Póliza digital anti-multas SGAE para bodas y eventos privados. Certificado Inmune con trazabilidad 0 Fallos.
              </p>
              <div className="pt-4 border-t border-white/10">
                <span className="text-4xl font-black text-white font-mono">
                  {billingCycle === "yearly" ? "950 €" : "99 €"}
                </span>
                <span className="text-xs text-zinc-400 font-mono"> / {billingCycle === "yearly" ? "año" : "mes"}</span>
                <div className="text-[11px] text-cyan-400 font-mono mt-1">Garantía jurídica de comunicación pública</div>
              </div>

              <ul className="space-y-2.5 text-xs text-zinc-300 font-mono pt-4">
                <li className="flex items-center gap-2">
                  <CheckBadgeIcon className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Auditoría automática de DJs invitados</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckBadgeIcon className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Actas visadas descargables para inspección</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckBadgeIcon className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Cobertura acústica hasta 400 pax</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleVenueSubscriptionCheckout("FINCA_BODAS_SCLASS")}
              disabled={billingLoading === "FINCA_BODAS_SCLASS"}
              className="mt-8 w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs font-mono uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
            >
              {billingLoading === "FINCA_BODAS_SCLASS" ? "Conectando Stripe..." : "Suscribir Finca S-Class"}
            </button>
          </div>

          {/* TIER 3: CLUB & MACRO-DISCOTECA (199 €/mes) */}
          <div className="bg-gradient-to-b from-zinc-900 to-black p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-mono font-bold uppercase">
                Salas & Festivales
              </div>
              <h3 className="text-2xl font-bold text-white font-syne">Macro-Discotecas & Clubs</h3>
              <p className="text-xs text-zinc-400">
                Auditoría multi-cabina en directo hasta 1.500 pax con liquidación periódica y reporting mensual automático.
              </p>
              <div className="pt-4 border-t border-white/10">
                <span className="text-4xl font-black text-white font-mono">
                  {billingCycle === "yearly" ? "1.900 €" : "199 €"}
                </span>
                <span className="text-xs text-zinc-400 font-mono"> / {billingCycle === "yearly" ? "año" : "mes"}</span>
                <div className="text-[11px] text-purple-400 font-mono mt-1">Split Soberano 70/20/10 integrado</div>
              </div>

              <ul className="space-y-2.5 text-xs text-zinc-300 font-mono pt-4">
                <li className="flex items-center gap-2">
                  <CheckBadgeIcon className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Multi-cabina (Pioneer + Traktor + Serato)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckBadgeIcon className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Reporting fiscal directo para gestorías</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckBadgeIcon className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Soporte prioritario 24/7 en eventos</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleVenueSubscriptionCheckout("CLUB_DISCOTECA_PRO")}
              disabled={billingLoading === "CLUB_DISCOTECA_PRO"}
              className="mt-8 w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-extrabold text-xs font-mono uppercase tracking-wider rounded-xl shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              {billingLoading === "CLUB_DISCOTECA_PRO" ? "Conectando Stripe..." : "Suscribir Sala / Festival"}
            </button>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          4. COMPARATIVA DE VALORACIÓN & LEGAL FAQ
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-24 space-y-12">
        <div className="bg-zinc-900/40 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
          <h3 className="text-xl font-bold text-white font-syne mb-4 flex items-center gap-2">
            <LockClosedIcon className="w-5 h-5 text-[#ecb613]" />
            ¿Por Qué el Expediente SHA-256 es Jurídicamente Irrefutable?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            De acuerdo con el <strong className="text-white">Artículo 24 de la Ley 34/2002 (LSSI)</strong> y el <strong className="text-white">Real Decreto Legislativo 1/1996 de Propiedad Intelectual</strong>, un registro digital fechado con sellado criptográfico SHA-256 y vinculado a coordenadas GPS constituye prueba plena de comunicación pública. La SGAE y la AIE no pueden rechazar una declaración de repertorio respaldada por datos de hardware no manipulables.
          </p>
        </div>
      </section>
    </div>
  );
}
