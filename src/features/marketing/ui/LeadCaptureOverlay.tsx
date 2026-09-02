import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, X, Mail, User, Building } from 'lucide-react';
import { useSovereignNurturing } from '../hooks/useSovereignNurturing';

interface LeadCaptureOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (email: string, name?: string) => void;
  assetName: string;
}

export const LeadCaptureOverlay: React.FC<LeadCaptureOverlayProps> = ({ isOpen, onClose, onSuccess, assetName }) => {
  const { processLead, isSubmitting, isSuccess } = useSovereignNurturing();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await processLead({
      email,
      name,
      interest: `Descarga: ${assetName}`,
      source: 'VAULT_SCLASS'
    });
    if (onSuccess) onSuccess(email, name);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-xl bg-[#050505] border border-[#D4AF37]/20 rounded-[3rem] p-12 relative overflow-hidden"
          >
            {/* Artifacts Visuales */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#D4AF37]/5 blur-[100px] rounded-full" />
            
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {!isSuccess ? (
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center text-[#D4AF37]">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Invitación al Círculo</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Acceso a Activos S-Class</p>
                  </div>
                </div>

                <p className="text-white/40 text-sm leading-relaxed uppercase font-bold tracking-widest">
                  Para acceder a <span className="text-white">"{assetName}"</span>, valide su identidad profesional. 
                  Recibirá el Dossier Técnico actualizado en su bandeja de entrada.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      required
                      type="text" 
                      placeholder="NOMBRE COMPLETO" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-5 text-[10px] font-black uppercase tracking-widest focus:border-[#D4AF37] outline-none transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      required
                      type="email" 
                      placeholder="EMAIL PROFESIONAL (@gob.es)" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-5 text-[10px] font-black uppercase tracking-widest focus:border-[#D4AF37] outline-none transition-all"
                    />
                  </div>
                  
                  <button 
                    disabled={isSubmitting}
                    className="w-full py-6 bg-[#D4AF37] text-black font-black uppercase tracking-[0.4em] text-[11px] rounded-2xl hover:bg-white transition-all shadow-[0_20px_40px_rgba(212,175,55,0.2)] flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? 'VALIDANDO...' : 'SOLICITAR ACCESO'} <ArrowRight size={16} />
                  </button>
                </form>

                <p className="text-[8px] text-white/20 uppercase text-center font-bold tracking-widest">
                  AL CONTINUAR, ACEPTA EL PROTOCOLO DE PRIVACIDAD EAR GOLD.
                </p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8 relative z-10"
              >
                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mx-auto">
                  <ShieldCheck size={48} />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter text-white">Vínculo Establecido</h3>
                <p className="text-white/40 text-sm uppercase font-bold tracking-widest">
                  Su solicitud ha sido procesada. Revise su bandeja de entrada para completar la descarga segura.
                </p>
                <button 
                  onClick={onClose}
                  className="px-12 py-5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white/5 transition-all"
                >
                  VOLVER A LA BÓVEDA
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
