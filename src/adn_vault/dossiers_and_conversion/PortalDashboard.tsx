import React from 'react';
import { 
  Shield, 
  TrendingUp, 
  Zap, 
  Lock, 
  ChevronRight, 
  Award, 
  Database, 
  Scale, 
  Target
} from 'lucide-react';

export interface ModuleItem {
  id: string;
  label: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isLocked: boolean;
}

interface PortalDashboardProps {
  userName: string;
  userAvatar: string;
  userRange: string;
  currentXP: number;
  totalXP: number;
  systemStability: number;
  timeline: ModuleItem[];
}

const StatCard = ({ title, value, subValue, icon: Icon, color = "#D4AF37" }: any) => (
  <div className="bg-[#111]/50 backdrop-blur-md border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <Icon size={48} color={color} />
    </div>
    <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">{title}</p>
    <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
    <p className="text-[#D4AF37] text-[10px] font-medium uppercase">{subValue}</p>
  </div>
);

const PortalDashboard: React.FC<PortalDashboardProps> = ({
  userName,
  userAvatar,
  userRange,
  currentXP,
  totalXP,
  systemStability,
  timeline
}) => {
  const xpPercentage = (currentXP / totalXP) * 100;

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-32 px-4 pt-8">
      {/* Header / User Profile */}
      <header className="flex items-center justify-between mb-10">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#D4AF37]/50 p-1 bg-[#111]">
              <img src={userAvatar} alt={userName} className="w-full h-full object-cover rounded-xl" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#D4AF37] p-1 rounded-lg border-2 border-[#050505]">
              <Award size={12} color="black" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{userName}</h1>
            <p className="text-xs text-gray-500 uppercase tracking-[0.2em]">{userRange}</p>
          </div>
        </div>
        <button className="bg-white/5 p-3 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
          <Shield size={20} className="text-[#D4AF37]" />
        </button>
      </header>

      {/* Stability & XP Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <StatCard 
          title="Estabilidad del Sistema" 
          value={`${systemStability}%`} 
          subValue="Arquitectura de Carrera Estable"
          icon={Zap}
        />
        <div className="bg-[#111]/50 backdrop-blur-md border border-white/5 rounded-2xl p-5">
          <div className="flex justify-between items-end mb-3">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Progreso XP</p>
              <h3 className="text-2xl font-bold text-white">{currentXP} <span className="text-gray-600 text-lg">/ {totalXP}</span></h3>
            </div>
            <p className="text-[#D4AF37] text-xs font-bold">{Math.round(xpPercentage)}%</p>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] transition-all duration-1000"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Financial Snapshot (Mocked from Cluster 02) */}
      <section className="mb-10">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp size={18} className="text-[#D4AF37]" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Activos Digitales & Royalties</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Señal de Ingreso" value="$12,450" subValue="↑ 8.4% mensual" icon={Database} />
          <StatCard title="ROI Promedio" value="18.2%" subValue="Anualizado" icon={TrendingUp} />
          <StatCard title="Valor Catálogo" value="$450K" subValue="Proyección 12M" icon={Lock} />
        </div>
      </section>

      {/* Impact Timeline */}
      <section className="mb-10">
        <div className="flex items-center space-x-2 mb-6">
          <Target size={18} className="text-[#D4AF37]" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Impact Timeline (Ruta S-Class)</h2>
        </div>
        <div className="space-y-4">
          {timeline.map((item, index) => (
            <div 
              key={item.id}
              className={`relative flex items-start space-x-4 p-4 rounded-2xl border transition-all ${
                item.isLocked ? 'bg-black/20 border-white/5 opacity-50' : 'bg-[#111]/80 border-white/10'
              }`}
            >
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  item.isCompleted ? 'bg-[#D4AF37] border-[#D4AF37] text-black' : 
                  item.isLocked ? 'bg-white/5 border-white/10 text-gray-600' : 'bg-white/10 border-white/20 text-[#D4AF37]'
                }`}>
                  {item.isLocked ? <Lock size={16} /> : <span className="font-bold text-xs">{index + 1}</span>}
                </div>
                {index !== timeline.length - 1 && <div className="w-[2px] h-10 bg-white/5 mt-2" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className={`text-sm font-bold ${item.isLocked ? 'text-gray-500' : 'text-white'}`}>{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.description}</p>
                  </div>
                  {!item.isLocked && <ChevronRight size={16} className="text-gray-600" />}
                </div>
                {item.isCompleted && (
                  <div className="mt-3 flex items-center space-x-2">
                    <div className="px-2 py-0.5 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-md text-[10px] text-[#D4AF37] font-bold uppercase tracking-tighter">
                      Completado
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Infrastructure / Legal Section */}
      <section>
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-5">
            <Scale size={200} />
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Bóveda de Infraestructura</h3>
            <p className="text-sm text-gray-400 mb-6 max-w-xs">
              Blindaje legal, contratos forenses y seguridad de equipo. Estado: En Proceso.
            </p>
            <button className="bg-white text-black font-bold py-3 px-6 rounded-2xl text-sm hover:bg-gray-200 transition-colors flex items-center space-x-2">
              <span>Subir Contratos</span>
              <Award size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PortalDashboard;
