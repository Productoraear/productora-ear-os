import { Calendar, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Cronograma | Proyecto VIMUME',
  description: 'Cronograma oficial de ejecución y fases de implementación del Proyecto VIMUME 2026.',
};

export default function CronogramaPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1a1a1a] font-sans">
      {/* HEADER S-CLASS */}
      <header className="pt-32 pb-20 px-4 md:px-12 max-w-7xl mx-auto border-b border-[#e5e5e5]">
        <div className="flex items-center space-x-2 text-emerald-700 font-mono text-sm mb-6 uppercase tracking-widest">
          <Calendar size={16} />
          <span>Hoja de Ruta 2026</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight text-[#1a1a1a] mb-8">
          Cronograma <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-800">
            De Ejecución
          </span>
        </h1>
        <p className="text-xl md:text-2xl font-light text-[#4a4a4a] max-w-3xl leading-relaxed">
          Las fases oficiales de validación clínica, escalado tecnológico e implantación a nivel nacional de la Plataforma Neural VIMUME.
        </p>
      </header>

      {/* TIMELINE */}
      <main className="py-24 px-4 md:px-12 max-w-5xl mx-auto">
        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-emerald-300 before:to-transparent">
          
          {/* FASE 1 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#FDFBF7] bg-emerald-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
              <CheckCircle2 size={18} />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-emerald-500/20 bg-emerald-50/50 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-emerald-800 text-lg uppercase tracking-tight">Fase 1: Ontología y Ecosistema</h3>
                <span className="text-emerald-600 font-mono text-sm">Completado</span>
              </div>
              <p className="text-[#4a4a4a] leading-relaxed">
                Despliegue del diamante isométrico, indexación de 415 archivos de conocimiento VIMUME, y compilación estática de 255 rutas S-Class.
              </p>
            </div>
          </div>

          {/* FASE 2 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#FDFBF7] bg-amber-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
              <Clock size={18} />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-[#e5e5e5] bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-[#1a1a1a] text-lg uppercase tracking-tight">Fase 2: Piloto 5 Centros</h3>
                <span className="text-amber-600 font-mono text-sm">En progreso</span>
              </div>
              <p className="text-[#4a4a4a] leading-relaxed">
                Validación de la neuromodulación 40Hz en 5 residencias pioneras de Castilla-La Mancha. Recopilación de telemetría y ajuste del modelo algorítmico.
              </p>
            </div>
          </div>

          {/* FASE 3 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#FDFBF7] bg-gray-300 text-gray-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
              <span className="font-bold font-mono text-sm">03</span>
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-[#e5e5e5] bg-white opacity-70">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-[#1a1a1a] text-lg uppercase tracking-tight">Fase 3: B2G y Financiación</h3>
                <span className="text-gray-500 font-mono text-sm">Q3 2026</span>
              </div>
              <p className="text-[#4a4a4a] leading-relaxed">
                Autocompilación masiva de memorias para licitaciones públicas (Art. 118 LCSP) y solicitudes formales para fondos europeos Next Generation.
              </p>
            </div>
          </div>

          {/* FASE 4 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#FDFBF7] bg-gray-300 text-gray-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
              <span className="font-bold font-mono text-sm">04</span>
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-[#e5e5e5] bg-white opacity-70">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-[#1a1a1a] text-lg uppercase tracking-tight">Fase 4: Expansión Nacional</h3>
                <span className="text-gray-500 font-mono text-sm">Q4 2026</span>
              </div>
              <p className="text-[#4a4a4a] leading-relaxed">
                Activación del ecosistema Silver Economy, integrando a más de 500 residencias y consolidando la red Hermes de cuidadores a nivel nacional.
              </p>
            </div>
          </div>

        </div>

        <div className="mt-20 text-center">
          <Link href="/vimume/roadmap" className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold uppercase tracking-widest bg-[#1a1a1a] text-white rounded-full hover:bg-emerald-600 transition-colors">
            Explorar Roadmap Completo
            <ChevronRight className="ml-2" size={16} />
          </Link>
        </div>
      </main>
    </div>
  );
}
