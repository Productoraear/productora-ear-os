
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from '../../contexts/LanguageContext';
import { generateCourseArchitecture } from '../../services/geminiService';
import { CourseArchitecture, CourseFormData } from '../../types';
import { CourseView } from './knowledge_architect/CourseView';
import { Icon } from '../Icon';

export const KnowledgeArchitect: React.FC = () => {
    const { t } = useTranslations();
    const [course, setCourse] = useState<CourseArchitecture | null>(null);
    const [generating, setGenerating] = useState(false);
    
    const handleLaunchLevel = async (level: number) => {
        setGenerating(true);
        // Definición de objetivos y lecciones inyectadas al prompt de Gemini
        const levelsData: Record<number, CourseFormData> = {
            1: { 
                tema: "Nivel 1: Arquitectura de Identidad EAR (El Artista Inspirador)", 
                nivel: "Avanzado", 
                perfil: "Artista Visionario", 
                objetivo: "Establecer la base de valores y marca personal innegociable basada en el respeto y el positivismo.",
                tiempo: "1 sesión estratégica",
                formato: "Protocolo de Deconstrucción" 
            },
            2: { 
                tema: "Nivel 2: Ingeniería Táctica EAR (Mapas de Batalla y Forense)", 
                nivel: "Avanzado", 
                perfil: "Emanager", 
                objetivo: "Realizar una auditoría completa de activos y detectar fugas de tiempo y dinero en la carrera artística.",
                tiempo: "1 sesión táctica",
                formato: "Auditoría Forense" 
            },
            3: { 
                tema: "Nivel 3: El Propósito (Ikigai Estratégico Artístico)", 
                nivel: "Avanzado", 
                perfil: "Artista EAR", 
                objetivo: "Encontrar la intersección perfecta entre la visión creativa y la rentabilidad del mercado musical actual.",
                tiempo: "1 taller intensivo",
                formato: "Sincronización de Propósito" 
            },
            4: { 
                tema: "Nivel 4: Maquinaria de Acción y Escalamiento Digital", 
                nivel: "Avanzado", 
                perfil: "Project Manager Artístico", 
                objetivo: "Implementar sistemas de lanzamiento en Spotify/YouTube y construir funnels de venta AIDA para fans.",
                tiempo: "Ciclo de 90 días",
                formato: "Hoja de Ruta Operativa" 
            },
            5: { 
                tema: "Nivel 5: Mentorías Memorables (Protocolo EAR 1-10)", 
                nivel: "Avanzado", 
                perfil: "Líder de Legado", 
                objetivo: "Maestría en comunicación de autoridad para vender productos premium y liderar equipos de alto rendimiento.",
                tiempo: "Formación de Maestría",
                formato: "Protocolo de Autoridad" 
            }
        };

        try {
            const result = await generateCourseArchitecture(levelsData[level]);
            setCourse(result);
        } catch (e) {
            console.error(e);
        } finally {
            setGenerating(false);
        }
    };

    if (course) return <CourseView course={course} onBack={() => setCourse(null)} />;

    return (
        <div className="flex-1 overflow-y-auto bg-zinc-950 text-white font-sans selection:bg-gold-500/30 selection:text-gold-200">
            {/* Hero Section */}
            <section className="relative min-h-[80vh] flex flex-col items-center justify-center p-8 text-center border-b border-zinc-900 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="max-w-4xl"
                >
                    <span className="text-gold-500 font-mono text-xs tracking-[0.4em] uppercase mb-4 block animate-pulse">
                        {t('landing_hero_tag')}
                    </span>
                    <h1 className="text-6xl md:text-8xl font-serif font-bold text-white leading-[0.9] tracking-tighter mb-8 italic">
                        {t('landing_hero_title')}
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-12 font-light">
                        {t('landing_hero_subtitle')}
                    </p>
                    <button 
                        onClick={() => document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth' })}
                        className="group relative inline-flex items-center gap-4 py-4 px-10 bg-gold-500 text-black font-bold text-sm tracking-widest uppercase rounded-full hover:bg-white transition-all shadow-[0_0_30px_rgba(197,160,40,0.3)] hover:shadow-white/20"
                    >
                        {t('landing_cta_start')}
                        <Icon className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                        </Icon>
                    </button>
                </motion.div>
                
                <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30"
                >
                    <div className="w-px h-12 bg-gradient-to-b from-gold-500 to-transparent"></div>
                </motion.div>
            </section>

            {/* Roadmap Section */}
            <section id="roadmap" className="py-32 px-8 max-w-7xl mx-auto">
                <header className="mb-24 text-center">
                    <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 italic">{t('landing_roadmap_title')}</h2>
                    <p className="text-zinc-500 text-xl max-w-2xl mx-auto font-light">{t('landing_roadmap_subtitle')}</p>
                </header>

                <div className="space-y-16 relative">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-zinc-900 -translate-x-1/2 hidden lg:block"></div>

                    {[1, 2, 3, 4, 5].map((level) => (
                        <LevelRow 
                            key={level}
                            number={level}
                            title={t(`ka_level_${level}_title`)}
                            desc={t(`ka_level_${level}_desc`)}
                            onStart={() => handleLaunchLevel(level)}
                            isRight={level % 2 === 0}
                            isPremium={level === 5}
                        />
                    ))}
                </div>
            </section>

            {/* Loading Overlay */}
            {generating && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-8 text-center"
                >
                    <div className="w-24 h-24 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mb-8"></div>
                    <h2 className="text-3xl font-serif text-white mb-2 italic">Sintonizando Kernel EAR</h2>
                    <p className="text-gold-500 font-mono text-sm tracking-widest animate-pulse uppercase">Sintetizando Protocolo de Nivel...</p>
                </motion.div>
            )}
            
            <footer className="py-20 border-t border-zinc-900 text-center">
                <p className="text-zinc-600 font-mono text-[10px] tracking-widest uppercase">
                    © 2025 PRODUCTORA EAR // ARQUITECTURA DE LEGADO
                </p>
            </footer>
        </div>
    );
};

