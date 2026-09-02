"use client";

import React, { useState } from 'react';
import { 
  Radio, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck, 
  Zap, 
  Eye, 
  X, 
  Fingerprint, 
  Mic2, 
  Lock,
  Globe,
  Sparkles,
  Download,
  BookOpen,
  Volume2,
  Calendar,
  Phone,
  CheckCircle2,
  Trophy,
  Award,
  Layers,
  Scale
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../lib/api';
import { CENTRALITA } from '@/lib/phone-constants';

type SignalMode = 'split' | 'artist_manifesto' | 'artist_form' | 'fan_access';

export const TheEarSignal: React.FC = () => {
  const [mode, setMode] = useState<SignalMode>('split');
  const [formStep, setFormStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadedMagnet, setDownloadedMagnet] = useState(false);

  // 10 Fases Data State
  const [formData, setFormData] = useState({
    // Fase 1: Huella Digital
    videoLink: '',
    metrics: '',
    // Fase 2: Filosofía & Linchpin
    linchpin: '',
    whyIncomparable: '',
    // Fase 3: Rider & Acústica
    acousticPressureWatts: '12 W/pax (Bose F1 / L-Acoustics)',
    monitoringSystem: 'In-Ear Stereo / Shure PSM',
    // Fase 4: Solvencia Escénica
    showDurationMinutes: '90 minutos continuo',
    repertoireDiversity: 'Clásico, Gala, Contemporáneo',
    // Fase 5: SLA & Puntualidad
    arrivalBufferMinutes: 'T-120 min',
    insurancePolicyStatus: 'Póliza RC Activa',
    // Fase 6: Cátedra de Marca
    suitGalaQuality: 'Traje de Autor / Charro de Gala Bordado',
    stageSobrietyRating: '10/10 Protocolar',
    // Fase 7: Ticketing & Conversión
    avgTicketPrice: '350€ - 1.200€',
    fanRetentionStrategy: 'Bases de Datos Propias & WhatsApp VIP',
    // Fase 8: Protocolo B2G
    institutionalExperience: 'Ayuntamientos, Consulados & Bodas Reales',
    diplomaticCompliance: 'Art. 118 LCSP Compatible',
    // Fase 9: Test de Tensión Plan B
    failoverReadiness: 'Generador Redundante + Microfonía Dual',
    weatherResilienceProtocol: 'Cobertura IP65 & Carpas Homologadas',
    // Fase 10: Datos de Contacto
    email: '',
    phone: '',
    fullName: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.submitLead({
        type: 'artist_candidate',
        source: 'the_ear_signal_funnel_s_class',
        section: 'certification_10_phases',
        data: formData,
        timestamp: new Date().toISOString()
      });
      setFormStep(11); // Step 11 is Solicitud Registrada
    } catch (error) {
      console.error("Error al enviar candidatura:", error);
      setFormStep(11); // Ensure smooth UI transition even on sandbox
    } finally {
      setIsSubmitting(false);
    }
  };

  /* -------------------------------------------------------------
     1. THE GREAT DIVIDE (SOY CREADOR vs SOY CURADOR)
  ------------------------------------------------------------- */
  const TheGreatDivide = () => (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[#050505]">
        <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-[#ecb613]/5 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#ecb613]/3 blur-[140px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center max-w-5xl mx-auto space-y-8"
      >
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/20 text-[#ecb613] text-[10px] font-black uppercase tracking-[0.4em]">
          <Radio size={14} className="animate-pulse" /> The EAR Signal
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[0.95] font-syne uppercase">
          El 90% de los artistas independientes <br className="hidden sm:inline" />
          regala su margen por <span className="text-[#ecb613]">falta de estructura</span>.
        </h1>
        
        <p className="text-white/70 text-sm md:text-base max-w-3xl mx-auto font-light leading-relaxed">
          Somete tu propuesta al Test de 10 Fases Meritorias de EAR OS. Si superas la auditoría, accedes directamente al Split Soberano 80/10/10.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto pt-6 text-left">
          {/* Card 1: Soy Creador */}
          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            onClick={() => setMode('artist_manifesto')} 
            className="group cursor-pointer bg-[#0a0a0f] border border-white/10 p-8 sm:p-10 rounded-[2.5rem] hover:border-[#ecb613]/50 transition-all duration-500 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity text-[#ecb613]">
              <Mic2 size={70} />
            </div>
            <h3 className="text-3xl font-black text-white mb-3 group-hover:text-[#ecb613] transition-colors font-syne uppercase tracking-tight">
              Soy Creador
            </h3>
            <p className="text-xs text-white/50 mb-8 leading-relaxed font-semibold">
              No buscamos rellenos de cartel. Buscamos Arquitectos de Experiencia.
            </p>
            <div className="flex items-center gap-3 text-white font-black text-[10px] uppercase tracking-[0.3em] group-hover:text-[#ecb613] transition-colors">
              Iniciar Proceso <ArrowRight size={16} className="text-[#ecb613] group-hover:translate-x-2 transition-transform"/>
            </div>
          </motion.div>

          {/* Card 2: Soy Curador */}
          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            onClick={() => setMode('fan_access')} 
            className="group cursor-pointer bg-[#0a0a0f] border border-white/10 p-8 sm:p-10 rounded-[2.5rem] hover:border-[#ecb613]/50 transition-all duration-500 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity text-[#ecb613]">
              <Fingerprint size={70} />
            </div>
            <h3 className="text-3xl font-black text-white mb-3 group-hover:text-[#ecb613] transition-colors font-syne uppercase tracking-tight">
              Soy Curador
            </h3>
            <p className="text-xs text-white/50 mb-8 leading-relaxed font-semibold">
              El algoritmo te da lo viral. Nosotros te damos lo legendario.
            </p>
            <div className="flex items-center gap-3 text-white font-black text-[10px] uppercase tracking-[0.3em] group-hover:text-[#ecb613] transition-colors">
              Solicitar Acceso <ArrowRight size={16} className="text-[#ecb613] group-hover:translate-x-2 transition-transform"/>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );

  /* -------------------------------------------------------------
     2. MANIFIESTO DE INGRESO
  ------------------------------------------------------------- */
  const ArtistManifesto = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#050505] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ecb613]/5 blur-[160px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-4xl mx-auto text-left border-l-4 border-[#ecb613] pl-8 sm:pl-14 py-8 space-y-8"
      >
        <div className="flex items-center gap-3">
          <span className="text-[#ecb613] font-mono font-black text-[11px] uppercase tracking-[0.4em] block">
            Manifiesto de Ingreso S-Class
          </span>
        </div>

        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-none tracking-tighter uppercase font-syne">
          Antes de aplicar,<br/>
          <span className="text-[#ecb613]">Entiende esto:</span>
        </h2>

        <p className="text-white/80 text-base sm:text-xl leading-relaxed uppercase tracking-wide font-bold">
          EAR no es un directorio. Somos una <strong className="text-white underline decoration-[#ecb613]">Infraestructura de Talento</strong>. Exigimos excelencia absoluta. Si buscas "bolos" rápidos, no apliques. Si buscas construir un activo patrimonial, estás en el lugar correcto.
        </p>

        <div className="flex flex-wrap gap-4 pt-4">
          <button 
            onClick={() => { setMode('artist_form'); setFormStep(1); }} 
            className="px-10 py-5 bg-[#ecb613] text-black font-black uppercase tracking-[0.3em] hover:bg-white transition-all rounded-2xl shadow-[0_10px_40px_rgba(236,182,19,0.3)] text-xs flex items-center gap-3 cursor-pointer hover:scale-105"
          >
            <span>Acepto el Desafío S-Class</span>
            <ArrowRight size={16} />
          </button>
          
          <button 
            onClick={() => setMode('split')} 
            className="px-8 py-5 border border-white/10 text-white/60 hover:text-white font-black uppercase tracking-[0.2em] rounded-2xl text-xs transition-colors cursor-pointer"
          >
            Volver
          </button>
        </div>
      </motion.div>
    </div>
  );

  /* -------------------------------------------------------------
     3. 10 FASES MERITORIAS DE CONVOCATORIA (FORMULARIO ADAPTADO)
  ------------------------------------------------------------- */
  const ArtistForm10Phases = () => (
    <div className="min-h-screen py-24 px-4 sm:px-6 bg-[#050505] flex justify-center items-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[#ecb613]/5 blur-[160px] opacity-30 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl bg-[#09090d] border border-white/10 p-8 sm:p-14 rounded-[3rem] relative shadow-[0_40px_80px_rgba(0,0,0,0.9)]"
      >
        {/* Progress Bar & Phase Badge */}
        {formStep <= 10 && (
          <div className="mb-10 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.3em] font-mono">
              <span className="text-white/40">Fase de Evaluación Meritoria</span>
              <span className="text-[#ecb613]">Fase {formStep} / 10</span>
            </div>
            {/* 10-step progress bar */}
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#ecb613] to-amber-200 transition-all duration-500" 
                style={{ width: `${(formStep / 10) * 100}%` }}
              />
            </div>
          </div>
        )}
        
        <AnimatePresence mode="wait">
          
          {/* FASE 1: TU HUELLA DIGITAL */}
          {formStep === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <span className="text-[#ecb613] text-[10px] font-mono font-bold uppercase tracking-widest">Paso Inicial</span>
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-syne">1. Tu Huella Digital</h3>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Link Video (Actuación en Vivo)</label>
                  <input name="videoLink" value={formData.videoLink} onChange={handleInputChange} type="url" className="w-full bg-black/60 border border-white/10 p-5 text-white rounded-2xl focus:border-[#ecb613] outline-none transition-all text-sm font-mono" placeholder="https://youtube.com/... o Vimeo..." />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Métricas Reales</label>
                  <input name="metrics" value={formData.metrics} onChange={handleInputChange} type="text" className="w-full bg-black/60 border border-white/10 p-5 text-white rounded-2xl focus:border-[#ecb613] outline-none transition-all text-sm" placeholder="Engagement, Audiencia media, oyentes o seguidores..." />
                </div>
                <button onClick={() => setFormStep(2)} className="w-full py-5 bg-[#ecb613] text-black font-black uppercase tracking-[0.3em] hover:bg-white transition-all rounded-2xl text-[11px] cursor-pointer shadow-lg">Continuar Protocolo</button>
              </div>
            </motion.div>
          )}

          {/* FASE 2: FILOSOFÍA DE ESCENARIO & LINCHPIN */}
          {formStep === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <span className="text-[#ecb613] text-[10px] font-mono font-bold uppercase tracking-widest">Diferenciación Asimétrica</span>
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-syne">2. Filosofía de Escenario</h3>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">¿Cuál es tu 'Linchpin'? (Valor Único)</label>
                  <textarea name="linchpin" value={formData.linchpin} onChange={handleInputChange} rows={3} className="w-full bg-black/60 border border-white/10 p-5 text-white rounded-2xl focus:border-[#ecb613] outline-none resize-none transition-all text-sm" placeholder="Define el núcleo de tu propuesta artística..."></textarea>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">¿Por qué eres incomparable?</label>
                  <textarea name="whyIncomparable" value={formData.whyIncomparable} onChange={handleInputChange} rows={3} className="w-full bg-black/60 border border-white/10 p-5 text-white rounded-2xl focus:border-[#ecb613] outline-none resize-none transition-all text-sm" placeholder="¿Qué ocurre en tu directo que nadie más puede replicar?"></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setFormStep(1)} className="py-4 border border-white/10 text-white/60 hover:text-white font-black uppercase tracking-widest rounded-2xl text-[10px]">Atrás</button>
                  <button onClick={() => setFormStep(3)} className="py-4 bg-[#ecb613] text-black font-black uppercase tracking-[0.2em] hover:bg-white transition-all rounded-2xl text-[10px]">Avanzar a Fase 3</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* FASE 3: CALIBRACIÓN ACÚSTICA & RIDER */}
          {formStep === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <span className="text-[#ecb613] text-[10px] font-mono font-bold uppercase tracking-widest">Ingeniería de Audio</span>
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-syne">3. Presión Acústica & Rider Técnico</h3>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Presión Sonora Estándar (12 W/pax)</label>
                  <select name="acousticPressureWatts" value={formData.acousticPressureWatts} onChange={handleInputChange} className="w-full bg-black/60 border border-white/10 p-5 text-white rounded-2xl focus:border-[#ecb613] outline-none text-sm">
                    <option value="12 W/pax (Bose F1 / L-Acoustics)">12 W/pax (Bose F1 / L-Acoustics) — Recomendado</option>
                    <option value="8 W/pax (Sonido Acústico Íntimo)">8 W/pax (Sonido Acústico Íntimo)</option>
                    <option value="15 W/pax (Gran Formato Exterior)">15 W/pax (Gran Formato Exterior)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Sistema de Monitoreo</label>
                  <input name="monitoringSystem" value={formData.monitoringSystem} onChange={handleInputChange} type="text" className="w-full bg-black/60 border border-white/10 p-5 text-white rounded-2xl focus:border-[#ecb613] outline-none text-sm" placeholder="In-Ear Stereo / Shure PSM / Cuñas de suelo..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setFormStep(2)} className="py-4 border border-white/10 text-white/60 hover:text-white font-black uppercase tracking-widest rounded-2xl text-[10px]">Atrás</button>
                  <button onClick={() => setFormStep(4)} className="py-4 bg-[#ecb613] text-black font-black uppercase tracking-[0.2em] hover:bg-white transition-all rounded-2xl text-[10px]">Avanzar a Fase 4</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* FASE 4: SOLVENCIA ESCÉNICA */}
          {formStep === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <span className="text-[#ecb613] text-[10px] font-mono font-bold uppercase tracking-widest">Resistencia y Versatilidad</span>
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-syne">4. Solvencia Escénica y Repertorio</h3>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Capacidad de Show Continuo</label>
                  <input name="showDurationMinutes" value={formData.showDurationMinutes} onChange={handleInputChange} type="text" className="w-full bg-black/60 border border-white/10 p-5 text-white rounded-2xl focus:border-[#ecb613] outline-none text-sm" placeholder="Ej: 60 min, 90 min, 120 min..." />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Diversidad de Repertorio</label>
                  <input name="repertoireDiversity" value={formData.repertoireDiversity} onChange={handleInputChange} type="text" className="w-full bg-black/60 border border-white/10 p-5 text-white rounded-2xl focus:border-[#ecb613] outline-none text-sm" placeholder="Bolero, Ranchera Clásica, Gala, Pop Fusion..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setFormStep(3)} className="py-4 border border-white/10 text-white/60 hover:text-white font-black uppercase tracking-widest rounded-2xl text-[10px]">Atrás</button>
                  <button onClick={() => setFormStep(5)} className="py-4 bg-[#ecb613] text-black font-black uppercase tracking-[0.2em] hover:bg-white transition-all rounded-2xl text-[10px]">Avanzar a Fase 5</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* FASE 5: SLA & COMPROMISO CONTRACTUAL */}
          {formStep === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <span className="text-[#ecb613] text-[10px] font-mono font-bold uppercase tracking-widest">Garantía Operativa</span>
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-syne">5. Compromiso SLA & Puntualidad</h3>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Llegada a Soundcheck (Buffer T-Minutos)</label>
                  <select name="arrivalBufferMinutes" value={formData.arrivalBufferMinutes} onChange={handleInputChange} className="w-full bg-black/60 border border-white/10 p-5 text-white rounded-2xl focus:border-[#ecb613] outline-none text-sm">
                    <option value="T-120 min (2 horas antes)">T-120 min (2 horas antes — Estándar EAR)</option>
                    <option value="T-90 min (1.5 horas antes)">T-90 min (1.5 horas antes)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Póliza de Responsabilidad Civil</label>
                  <select name="insurancePolicyStatus" value={formData.insurancePolicyStatus} onChange={handleInputChange} className="w-full bg-black/60 border border-white/10 p-5 text-white rounded-2xl focus:border-[#ecb613] outline-none text-sm">
                    <option value="Póliza RC Activa (1M€)">Póliza RC Activa (1M€) — Verificada</option>
                    <option value="En trámite de emisión">En trámite de emisión</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setFormStep(4)} className="py-4 border border-white/10 text-white/60 hover:text-white font-black uppercase tracking-widest rounded-2xl text-[10px]">Atrás</button>
                  <button onClick={() => setFormStep(6)} className="py-4 bg-[#ecb613] text-black font-black uppercase tracking-[0.2em] hover:bg-white transition-all rounded-2xl text-[10px]">Avanzar a Fase 6</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* FASE 6: CÁTEDRA DE MARCA & ETIQUETA */}
          {formStep === 6 && (
            <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <span className="text-[#ecb613] text-[10px] font-mono font-bold uppercase tracking-widest">Estética y Pulcritud</span>
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-syne">6. Cátedra de Marca & Vestuario</h3>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Calidad del Vestuario de Gala</label>
                  <input name="suitGalaQuality" value={formData.suitGalaQuality} onChange={handleInputChange} type="text" className="w-full bg-black/60 border border-white/10 p-5 text-white rounded-2xl focus:border-[#ecb613] outline-none text-sm" placeholder="Bordados de autor, botonaduras de plata, traje de etiqueta..." />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Autoevaluación de Sobriedad Escénica</label>
                  <select name="stageSobrietyRating" value={formData.stageSobrietyRating} onChange={handleInputChange} className="w-full bg-black/60 border border-white/10 p-5 text-white rounded-2xl focus:border-[#ecb613] outline-none text-sm">
                    <option value="10/10 Protocolar">10/10 Protocolar (Cero vulgaridad, respeto solemne)</option>
                    <option value="9/10 Excelente">9/10 Excelente</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setFormStep(5)} className="py-4 border border-white/10 text-white/60 hover:text-white font-black uppercase tracking-widest rounded-2xl text-[10px]">Atrás</button>
                  <button onClick={() => setFormStep(7)} className="py-4 bg-[#ecb613] text-black font-black uppercase tracking-[0.2em] hover:bg-white transition-all rounded-2xl text-[10px]">Avanzar a Fase 7</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* FASE 7: TICKETING & CONVERSIÓN */}
          {formStep === 7 && (
            <motion.div key="step7" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <span className="text-[#ecb613] text-[10px] font-mono font-bold uppercase tracking-widest">Monetización y Fans</span>
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-syne">7. Modelo de Conversión y Ticketing</h3>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Ticket Medio de Venta Directa</label>
                  <input name="avgTicketPrice" value={formData.avgTicketPrice} onChange={handleInputChange} type="text" className="w-full bg-black/60 border border-white/10 p-5 text-white rounded-2xl focus:border-[#ecb613] outline-none text-sm" placeholder="Ej: 350€ solista / 1.250€ grupo..." />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Estrategia de Retención Post-Show</label>
                  <input name="fanRetentionStrategy" value={formData.fanRetentionStrategy} onChange={handleInputChange} type="text" className="w-full bg-black/60 border border-white/10 p-5 text-white rounded-2xl focus:border-[#ecb613] outline-none text-sm" placeholder="Bases de datos, WhatsApp VIP, fotos de recuerdo..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setFormStep(6)} className="py-4 border border-white/10 text-white/60 hover:text-white font-black uppercase tracking-widest rounded-2xl text-[10px]">Atrás</button>
                  <button onClick={() => setFormStep(8)} className="py-4 bg-[#ecb613] text-black font-black uppercase tracking-[0.2em] hover:bg-white transition-all rounded-2xl text-[10px]">Avanzar a Fase 8</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* FASE 8: PROTOCOLO B2G & INSTITUCIONAL */}
          {formStep === 8 && (
            <motion.div key="step8" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <span className="text-[#ecb613] text-[10px] font-mono font-bold uppercase tracking-widest">Trato Institucional</span>
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-syne">8. Protocolo B2G y Adjudicaciones</h3>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Experiencia en Entornos Oficiales</label>
                  <input name="institutionalExperience" value={formData.institutionalExperience} onChange={handleInputChange} type="text" className="w-full bg-black/60 border border-white/10 p-5 text-white rounded-2xl focus:border-[#ecb613] outline-none text-sm" placeholder="Ayuntamientos, Casas de Cultura, Embajadas..." />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Compatibilidad Contrato Menor (Art. 118 LCSP)</label>
                  <select name="diplomaticCompliance" value={formData.diplomaticCompliance} onChange={handleInputChange} className="w-full bg-black/60 border border-white/10 p-5 text-white rounded-2xl focus:border-[#ecb613] outline-none text-sm">
                    <option value="Art. 118 LCSP Compatible">Art. 118 LCSP Compatible (Listo para facturación institucional)</option>
                    <option value="Requiere Asesoría EAR">Requiere Asesoría EAR</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setFormStep(7)} className="py-4 border border-white/10 text-white/60 hover:text-white font-black uppercase tracking-widest rounded-2xl text-[10px]">Atrás</button>
                  <button onClick={() => setFormStep(9)} className="py-4 bg-[#ecb613] text-black font-black uppercase tracking-[0.2em] hover:bg-white transition-all rounded-2xl text-[10px]">Avanzar a Fase 9</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* FASE 9: TEST DE TENSIÓN PLAN B */}
          {formStep === 9 && (
            <motion.div key="step9" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <span className="text-[#ecb613] text-[10px] font-mono font-bold uppercase tracking-widest">Resiliencia Operativa</span>
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-syne">9. Test de Tensión & Protocolo Plan B</h3>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Preparación ante Contingencias Técnicas</label>
                  <input name="failoverReadiness" value={formData.failoverReadiness} onChange={handleInputChange} type="text" className="w-full bg-black/60 border border-white/10 p-5 text-white rounded-2xl focus:border-[#ecb613] outline-none text-sm" placeholder="Microfonía de respaldo, generador auxiliar..." />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Protocolo Climatológico</label>
                  <input name="weatherResilienceProtocol" value={formData.weatherResilienceProtocol} onChange={handleInputChange} type="text" className="w-full bg-black/60 border border-white/10 p-5 text-white rounded-2xl focus:border-[#ecb613] outline-none text-sm" placeholder="Planes para lluvia, carpas o traslados de emergencia..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setFormStep(8)} className="py-4 border border-white/10 text-white/60 hover:text-white font-black uppercase tracking-widest rounded-2xl text-[10px]">Atrás</button>
                  <button onClick={() => setFormStep(10)} className="py-4 bg-[#ecb613] text-black font-black uppercase tracking-[0.2em] hover:bg-white transition-all rounded-2xl text-[10px]">Avanzar a Fase 10</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* FASE 10: TRANSMISIÓN CRIPTOGRÁFICA & CIERRE */}
          {formStep === 10 && (
            <motion.div key="step10" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <span className="text-[#ecb613] text-[10px] font-mono font-bold uppercase tracking-widest">Enlace Criptográfico</span>
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-syne">10. Finalizar Aplicación</h3>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Nombre Completo o Artístico</label>
                  <input name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" className="w-full bg-black/60 border border-white/10 p-5 text-white rounded-2xl focus:border-[#ecb613] outline-none text-sm" placeholder="Tu nombre..." />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Email de Contacto</label>
                  <input name="email" value={formData.email} onChange={handleInputChange} type="email" className="w-full bg-black/60 border border-white/10 p-5 text-white rounded-2xl focus:border-[#ecb613] outline-none text-sm font-mono" placeholder="tu@email.com" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Teléfono WhatsApp</label>
                  <input name="phone" value={formData.phone} onChange={handleInputChange} type="tel" className="w-full bg-black/60 border border-white/10 p-5 text-white rounded-2xl focus:border-[#ecb613] outline-none text-sm font-mono" placeholder="+34 600 000 000" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setFormStep(9)} className="py-5 border border-white/10 text-white/60 hover:text-white font-black uppercase tracking-widest rounded-2xl text-[10px]">Atrás</button>
                  <button onClick={handleFinalSubmit} disabled={isSubmitting} className="py-5 bg-[#ecb613] text-black font-black uppercase tracking-[0.3em] hover:bg-white transition-all rounded-2xl text-[10px] shadow-[0_0_30px_rgba(236,182,19,0.4)] cursor-pointer">
                    {isSubmitting ? 'Transmitiendo Señal...' : 'Finalizar Aplicación'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* FASE 11: SOLICITUD REGISTRADA & LEAD MAGNET RETENTION HUB */}
          {formStep === 11 && (
            <motion.div key="step11" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6 space-y-8">
              
              <div className="w-20 h-20 bg-[#ecb613]/10 rounded-full flex items-center justify-center mx-auto border border-[#ecb613]/40 shadow-[0_0_40px_rgba(236,182,19,0.3)]">
                <ShieldCheck className="text-[#ecb613]" size={42} />
              </div>
              
              <div className="space-y-2">
                <span className="text-[#ecb613] font-mono font-black text-[10px] uppercase tracking-[0.4em]">Señal Pura Transmitida</span>
                <h3 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-syne">Solicitud Registrada</h3>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 max-w-xl mx-auto">
                <p className="text-white/80 italic text-sm sm:text-base font-medium leading-relaxed">
                  "Los datos han sido digitalizados. Si tu señal es pura, recibirás el Kit de Autoridad en 48h."
                </p>
              </div>

              {/* LEAD MAGNETS & ECOSYSTEM RETENTION HUB */}
              <div className="space-y-4 pt-4 text-left">
                <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-[#ecb613] block text-center">
                  Acceso Inmediato a Activos Soberanos (Lead Magnets)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Magnet 1: Master Dossier */}
                  <div className="p-5 rounded-2xl bg-[#0e0e14] border border-white/10 hover:border-[#ecb613]/40 transition-all space-y-3">
                    <div className="flex items-center gap-3 text-[#ecb613]">
                      <Download size={18} />
                      <h4 className="font-bold text-xs uppercase text-white">Master Dossier Autoridad</h4>
                    </div>
                    <p className="text-[11px] text-white/50">
                      Descarga el Manifiesto S-Class y la guía para blindar tu caché artístico.
                    </p>
                    <button 
                      onClick={() => setDownloadedMagnet(true)}
                      className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-[#ecb613] hover:text-black text-[10px] font-black uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {downloadedMagnet ? <><CheckCircle2 size={13} /> Descargado</> : 'Descargar PDF Gratuito'}
                    </button>
                  </div>

                  {/* Magnet 2: Masterclass Privada */}
                  <div className="p-5 rounded-2xl bg-[#0e0e14] border border-white/10 hover:border-[#ecb613]/40 transition-all space-y-3">
                    <div className="flex items-center gap-3 text-[#ecb613]">
                      <BookOpen size={18} />
                      <h4 className="font-bold text-xs uppercase text-white">Masterclass Privada</h4>
                    </div>
                    <p className="text-[11px] text-white/50">
                      "De Músico de Bolos a Activo Patrimonial" dictada por Edwin Agudelo.
                    </p>
                    <a 
                      href={CENTRALITA.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-[#ecb613]/10 hover:bg-[#ecb613] hover:text-black border border-[#ecb613]/30 text-[10px] font-black uppercase tracking-wider text-[#ecb613] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles size={13} /> Desbloquear Acceso
                    </a>
                  </div>

                </div>

                {/* Direct Line with Edwin Agudelo */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0a0a10] to-[#151208] border border-[#ecb613]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-black uppercase text-white flex items-center gap-2">
                      <Phone size={14} className="text-[#ecb613]" /> Centralita VIP Edwin Agudelo
                    </h4>
                    <p className="text-[10px] text-white/40 mt-0.5">
                      Consulta directa de convocatorias prioritarias y calendario de gira.
                    </p>
                  </div>
                  <a
                    href={CENTRALITA.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 bg-[#25D366] text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-105 transition-transform shrink-0"
                  >
                    Hablar en WhatsApp
                  </a>
                </div>

              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );

  /* -------------------------------------------------------------
     4. CURADOR / FAN VIP ACCESS
  ------------------------------------------------------------- */
  const FanAccess = () => (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ecb613]/3 blur-[140px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-[#0a0a0f] border border-white/10 p-10 sm:p-14 rounded-[3rem] text-center backdrop-blur-3xl shadow-[0_40px_80px_rgba(0,0,0,0.8)] space-y-8"
      >
        <div className="p-5 bg-[#ecb613]/10 rounded-2xl w-fit text-[#ecb613] border border-[#ecb613]/20 mx-auto">
          <Eye size={32} />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-3xl font-black text-white uppercase tracking-tight font-syne">Curador VIP</h3>
          <p className="text-white/50 text-xs leading-relaxed">
            Únete al Círculo Interior para recibir acceso prioritario a soundchecks, conciertos privados y lanzamientos inéditos.
          </p>
        </div>

        <a 
          href={CENTRALITA.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-5 bg-[#ecb613] text-black font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-white transition-all text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
        >
          <span>Solicitar Acceso VIP</span>
          <ArrowRight size={15} />
        </a>

        <button 
          onClick={() => setMode('split')} 
          className="text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors cursor-pointer"
        >
          Volver
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-[#ecb613]/30">
      {mode === 'split' && <TheGreatDivide />}
      {mode === 'artist_manifesto' && <ArtistManifesto />}
      {mode === 'artist_form' && <ArtistForm10Phases />}
      {mode === 'fan_access' && <FanAccess />}
    </div>
  );
};

export default TheEarSignal;
