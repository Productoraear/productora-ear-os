import type { Metadata } from 'next';
import { Activity, CalendarCheck, Eye, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard | Vendor',
  description: 'Panel S-Class de control para proveedores',
};

export default function VendorDashboardPage() {
  return (
    <main className="min-h-screen bg-[#030305] text-zinc-100 font-sans p-6 sm:p-12 overflow-x-hidden relative">
      {/* S-Class OLED Mesh / Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ecb613]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00E5FF]/5 blur-[100px] rounded-full pointer-events-none" />

      <section className="relative z-10 max-w-6xl mx-auto space-y-12">
        <header className="space-y-3">
          <p className="text-[10px] font-mono text-[#ecb613] font-bold tracking-widest uppercase">
            Sistema Nervioso Central · Vendor
          </p>
          <h1 className="text-4xl sm:text-5xl font-syne font-black tracking-tight text-white">
            Dashboard
          </h1>
          <p className="text-zinc-400 max-w-2xl leading-relaxed">
            Monitoriza tus KPIs de impacto, gestiona fechas y mantén el estatus de homologación activo.
          </p>
        </header>

        {/* KPIs S-Class */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <KpiCard
            label="Vistas (Últimos 30d)"
            value="1,492"
            icon={<Eye className="w-5 h-5 text-zinc-400" />}
          />
          <KpiCard
            label="Reservas Activas"
            value="14"
            icon={<CalendarCheck className="w-5 h-5 text-[#ecb613]" />}
            accent="border-[#ecb613]/30 shadow-[0_0_15px_rgba(236,182,19,0.1)]"
            valueColor="text-[#ecb613]"
          />
          <KpiCard
            label="Conversión"
            value="3.2%"
            icon={<Activity className="w-5 h-5 text-[#00E5FF]" />}
            valueColor="text-[#00E5FF]"
          />
          <KpiCard
            label="Strikes (Riesgo)"
            value="0"
            icon={<AlertTriangle className="w-5 h-5 text-emerald-400" />}
            valueColor="text-emerald-400"
          />
        </section>

        {/* Acciones Rápidas */}
        <section className="bg-[#050508] border border-white/5 rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
          <h2 className="text-xl font-syne font-bold text-white mb-6">
            Acciones Tácticas
          </h2>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all font-mono text-xs uppercase tracking-wider">
              Gestionar Calendario
            </button>
            <button className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all font-mono text-xs uppercase tracking-wider">
              Optimizar Perfil
            </button>
            <button className="px-6 py-2.5 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] hover:bg-[#00E5FF]/20 transition-all font-mono text-xs uppercase tracking-wider font-bold">
              Configurar VIMUME
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}

function KpiCard({
  label,
  value,
  icon,
  accent = 'border-white/5',
  valueColor = 'text-white',
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent?: string;
  valueColor?: string;
}) {
  return (
    <article className={`bg-[#050508] border ${accent} rounded-2xl p-6 flex flex-col justify-between h-36 backdrop-blur-md transition-all hover:border-white/10`}>
      <div className="flex items-start justify-between">
        <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500">
          {label}
        </h3>
        {icon}
      </div>
      <p className={`text-3xl font-mono font-bold ${valueColor}`}>
        {value}
      </p>
    </article>
  );
}