const LevelRow = ({ number, title, desc, onStart, isRight, isPremium }: any) => {
    return (
        <motion.div 
            initial={{ opacity: 0, x: isRight ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${isRight ? 'lg:flex-row-reverse' : ''}`}
        >
            <div className="flex-1 w-full lg:text-left text-center">
                <div className={`p-10 rounded-[2rem] border transition-all duration-500 bg-zinc-900/30 hover:bg-zinc-900/50 ${isPremium ? 'border-gold-500/40 shadow-[0_0_50px_rgba(197,160,40,0.1)]' : 'border-zinc-800 hover:border-zinc-700'}`}>
                    <div className="flex items-center gap-4 mb-6 lg:justify-start justify-center">
                        <span className="text-[10px] font-mono text-zinc-500 tracking-[0.3em] uppercase">Módulo Operativo 0{number}</span>
                        {isPremium && <span className="text-[10px] font-mono bg-gold-500 text-black px-2 py-0.5 font-bold rounded tracking-widest uppercase">Elite</span>}
                    </div>
                    <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4 italic leading-tight">{title}</h3>
                    <p className="text-zinc-400 text-lg mb-10 leading-relaxed font-light">{desc}</p>
                    <button 
                        onClick={onStart}
                        className="w-full lg:w-auto py-4 px-10 bg-zinc-800 hover:bg-white hover:text-black transition-all font-bold text-[10px] tracking-[0.2em] uppercase rounded-xl border border-zinc-700"
                    >
                        Acceder al Protocolo
                    </button>
                </div>
            </div>
            
            {/* Center Node */}
            <div className="relative z-10 hidden lg:flex items-center justify-center">
                <div className={`w-14 h-14 rounded-full border-4 ${isPremium ? 'border-gold-500 bg-black shadow-[0_0_20px_rgba(197,160,40,0.5)]' : 'border-zinc-900 bg-zinc-800'} flex items-center justify-center text-xl font-bold font-serif`}>
                    {number}
                </div>
            </div>

            <div className="flex-1 hidden lg:block"></div>
        </motion.div>
    );
};
