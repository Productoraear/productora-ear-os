
import React, { useState } from 'react';
import { trackEvent } from '../FleetTracker';  // Inyectar importación de la función trackEvent
import { Calendar, MapPin, Clock, Ticket, Star, Mic2, Users, ArrowRight, Heart, Zap, Megaphone, CheckCircle } from 'lucide-react';
import type { Event } from '../data/Event';  // Importar la interfaz Event
import PaymentModal from './PaymentModal';
import { UPCOMING_EVENTS } from '../data/events';  // Asegurar que la ruta esté correcta

const EventsSection: React.FC = () => {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  return (
    <div className="pt-20 bg-black min-h-screen font-body">
      
      {/* HERO SECTION */}
      <div className="relative py-24 border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <span className="text-ear-gold font-body font-bold tracking-[0.3em] uppercase text-xs mb-4 block animate-fade-in-up">Ingeniería de Experiencias</span>
          <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-6 animate-fade-in-up delay-100 leading-tight">
            EVENTOS <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">360 DE AUTOR</span>
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed animate-fade-in-up delay-200">
            No solo organizamos eventos; creamos hitos inolvidables. Cubrimos desde la idea inicial hasta la medición de resultados.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        
        {/* EVENT PRICING INFO */}
        <div className="bg-white/5 border border-white/10 p-10 rounded-3xl mb-24 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5"><Zap size={200}/></div>
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                 <h2 className="text-3xl font-display font-bold text-white mb-6 uppercase">Producción de <span className="text-ear-gold">Alto Nivel</span></h2>
                 <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-6xl font-black text-white">€3000</span>
                    <span className="text-gray-500 uppercase font-bold text-xs">/ Pago Único (Base)</span>
                 </div>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    Nuestra visión nos impide hacer un "copia y pega". Creamos experiencias inolvidables con garantía de resultados por escrito.
                 </p>
<button 
  className="px-10 py-5 bg-white text-black font-black uppercase tracking-[0.2em] rounded-xl hover:bg-ear-gold transition-colors shadow-2xl flex items-center gap-2"
  onClick={() => {
    setPaymentModalOpen(true);
    trackEvent('agenda_cita'); // Llamada a la función trackEvent
  }}
>
  <Calendar size={20} /> Agenda cita de 30 min sin compromiso
</button>
              </div>
              <div className="space-y-4">
                 <div className="bg-gradient-to-r from-ear-purple/30 to-black p-6 rounded-2xl border border-ear-gold/20">
                    <h4 className="text-white font-bold mb-2 flex items-center gap-2"><CheckCircle size={18} className="text-ear-gold"/> Planificación Total</h4>
                    <p className="text-xs text-gray-400">Diseño conceptual y logística integral de proveedores.</p>
                 </div>
                 <div className="bg-gradient-to-r from-ear-purple/30 to-black p-6 rounded-2xl border border-ear-gold/20">
                    <h4 className="text-white font-bold mb-2 flex items-center gap-2"><Megaphone size={18} className="text-ear-gold"/> Campañas Ads</h4>
                    <p className="text-xs text-gray-400">Promoción estratégica para garantizar el aforo y el impacto.</p>
                 </div>
              </div>
           </div>
        </div>

        {/* UPCOMING EVENTS LIST */}
        <div className="grid grid-cols-1 gap-8">
           {UPCOMING_EVENTS.map((event: Event) => (  // Tipar el parámetro event como Event
              <div key={event.id} className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row group">
                 <div className="md:w-1/3 aspect-video md:aspect-auto overflow-hidden">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                 </div>
                 <div className="p-8 md:p-12 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-ear-gold text-xs font-bold uppercase tracking-widest mb-4">
                       <Star size={14} fill="currentColor" /> {event.status}
                    </div>
                    <h3 className="text-3xl font-display font-bold text-white mb-4">{event.title}</h3>
                    <p className="text-gray-400 mb-8 max-w-xl">{event.hook}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 pt-8 border-t border-white/5">
                       <div>
                          <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Fecha</p>
                          <p className="text-white font-bold">{event.date}</p>
                       </div>
                       <div>
                          <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Hora</p>
                          <p className="text-white font-bold">{event.time}</p>
                       </div>
                       <div className="col-span-2">
                          <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Ubicación</p>
                          <p className="text-white font-bold">{event.location}</p>
                       </div>
                    </div>
                    <button className="mt-auto px-8 py-4 bg-ear-gold text-black font-black uppercase tracking-widest text-xs rounded-xl self-start hover:bg-white transition-colors">
                       {event.cta}
                    </button>
                 </div>
              </div>
           ))}
        </div>

      </div>

      <PaymentModal 
           isOpen={paymentModalOpen}
           onClose={() => setPaymentModalOpen(false)}
           amount={0}
           concept="Reserva de Evento"
        />
    </div>
  );
};

export default EventsSection;

