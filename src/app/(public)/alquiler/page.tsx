import React from 'react';
import { Metadata } from 'next';
import { AcousticSpatialMatcher } from '@/app/components/SClassScreens/AcousticSpatialMatcher';
import { Sparkles, Shield, Clock, Award, CheckCircle2, Phone, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { CENTRALITA, generateWhatsAppLink } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Alquiler de Sonido e Iluminación S-Class | Productora EAR',
  description: 'Calculador acústico por m² y aforo. Alquiler de altavoces Bose, L-Acoustics, microfonía Shure y mesas Behringer con stock en tiempo real y reserva de fecha.',
};

export default function AlquilerSonidoIluminacionPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ecb613] selection:text-black font-sans">
      
      {/* HERO SECTION */}
      <section className="relative pt-28 pb-16 px-4 md:px-12 border-b border-white/10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#ecb613]/10 blur-[140px] pointer-events-none rounded-full" />
        
        <div className="max-w-6xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 border border-[#ecb613]/30 px-4 py-1.5 rounded-full bg-[#ecb613]/5 text-[#ecb613] text-xs font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" /> ARSENAL TÉCNICO • STOCK EN TIEMPO REAL
          </div>

          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight uppercase">
            Alquiler de Sonido <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#ecb613]">
              & Iluminación Profesional
            </span>
          </h1>

          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Presión sonora calculada para tu espacio (12 W/pax), microfonía Shure Axient/Beta y mesas digitales Behringer. Configura tu espacio, consulta el stock disponible y bloquea tu fecha en 1 clic.
          </p>
        </div>
      </section>

      {/* MATCHMAKER & INVENTORY CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 md:px-12 py-16 space-y-16">
        <AcousticSpatialMatcher />

        {/* GARANTÍAS TÉCNICAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/10 pt-16">
          <div className="bg-black/40 border border-white/5 p-8 rounded-3xl space-y-3">
            <Shield className="w-8 h-8 text-[#ecb613]" />
            <h4 className="font-bold text-lg text-white">Redundancia Acústica N+1</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Todos los montajes cuentan con canal auxiliar y microfonía de respaldo para garantizar 0% de interrupciones en directo.
            </p>
          </div>

          <div className="bg-black/40 border border-white/5 p-8 rounded-3xl space-y-3">
            <Clock className="w-8 h-8 text-[#ecb613]" />
            <h4 className="font-bold text-lg text-white">Price-Lock 72h con Criptofirma</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Al abonar tu garantía de reserva (0.50 €), el precio y las unidades de inventario quedan selladas matemáticamente mediante SHA-256.
            </p>
          </div>

          <div className="bg-black/40 border border-white/5 p-8 rounded-3xl space-y-3">
            <Award className="w-8 h-8 text-[#ecb613]" />
            <h4 className="font-bold text-lg text-white">Ingeniero & Técnico de Montaje</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Entrega, calibración acústica con analizador RTA y desinstalación profesional incluida en toda la península.
            </p>
          </div>
        </div>

        {/* ASISTENCIA INMEDIATA */}
        <div className="bg-gradient-to-r from-zinc-950 to-black border border-white/10 p-8 md:p-12 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h3 className="text-2xl font-black text-white uppercase">¿Dudas con la acústica de tu espacio?</h3>
            <p className="text-xs text-slate-400 mt-2 max-w-lg">
              Contacta directamente con nuestra centralita técnica de Productora EAR para asesoramiento inmediato.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <a 
              href={CENTRALITA.tel}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3.5 rounded-2xl font-bold uppercase text-xs tracking-widest border border-white/10"
            >
              <Phone className="w-4 h-4 text-[#ecb613]" /> Llamar
            </a>
            <a 
              href={generateWhatsAppLink({
                profile: 'alquiler',
                service: 'Alquiler de Sonido e Iluminación',
                location: 'España',
                intent: 'solicito asesoramiento técnico de altavoces e iluminación',
                slug: 'alquiler'
              }).url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 px-6 py-3.5 rounded-2xl font-bold uppercase text-xs tracking-widest"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Técnico
            </a>
          </div>
        </div>
      </main>

    </div>
  );
}
