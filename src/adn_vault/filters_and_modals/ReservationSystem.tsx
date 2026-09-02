import React, { useState } from 'react';
import { Calendar, Clock, Users, CheckCircle, ChevronRight, Search, Filter, MoreHorizontal, User, Shield } from 'lucide-react';

type Role = 'client' | 'admin';
type BookingStep = 'service' | 'datetime' | 'details' | 'confirmation';

interface Booking {
  id: string;
  client: string;
  service: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  pax: number;
}

const ReservationSystem: React.FC = () => {
  const [role, setRole] = useState<Role>('client');
  const [step, setStep] = useState<BookingStep>('service');
  
  // Mock Data for Admin View
  const [bookings, setBookings] = useState<Booking[]>([
    { id: 'RES-001', client: 'Sony Music Spain', service: 'Studio A - Recording', date: '2023-10-24', time: '10:00', status: 'confirmed', pax: 5 },
    { id: 'RES-002', client: 'Carlos Rivera', service: 'Consultoría Emanager', date: '2023-10-24', time: '12:30', status: 'pending', pax: 2 },
    { id: 'RES-003', client: 'Wedding: Ana & Jose', service: 'Showroom Visita', date: '2023-10-25', time: '16:00', status: 'confirmed', pax: 4 },
    { id: 'RES-004', client: 'Festival MadCool', service: 'Rental Pickup', date: '2023-10-25', time: '09:00', status: 'cancelled', pax: 1 },
  ]);

  // Booking Form State
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // --- CLIENT VIEW COMPONENTS ---
  
  const ClientView = () => {
    const services = [
      { id: 'consulting', title: 'Consultoría Emanager', duration: '60 min', price: '120€' },
      { id: 'studio', title: 'Reserva Estudio A', duration: '4 horas', price: '350€' },
      { id: 'showroom', title: 'Visita Showroom Eventos', duration: '45 min', price: 'Gratis' },
      { id: 'rental', title: 'Recogida/Devolución Rental', duration: '30 min', price: 'N/A' },
    ];

    const timeSlots = ['09:00', '10:00', '11:00', '12:30', '14:00', '16:00', '17:30'];

    return (
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-10"></div>
          {['Selección', 'Agenda', 'Datos', 'Confirmación'].map((label, idx) => {
            const steps: BookingStep[] = ['service', 'datetime', 'details', 'confirmation'];
            const isActive = steps.indexOf(step) >= idx;
            return (
              <div key={idx} className="flex flex-col items-center gap-2 bg-black px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isActive ? 'bg-ear-gold text-black' : 'bg-white/10 text-gray-500'}`}>
                  {idx + 1}
                </div>
                <span className={`text-[10px] uppercase tracking-wider ${isActive ? 'text-ear-gold' : 'text-gray-600'}`}>{label}</span>
              </div>
            );
          })}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 min-h-[400px]">
          
          {step === 'service' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-display font-bold text-white mb-6">Selecciona el Servicio</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((s) => (
                  <button 
                    key={s.id}
                    onClick={() => { setSelectedService(s.title); setStep('datetime'); }}
                    className="p-6 text-left border border-white/10 rounded-xl hover:border-ear-gold hover:bg-white/5 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-white group-hover:text-ear-gold">{s.title}</h3>
                      <ChevronRight className="text-gray-500 group-hover:text-ear-gold" />
                    </div>
                    <p className="text-sm text-gray-400 flex gap-4">
                      <span className="flex items-center gap-1"><Clock size={14}/> {s.duration}</span>
                      <span>{s.price}</span>
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'datetime' && (
            <div className="animate-fade-in">
              <button onClick={() => setStep('service')} className="text-xs text-gray-500 hover:text-white mb-4 flex items-center gap-1">
                &larr; Volver
              </button>
              <h2 className="text-2xl font-display font-bold text-white mb-6">Fecha y Hora</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Mock Calendar */}
                <div className="bg-black/50 p-4 rounded-xl border border-white/10">
                  <div className="text-center font-bold text-white mb-4 border-b border-white/10 pb-2">Octubre 2023</div>
                  <div className="grid grid-cols-7 gap-2 text-center text-sm">
                    {['L','M','X','J','V','S','D'].map(d => <span key={d} className="text-gray-500 text-xs">{d}</span>)}
                    {[...Array(31)].map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => setSelectedDate(`2023-10-${i+1}`)}
                        className={`p-2 rounded hover:bg-ear-gold hover:text-black transition-colors ${selectedDate === `2023-10-${i+1}` ? 'bg-ear-gold text-black font-bold' : 'text-gray-300'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-4">Disponibilidad</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map(t => (
                      <button 
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        className={`py-3 px-4 rounded-lg border text-sm font-bold transition-all ${selectedTime === t ? 'bg-ear-gold text-black border-ear-gold' : 'border-white/20 text-white hover:border-white/50'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <button 
                    disabled={!selectedDate || !selectedTime}
                    onClick={() => setStep('details')}
                    className="w-full mt-8 py-3 bg-white text-black font-bold uppercase tracking-widest hover:bg-ear-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'details' && (
            <div className="animate-fade-in">
               <button onClick={() => setStep('datetime')} className="text-xs text-gray-500 hover:text-white mb-4 flex items-center gap-1">
                &larr; Volver
              </button>
              <h2 className="text-2xl font-display font-bold text-white mb-6">Tus Datos</h2>
              <form className="space-y-4 max-w-lg" onSubmit={(e) => { e.preventDefault(); setStep('confirmation'); }}>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Nombre" className="bg-black/50 border border-white/20 p-3 rounded text-white focus:border-ear-gold outline-none" required />
                  <input type="text" placeholder="Apellidos" className="bg-black/50 border border-white/20 p-3 rounded text-white focus:border-ear-gold outline-none" required />
                </div>
                <input type="email" placeholder="Email Corporativo" className="w-full bg-black/50 border border-white/20 p-3 rounded text-white focus:border-ear-gold outline-none" required />
                <input type="tel" placeholder="Teléfono" className="w-full bg-black/50 border border-white/20 p-3 rounded text-white focus:border-ear-gold outline-none" required />
                <textarea placeholder="Notas especiales (Alergias, requerimientos técnicos...)" className="w-full bg-black/50 border border-white/20 p-3 rounded text-white focus:border-ear-gold outline-none h-24"></textarea>
                
                <div className="bg-ear-gold/10 border border-ear-gold/20 p-4 rounded mb-6">
                  <h4 className="font-bold text-ear-gold text-sm mb-2">Resumen</h4>
                  <p className="text-gray-300 text-sm">{selectedService}</p>
                  <p className="text-gray-300 text-sm">{selectedDate} a las {selectedTime}</p>
                </div>

                <button className="w-full py-4 bg-ear-gold text-black font-bold uppercase tracking-widest hover:bg-white transition-colors shadow-lg shadow-ear-gold/20">
                  Confirmar Reserva
                </button>
              </form>
            </div>
          )}

          {step === 'confirmation' && (
            <div className="flex flex-col items-center justify-center text-center h-full animate-scale-in py-12">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                <CheckCircle size={40} className="text-black" />
              </div>
              <h2 className="text-3xl font-display font-bold text-white mb-2">¡Reserva Confirmada!</h2>
              <p className="text-gray-400 mb-8 max-w-md">
                Hemos enviado un correo de confirmación a tu dirección. Tu código de reserva es <span className="text-ear-gold font-mono">EAR-8X29</span>.
              </p>
              <button 
                onClick={() => { setStep('service'); setSelectedDate(''); setSelectedTime(''); }}
                className="px-8 py-3 border border-white/30 text-white hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-sm font-bold"
              >
                Nueva Reserva
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // --- ADMIN VIEW COMPONENTS ---

  const AdminView = () => {
    return (
      <div className="animate-fade-in w-full">
        {/* Admin Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
            <span className="text-gray-400 text-xs uppercase tracking-widest">Reservas Hoy</span>
            <div className="text-3xl font-display font-bold text-white mt-1">12</div>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
            <span className="text-gray-400 text-xs uppercase tracking-widest">Ocupación Estudio</span>
            <div className="text-3xl font-display font-bold text-ear-gold mt-1">85%</div>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
            <span className="text-gray-400 text-xs uppercase tracking-widest">Pendientes</span>
            <div className="text-3xl font-display font-bold text-orange-400 mt-1">3</div>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
            <span className="text-gray-400 text-xs uppercase tracking-widest">Ingresos Previstos</span>
            <div className="text-3xl font-display font-bold text-green-400 mt-1">1.2k€</div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar reserva, cliente o ID..." 
              className="w-full bg-black border border-white/20 pl-12 pr-4 py-3 rounded-lg text-white focus:border-ear-gold outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg text-sm text-white hover:bg-white/10">
              <Filter size={16} /> Filtros
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-ear-gold text-black font-bold rounded-lg text-sm hover:bg-white transition-colors">
              + Nueva Manual
            </button>
          </div>
        </div>

        {/* Booking Table (OpenTable style) */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400">ID</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400">Cliente</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400">Servicio</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400">Fecha/Hora</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400">Pax</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400">Estado</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-sm font-mono text-gray-500">{booking.id}</td>
                  <td className="p-4 text-white font-bold">{booking.client}</td>
                  <td className="p-4 text-sm text-gray-300">{booking.service}</td>
                  <td className="p-4 text-sm text-gray-300">
                    <div className="flex flex-col">
                      <span>{booking.date}</span>
                      <span className="text-xs text-gray-500">{booking.time}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-300"><span className="flex items-center gap-1"><User size={12}/>{booking.pax}</span></td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                      booking.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      booking.status === 'pending' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                      'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 cursor-pointer hover:text-white">
                    <MoreHorizontal size={20} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 border-t border-white/10 text-center text-xs text-gray-500 uppercase tracking-widest hover:text-white cursor-pointer transition-colors">
            Ver todas las reservas
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-24 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-6">
          <div>
             <span className="text-ear-gold font-body font-bold tracking-[0.2em] uppercase text-xs mb-2 block">
              Gestión de Espacios & Servicios
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
              EAR <span className="text-transparent bg-clip-text bg-gradient-to-r from-ear-gold to-yellow-200">RESERVE</span>
            </h1>
          </div>
          
          {/* Role Switcher (For Demo Purposes) */}
          <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10">
            <button 
              onClick={() => setRole('client')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${role === 'client' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              Cliente
            </button>
            <button 
              onClick={() => setRole('admin')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${role === 'admin' ? 'bg-ear-purple text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              <Shield size={12} /> Admin
            </button>
          </div>
        </div>

        {/* Content Area */}
        {role === 'client' ? <ClientView /> : <AdminView />}

      </div>
    </div>
  );
};

export default ReservationSystem;
