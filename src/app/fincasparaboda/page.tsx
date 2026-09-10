"use client";

import React, { useState } from 'react';
import { Crown, ShieldCheck, Sparkles, ArrowRight, CheckCircle2, Building2, Music, TrendingUp, MapPin, Phone, Mail } from 'lucide-react';

export default function FincasSClassPage() {
  const [formData, setFormData] = useState({
    nombreFinca: '',
    ubicacion: '',
    contacto: '',
    email: '',
    capacidad: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-[#fcfbf9] font-sans selection:bg-[#d4ac0d] selection:text-black">
      {/* Top S-Class Bar */}
      <div className="bg-[#080808] border-b border-[#222] py-2 px-6 text-xs text-gray-400 flex justify-between items-center tracking-wider uppercase">
        <span className="flex items-center gap-2 text-[#d4ac0d]">
          <Crown className="w-4 h-4" /> EAR OS S-Class Architecture // Fincasparaboda.com
        </span>
        <span className="hidden md:inline">Madrid &bull; Toledo &bull; Zona Centro &bull; 15 Plazas Fundadoras</span>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-6 md:px-12 border-b border-[#1c1c1c] bg-gradient-to-b from-[#0a0a0a] to-[#030303]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#d4ac0d]/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#141414] border border-[#d4ac0d]/30 text-[#d4ac0d] text-xs font-semibold uppercase tracking-widest shadow-lg">
            <Sparkles className="w-3.5 h-3.5" /> Exclusividad Soberana &bull; Sin Comisiones Masivas
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white">
            Tu Finca No Es Un Salón Vacío.<br />
            <span className="bg-gradient-to-r from-[#d4ac0d] via-[#f39c12] to-[#e67e22] bg-clip-text text-transparent">
              Es el Escenario de una Leyenda.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            Abandonamos el mercadeo de catálogos masivos y leads fríos. <strong className="text-white font-semibold">fincasparaboda.com</strong> conecta fincas singulares en Madrid y Toledo con parejas de alto poder adquisitivo, fusionando arquitectura patrimonial con la producción artística en directo de Productora EAR.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="#solicitud" 
              className="inline-flex items-center justify-center gap-3 bg-[#d4ac0d] hover:bg-[#b7950b] text-black font-extrabold px-8 py-4 rounded-xl transition-all shadow-[0_0_30px_rgba(212,172,13,0.3)] hover:scale-[1.02] cursor-pointer"
            >
              Postular Finca Fundadora <ArrowRight className="w-5 h-5" />
            </a>
            <a 
              href="#manifiesto" 
              className="inline-flex items-center justify-center gap-2 bg-[#121212] hover:bg-[#1a1a1a] text-gray-200 border border-[#333] font-semibold px-8 py-4 rounded-xl transition-all"
            >
              Leer Manifiesto S-Class
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-12 border-t border-[#1f1f1f] max-w-3xl mx-auto text-center">
            <div>
              <div className="text-2xl md:text-3xl font-black text-white">15</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Plazas Fundadoras</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-black text-[#d4ac0d]">12 W/pax</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Rider Homologado</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-black text-white">80%</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Soberanía de Valor</div>
            </div>
          </div>
        </div>
      </section>

      {/* Manifiesto Section */}
      <section id="manifiesto" className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="bg-[#0b0b0b] border border-[#222] p-8 md:p-12 rounded-2xl relative shadow-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#8e44ad]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center space-y-4 mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8e44ad]">Filosofía & Moat Estético</span>
            <h2 className="text-2xl md:text-3xl font-bold text-white">El Despertar del Espacio Exclusivo</h2>
          </div>

          <blockquote className="border-l-4 border-[#8e44ad] pl-6 my-6 italic text-gray-200 text-lg md:text-xl font-light leading-relaxed">
            &ldquo;Una finca no es solo un entorno con historia y naturaleza; es el santuario donde la vida de dos personas se convierte en leyenda. Sin embargo, el mercado actual os ha tratado como almacenes de bodas en serie.&rdquo;
          </blockquote>

          <div className="space-y-4 text-gray-300 font-light leading-relaxed">
            <p>
              Creemos firmemente que la excelencia arquitectónica y paisajística no debe competir en un escaparate impersonal de descuentos y leads masificados. Las parejas de este segmento no buscan un lugar donde celebrar un evento; buscan un refugio donde respirar exclusividad, emoción y arte absoluto.
            </p>
            <p>
              <strong className="text-white font-medium">fincasparaboda.com</strong> nace para romper el molde. Unimos la majestuidad de vuestras fincas con la curaduría artística de nivel superior de <strong className="text-[#d4ac0d]">Productora EAR</strong>, creando una simbiosis perfecta donde el entorno natural y la ejecución sonora se funden en una experiencia inolvidable.
            </p>
          </div>
        </div>
      </section>

      {/* Value Prop Grid */}
      <section className="py-20 px-6 md:px-12 bg-[#050505] border-t border-b border-[#1c1c1c]">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <span className="text-xs font-bold text-[#d4ac0d] uppercase tracking-wider">Arquitectura de Conversión</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Por qué las fincas líderes abandonan los directorios masivos</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#0b0b0b] border border-[#1f1f1f] p-8 rounded-2xl space-y-4 hover:border-[#d4ac0d]/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#d4ac0d]/10 flex items-center justify-center text-[#d4ac0d] group-hover:bg-[#d4ac0d] group-hover:text-black transition-all">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Cero Fricción & Leads Calificados</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Filtramos rigurosamente el tráfico. Conectamos tu espacio exclusivamente con parejas con alta capacidad presupuestaria y alineadas con el lujo experiencial.
              </p>
            </div>

            <div className="bg-[#0b0b0b] border border-[#1f1f1f] p-8 rounded-2xl space-y-4 hover:border-[#d4ac0d]/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#d4ac0d]/10 flex items-center justify-center text-[#d4ac0d] group-hover:bg-[#d4ac0d] group-hover:text-black transition-all">
                <Music className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">El Efecto Compuesto del Arte</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Una finca gana un 40% más de retención y recuerdo emocional cuando se acompaña de producción artística y técnica en directo (tenores, boleros, rider Shure/Bose).
              </p>
            </div>

            <div className="bg-[#0b0b0b] border border-[#1f1f1f] p-8 rounded-2xl space-y-4 hover:border-[#d4ac0d]/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#d4ac0d]/10 flex items-center justify-center text-[#d4ac0d] group-hover:bg-[#d4ac0d] group-hover:text-black transition-all">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Visibilidad de Autor</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Tu propiedad no aparece en listas impersonales. Se presenta mediante storytelling cinematográfico que realza la singularidad de tu patrimonio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section id="solicitud" className="py-24 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="bg-gradient-to-b from-[#111] to-[#080808] border-2 border-[#d4ac0d]/30 p-8 md:p-14 rounded-3xl shadow-2xl relative">
          <div className="text-center space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#d4ac0d] bg-[#d4ac0d]/10 px-4 py-1 rounded-full">
              <Crown className="w-3.5 h-3.5" /> Fase de Selección Cerrada
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Solicita tu plaza como Finca Fundadora</h2>
            <p className="text-gray-400 max-w-lg mx-auto text-sm">
              Seleccionamos estrictamente <strong className="text-white">15 fincas</strong> en la zona centro (Madrid y Toledo) para el despliegue oficial de la beta.
            </p>
          </div>

          {submitted ? (
            <div className="bg-[#0e1f14] border border-[#27ae60] p-8 rounded-2xl text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-[#27ae60] mx-auto" />
              <h3 className="text-2xl font-bold text-white">Solicitud Recibida Correctamente</h3>
              <p className="text-gray-300 text-sm max-w-md mx-auto">
                Tu postulación para <strong className="text-[#d4ac0d]">{formData.nombreFinca || 'tu finca'}</strong> ha sido registrada en el núcleo de EAR OS. Nuestro comité se pondrá en contacto en menos de 24 horas.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#d4ac0d]" /> Nombre de la Finca
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ej. Finca El Romero"
                    value={formData.nombreFinca}
                    onChange={(e) => setFormData({...formData, nombreFinca: e.target.value})}
                    className="w-full bg-[#050505] border border-[#333] focus:border-[#d4ac0d] rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#d4ac0d]" /> Ubicación (Provincia / Zona)
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ej. Méntrida, Toledo / Madrid"
                    value={formData.ubicacion}
                    onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                    className="w-full bg-[#050505] border border-[#333] focus:border-[#d4ac0d] rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#d4ac0d]" /> Teléfono de Contacto
                  </label>
                  <input 
                    type="tel" 
                    required
                    placeholder="+34 600 000 000"
                    value={formData.contacto}
                    onChange={(e) => setFormData({...formData, contacto: e.target.value})}
                    className="w-full bg-[#050505] border border-[#333] focus:border-[#d4ac0d] rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#d4ac0d]" /> Correo Electrónico
                  </label>
                  <input 
                    type="email" 
                    required
                    placeholder="propietario@tu-finca.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-[#050505] border border-[#333] focus:border-[#d4ac0d] rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  Capacidad Estimada de Invitados & Estilo Arquitectónico
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. 250 invitados / Casona rústica del siglo XIX con jardines"
                  value={formData.capacidad}
                  onChange={(e) => setFormData({...formData, capacidad: e.target.value})}
                  className="w-full bg-[#050505] border border-[#333] focus:border-[#d4ac0d] rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all"
                />
              </div>

              <div className="pt-4 text-center">
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#d4ac0d] via-[#f39c12] to-[#d4ac0d] hover:opacity-90 text-black font-extrabold py-4 px-8 rounded-xl transition-all shadow-[0_0_30px_rgba(212,172,13,0.4)] text-base tracking-wider uppercase cursor-pointer"
                >
                  Enviar Postulación Finca Fundadora
                </button>
                <p className="text-xs text-gray-500 mt-3">
                  Al enviar este formulario, aceptas la homologación de estándares S-Class de Productora EAR.
                </p>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Footer S-Class */}
      <footer className="border-t border-[#1c1c1c] bg-[#050505] py-12 px-6 text-center text-xs text-gray-500 space-y-4">
        <div className="flex justify-center items-center gap-2 text-[#d4ac0d] font-semibold">
          <Crown className="w-4 h-4" /> Productora EAR &bull; Infraestructura S-Class
        </div>
        <p>&copy; 2026 fincasparaboda.com &bull; Todos los derechos reservados. Operado desde Méntrida, Toledo (España).</p>
      </footer>
    </div>
  );
}
