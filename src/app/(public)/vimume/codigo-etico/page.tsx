import { Shield, Heart, Scale, Users, CheckCircle2, Lock } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Código Ético | Proyecto VIMUME',
  description: 'Gobernanza, transparencia y compromisos éticos del Proyecto VIMUME para la protección del paciente y la integridad de los datos.',
};

export default function CodigoEticoPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1a1a1a] font-sans">
      {/* HEADER S-CLASS */}
      <header className="pt-32 pb-20 px-4 md:px-12 max-w-7xl mx-auto border-b border-[#e5e5e5]">
        <div className="flex items-center space-x-2 text-emerald-700 font-mono text-sm mb-6 uppercase tracking-widest">
          <Shield size={16} />
          <span>Gobernanza Institucional</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight text-[#1a1a1a] mb-8">
          Código Ético <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-800">
            Y Transparencia
          </span>
        </h1>
        <p className="text-xl md:text-2xl font-light text-[#4a4a4a] max-w-3xl leading-relaxed">
          El Proyecto VIMUME se fundamenta en la integridad absoluta, la protección de los pacientes de Alzheimer y el rigor científico en el uso de la musicoterapia.
        </p>
      </header>

      {/* CORE PILLARS */}
      <main className="py-24 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div className="p-8 border border-[#e5e5e5] rounded-3xl bg-white shadow-sm hover:shadow-xl transition-shadow duration-500">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
              <Heart className="text-emerald-600" size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">1. Dignidad del Paciente</h3>
            <p className="text-[#4a4a4a] leading-relaxed">
              El bienestar emocional, la dignidad y el respeto por los tiempos de cada paciente son la máxima prioridad. Las sesiones son adaptativas y pueden detenerse instantáneamente ante cualquier signo de incomodidad.
            </p>
          </div>

          <div className="p-8 border border-[#e5e5e5] rounded-3xl bg-white shadow-sm hover:shadow-xl transition-shadow duration-500">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-6">
              <Lock className="text-blue-600" size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">2. Privacidad y Soberanía del Dato</h3>
            <p className="text-[#4a4a4a] leading-relaxed">
              Los datos biométricos y la evolución clínica recopilada pertenecen al paciente y a su familia. Cumplimos de manera estricta con el RGPD y la Ley de Protección de Datos española.
            </p>
          </div>

          <div className="p-8 border border-[#e5e5e5] rounded-3xl bg-white shadow-sm hover:shadow-xl transition-shadow duration-500">
            <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mb-6">
              <Scale className="text-amber-600" size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">3. Rigor Científico y B2G</h3>
            <p className="text-[#4a4a4a] leading-relaxed">
              No ofrecemos "curas milagrosas". Nos basamos en evidencia clínica (neuromodulación Gamma 40Hz) y colaboramos transparentemente con instituciones públicas y consorcios de investigación.
            </p>
          </div>

          <div className="p-8 border border-[#e5e5e5] rounded-3xl bg-white shadow-sm hover:shadow-xl transition-shadow duration-500">
            <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center mb-6">
              <Users className="text-purple-600" size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">4. Formación y Acreditación</h3>
            <p className="text-[#4a4a4a] leading-relaxed">
              Todos los profesionales que intervienen en el proyecto están acreditados y capacitados en gerontología, musicoterapia clínica y gestión de crisis neurodegenerativas.
            </p>
          </div>

        </div>

        {/* COMPLIANCE FOOTER */}
        <div className="mt-24 p-12 bg-[#1a1a1a] text-white rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0 max-w-2xl">
            <h4 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Certificación de Cumplimiento</h4>
            <p className="text-gray-400 font-light text-lg">
              El presente código es vinculante para todos los socios, filiales y proveedores adheridos al Proyecto VIMUME y al ecosistema de Productora EAR.
            </p>
          </div>
          <div className="flex flex-col items-end space-y-4">
            <div className="flex items-center space-x-2 text-emerald-400 font-mono border border-emerald-400/30 px-4 py-2 rounded-full">
              <CheckCircle2 size={16} />
              <span className="text-sm">VIMUME ETHICS BOARD COMPLIANT</span>
            </div>
            <Link href="/vimume/protocolo" className="text-sm hover:text-emerald-300 underline underline-offset-4 decoration-emerald-500/50 transition-all">
              Ver Protocolo de Actuación
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
