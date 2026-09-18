'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, DollarSign, ShieldCheck, Sparkles, ArrowRight, 
  CheckCircle2, Share2, Copy, Trophy, Phone, MessageCircle,
  Building2, Mail, CreditCard, Send, Lock, HelpCircle
} from 'lucide-react';
import Link from 'next/link';

export default function AfiliadosPage() {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    cifNif: '',
    email: '',
    phone: '',
    category: 'FINCA_ESPACIO',
    payoutMethod: 'IBAN' as 'IBAN' | 'BIZUM',
    payoutDetails: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredAffiliate, setRegisteredAffiliate] = useState<{
    affiliateCode: string;
    referralUrl: string;
    companyName: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/affiliates/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al procesar el registro de afiliado.');
      }

      setRegisteredAffiliate({
        affiliateCode: data.affiliate.affiliateCode,
        referralUrl: data.affiliate.referralUrl,
        companyName: data.affiliate.companyName
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'No se pudo completar el alta. Revisa los datos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = (url: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-white selection:bg-[#ecb613] selection:text-black font-sans pt-28 pb-40 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* HEADER HERO S-CLASS */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[#ecb613] text-[10px] font-mono uppercase tracking-[0.3em]">
            <Trophy size={13} />
            <span>ALIANZAS NUPCIALES // SPLIT 80/10/10 CANÓNICO</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter text-white font-syne leading-[0.95]">
            PROGRAMA DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white">AFILIADOS S-CLASS</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
            Fincas exclusivas, Wedding Planners y Espacios de Bodas: Monetiza tus recomendaciones con liquidación garantizada del <strong className="text-white font-semibold">10% por contrato mercantil</strong> en cada evento cerrado.
          </p>
        </div>

        {/* BENTO GRID DE VENTAJAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-[#0a0a0f] border border-[#1a1a24] hover:border-[#ecb613]/40 transition-all flex flex-col justify-between shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/20 flex items-center justify-center text-[#ecb613]">
              <DollarSign size={24} />
            </div>
            <div className="mt-8">
              <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest block">Comisión Mercantil</span>
              <h3 className="text-2xl font-black text-white mt-1">10% Neto por Gala</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Liquidación de 10% directo de la facturación total generada por cada contratación de sonido, iluminación o actuación de Edwin Agudelo.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#0a0a0f] border border-[#1a1a24] hover:border-emerald-500/40 transition-all flex flex-col justify-between shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck size={24} />
            </div>
            <div className="mt-8">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">Liquidación Directa</span>
              <h3 className="text-2xl font-black text-white mt-1">Cero Cuotas Fijas</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Sin pagos mensuales, sin permanencias. Cobras por transferencia o Bizum tras la confirmación del depósito en Stripe.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#0a0a0f] border border-[#1a1a24] hover:border-cyan-500/40 transition-all flex flex-col justify-between shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Sparkles size={24} />
            </div>
            <div className="mt-8">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">Trazabilidad Total</span>
              <h3 className="text-2xl font-black text-white mt-1">Enlace Soberano</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Recibes un enlace exclusivo y código de prescriptor. Toda pareja que reserve a través de ti queda asignada a tu cuenta.
              </p>
            </div>
          </div>
        </div>

        {/* SECCIÓN DE ALTA AUTÓNOMA O DASHBOARD DEL AFILIADO */}
        <div className="rounded-[2.5rem] bg-gradient-to-b from-[#0f0f14] to-[#08080c] border border-[#1a1a28] p-8 md:p-12 shadow-2xl">
          <AnimatePresence mode="wait">
            {!registeredAffiliate ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                <div className="border-b border-zinc-800/80 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono text-[#ecb613] uppercase tracking-wider block">Alta Inmediata Online</span>
                    <h2 className="text-2xl md:text-3xl font-bold font-syne text-white uppercase mt-1">
                      Date de Alta como Partner de EAR OS
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1">
                      Completa el formulario en 1 minuto. Generaremos tu enlace de afiliado y ledger de comisiones al instante.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 shrink-0">
                    <Lock className="w-3.5 h-3.5 text-[#ecb613]" />
                    <span>Split 80/10/10 Blindado</span>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs font-mono text-rose-400">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 uppercase mb-2">
                        Nombre y Apellidos del Titular *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ej. Carmen Navarro Sánchez"
                        className="w-full px-4 py-3 bg-zinc-950/80 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#ecb613] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 uppercase mb-2">
                        Nombre de la Finca / Espacio / Marca *
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        required
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Ej. Finca Monteviejo / Bodas Luxury"
                        className="w-full px-4 py-3 bg-zinc-950/80 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#ecb613] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 uppercase mb-2">
                        CIF / NIF (Facturación de Comisiones)
                      </label>
                      <input
                        type="text"
                        name="cifNif"
                        value={formData.cifNif}
                        onChange={handleInputChange}
                        placeholder="Ej. B-88997766 o 05248991X"
                        className="w-full px-4 py-3 bg-zinc-950/80 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#ecb613] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 uppercase mb-2">
                        Tipo de Colaborador
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-zinc-950/80 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#ecb613] transition-colors"
                      >
                        <option value="FINCA_ESPACIO">Finca / Espacio de Eventos</option>
                        <option value="WEDDING_PLANNER">Wedding Planner / Organizador</option>
                        <option value="CATERING">Catering / Restauración Nupcial</option>
                        <option value="PROVEEDOR_TECNICO">Proveedor Técnico / DJ / Fotógrafo</option>
                        <option value="OTRO">Otro Prescriptor Profesional</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 uppercase mb-2">
                        Email de Contacto *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="contacto@fincamonteviejo.com"
                        className="w-full px-4 py-3 bg-zinc-950/80 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#ecb613] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 uppercase mb-2">
                        Teléfono / WhatsApp de Avisos *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+34 600 000 000"
                        className="w-full px-4 py-3 bg-zinc-950/80 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#ecb613] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Datos de Liquidación */}
                  <div className="pt-4 border-t border-zinc-800/80 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      <span>DATOS PARA LIQUIDAR TUS COMISIONES (10% NETO)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-zinc-500 uppercase mb-2">
                          Método Preferido
                        </label>
                        <select
                          name="payoutMethod"
                          value={formData.payoutMethod}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-zinc-950/80 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#ecb613] transition-colors"
                        >
                          <option value="IBAN">Transferencia Bancaria (IBAN)</option>
                          <option value="BIZUM">Bizum Profesional</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-mono text-zinc-500 uppercase mb-2">
                          {formData.payoutMethod === 'IBAN' ? 'Número de Cuenta IBAN' : 'Teléfono Asociado a Bizum'}
                        </label>
                        <input
                          type="text"
                          name="payoutDetails"
                          value={formData.payoutDetails}
                          onChange={handleInputChange}
                          placeholder={formData.payoutMethod === 'IBAN' ? 'ES00 0000 0000 0000 0000 0000' : '+34 600 000 000'}
                          className="w-full px-4 py-3 bg-zinc-950/80 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#ecb613] transition-colors font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-2xl bg-[#ecb613] text-black font-bold font-syne text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(236,182,19,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Procesando Alta y Generando Credenciales...</span>
                      ) : (
                        <>
                          <span>Generar Mi Enlace de Afiliado y Ficha Mercantil</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                    <p className="text-[11px] font-mono text-zinc-500 text-center mt-3">
                      Al registrarte aceptas las condiciones mercantiles de colaboración bajo Split 80/10/10. Sin permanencia.
                    </p>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle2 size={32} />
                  </div>
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                    ¡Alta Homologada con Éxito!
                  </span>
                  <h2 className="text-3xl font-black font-syne uppercase text-white">
                    Bienvenido a la Red S-Class, {registeredAffiliate.companyName}
                  </h2>
                  <p className="text-xs text-zinc-400 max-w-lg mx-auto">
                    Tu cuenta de partner ha quedado activa en el ledger. Ya puedes empezar a compartir tu enlace exclusivo para devengar el 10% de comisión en cada evento.
                  </p>
                </div>

                {/* Tarjeta de Credenciales */}
                <div className="p-6 md:p-8 rounded-3xl bg-black/60 border border-[#ecb613]/30 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">Código de Prescriptor</span>
                      <span className="text-xl font-mono font-bold text-[#ecb613]">{registeredAffiliate.affiliateCode}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">Comisión Pactada</span>
                      <span className="text-xl font-mono font-bold text-emerald-400">10% Neto por Gala</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-mono text-zinc-400 uppercase block">Tu Enlace Soberano de Referido:</span>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <div className="w-full p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl font-mono text-xs text-[#ecb613] select-all truncate">
                        {registeredAffiliate.referralUrl}
                      </div>
                      <button
                        onClick={() => handleCopy(registeredAffiliate.referralUrl)}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#ecb613] text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-amber-300 transition-all shrink-0"
                      >
                        {copied ? <CheckCircle2 size={16} className="text-black" /> : <Copy size={16} />}
                        <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <button
                    onClick={() => setRegisteredAffiliate(null)}
                    className="text-xs font-mono text-zinc-500 hover:text-white underline transition-colors"
                  >
                    Registrar otro partner o espacio
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* JUSTIFICACIÓN CANÓNICA DEL SPLIT 80/10/10 */}
        <div className="p-8 rounded-3xl bg-[#08080c] border border-zinc-800/80 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#ecb613] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#ecb613]" />
            <span>Transparencia Canónica // Split 80/10/10</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-xs">
            <div>
              <p className="font-bold text-white mb-1">80% Artista & Ejecución</p>
              <p className="text-zinc-400 leading-relaxed">
                Remuneración justa y directa al artista ejecutor (Edwin Agudelo) y cobertura de portes técnicos Méntrida Km 0.
              </p>
            </div>
            <div>
              <p className="font-bold text-[#ecb613] mb-1">10% Partner / Finca Aliada</p>
              <p className="text-zinc-400 leading-relaxed">
                Liquidado al prescriptor en cada contrato cerrado. Sin esperas de fin de temporada ni deducciones ocultas.
              </p>
            </div>
            <div>
              <p className="font-bold text-cyan-400 mb-1">10% Impacto Social VIMUME</p>
              <p className="text-zinc-400 leading-relaxed">
                Financia musicoterapia hospitalaria y mayores (Protocolo 40 Hz). Certificado de donación Ley 49/2002 deducible en IRPF / IS.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
