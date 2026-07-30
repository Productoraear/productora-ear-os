import React from 'react';
import { Shield, Brain, HeartPulse, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { PredatorNav } from '@/widgets/navigation/PredatorNav';
import Link from 'next/link';
// Ggeneración estática de nichos tácticos
export async function generateStaticParams() {
    return [
        { nicho: 'musicoterapia-alzheimer' },
        { nicho: 'terapia-ocupacional' },
        { nicho: 'envejecimiento-activo' },
        { nicho: 'agenda-2030-ods' },
    ];
}
export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const nicho = resolvedParams?.nicho || '';
    const titles = {
        'musicoterapia-alzheimer': 'Musicoterapia en Alzheimer | Evidencia Clínica VIMUME',
        'terapia-ocupacional': 'Terapia Ocupacional y Música | Intervención VIMUME',
        'envejecimiento-activo': 'Programas de Envejecimiento Activo | Iniciativa VIMUME',
        'agenda-2030-ods': 'Agenda 2030 y ODS | Impacto Social Institucional VIMUME',
    };
    return {
        title: titles[nicho] || 'Conocimiento VIMUME | EAR OS',
        description: `Biblioteca de conocimiento clínico e institucional sobre ${nicho.replace(/-/g, ' ')}.`,
    };
}
export default async function VimumeNichePage({ params }) {
    const resolvedParams = await params;
    const nicho = resolvedParams?.nicho || 'musicoterapia-alzheimer';
    const contentMap = {
        'musicoterapia-alzheimer': {
            title: 'Impacto de la Musicoterapia en el Alzheimer',
            subtitle: 'Estimulación Cognitiva y Recuperación de la Memoria a través de la Música Vernácula',
            icon: <Brain size={32} className="text-pink-500"/>,
            content: 'La evidencia clínica demuestra que la memoria musical es una de las últimas en perderse. Los protocolos VIMUME utilizan la música que marcó la juventud de los pacientes (boleros, rancheras) para reconectar vías neuronales, reducir la agitación y mejorar la calidad de vida.'
        },
        'terapia-ocupacional': {
            title: 'Sinergia con Terapia Ocupacional',
            subtitle: 'Integración Sensorial en Centros de Día',
            icon: <HeartPulse size={32} className="text-pink-500"/>,
            content: 'El protocolo VIMUME no es un concierto; es una intervención diseñada para complementar el trabajo de los terapeutas ocupacionales, facilitando la socialización, la movilidad articular y el bienestar emocional de los mayores.'
        },
        'envejecimiento-activo': {
            title: 'Envejecimiento Activo y Alegría',
            subtitle: 'Prevención del Aislamiento Social',
            icon: <Sparkles size={32} className="text-pink-500"/>,
            content: 'Fomentar la participación activa a través de cantos grupales e interacción con músicos profesionales eleva la autoestima de los mayores, transformando residencias y centros cívicos en espacios de vitalidad y celebración.'
        },
        'agenda-2030-ods': {
            title: 'Alineación ODS Institucional',
            subtitle: 'Cumplimiento Normativo para Ayuntamientos',
            icon: <Shield size={32} className="text-pink-500"/>,
            content: 'Integrar a VIMUME en las partidas presupuestarias municipales responde directamente al ODS 3 (Salud y Bienestar) y al ODS 10 (Reducción de Desigualdades), aportando un indicador de impacto social medible para las administraciones públicas.'
        }
    };
    const data = contentMap[nicho] || contentMap['musicoterapia-alzheimer'];
    return (<div className="min-h-screen bg-[#050505] text-white selection:bg-pink-500/30">
      <PredatorNav />

      <section className="relative pt-48 pb-32 px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-pink-900/20 to-transparent blur-[120px]"/>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-pink-500/30 bg-pink-500/10 mb-8">
            <BookOpen className="text-pink-500" size={14}/>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-500">
              Biblioteca Clínica VIMUME
            </span>
          </div>

          <div className="flex justify-center mb-8">
            {data.icon}
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none uppercase mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-white">
            {data.title}
          </h1>

          <p className="text-xl text-white/50 font-bold uppercase tracking-widest mb-12">
            {data.subtitle}
          </p>

          <div className="glass-panel p-12 rounded-[3rem] border-white/5 text-left">
            <p className="text-lg leading-relaxed text-white/80 font-medium mb-8">
              {data.content}
            </p>
            <div className="h-px w-full bg-white/10 my-8"/>
            <h3 className="text-sm font-black uppercase tracking-widest text-pink-500 mb-4">El Embudo Ético (Impacto Institucional)</h3>
            <p className="text-xs leading-relaxed text-white/50 font-bold uppercase mb-8">
              Al contratar los servicios artísticos de la red EAR OS, se destina una cuota inmutable al sostenimiento de este programa. Si usted representa a un Ayuntamiento o Residencia, puede incorporar VIMUME directamente.
            </p>
            
            <div className="flex gap-4 items-center">
              <Link href="/vimume" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white hover:text-pink-500 transition-colors">
                Regresar al Hub <ArrowRight size={14}/>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>);
}
