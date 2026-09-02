'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Video, 
  MapPin, 
  Heart, 
  Download, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  Sparkles,
  Phone,
  MessageCircle,
  Loader2
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';

interface InstitutionalBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultOption?: string;
}

const INSTITUTIONAL_OPTIONS = [
  {
    id: 'PRESENCIAL',
    title: 'Presentación Presencial en Pleno / Comisión',
    desc: 'Demostración acústica in situ, catálogo de orquestas/mariachis y dossier técnico impreso sellado.',
    icon: Building2,
    tag: 'Presencial',
    color: 'border-[#ecb613] text-[#ecb613]'
  },
  {
    id: 'VIDEO_EXPRESS',
    title: 'Videoconferencia Técnica de Validación (15 min)',
    desc: 'Reunión express para auditar pliegos bajo el Art. 118 LCSP (<15.000 €) y encaje presupuestario.',
    icon: Video,
    tag: 'Virtual / Meet',
    color: 'border-blue-400 text-blue-400'
  },
  {
    id: 'AUDITORIA_RECINTO',
    title: 'Auditoría Acústica y de Aforo de Recinto Municipal',
    desc: 'Inspección técnica previa de teatros, plazas o recintos feriales con cálculo de 12 W/pax y limitadores.',
    icon: MapPin,
    tag: 'Ingeniería',
    color: 'border-emerald-400 text-emerald-400'
  },
  {
    id: 'PILOTO_VIMUME',
    title: 'Proyecto Piloto VIMUME (Tercera Edad / Residencias)',
    desc: 'Sesión gratuita de prueba del protocolo neuroacústico Gamma 40Hz amparado por fondos NextGenEU.',
    icon: Heart,
    tag: 'Social / Silver',
    color: 'border-pink-400 text-pink-400'
  },
  {
    id: 'PLIEGO_EXCLUSIVIDAD',
    title: 'Descarga de Pliego Borrador + Certificado Exclusividad',
    desc: 'Entrega del borrador de contrato menor, certificado Art. 168.a.2º LCSP y póliza de RC de 1.000.000 €.',
    icon: Download,
    tag: 'Documental',
    color: 'border-purple-400 text-purple-400'
  }
];

export function InstitutionalBookingModal({ isOpen, onClose, defaultOption = 'PRESENCIAL' }: InstitutionalBookingModalProps) {
  const [selectedOption, setSelectedOption] = useState<string>(defaultOption);
  const [cargo, setCargo] = useState<string>('');
  const [entidad, setEntidad] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [telefono, setTelefono] = useState<string>('');
  const [fecha, setFecha] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Registrar evento institucional
      await fetch('/api/telemetry/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'INSTITUTIONAL_BOOKING_REQUEST',
          metadata: {
            option: selectedOption,
            cargo,
            entidad,
            email,
            telefono,
            fecha
          }
        })
      }).catch(() => {});

      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
      }, 600);
    } catch {
      setIsSubmitting(false);
      setIsSuccess(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0b0b10] border border-[#ecb613]/40 rounded-[2.5rem] p-6 sm:p-10 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_80px_rgba(236,182,19,0.15)] text-white space-y-6 relative"
      >
        
        {/* BOTÓN CERRAR */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X size={18} />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase tracking-tight font-syne text-white">
                Convocatoria Registrada con Éxito
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Hemos recibido tu solicitud para <strong>{entidad || 'la entidad pública'}</strong>. Nuestro departamento técnico contactará con el despacho en menos de 2 horas laborables.
              </p>
            </div>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={CENTRALITA.tel}
                className="px-6 py-3 bg-[#ecb613] text-black font-mono text-xs font-bold uppercase rounded-xl inline-flex items-center justify-center gap-2"
              >
                <Phone size={14} /> Llamar Centralita Directa
              </a>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase rounded-xl"
              >
                Cerrar Ventana
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* CABECERA */}
            <div className="space-y-2 border-b border-white/10 pb-6 pr-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono font-bold tracking-widest uppercase">
                <ShieldCheck size={12} /> PROTOCOLO INSTITUCIONAL B2G
              </div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight font-syne text-white">
                Agendar <span className="text-[#ecb613]">Presentación Institucional</span>
              </h2>
              <p className="text-xs text-slate-400 font-light">
                Selecciona la modalidad de coordinación requerida para tu ayuntamiento, residencia o entidad pública.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* 5 OPCIONES DE SERVICIO */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">
                  1. MODALIDAD DE VALIDACIÓN / PRESENTACIÓN
                </span>
                <div className="space-y-2">
                  {INSTITUTIONAL_OPTIONS.map((opt) => {
                    const isSelected = selectedOption === opt.id;
                    const Icon = opt.icon;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedOption(opt.id)}
                        className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                          isSelected
                            ? 'bg-white/10 border-[#ecb613] shadow-lg shadow-[#ecb613]/10'
                            : 'bg-white/5 border-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className={`p-2 rounded-xl bg-black/40 border ${isSelected ? opt.color : 'border-white/10 text-slate-400'}`}>
                          <Icon size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center gap-2">
                            <h4 className={`text-xs font-bold font-syne uppercase truncate ${isSelected ? 'text-white font-black' : 'text-slate-200'}`}>
                              {opt.title}
                            </h4>
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
                              {opt.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-light leading-relaxed mt-0.5">
                            {opt.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CAMPOS DEL DESPACHO */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">
                  2. DATOS DEL CARGO Y ENTIDAD PÚBLICA
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <input
                    required
                    type="text"
                    placeholder="Ayuntamiento / Entidad (ej: Ayto. de Pozuelo)"
                    value={entidad}
                    onChange={(e) => setEntidad(e.target.value)}
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-3.5 text-white focus:outline-none focus:border-[#ecb613]"
                  />
                  <input
                    required
                    type="text"
                    placeholder="Cargo (ej: Concejal de Festejos, Director)"
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-3.5 text-white focus:outline-none focus:border-[#ecb613]"
                  />
                  <input
                    required
                    type="email"
                    placeholder="Email Institucional (@ayto.es)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-3.5 text-white focus:outline-none focus:border-[#ecb613]"
                  />
                  <input
                    required
                    type="tel"
                    placeholder="Teléfono Directo de Contacto"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-3.5 text-white focus:outline-none focus:border-[#ecb613]"
                  />
                </div>
              </div>

              {/* FECHA ESTIMADA */}
              <div className="space-y-1.5 text-xs">
                <label className="text-[10px] font-mono uppercase text-slate-400">Fecha Estimada de Presentación / Comisión</label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-3.5 text-white focus:outline-none focus:border-[#ecb613]"
                />
              </div>

              {/* BOTÓN SUBMIT */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-[#ecb613] hover:bg-[#d4a210] text-black font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#ecb613]/20 transition-all cursor-pointer active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Formalizando Convocatoria...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} />
                      <span>Confirmar Solicitud de Presentación Institucional</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </>
        )}

      </motion.div>
    </div>
  );
}

export default InstitutionalBookingModal;
