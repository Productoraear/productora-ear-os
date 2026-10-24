import React from 'react';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';

/**
 * 🛰️ EMANAGER STUDIO DASHBOARD (BÚNKER OPERATIVO)
 * Vertical: Talent OS
 */

export default function ArtistDashboardPage() {
  return (
    <div className="space-y-12">
      
      {/* 🏁 WELCOME & STATUS */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-4">Mando Central</h1>
          <p className="text-white/40 text-sm font-medium italic">Monitorización de activos artísticos y flujo contractual.</p>
        </div>
        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] flex items-center gap-6">
           <div className="flex flex-col items-end">
             <span className="text-[9px] font-black uppercase tracking-widest text-[#ecb613]">Estado del Perfil</span>
             <span className="text-xl font-black italic tracking-tighter text-white uppercase">Publicado</span>
           </div>
           <div className="w-12 h-12 bg-[#ecb613]/20 rounded-full flex items-center justify-center text-[#ecb613]">
             <CheckCircle2 size={24} />
           </div>
        </div>
      </div>

      {/* 🚀 MÓDULO DEL PUENTE TECNOLÓGICO: PASARELA DE COBRO DE CLIENTES */}
      <div className="rounded-[2.5rem] bg-gradient-to-r from-[#0d0d15] via-[#151522] to-[#0d0d15] border border-[#ecb613]/30 p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ecb613]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/30 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                Puente Tecnológico EAR OS // Pasarela de Clientes
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                Membresía Élite Anual Activa (290€/año)
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-white font-syne">
              Tus Clientes Pagan Seguro en Stripe. Tú Cobras el 80%.
            </h2>
            <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
              Comparte tu enlace de reserva directa para que tus clientes depositen los 100€ deducibles en Stripe Escrow. Tu fecha queda blindada con candado atómico y cero plantones.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://productoraear.com/mariachis"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-[#ecb613] hover:bg-amber-300 text-black font-black font-mono text-xs uppercase tracking-wider transition shadow-lg shadow-[#ecb613]/20 flex items-center gap-2"
            >
              <ArrowUpRight size={16} />
              <span>Ver Mi Escaparate Público</span>
            </a>
            <a
              href="/studio/artist/finance"
              className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold font-mono text-xs uppercase tracking-wider transition flex items-center gap-2"
            >
              <span>Ver Liquidaciones (80%)</span>
            </a>
          </div>
        </div>
      </div>

      {/* 📊 KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <KpiCard title="Impacto Semanal" value="12.4k" trend="+14%" icon={<Users size={20} />} />
        <KpiCard title="Próximos Eventos" value="3" trend="Siguiente: 24/05" icon={<Calendar size={20} />} />
        <KpiCard title="Escrow Garantizado" value="600€" trend="6 depósitos Stripe" icon={<TrendingUp size={20} />} />
        <KpiCard title="Split Soberano" value="80%" trend="Neto inmutable" icon={<FileText size={20} />} />
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        
        {/* 📅 ACTIVITY / BOOKINGS */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-end">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter">Eventos en el Horizonte</h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-[#ecb613] transition-colors cursor-pointer">Ver Calendario Completo</span>
          </div>
          
          <div className="space-y-4">
             <BookingRow 
              date="24 MAY" 
              name="Gala Benéfica Alzheimer" 
              location="Madrid, Palacio de Cristal"
              status="CONFIRMADO"
             />
             <BookingRow 
              date="12 JUN" 
              name="Festival Silver Economy" 
              location="Valencia, Ciudad de las Artes"
              status="RESERVADO"
              isHighlight
             />
             <BookingRow 
              date="18 JUN" 
              name="Evento Corporativo VIMUME" 
              location="Bilbao, Museo Guggenheim"
              status="PENDIENTE"
             />
          </div>
        </div>

        {/* 🧬 ALERTS / NOTIFICATIONS */}
        <div className="space-y-8">
           <h3 className="text-2xl font-black uppercase italic tracking-tighter">Señales del Nexo</h3>
           <div className="space-y-4">
              <AlertItem 
                icon={<AlertCircle size={18} className="text-[#ecb613]" />}
                title="Actualización de Rider"
                desc="Se requiere validación técnica para el evento en Valencia."
              />
              <AlertItem 
                icon={<Clock size={18} className="text-white/30" />}
                title="Liquidación en Proceso"
                desc="La factura #2026-088 está siendo auditada por el Ledger."
              />
              <div className="p-10 bg-gradient-to-br from-[#ecb613]/10 to-transparent border border-[#ecb613]/20 rounded-[3rem] space-y-6">
                <h4 className="text-xl font-black uppercase italic tracking-tighter leading-none italic">Soberanía de Datos</h4>
                <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold leading-relaxed">
                  Toda la información contractual está protegida bajo protocolos RLS de Productora EAR.
                </p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

function KpiCard({ title, value, trend, icon }: { title: string, value: string, trend: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] hover:bg-white/[0.04] transition-all group">
      <div className="flex justify-between items-start mb-8">
        <div className="p-3 bg-white/5 rounded-2xl text-[#ecb613] group-hover:bg-[#ecb613] group-hover:text-black transition-all">
          {icon}
        </div>
        <ArrowUpRight size={16} className="text-white/20 group-hover:text-[#ecb613] transition-colors" />
      </div>
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">{title}</h4>
        <div className="flex items-baseline gap-4">
          <span className="text-3xl font-black italic tracking-tighter">{value}</span>
          <span className="text-[9px] font-bold text-[#ecb613] uppercase tracking-widest">{trend}</span>
        </div>
      </div>
    </div>
  );
}

function BookingRow({ date, name, location, status, isHighlight = false }: { date: string, name: string, location: string, status: string, isHighlight?: boolean }) {
  return (
    <div className={`p-8 rounded-3xl border flex items-center justify-between transition-all group ${
      isHighlight ? 'bg-[#ecb613]/5 border-[#ecb613]/20' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'
    }`}>
      <div className="flex items-center gap-10">
         <div className="text-center">
            <span className="block text-2xl font-black italic tracking-tighter leading-none">{date.split(' ')[0]}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{date.split(' ')[1]}</span>
         </div>
         <div className="w-px h-10 bg-white/5" />
         <div>
            <h4 className="font-black uppercase italic tracking-tighter text-lg">{name}</h4>
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mt-1">{location}</p>
         </div>
      </div>
      <div className="flex items-center gap-8">
         <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full border ${
           status === 'CONFIRMADO' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
           status === 'RESERVADO' ? 'bg-[#ecb613]/10 border-[#ecb613]/20 text-[#ecb613]' :
           'bg-white/5 border-white/10 text-white/40'
         }`}>
           {status}
         </span>
         <ArrowUpRight size={16} className="text-white/10 group-hover:text-white transition-colors cursor-pointer" />
      </div>
    </div>
  );
}

function AlertItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-6 p-6 rounded-3xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
       <div className="pt-1">{icon}</div>
       <div>
          <h4 className="text-xs font-black uppercase tracking-widest group-hover:text-[#ecb613] transition-colors">{title}</h4>
          <p className="text-[10px] text-white/30 italic leading-relaxed mt-2">{desc}</p>
       </div>
    </div>
  );
}
