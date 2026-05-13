
import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Send, Activity, FileText, Search, Layers, Anchor, Zap, AlertTriangle } from 'lucide-react';
import { api } from '../../lib/api';

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    identity: '',
    metrics: '',
    friction: '',
    zero: '',
    contact: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Persistencia en Backend (Digitalización del Lead)
      await api.submitLead({
        type: 'business_audit',
        source: 'web_productora_ear',
        section: 'forensic_audit_form',
        data: formData,
        timestamp: new Date().toISOString()
      });

      // 2. Preparar el mensaje de WhatsApp para el canal de cierre
      const text = `
*ASUNTO: SOLICITUD DE AUDITORÍA FORENSE*
He detectado Sistemas Zombie y necesito disección estructural.

1. 🧬 *Identidad:* ${formData.identity}
2. 📉 *Power Numbers:* ${formData.metrics}
3. 🛑 *Fricción:* ${formData.friction}
4. 0️⃣ *Test del Cero:* ${formData.zero}

👤 *Contacto:* ${formData.contact}
      `.trim();

      const encodedText = encodeURIComponent(text);
      const waLink = `https://wa.me/34693693048?text=${encodedText}`;
      
      setSubmitted(true);
      setTimeout(() => {
        window.open(waLink, '_blank');
        setIsSubmitting(false);
      }, 500);

    } catch (error) {
      console.error("Error al procesar auditoría:", error);
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-24 bg-black min-h-screen flex items-center justify-center font-body">
        <div className="text-center animate-scale-in">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
            <ShieldCheck size={40} className="text-black" />
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-4 uppercase">Solicitud Procesada</h2>
          <p className="text-gray-400 max-w-md mx-auto mb-8">
            Los datos han sido registrados en nuestra base de datos forense. Estamos abriendo WhatsApp para la validación final.
          </p>
          <button onClick={() => setSubmitted(false)} className="text-ear-gold font-bold uppercase tracking-widest text-xs border-b border-ear-gold pb-1">Nueva Auditoría</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 bg-black min-h-screen relative overflow-hidden flex flex-col justify-center font-body">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-red-900/10 via-black to-black"></div>
      
      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10 w-full">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-red-900/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-[0.2em] mb-6">
            <Activity size={14} /> Protocolo de Deconstrucción
          </div>
          <h1 className="text-4xl md:text-7xl font-display font-black text-white mb-6 leading-tight">
            LA AUTOPSIA DEL <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-red-500">NEGOCIO VIVO</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-[#111] p-6 rounded-2xl border border-white/5 hover:border-red-500/30 transition-all group">
                <Zap className="text-red-500 mb-4 group-hover:scale-110 transition-transform" size={32}/>
                <h3 className="text-white font-bold text-sm uppercase mb-2">1. Búsqueda del Cero</h3>
                <p className="text-gray-500 text-xs leading-relaxed">El componente que anula al resto. Buscamos el punto de ruptura estructural.</p>
            </div>
            <div className="bg-[#111] p-6 rounded-2xl border border-white/5 hover:border-ear-gold/30 transition-all group">
                <ShieldCheck className="text-ear-gold mb-4 group-hover:scale-110 transition-transform" size={32}/>
                <h3 className="text-white font-bold text-sm uppercase mb-2">2. Señales Invisibles</h3>
                <p className="text-gray-500 text-xs leading-relaxed">Trust Architecture. Auditamos la disonancia entre tu precio y tu autoridad estética.</p>
            </div>
            <div className="bg-[#111] p-6 rounded-2xl border border-white/5 hover:border-blue-400/30 transition-all group">
                <Layers className="text-blue-400 mb-4 group-hover:scale-110 transition-transform" size={32}/>
                <h3 className="text-white font-bold text-sm uppercase mb-2">3. Análisis de Fricción</h3>
                <p className="text-gray-500 text-xs leading-relaxed">Identificamos lo que sobra. Si no es fluido como el agua, es un fallo de diseño.</p>
            </div>
            <div className="bg-[#111] p-6 rounded-2xl border border-white/5 hover:border-green-400/30 transition-all group">
                <Anchor className="text-green-400 mb-4 group-hover:scale-110 transition-transform" size={32}/>
                <h3 className="text-white font-bold text-sm uppercase mb-2">4. El Linchpin</h3>
                <p className="text-gray-500 text-xs leading-relaxed">El Eje Central. Lo único que, si lo arreglamos, hace que todo lo demás sea irrelevante.</p>
            </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/10 p-8 md:p-12 rounded-3xl shadow-[0_0_50px_rgba(220,38,38,0.1)] relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
                 <FileText className="text-white" size={24}/>
                 <h2 className="text-2xl font-display font-bold text-white">Solicitud de Auditoría Forense</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-xs text-ear-gold uppercase tracking-widest font-bold flex items-center gap-2">
                     <Search size={12}/> 1. Auditoría de Identidad
                  </label>
                  <input type="text" name="identity" value={formData.identity} onChange={handleChange} className="w-full bg-black border border-white/20 p-4 rounded-xl text-white font-bold focus:border-ear-gold outline-none transition-colors" placeholder="Ej: Nuestra oferta suena igual a la competencia..." required />
                </div>

                <div className="space-y-3">
                  <label className="text-xs text-ear-gold uppercase tracking-widest font-bold flex items-center gap-2">
                     <Activity size={12}/> 2. Power Numbers
                  </label>
                  <input type="text" name="metrics" value={formData.metrics} onChange={handleChange} className="w-full bg-black border border-white/20 p-4 rounded-xl text-white font-bold focus:border-ear-gold outline-none transition-colors" placeholder="Ej: Tenemos tráfico pero el cierre cae al 2%..." required />
                </div>

                <div className="space-y-3">
                  <label className="text-xs text-ear-gold uppercase tracking-widest font-bold flex items-center gap-2">
                     <Layers size={12}/> 3. Detección de Fricción
                  </label>
                  <textarea name="friction" rows={2} value={formData.friction} onChange={handleChange} className="w-full bg-black border border-white/20 p-4 rounded-xl text-white font-bold focus:border-ear-gold outline-none transition-colors resize-none" placeholder="Ej: Procesos internos lentos, web confusa..." required />
                </div>

                <div className="space-y-3">
                  <label className="text-xs text-red-500 uppercase tracking-widest font-bold flex items-center gap-2">
                     <AlertTriangle size={12}/> 4. El Test del Cero
                  </label>
                  <input type="text" name="zero" value={formData.zero} onChange={handleChange} className="w-full bg-black border border-red-900/50 p-4 rounded-xl text-white font-bold focus:border-red-500 outline-none transition-colors" placeholder="Ej: Dependencia total de un solo canal..." required />
                </div>

                <div className="pt-4 border-t border-white/10">
                   <input type="text" name="contact" value={formData.contact} onChange={handleChange} className="w-full bg-transparent border-b border-white/20 p-2 text-white text-sm focus:border-white outline-none" placeholder="Tu Email / Teléfono para el diagnóstico..." required />
                </div>

                <div className="pt-6">
                  <button type="submit" disabled={isSubmitting} className="group relative w-full py-5 bg-white text-black font-black font-display tracking-[0.2em] uppercase overflow-hidden hover:bg-red-600 hover:text-white transition-all duration-300 rounded-xl">
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {isSubmitting ? 'Digitalizando Autopsia...' : 'SOLICITAR AUTOPSIA DEL NEGOCIO'} <ArrowRight size={20} />
                    </span>
                  </button>
                </div>
              </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
