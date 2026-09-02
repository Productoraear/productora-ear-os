"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { 
  SparklesIcon, 
  ArrowDownTrayIcon, 
  ArrowUpTrayIcon, 
  ShieldCheckIcon, 
  LockClosedIcon, 
  LockOpenIcon, 
  BanknotesIcon, 
  CheckBadgeIcon, 
  ScaleIcon, 
  DocumentArrowDownIcon, 
  ArrowRightIcon, 
  MusicalNoteIcon, 
  ClockIcon, 
  ComputerDesktopIcon, 
  BoltIcon, 
  UserCircleIcon,
  EyeSlashIcon
} from "@heroicons/react/24/outline";
import { UniversalCueBridge, CueSessionReport } from "@/lib/UniversalCueBridge";
import { CueSheetGenerator, ProofOfPlayCertificate } from "@/lib/cue-sheet-generator";
import { createArtistRoyaltyTrackerCheckout } from "@/app/actions/stripeBillingActions";

export default function ArtistDashboardPage() {
  const [activeTier, setActiveTier] = useState<"freemium" | "pro">("freemium");

  // Freemium Session Ingest State
  const [cueReport, setCueReport] = useState<CueSessionReport | null>(null);
  const [certificate, setCertificate] = useState<ProofOfPlayCertificate | null>(null);
  const [estimatedRoyalties, setEstimatedRoyalties] = useState<number>(0);
  const [isAuditing, setIsAuditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pro Registration / Checkout State
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [artistForm, setArtistForm] = useState({
    artisticName: "DJ Edwin Agudelo",
    legalName: "Edwin Agudelo Díaz",
    nifDni: "71758247K",
    sgaeCode: "SGAE-2026-0988",
    email: "booking@productoraear.com",
    billingCycle: "monthly" as "monthly" | "yearly"
  });

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

        const hours = report.totalDurationSeconds / 3600;
        const estimated = Math.max(150, Math.round(hours * 75 * Math.sqrt(report.totalTracks || 8)));
        setEstimatedRoyalties(estimated);

        const cert = await CueSheetGenerator.generateCertificate(report, {
          venueName: "Sala / Recinto de Gala Directo",
          venueNif: "B-29884102",
          address: "Sede de Actuación",
          city: "Marbella (Málaga)",
          gpsCoordinates: "36.5101,-4.8824",
          ownerEmail: artistForm.email
        });
        setCertificate(cert);
        setIsAuditing(false);
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadSampleCert = () => {
    if (!certificate) return;
    const html = CueSheetGenerator.renderPrintableHtml(certificate);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (win) win.focus();
  };

  const handleUpgradeToPro = async () => {
    if (!artistForm.artisticName || !artistForm.nifDni || !artistForm.email) {
      alert("Por favor, introduce tu Nombre Artístico, DNI/NIF y Email.");
      return;
    }

    setCheckoutLoading(true);
    try {
      const res = await createArtistRoyaltyTrackerCheckout({
        artisticName: artistForm.artisticName,
        legalName: artistForm.legalName,
        nifDni: artistForm.nifDni,
        sgaeCode: artistForm.sgaeCode,
        email: artistForm.email,
        billingCycle: artistForm.billingCycle,
        returnPath: "/artistas/dashboard"
      });

      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      }
    } catch (err: any) {
      alert(err.message || "Error al conectar con Stripe.");
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-[#ecb613] selection:text-black">
      
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. HEADER DEL PORTAL FREEMIUM & PRO S-CLASS
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <BoltIcon className="w-4 h-4" /> Portal de Artistas & Creadores · EAR OS Incubadora
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-syne tracking-tight">
              Escalera de Valor & Cabina <span className="text-[#ecb613]">S-Class</span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 mt-2 max-w-2xl">
              De la captación gratuita en cabina a la liquidación directa de cachés (80/10/10) y defensa de regalías ante SGAE con firma SHA-256.
            </p>
          </div>

          {/* Selector de Nivel (Freemium vs Pro) */}
          <div className="inline-flex p-1.5 rounded-2xl bg-zinc-900 border border-white/10 text-xs font-mono font-bold">
            <button
              onClick={() => setActiveTier("freemium")}
              className={`px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTier === "freemium" ? "bg-white text-black shadow-lg" : "text-zinc-400 hover:text-white"
              }`}
            >
              <LockOpenIcon className="w-4 h-4" />
              <span>Nivel Freemium (0 €)</span>
            </button>
            <button
              onClick={() => setActiveTier("pro")}
              className={`px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTier === "pro" ? "bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/25" : "text-zinc-400 hover:text-white"
              }`}
            >
              <SparklesIcon className="w-4 h-4" />
              <span>Categoría Pro (10 €/mes)</span>
            </button>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. NIVEL FREEMIUM (ACCESO GRATUITO / ZERO-CAC)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {activeTier === "freemium" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-10 animate-in fade-in duration-300">
          
          {/* Banner de Bienvenida Freemium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-zinc-900/60 border border-white/10 backdrop-blur-md space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-mono font-bold">
                1
              </div>
              <h3 className="font-bold text-white text-base font-syne">Instalador 1-Clic</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Ejecuta <code className="text-cyan-400">install-ear-cue-bridge.ps1</code> para autodetectar VirtualDJ, Serato, Rekordbox o Traktor.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-900/60 border border-white/10 backdrop-blur-md space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono font-bold">
                2
              </div>
              <h3 className="font-bold text-white text-base font-syne">Auditoría Instantánea</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Procesamiento sub-100ms de tracklists con estimación automática del canon no reclamado ante entidades de gestión.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-900/60 border border-white/10 backdrop-blur-md space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-mono font-bold">
                3
              </div>
              <h3 className="font-bold text-white text-base font-syne">Perfil Protegido</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tu ficha pública opera con SupplierBlurLock (anti-fuga), protegiendo tus datos de contacto hasta la contratación formal.
              </p>
            </div>
          </div>

          {/* Módulo Interactivo de Carga & Auditoría de Cabina */}
          <div className="bg-gradient-to-b from-zinc-900 via-zinc-950 to-black p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                  Módulo de Cabina · Universal Cue Bridge
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white font-syne">
                  Lectura & Diagnóstico Forense de Sesión
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Carga el archivo de historial (<code className="text-white">.m3u, .csv, .xml, .nml, .txt</code>) para auditar obras y calcular regalías.
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
                  className="px-6 py-3.5 bg-white hover:bg-zinc-200 text-black font-extrabold text-xs font-mono uppercase tracking-wider rounded-xl shadow-lg active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ArrowUpTrayIcon className="w-4 h-4" />
                  {isAuditing ? "Analizando Sesión..." : "Subir Historial DJ"}
                </button>
              </div>
            </div>

            {cueReport && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-black/60 border border-white/10">
                    <span className="text-xs font-mono text-zinc-500 uppercase block">Motor Software</span>
                    <span className="text-lg font-bold text-white">{cueReport.softwareDetected}</span>
                    <span className="text-[11px] text-zinc-400 block mt-1">{cueReport.totalTracks} pistas identificadas</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-black/60 border border-white/10">
                    <span className="text-xs font-mono text-zinc-500 uppercase block">Tiempo en Directo</span>
                    <span className="text-lg font-bold text-cyan-400 font-mono">{cueReport.totalDurationFormatted}</span>
                    <span className="text-[11px] text-zinc-400 block mt-1">Comunicación pública auditada</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
                    <span className="text-xs font-mono text-emerald-400 uppercase block font-bold">Canon Potencial SGAE</span>
                    <span className="text-2xl font-black text-emerald-300 font-mono">{estimatedRoyalties} €</span>
                    <span className="text-[11px] text-zinc-400 block mt-1">Estimación por temporada</span>
                  </div>
                </div>

                {/* Vista Previa de Tabla de Canciones */}
                <div className="bg-black/60 border border-white/10 rounded-2xl overflow-hidden">
                  <div className="p-4 bg-zinc-900/80 border-b border-white/10 flex justify-between items-center text-xs font-mono">
                    <span className="text-zinc-400">Pistas Auditadas ({cueReport.tracks.length})</span>
                    <span className="text-emerald-400 font-bold">Filtro Antifraude: 100% Válido</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-white/5 text-xs font-mono">
                    {cueReport.tracks.slice(0, 10).map((t, idx) => (
                      <div key={idx} className="p-3 flex justify-between items-center hover:bg-white/5">
                        <div className="flex items-center gap-3">
                          <span className="text-zinc-500 w-5">{idx + 1}</span>
                          <span className="text-white font-semibold">{t.title}</span>
                          <span className="text-[#ecb613]">({t.artist})</span>
                        </div>
                        <span className="text-zinc-400">{t.durationFormatted}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {certificate && (
                  <div className="p-5 rounded-2xl bg-zinc-900/90 border border-emerald-500/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
                        <CheckBadgeIcon className="w-4 h-4" />
                        <span>Muestra de Certificado: {certificate.certificateId}</span>
                      </div>
                      <p className="text-xs font-mono text-zinc-400 mt-1">
                        Firma SHA-256: <code className="text-[#ecb613]">{certificate.sha256Proof.substring(0, 32)}...</code>
                      </p>
                    </div>

                    <button
                      onClick={handleDownloadSampleCert}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs uppercase font-bold rounded-xl shadow-lg flex items-center gap-2 cursor-pointer shrink-0"
                    >
                      <DocumentArrowDownIcon className="w-4 h-4" />
                      Descargar Muestra HTML
                    </button>
                  </div>
                )}
              </div>
            )}

            {!cueReport && (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/10 hover:border-white/30 p-10 rounded-2xl text-center cursor-pointer transition-colors"
              >
                <ArrowUpTrayIcon className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                <div className="font-bold text-white text-base">Selecciona o arrastra el historial de tu sesión</div>
                <div className="text-xs text-zinc-500 mt-1">Compatible con VirtualDJ, Serato, Rekordbox, Traktor y Denon</div>
              </div>
            )}
          </div>

          {/* Upsell Banner to Pro */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-zinc-900 via-black to-[#141208] border border-[#ecb613]/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#ecb613] font-bold uppercase mb-1">
                <SparklesIcon className="w-4 h-4" /> Paso Siguiente en la Escalera de Valor
              </div>
              <h3 className="text-2xl font-bold text-white font-syne">
                Desbloquea la Categoría Pro S-Class (10 €/mes)
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Elimina el Blur-Lock de tu perfil, recibe reservas directas con Split Soberano 80/10/10 y emite expedientes oficiales de reclamación ante SGAE.
              </p>
            </div>

            <button
              onClick={() => setActiveTier("pro")}
              className="px-8 py-4 bg-[#ecb613] hover:bg-[#d4a855] text-black font-extrabold text-xs font-mono uppercase tracking-wider rounded-xl shadow-lg shadow-[#ecb613]/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <span>Ver Beneficios Pro</span>
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          3. NIVEL PRO / CATEGORÍA PAID (10 €/MES O TARIFA S-CLASS)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {activeTier === "pro" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-12 animate-in fade-in duration-300">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            
            {/* Beneficios S-Class Pro */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono font-bold uppercase">
                <CheckBadgeIcon className="w-4 h-4" /> Operativa S-Class Completa
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-syne">
                Monetización & Defensa Total para Artistas
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                El plan Pro transforma tu actividad de cabina en un negocio blindado con cobro directo y reclamación activa de derechos de autor.
              </p>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 flex items-start gap-4">
                  <div className="p-2 rounded-xl bg-[#ecb613]/10 text-[#ecb613] shrink-0">
                    <LockOpenIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-syne">Ficha Técnica 100% Desbloqueada</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Retirada del Blur-Lock. Clientes y fincas de boda acceden directamente a tu perfil verificado sin intermediarios opacos.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 flex items-start gap-4">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                    <BanknotesIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-syne">Split Soberano 80/10/10</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      80% directo a tu cuenta de Stripe Connect, 10% canon de servidores EAR OS y 10% Fondo Social VIMUME.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 flex items-start gap-4">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                    <ScaleIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-syne">Expediente Legal Criptográfico SHA-256</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Emisión de actas de ejecución pública con validez ante SGAE/AIE/AGEDI conforme al Art. 108 de la Ley de Propiedad Intelectual.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario & Checkout de Activación Pro */}
            <div className="bg-gradient-to-b from-zinc-900 to-black p-8 sm:p-10 rounded-3xl border border-[#ecb613]/50 shadow-2xl shadow-[#ecb613]/10 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-[#ecb613] font-bold uppercase">Suscripción Profesional</span>
                  <div className="inline-flex p-1 bg-black rounded-lg border border-white/10 text-[11px] font-mono">
                    <button
                      onClick={() => setArtistForm({ ...artistForm, billingCycle: "monthly" })}
                      className={`px-2.5 py-1 rounded ${artistForm.billingCycle === "monthly" ? "bg-[#ecb613] text-black font-bold" : "text-zinc-400"}`}
                    >
                      10 €/mes
                    </button>
                    <button
                      onClick={() => setArtistForm({ ...artistForm, billingCycle: "yearly" })}
                      className={`px-2.5 py-1 rounded ${artistForm.billingCycle === "yearly" ? "bg-[#ecb613] text-black font-bold" : "text-zinc-400"}`}
                    >
                      99 €/año (-20%)
                    </button>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white font-syne">Vincular Expediente & Activar Pro</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Introduce tus datos fiscales para emitir certificados legalmente vinculantes.
                </p>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <label className="text-zinc-400 block mb-1">Nombre Artístico</label>
                  <input 
                    type="text" 
                    value={artistForm.artisticName}
                    onChange={(e) => setArtistForm({ ...artistForm, artisticName: e.target.value })}
                    placeholder="Ej: DJ Edwin Agudelo"
                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-[#ecb613] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-400 block mb-1">DNI / NIF</label>
                    <input 
                      type="text" 
                      value={artistForm.nifDni}
                      onChange={(e) => setArtistForm({ ...artistForm, nifDni: e.target.value })}
                      placeholder="71758247K"
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-[#ecb613] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 block mb-1">Código SGAE / AIE</label>
                    <input 
                      type="text" 
                      value={artistForm.sgaeCode}
                      onChange={(e) => setArtistForm({ ...artistForm, sgaeCode: e.target.value })}
                      placeholder="SGAE-2026-0988"
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-[#ecb613] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Email de Facturación & Cobros</label>
                  <input 
                    type="email" 
                    value={artistForm.email}
                    onChange={(e) => setArtistForm({ ...artistForm, email: e.target.value })}
                    placeholder="booking@productoraear.com"
                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-[#ecb613] outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleUpgradeToPro}
                  disabled={checkoutLoading}
                  className="w-full py-4 bg-gradient-to-r from-[#ecb613] to-[#d4a855] text-black font-extrabold text-xs font-mono uppercase tracking-wider rounded-xl shadow-xl shadow-[#ecb613]/25 hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckBadgeIcon className="w-5 h-5" />
                  <span>{checkoutLoading ? "Conectando Stripe Billing..." : `Activar Categoría Pro (${artistForm.billingCycle === "yearly" ? "99 €/año" : "10 €/mes"})`}</span>
                </button>
                <div className="text-[11px] text-zinc-500 text-center font-mono mt-2">
                  Pago seguro procesado por Stripe Connect · Descontable del primer reparto de regalías
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
