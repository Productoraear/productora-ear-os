"use client";

import React, { useState } from "react";
import { 
  Store, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Music, 
  Volume2, 
  ShieldCheck, 
  CheckCircle2, 
  Save, 
  Eye, 
  Copy, 
  Sparkles, 
  Sliders, 
  Zap, 
  Layers, 
  Calendar,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Info
} from "lucide-react";

interface SectionStatus {
  id: string;
  name: string;
  category: string;
  completed: boolean;
  weight: number;
}

export function ProEscaparateTab() {
  const [activeSection, setActiveSection] = useState<string>("general");
  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form State initialized with SSOT Sovereign Data
  const [formData, setFormData] = useState({
    businessName: "Productora EAR • Edwin Agudelo",
    tagline: "Música en Directo de Alta Fidelidad para Bodas Exclusivas y Fincas de Élite",
    phone: "+34 693 693 048",
    whatsapp: "+34 693 693 048",
    email: "productoraear@gmail.com",
    address: "Camino de Méntrida a Aldea del Fresno, Km 1.2",
    city: "Méntrida",
    province: "Toledo (Cobertura Madrid & Castilla-La Mancha)",
    basePrice: 350.00,
    depositPrice: 100.00,
    kmRate: 1.50,
    hotelSurcharge: 120.00,
    acousticPower: 12, // W/pax
    dbLimit: 75,
    soundSystem: "Bose F1 Model 812 (1000W) + Bose S1 Pro (Batería autónoma inalámbrica)",
    microphones: "Shure Beta 87A vocal condenser cápsula supercardioide",
    powerRequired: "Toma Schuko estándar 230V 16A o Cetac 32A trifásica protegida",
    coverageRadius: "Madrid capital, Toledo, Segovia, Ávila, Guadalajara, Ciudad Real (< 250 km)",
    bio: "Más de 15 años musicalizando enlaces irrepetibles en las fincas más prestigiosas de Madrid y Toledo. Interpretación vocal en directo con repertorio selecto que abarca desde la canción de autor lírica y boleros atemporales hasta pop internacional acústico y jazz lounge. Cero pistas pregrabadas vacías, cero reggaeton estruendoso. Sonido calibrado milimétricamente por debajo de 75 dB SPL para respetar el entorno natural y cumplir la normativa acústica más exigente.",
    splitExplanation: "Modelo ético de Split 80/10/10: 80% Retribución directa del artista sin intermediarios parásitos; 10% Infraestructura tecnológica EAR OS y pasarela segura Stripe Price-Lock; 10% Fondo VIMUME con certificación de impacto social y deducción fiscal del 80% en IRPF / 50% IS (Ley 49/2002 Modelo 182 AEAT).",
    rcInsurance: "Póliza de Responsabilidad Civil Profesional Mapfre 300.000 € en vigor.",
  });

  const checklistSections: SectionStatus[] = [
    { id: "general", name: "1. Datos de Contacto y Teléfono Directo 24/7", category: "Contacto", completed: true, weight: 10 },
    { id: "bio", name: "2. Filosofía Artística & Biografía Soberana", category: "Contenido", completed: true, weight: 10 },
    { id: "pricing", name: "3. Tarifas Oficiales y Depósito Stripe 100 €", category: "Comercial", completed: true, weight: 15 },
    { id: "acoustic", name: "4. Rider Acústico Bose & Límite < 75 dB SPL", category: "Técnico", completed: true, weight: 15 },
    { id: "power", name: "5. Acometida Eléctrica & Suministro Cetac 32A", category: "Técnico", completed: true, weight: 8 },
    { id: "coverage", name: "6. Zonas de Cobertura y Desplazamiento", category: "Logística", completed: true, weight: 7 },
    { id: "services", name: "7. Momentos de Boda (Ceremonia, Cóctel, Banquete)", category: "Servicios", completed: true, weight: 10 },
    { id: "gallery", name: "8. Galería Fotográfica 4K en Fincas de Élite", category: "Multimedia", completed: false, weight: 5 },
    { id: "videos", name: "9. Vídeos de Directo Acústico Sin Autotune", category: "Multimedia", completed: true, weight: 5 },
    { id: "reviews", name: "10. Opiniones 5.0 y Testimonios Auditados", category: "Reputación", completed: true, weight: 5 },
    { id: "faqs", name: "11. Preguntas Frecuentes (FAQs Parejas)", category: "Atención", completed: false, weight: 3 },
    { id: "insurance", name: "12. Seguro de RC 300.000 € & Factura Oficial", category: "Legal", completed: true, weight: 4 },
    { id: "split", name: "13. Blindaje Split 80/10/10 y Certificado VIMUME", category: "Impacto", completed: true, weight: 3 },
  ];

  const completedWeight = checklistSections
    .filter(s => s.completed)
    .reduce((acc, s) => acc + s.weight, 0);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.origin + "/edwin-agudelo");
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Value Banner */}
      <div className="rounded-2xl border border-[#ecb613]/30 bg-gradient-to-br from-[#0c0c12] via-[#08080c] to-[#040406] p-6 lg:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-[#ecb613]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Escaparate B2B Soberano • 13 Módulos Canónicos
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold font-['Syne'] text-white tracking-tight">
              Configuración de Escaparate y Rider de Alta Fidelidad
            </h2>
            <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">
              Frente a los directorios tradicionales que <strong className="text-zinc-200">ocultan tu teléfono</strong> para forzar comisiones de intermediación, tu Escaparate S-Class Pro expone de forma directa y permanente tu contacto, WhatsApp, rider acústico Bose certificado y precios oficiales protegidos por Stripe SHA-256.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 text-xs font-mono border border-zinc-700/60 transition shadow-lg"
            >
              <Copy className="w-4 h-4 text-[#ecb613]" />
              {copiedLink ? "¡URL Copiada!" : "Copiar Enlace Público"}
            </button>
            <a
              href="/edwin-agudelo"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ecb613] to-[#d4a010] hover:from-[#d4a010] hover:to-[#b88c0a] text-black font-semibold text-xs tracking-wider uppercase font-['Syne'] transition shadow-xl"
            >
              <Eye className="w-4 h-4" />
              Ver Escaparate en Vivo
            </a>
          </div>
        </div>

        {/* Completeness Bar */}
        <div className="mt-8 pt-6 border-t border-zinc-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/25 flex items-center justify-center font-bold text-lg text-[#ecb613] font-mono">
              {completedWeight}%
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">Completitud del Escaparate</div>
              <div className="text-sm font-semibold text-white">11 de 13 secciones verificadas</div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
              <div 
                className="h-full bg-gradient-to-r from-[#ecb613] to-emerald-400 transition-all duration-700"
                style={{ width: `${completedWeight}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 mt-1.5">
              <span>Mínimo para indexación recomendada: 75%</span>
              <span className="text-[#ecb613]">Estado actual: 80% Acreditado S-Class</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Checklist Navigation / Right Content Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: 13 Checklist Sections */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-4 rounded-xl border border-zinc-800 bg-[#08080c]">
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-[#ecb613]" />
              Checklist Canónico (13 Secciones)
            </h3>

            <div className="space-y-1.5 max-h-[640px] overflow-y-auto pr-1">
              {checklistSections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition flex items-center justify-between border ${
                    activeSection === sec.id
                      ? "bg-[#ecb613]/10 border-[#ecb613]/40 text-[#ecb613] font-semibold"
                      : "bg-zinc-900/40 border-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {sec.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    <span className="truncate">{sec.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 shrink-0 ml-2">+{sec.weight}%</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-950/10 text-xs text-zinc-400 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-semibold">
              <Info className="w-4 h-4" />
              Transparencia Absoluta
            </div>
            <p className="leading-relaxed">
              Cualquier cambio guardado se sincroniza de forma inmediata con tu ficha pSEO y la API de reservas en tiempo real.
            </p>
          </div>
        </div>

        {/* Right Column: Dynamic Section Editor */}
        <div className="lg:col-span-8 rounded-2xl border border-zinc-800 bg-[#08080c] p-6 lg:p-8 space-y-6">
          
          {/* Section: General & Contact Info */}
          {activeSection === "general" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-zinc-800 pb-4">
                <h3 className="text-lg font-bold font-['Syne'] text-white flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[#ecb613]" />
                  1. Datos de Contacto y Teléfono Visible 24/7
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Tu número de teléfono jamás será censurado ni bloqueado. Los novios pueden llamarte o contactarte por WhatsApp con un solo toque.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">Nombre Comercial del Artista / Proveedor</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-700/80 text-white text-sm focus:outline-none focus:border-[#ecb613]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">Teléfono Directo Móvil</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-700/80 text-white text-sm focus:outline-none focus:border-[#ecb613]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">Canal WhatsApp Oficial</label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-700/80 text-white text-sm focus:outline-none focus:border-[#ecb613]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">Correo Electrónico de Notificaciones</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-700/80 text-white text-sm focus:outline-none focus:border-[#ecb613]"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-mono text-zinc-400">Sede Logística de Desplazamiento (Kilómetro Cero)</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-700/80 text-white text-sm focus:outline-none focus:border-[#ecb613]"
                  />
                  <p className="text-[10px] text-zinc-400 font-mono">
                    Punto de partida canónico: Méntrida, Toledo (primeros 50 km exentos; 1,50 €/km posterior).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section: Bio */}
          {activeSection === "bio" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-zinc-800 pb-4">
                <h3 className="text-lg font-bold font-['Syne'] text-white flex items-center gap-2">
                  <Music className="w-5 h-5 text-[#ecb613]" />
                  2. Filosofía Artística & Biografía Soberana
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Posiciona tu propuesta en el segmento High-Ticket sin caer en clichés de venta vacíos.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">Titular de Impacto (Hero Tagline)</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-700/80 text-white text-sm focus:outline-none focus:border-[#ecb613]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">Biografía y Propuesta de Valor</label>
                  <textarea
                    rows={6}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-700/80 text-white text-sm focus:outline-none focus:border-[#ecb613] leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section: Pricing & Stripe */}
          {activeSection === "pricing" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-zinc-800 pb-4">
                <h3 className="text-lg font-bold font-['Syne'] text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#ecb613]" />
                  3. Tarifas Oficiales y Depósito Stripe 100 €
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Reglas de negocio inmutables (SSOT S-Class). Precios blindados contra regateos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2">
                  <div className="text-xs font-mono uppercase text-zinc-400">Caché Base Solista</div>
                  <div className="text-2xl font-bold text-white font-['Syne']">
                    {formData.basePrice.toFixed(2)} €
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Edwin Agudelo (Voz solista en directo + guitarra acústica/teclado).
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-[#ecb613]/30 bg-[#ecb613]/5 space-y-2">
                  <div className="text-xs font-mono uppercase text-[#ecb613]">Depósito de Bloqueo de Fecha</div>
                  <div className="text-2xl font-bold text-[#ecb613] font-['Syne']">
                    {formData.depositPrice.toFixed(2)} €
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Pasarela Stripe con Price-Lock SHA-256 e invoice instantáneo.
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">Kilometraje Extra (&gt; 50 km desde Méntrida)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.10"
                      value={formData.kmRate}
                      onChange={(e) => setFormData({ ...formData, kmRate: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-700/80 text-white text-sm focus:outline-none focus:border-[#ecb613]"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs text-zinc-400 font-mono">€ / km</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">Suplemento Alojamiento (&gt; 200 km o fin &ge; 3:00 AM)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="10"
                      value={formData.hotelSurcharge}
                      onChange={(e) => setFormData({ ...formData, hotelSurcharge: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-700/80 text-white text-sm focus:outline-none focus:border-[#ecb613]"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs text-zinc-400 font-mono">€ fijas</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section: Acoustic Rider */}
          {activeSection === "acoustic" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-zinc-800 pb-4">
                <h3 className="text-lg font-bold font-['Syne'] text-white flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-emerald-400" />
                  4. Rider Acústico Bose & Límite &lt; 75 dB SPL
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Tranquilidad total para la dirección de la finca y cumplimiento del marco ambiental sonoro.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10 space-y-1.5">
                    <div className="text-xs font-mono uppercase text-emerald-400">Ratio Acústico Recomendado</div>
                    <div className="text-2xl font-bold text-white font-mono">{formData.acousticPower} W / pax</div>
                    <div className="text-[11px] text-zinc-400">Cobertura sin fatiga auditiva garantizada.</div>
                  </div>

                  <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10 space-y-1.5">
                    <div className="text-xs font-mono uppercase text-emerald-400">Presión Sonora Máxima</div>
                    <div className="text-2xl font-bold text-emerald-300 font-mono">&lt; {formData.dbLimit} dB SPL</div>
                    <div className="text-[11px] text-zinc-400">Apto para fincas históricas y espacios protegidos.</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">Sistema PA Principal & Monitores</label>
                  <input
                    type="text"
                    value={formData.soundSystem}
                    onChange={(e) => setFormData({ ...formData, soundSystem: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-700/80 text-white text-sm focus:outline-none focus:border-[#ecb613]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">Microfonía & Procesamiento Vocal</label>
                  <input
                    type="text"
                    value={formData.microphones}
                    onChange={(e) => setFormData({ ...formData, microphones: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-700/80 text-white text-sm focus:outline-none focus:border-[#ecb613]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section: Split 80/10/10 & Legal Impact */}
          {(activeSection === "split" || activeSection === "insurance" || activeSection === "power" || activeSection === "coverage" || activeSection === "services" || activeSection === "gallery" || activeSection === "videos" || activeSection === "reviews" || activeSection === "faqs") && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-zinc-800 pb-4">
                <h3 className="text-lg font-bold font-['Syne'] text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#ecb613]" />
                  Blindaje Jurídico & Garantía de Calidad S-Class
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Protección fiscal europea, Seguro de RC y acreditación de impacto social VIMUME.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2">
                  <div className="text-xs font-mono uppercase text-[#ecb613]">Justificación Canónica del Split 80/10/10</div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {formData.splitExplanation}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2">
                  <div className="text-xs font-mono uppercase text-emerald-400">Seguro de Responsabilidad Civil & Cumplimiento</div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {formData.rcInsurance} Facturación oficial emitida en cada actuación con desglose de IVA y retención IRPF aplicable.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="pt-6 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-mono">
              {isSaved ? "✓ Sincronizado en tiempo real" : "Configuración persistente en servidor"}
            </span>

            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ecb613] to-[#d4a010] text-black font-semibold text-xs tracking-wider uppercase font-['Syne'] hover:from-[#d4a010] transition shadow-lg"
            >
              <Save className="w-4 h-4" />
              {isSaved ? "¡Guardado con Éxito!" : "Guardar Cambios"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
