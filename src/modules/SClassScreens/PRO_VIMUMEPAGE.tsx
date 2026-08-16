'use client';

import React, { useState } from 'react';
import {
    Heart, Brain, Users, Video, BarChart, MessageCircle, Globe, Share2, FileText,
    CheckCircle, Mic, Mail, Eye, Rocket, TrendingUp, CalendarClock, Target, Award,
    HeartHandshake, Lightbulb, Megaphone, Coins, Landmark, MonitorPlay, Code, Database,
    Layout, Smartphone, PieChart, BookOpen, Building, AlertTriangle, Briefcase, Frown,
    Smile, Download, Zap, Blocks, AlertOctagon, UserCheck, Lock, Shield, FileKey,
    Terminal, Scale, ChevronDown, ChevronUp, ShieldCheck, Gem, TrendingDown, Anchor,
    Network, Activity, Star, Speaker, Ear, Sun, MapPin,
} from 'lucide-react';

type TabId = 'overview' | 'ethics' | 'strategy' | 'funding' | 'campaigns' | 'roadmap';

const TABS: { id: TabId; label: string }[] = [
    { id: 'overview', label: 'Proyecto' },
    { id: 'ethics', label: 'Código Ético' },
    { id: 'strategy', label: 'Estrategia' },
    { id: 'funding', label: 'Inversión (Funding)' },
    { id: 'campaigns', label: 'Campañas' },
    { id: 'roadmap', label: 'Cronograma' },
];

const TAB_COLORS: Record<TabId, string> = {
    overview: 'bg-pink-600',
    ethics: 'bg-ear-gold text-black',
    strategy: 'bg-pink-600',
    funding: 'bg-ear-gold text-black',
    campaigns: 'bg-pink-600',
    roadmap: 'bg-pink-600',
};

/* ─── Subcomponents ─── */
const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; color?: string }> = ({ icon, title, color = 'bg-ear-gold/20 text-ear-gold' }) => (
    <div className="flex items-center gap-3 mb-8">
        <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
        <h3 className="text-3xl font-display font-bold text-white">{title}</h3>
    </div>
);

const InfoCard: React.FC<{ title: string; sub?: string; desc: string; icon: React.ReactNode; accentClass?: string; quote?: string }> = ({
    title, sub, desc, icon, accentClass = 'text-pink-400', quote,
}) => (
    <div className={`bg-[#111] border border-white/10 p-8 rounded-2xl hover:border-pink-500/50 transition-colors group`}>
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 bg-white/5 rounded-xl ${accentClass} group-hover:scale-110 transition-transform`}>{icon}</div>
            {sub && <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{sub}</span>}
        </div>
        <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">{desc}</p>
        {quote && <div className="pt-4 border-t border-white/10"><p className={`text-xs font-bold italic ${accentClass}`}>{quote}</p></div>}
    </div>
);

/* ─── TAB: Overview ─── */
const OverviewTab: React.FC = () => {
    const [accordion, setAccordion] = useState<string | null>('sensory');
    const toggle = (id: string) => setAccordion(accordion === id ? null : id);

    const pillars = [
        { title: 'La Copla & Posguerra', sub: 'Pilar de Resiliencia', desc: 'Música de supervivencia. Reactivamos la dignidad y la "raíz" del paciente.', icon: <Anchor size={24} />, color: 'text-red-500 bg-red-900/20', hover: 'hover:border-red-500/50' },
        { title: 'El Ye-yé & Apertura', sub: 'Pilar de Vitalidad', desc: 'Alegría y activación motora. Nadie puede estar triste escuchando "Tómbola".', icon: <Sun size={24} />, color: 'text-yellow-500 bg-yellow-900/20', hover: 'hover:border-yellow-500/50' },
        { title: 'Verbena & Folclore', sub: 'Pilar de Comunidad', desc: 'Pasodobles y Zarzuelas que combaten el aislamiento y unen a la sala.', icon: <Users size={24} />, color: 'text-orange-500 bg-orange-900/20', hover: 'hover:border-orange-500/50' },
    ];

    const accordionItems = [
        { id: 'sensory', icon: <Ear size={24} className="text-pink-400" />, title: 'Adaptación Sensorial Radical', body: 'No gritamos; articulamos. Controlamos el entorno para eliminar ruido que aísla. Cuidamos la iluminación para que la lectura de labios y las señales visuales sean claras.', color: 'border-pink-500/20' },
        { id: 'cognitive', icon: <Brain size={24} className="text-blue-400" />, title: 'Arquitectura Cognitiva', body: 'Para mentes que procesan diferente, comunicamos diferente. Dividimos la información en piezas asimilables, usamos la repetición positiva y validamos la comprensión sin presionar.', color: 'border-blue-500/20' },
        { id: 'nonverbal', icon: <Eye size={24} className="text-ear-gold" />, title: 'El Poder de lo No Verbal', body: 'Cuando las palabras fallan, nuestro lenguaje corporal sostiene la conversación. Contacto visual directo, paciencia infinita y contacto físico respetuoso.', color: 'border-ear-gold/20' },
    ];

    return (
        <div className="space-y-20">
            {/* Hero Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                        <Brain size={48} className="text-pink-400 mb-6" />
                        <h3 className="text-2xl font-display font-bold mb-4">El Poder de la Reminiscencia</h3>
                        <p className="text-gray-400 leading-relaxed">Utilizamos la música como llave maestra para acceder a recuerdos que parecían perdidos. Nuestro enfoque científico y humano busca mejorar la calidad de vida de personas con Alzheimer y demencia.</p>
                    </div>
                    <div className="flex gap-4">
                        {[{ v: '150+', l: 'Familias Impactadas' }, { v: '90%', l: 'Mejora Emocional' }].map(({ v, l }) => (
                            <div key={l} className="flex-1 bg-white/5 p-6 rounded-2xl border border-white/10 text-center">
                                <span className="text-3xl font-bold text-white block mb-1">{v}</span>
                                <span className="text-xs text-gray-500 uppercase tracking-widest">{l}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="relative rounded-3xl overflow-hidden border border-white/10 min-h-[400px]">
                    <img src="https://images.unsplash.com/photo-1551847677-dc82d764e1eb?q=80&w=1000&auto=format&fit=crop" alt="Musicoterapia EAR" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8">
                        <p className="text-lg text-white font-bold italic">"La música es lo último que se olvida."</p>
                    </div>
                </div>
            </div>

            {/* Patrimonio Sonoro Vital */}
            <div className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-red-900/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="relative z-10">
                    <div className="text-center mb-12">
                        <span className="text-ear-gold font-bold uppercase tracking-[0.2em] text-xs mb-3 block">Especialización Cultural</span>
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                            PATRIMONIO SONORO <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">VITAL</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
                            Rechazamos las playlists genéricas. Para la generación que construyó este país, una Copla no es entretenimiento;
                            es un <strong>ancla emocional</strong> a su identidad antes del olvido.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {pillars.map((p) => (
                            <div key={p.title} className={`bg-black/50 border border-white/10 p-6 rounded-2xl ${p.hover} transition-all group`}>
                                <div className={`w-12 h-12 ${p.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>{p.icon}</div>
                                <h4 className="text-xl font-bold text-white mb-2">{p.title}</h4>
                                <span className={`text-xs font-bold uppercase tracking-widest mb-3 block ${p.color.split(' ')[0].replace('bg-', 'text-')}`}>{p.sub}</span>
                                <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                            <h3 className="text-2xl font-display font-bold text-white mb-4 flex items-center gap-3"><MapPin className="text-ear-gold" /> El Linchpin: Curación Biográfica</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">El <strong>Mapeo de la Banda Sonora Vital™</strong> identifica qué sonaba en la radio cuando tenían 15 años, fijando la memoria para siempre.</p>
                            <div className="inline-flex items-center gap-2 text-xs font-bold text-ear-gold uppercase tracking-widest"><CheckCircle size={14} /> Manolo Escobar activa neuronas que The Beatles no tocan.</div>
                        </div>
                        <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                            <h3 className="text-2xl font-display font-bold text-white mb-4 flex items-center gap-3"><Speaker className="text-blue-400" /> Infraestructura de Contexto</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6"><strong>Remasterizamos la experiencia en vivo</strong>. Audio de alta fidelidad para atravesar la barrera de la hipoacusia y entregar claridad cristalina.</p>
                            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest"><Zap size={14} /> Tecnología Médica de Precisión Sonora.</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tecnología de Comunicación */}
            <div>
                <SectionHeader icon={<Zap size={24} />} title='Nuestra "Tecnología" de Comunicación' />
                <div className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden">
                    {accordionItems.map((item, i) => (
                        <div key={item.id} className={i < accordionItems.length - 1 ? 'border-b border-white/5' : ''}>
                            <button onClick={() => toggle(item.id)} className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors text-left">
                                <div className="flex items-center gap-4">{item.icon}<span className="text-lg font-bold text-white">{item.title}</span></div>
                                {accordion === item.id ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
                            </button>
                            {accordion === item.id && (
                                <div className={`p-6 pt-0 pl-16 text-gray-400 text-sm leading-relaxed border-l-2 ${item.color} ml-6 mb-6`}>{item.body}</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

/* ─── TAB: Ethics ─── */
const EthicsTab: React.FC = () => {
    const stakeholders = [
        { title: 'Dignidad Absoluta', sub: 'Los Participantes', desc: 'Rechazamos el lenguaje infantilizador. Nos dirigimos a ellos con el respeto que merecen sus años.', icon: <Smile size={24} />, accentClass: 'text-pink-400', quote: '"No son sujetos de terapia; son los guías de su propio viaje."' },
        { title: 'Transparencia Emocional', sub: 'Familias & Cuidadores', desc: 'Sabemos que necesitáis certeza, no solo esperanza. Ofrecemos canales directos para actualizaciones reales.', icon: <HeartHandshake size={24} />, accentClass: 'text-blue-400', quote: '"No endulzamos la realidad, la acompañamos."' },
        { title: 'Rigor Científico', sub: 'Aliados Clínicos', desc: 'No competimos con la medicina; nos integramos en ella. Coordinamos nuestra intervención y entregamos informes basados en evidencia.', icon: <Briefcase size={24} />, accentClass: 'text-green-400', quote: '"Musicoterapia no es entretenimiento. Es clínica."' },
        { title: 'Rendición de Cuentas', sub: 'Socios de Impacto', desc: 'Si algo no funciona, lo decimos. El uso de los fondos es sagrado.', icon: <Landmark size={24} />, accentClass: 'text-ear-gold', quote: '"Resultados medibles. Cero humo."' },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-16">
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-ear-gold/10 border border-ear-gold/30 text-ear-gold text-xs font-bold uppercase tracking-widest mb-6">
                    <ShieldCheck size={14} /> Manifiesto de Verdad
                </div>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">EL PACTO DE CUIDADO</h2>
                <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto">
                    Operamos bajo un protocolo de Humanidad Radical. <strong className="text-white">No gestionamos "pacientes"; honramos historias de vida.</strong>
                </p>
            </div>
            <div>
                <h3 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-3"><Users className="text-pink-400" /> El Ecosistema de Respeto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {stakeholders.map((s) => <InfoCard key={s.title} {...s} />)}
                </div>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-black border border-ear-gold/30 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><Shield size={150} /></div>
                <h3 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-3 relative z-10"><Lock className="text-ear-gold" /> Protocolo de Integridad EAR</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                    {[
                        { icon: <UserCheck size={18} className="text-green-400" />, title: 'Consentimiento Real', desc: 'Buscamos el consentimiento informado, respetando la capacidad de decisión.' },
                        { icon: <FileKey size={18} className="text-blue-400" />, title: 'Privacidad Blindada', desc: 'Los recuerdos son sagrados; los datos, también. Cumplimiento estricto del RGPD.' },
                        { icon: <Sun size={18} className="text-ear-gold" />, title: 'La Verdad Ante Todo', desc: 'No prometemos curas milagrosas; prometemos momentos de conexión real.' },
                    ].map((i) => (
                        <div key={i.title} className="space-y-3">
                            <h4 className="text-white font-bold flex items-center gap-2">{i.icon} {i.title}</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">{i.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

/* ─── TAB: Funding ─── */
const FundingTab: React.FC = () => {
    const targets = [
        { title: 'Longevidad Digna', sub: 'Banca & Seguros', desc: 'Nuestra arquitectura reduce la ansiedad en centros y mejora la calidad de vida sin fármacos.', icon: <Landmark size={24} />, color: 'text-green-400 bg-green-900/20', hover: 'hover:border-green-500/50', targets: 'Fundación "la Caixa", Mapfre, BBVA.' },
        { title: 'Conexión Humana', sub: 'Tech & Telco', desc: 'Usamos tecnología de audio para reconectar neuronas en el mundo hiperconectado.', icon: <Network size={24} />, color: 'text-blue-400 bg-blue-900/20', hover: 'hover:border-blue-500/50', targets: 'Fundación Telefónica, Vodafone.' },
        { title: 'Terapia Complementaria', sub: 'Sanitaria', desc: 'Somos el complemento emocional al tratamiento clínico. Ustedes cuidan el cuerpo; nosotros la identidad.', icon: <Activity size={24} />, color: 'text-purple-400 bg-purple-900/20', hover: 'hover:border-purple-500/50', targets: 'Cinfa, Sanitas, Laboratorios.' },
    ];

    const tiers = [
        { name: 'Adopta un Centro', price: '3.000€ - 5.000€', benefits: ['Intervención completa (3 meses) en una residencia.', 'Reporte de Impacto Emocional (Video + Datos).', 'Visita corporativa de voluntariado.'], cta: 'Solicitar Dossier', style: 'border-white/20 text-white hover:bg-white hover:text-black', tier: '1' },
        { name: 'Arquitecto de Memoria', price: 'Partner Único', benefits: ['Apadrinamiento total del lanzamiento Fase Piloto.', 'Branding exclusivo en toda la comunicación.', 'Documental dedicado a la marca.'], cta: 'Agendar Reunión', style: 'bg-ear-gold text-black hover:bg-white', tier: 'EXCLUSIVO', featured: true },
        { name: 'Socio Tecnológico', price: 'En Especie', benefits: ['Donación de auriculares (JBL/Shure) o Tablets.', '"Powered by [Tu Marca]" en cada sesión.', 'Contenido para redes sociales de la marca.'], cta: 'Ofrecer Tecnología', style: 'border-white/20 text-white hover:bg-white hover:text-black', tier: 'ESPECIE' },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-20">
            <div className="text-center relative">
                <div className="absolute left-1/2 top-0 -translate-x-1/2 w-64 h-64 bg-ear-gold/10 rounded-full blur-[100px] pointer-events-none" />
                <span className="text-ear-gold font-bold uppercase tracking-[0.3em] text-xs mb-4 block relative z-10">Filosofía de Financiación</span>
                <h2 className="text-4xl md:text-6xl font-display font-black text-white mb-6 relative z-10 leading-tight">
                    DE LA CARIDAD A LA<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-ear-gold to-white">INVERSIÓN EN LEGADO</span>
                </h2>
                <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed relative z-10">
                    No buscamos donaciones para sobrevivir. Buscamos <strong>Socios Fundadores</strong> que quieran asociar su marca a la innovación en la <strong>"Silver Economy"</strong>.
                </p>
            </div>

            {/* Pitch */}
            <div className="bg-[#111] border border-ear-gold/30 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 p-6 opacity-5 pointer-events-none"><Video size={120} /></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /><span className="text-xs font-bold text-red-500 uppercase tracking-widest">El Pitch de 50 Palabras</span></div>
                        <blockquote className="text-2xl md:text-3xl font-display font-bold text-white leading-snug italic border-l-4 border-ear-gold pl-6">
                            "El Alzheimer borra quién eres. Pero la música se aloja en una parte del cerebro que la enfermedad no toca. Nosotros usamos esa 'puerta trasera' neurológica para que Antonio vuelva a cantarle la nana de su infancia. Recuperamos a la persona, nota a nota."
                        </blockquote>
                    </div>
                    <div className="md:w-1/3 flex flex-col justify-center items-center text-center">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10 mb-4 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                            <Lightbulb size={40} className="text-ear-gold" />
                        </div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Efecto Visualización Inmediata</p>
                    </div>
                </div>
            </div>

            {/* Targets */}
            <div>
                <SectionHeader icon={<Target size={24} />} title="Mapa de Tiro: Los 3 Verticales" color="bg-green-500/20 text-green-400" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {targets.map((t) => (
                        <div key={t.title} className={`bg-[#0f0f0f] border border-white/10 p-8 rounded-2xl ${t.hover} transition-all group`}>
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-3 rounded-lg ${t.color} group-hover:scale-110 transition-transform`}>{t.icon}</div>
                                <span className="text-xs font-bold text-gray-500 uppercase">{t.sub}</span>
                            </div>
                            <h4 className="text-xl font-bold text-white mb-2">{t.title}</h4>
                            <p className="text-sm text-gray-400 mb-6 leading-relaxed">{t.desc}</p>
                            <div className="pt-4 border-t border-white/10">
                                <span className="text-xs font-bold text-white block mb-1">Objetivos:</span>
                                <span className="text-xs text-gray-500">{t.targets}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sponsorship Tiers */}
            <div>
                <SectionHeader icon={<Gem size={24} />} title="Productos de Patrocinio (Legado)" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                    {tiers.map((tier) => (
                        <div key={tier.name} className={`${tier.featured ? 'bg-gradient-to-b from-ear-gold to-yellow-600 p-1 rounded-3xl lg:-translate-y-4 shadow-[0_0_30px_rgba(236,182,19,0.2)]' : 'bg-gradient-to-b from-white/10 to-black p-1 rounded-3xl'}`}>
                            <div className="bg-black h-full rounded-[20px] p-8 relative overflow-hidden flex flex-col">
                                <div className={`absolute top-0 right-0 px-4 py-2 rounded-bl-xl text-xs font-bold uppercase tracking-widest ${tier.featured ? 'bg-ear-gold text-black' : 'bg-white/10 text-white'}`}>{tier.tier}</div>
                                <h4 className="text-2xl font-display font-bold text-white mb-2">{tier.name}</h4>
                                <p className={`font-bold text-xl mb-6 ${tier.featured ? 'text-ear-gold' : 'text-ear-gold'}`}>{tier.price}</p>
                                <ul className="space-y-4 mb-8 flex-1">
                                    {tier.benefits.map((b) => (
                                        <li key={b} className="flex items-start gap-3 text-sm text-gray-400">
                                            {tier.featured ? <Star size={16} className="text-ear-gold mt-0.5 shrink-0" /> : <CheckCircle size={16} className="text-ear-gold mt-0.5 shrink-0" />} {b}
                                        </li>
                                    ))}
                                </ul>
                                <button className={`w-full py-4 border font-bold uppercase tracking-widest text-xs rounded-xl transition-colors ${tier.style}`}>{tier.cta}</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Trust */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/3 text-center">
                    <div className="w-32 h-32 bg-gray-800 rounded-full mx-auto mb-4 overflow-hidden border-2 border-ear-gold">
                        <img src="https://picsum.photos/id/453/400/400" alt="Edwin Agudelo" className="w-full h-full object-cover" />
                    </div>
                    <h4 className="text-white font-bold text-lg">El Linchpin del Fundador</h4>
                    <p className="text-gray-500 text-xs uppercase tracking-widest">Edwin Agudelo</p>
                </div>
                <div className="md:w-2/3 space-y-4">
                    <h3 className="text-2xl font-display font-bold text-white">¿Por qué confiar sin métricas históricas?</h3>
                    {[
                        { icon: <ShieldCheck className="text-ear-gold mt-1 shrink-0" size={20} />, text: <><strong>Foso Moral (Honestidad Radical):</strong> No tenemos la burocracia de las grandes ONGs. Cada euro va directo a la intervención.</> },
                        { icon: <Anchor className="text-ear-gold mt-1 shrink-0" size={20} />, text: <><strong>Autoridad Artística:</strong> "He emocionado a auditorios de miles; ahora uso esa capacidad técnica de élite para emocionar a quien más lo necesita."</> },
                        { icon: <TrendingDown className="text-ear-gold mt-1 shrink-0" size={20} />, text: <><strong>Metodología, no Evento:</strong> No hacemos "conciertos". Aplicamos el protocolo Vimume (Diagnóstico, Intervención, Evaluación).</> },
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3"><span className="shrink-0 mt-1">{item.icon}</span><p className="text-gray-400 text-sm">{item.text}</p></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

/* ─── TAB: Strategy ─── */
const StrategyTab: React.FC = () => (
    <div className="space-y-16">
        <SectionHeader icon={<Target size={24} />} title="1. Objetivos & Ejecución" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
                { title: 'Conversión & Fidelización', icon: <Users size={18} />, items: [{ icon: <Video size={14} className="text-blue-400 mt-1 shrink-0" />, text: 'Testimonios en video para conexión emocional.' }, { icon: <Download size={14} className="text-green-500 mt-1 shrink-0" />, text: 'Guías descargables (Lead Magnets) sobre beneficios.' }], tool: 'Lead Magnets + Mailchimp' },
                { title: 'Plataforma Informativa', icon: <MonitorPlay size={18} />, items: [{ icon: <MessageCircle size={14} className="text-blue-400 mt-1 shrink-0" />, text: 'FAQs con videos de expertos en musicoterapia.' }, { icon: <FileText size={14} className="text-green-500 mt-1 shrink-0" />, text: 'Blog educativo sobre calidad de vida.' }], tool: 'WordPress + WooCommerce' },
                { title: 'Referente del Sector', icon: <Award size={18} />, items: [{ icon: <BarChart size={14} className="text-blue-400 mt-1 shrink-0" />, text: 'Publicar estudios de caso y resultados concretos.' }, { icon: <Users size={14} className="text-green-500 mt-1 shrink-0" />, text: 'Colaboraciones con influencers del sector salud.' }], tool: 'Integración Redes Sociales' },
            ].map((obj) => (
                <div key={obj.title} className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-white/10 hover:border-ear-gold/30 transition-colors flex flex-col">
                    <h4 className="text-ear-gold font-bold mb-4 flex items-center gap-2 text-lg">{obj.icon} {obj.title}</h4>
                    <ul className="space-y-4 text-sm text-gray-400 mb-6 flex-1">
                        {obj.items.map((item, i) => (
                            <li key={i} className="flex gap-2 items-start">{item.icon}<span>{item.text}</span></li>
                        ))}
                    </ul>
                    <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-gray-500 font-mono">
                        <Terminal size={12} /> {obj.tool}
                    </div>
                </div>
            ))}
        </div>

        <SectionHeader icon={<Megaphone size={24} />} title="2. Estrategia de Comunicación" color="bg-purple-500/20 text-purple-400" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h4 className="font-bold text-white mb-4 flex items-center gap-2"><Users className="text-purple-400" size={18} /> Comunicación Interna</h4>
                <ul className="space-y-4 text-sm text-gray-400">
                    {[{ tag: 'Slack', text: 'Comunicación fluida entre equipos de desarrollo y producción.' }, { tag: 'Reuniones', text: 'Sesiones semanales para revisar progreso y ajustar estrategia.' }].map((i) => (
                        <li key={i.tag} className="flex gap-3"><span className="bg-purple-900/40 text-purple-300 px-2 py-1 rounded text-xs font-bold h-fit">{i.tag}</span><span>{i.text}</span></li>
                    ))}
                </ul>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h4 className="font-bold text-white mb-4 flex items-center gap-2"><Globe className="text-pink-400" size={18} /> Comunicación Externa</h4>
                <div className="space-y-3">
                    {[{ label: 'Redes Sociales', desc: 'Videos cortos de sesiones en FB/IG.' }, { label: 'Blog & Newsletter', desc: 'Publicaciones semanales de consejos e historias.' }, { label: 'Eventos & Webinars', desc: 'Demostraciones en vivo de musicoterapia.' }].map((r) => (
                        <div key={r.label} className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5">
                            <span className="text-sm font-bold text-white">{r.label}</span>
                            <span className="text-xs text-gray-500">{r.desc}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <SectionHeader icon={<AlertOctagon size={24} />} title="Factores de Riesgo" color="bg-red-500/20 text-red-400" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
                { risk: 'Desconexión con el Público', mit: 'Validación continua con usuarios reales.' },
                { risk: 'Limitaciones Presupuestarias', mit: 'Priorización de funciones críticas.' },
            ].map((r) => (
                <div key={r.risk} className="bg-[#111] p-6 rounded-2xl border border-red-900/30 flex items-center gap-6">
                    <div className="space-y-1 flex-1">
                        <span className="text-red-400 text-xs font-bold uppercase">Riesgo</span>
                        <h4 className="text-white font-bold">{r.risk}</h4>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div className="space-y-1 flex-1">
                        <span className="text-green-400 text-xs font-bold uppercase">Mitigación</span>
                        <div className="flex items-center gap-2 text-sm text-gray-300"><UserCheck size={16} /> {r.mit}</div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

/* ─── TAB: Campaigns ─── */
const CampaignsTab: React.FC = () => {
    const campaigns = [
        { phase: 'FASE 1', name: 'La Semilla', period: 'Mes 1-2', goal: '3 Residencias Piloto', desc: 'Validación del protocolo. Generación del primer banco de testimonios reales.', color: 'text-green-400', icon: <Rocket size={20} className="text-green-400" /> },
        { phase: 'FASE 2', name: 'El Mapa', period: 'Mes 3-6', goal: '15+ Centros', desc: 'Expansión geográfica mediante alianzas con redes de residencias. Primera ronda de sponsoring.', color: 'text-blue-400', icon: <TrendingUp size={20} className="text-blue-400" /> },
        { phase: 'FASE 3', name: 'El Legado', period: 'Mes 7-12', goal: 'Modelo Replicable', desc: 'Documentación del protocolo Vimume™. Formación de musicoterapeutas. Escalado nacional.', color: 'text-ear-gold', icon: <Star size={20} className="text-ear-gold" /> },
    ];

    return (
        <div className="space-y-12">
            <div className="text-center">
                <span className="text-ear-gold font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Plan de Expansión</span>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">CAMPAÑAS VIMUME™</h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">Tres fases para pasar de iniciativa local a referente nacional en musicoterapia.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {campaigns.map((c) => (
                    <div key={c.phase} className="bg-[#111] border border-white/10 p-8 rounded-3xl hover:border-white/30 transition-colors relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 p-4 opacity-10 font-black text-9xl text-white group-hover:opacity-20 transition-opacity`}>{c.phase.split(' ')[1]}</div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">{c.icon}<span className={`text-xs font-bold uppercase tracking-widest ${c.color}`}>{c.phase}: {c.period}</span></div>
                            <h3 className="text-2xl font-display font-bold text-white mb-2 uppercase">{c.name}</h3>
                            <p className={`text-sm font-bold mb-4 ${c.color}`}>Meta: {c.goal}</p>
                            <p className="text-gray-400 text-sm leading-relaxed">{c.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Canales */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <h3 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-3"><Mic className="text-pink-400" /> Canales de Activación</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Social Media', desc: 'Reels de sesiones', icon: <Share2 size={20} /> },
                        { label: 'Email Marketing', desc: 'Secuencia de nurturing', icon: <Mail size={20} /> },
                        { label: 'Prensa', desc: 'Notas de impacto', icon: <FileText size={20} /> },
                        { label: 'Eventos', desc: 'Demostraciones live', icon: <Mic size={20} /> },
                    ].map((ch) => (
                        <div key={ch.label} className="bg-black/50 border border-white/10 p-6 rounded-2xl text-center hover:border-ear-gold/30 transition-colors">
                            <div className="text-ear-gold mb-3 flex justify-center">{ch.icon}</div>
                            <h4 className="text-white font-bold text-sm mb-1">{ch.label}</h4>
                            <p className="text-gray-600 text-xs">{ch.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

/* ─── TAB: Roadmap ─── */
const RoadmapTab: React.FC = () => {
    const milestones = [
        { q: 'Q1 2026', items: ['Selección 3 residencias piloto.', 'Diseño del protocolo Vimume™ v1.', 'Producción del primer video testimonial.'], done: false },
        { q: 'Q2 2026', items: ['Primer informe de impacto emocional.', 'Presentación a 5 patrocinadores potenciales.', 'Segundo ciclo de intervención.'], done: false },
        { q: 'Q3 2026', items: ['Cierre del primer socio fundador.', 'Expansión a 10+ centros.', 'Formación de equipo de musicoterapeutas.'], done: false },
        { q: 'Q4 2026', items: ['Modelo 100% replicable documentado.', 'Lanzamiento web Vimume™ independiente.', 'Primer congreso de Musicoterapia Clínica EAR.'], done: false },
    ];

    return (
        <div className="space-y-12">
            <div className="text-center">
                <span className="text-ear-gold font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Hoja de Ruta 2026</span>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">CRONOGRAMA VIMUME™</h2>
            </div>
            <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-pink-500/50 via-ear-gold/30 to-transparent hidden md:block" />
                <div className="space-y-8">
                    {milestones.map((m, i) => (
                        <div key={m.q} className="flex gap-8 items-start">
                            <div className="hidden md:flex flex-col items-center shrink-0">
                                <div className={`w-4 h-4 rounded-full border-2 ${m.done ? 'bg-ear-gold border-ear-gold' : 'bg-black border-white/30'} z-10`} />
                            </div>
                            <div className="flex-1 bg-[#111] border border-white/10 p-8 rounded-2xl hover:border-ear-gold/30 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`text-xs font-bold uppercase tracking-widest ${i === 0 ? 'text-pink-400' : i === 1 ? 'text-blue-400' : i === 2 ? 'text-ear-gold' : 'text-purple-400'}`}>{m.q}</span>
                                    {m.done && <span className="text-xs text-green-400 font-bold flex items-center gap-1"><CheckCircle size={12} /> Completado</span>}
                                </div>
                                <ul className="space-y-3">
                                    {m.items.map((item, j) => (
                                        <li key={j} className="flex items-start gap-3 text-sm text-gray-400">
                                            <div className="w-1.5 h-1.5 bg-white/20 rounded-full mt-2 shrink-0" />{item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

/* ─── MAIN COMPONENT ─── */
export const VimumePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabId>('overview');

    return (
        <div className="pt-4 bg-black min-h-screen text-white">

            {/* HERO */}
            <div className="relative py-24 border-b border-white/10 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516307365426-bea591f05011?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-pink-900/30 border border-pink-500/30 text-pink-300 text-xs font-bold uppercase tracking-widest mb-6">
                        <Heart size={12} fill="currentColor" /> Proyecto Buque Insignia
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-6">
                        VIAJE MUSICAL <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">POR LA MEMORIA</span>
                    </h1>
                    <p className="text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed">
                        Reconectando vidas a través de la música. Una iniciativa terapéutica para devolver la identidad y la emoción a nuestros mayores.
                    </p>
                </div>
            </div>

            {/* CONTENT */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* TABS */}
                <div className="flex justify-center mb-12 overflow-x-auto">
                    <div className="inline-flex bg-white/5 p-1 rounded-full border border-white/10 min-w-max gap-1">
                        {TABS.map((tab) => {
                            const active = activeTab === tab.id;
                            const goldTab = tab.id === 'funding';
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${active
                                        ? goldTab ? 'bg-ear-gold text-black shadow-lg' : 'bg-pink-600 text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* TAB CONTENT */}
                <div className="animate-fade-in">
                    {activeTab === 'overview' && <OverviewTab />}
                    {activeTab === 'ethics' && <EthicsTab />}
                    {activeTab === 'strategy' && <StrategyTab />}
                    {activeTab === 'funding' && <FundingTab />}
                    {activeTab === 'campaigns' && <CampaignsTab />}
                    {activeTab === 'roadmap' && <RoadmapTab />}
                </div>

                {/* CTA FINAL */}
                <div className="mt-24 text-center p-16 bg-gradient-to-br from-pink-900/20 to-black border border-pink-500/20 rounded-[3rem]">
                    <Heart size={40} className="text-pink-400 mx-auto mb-6" fill="currentColor" />
                    <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-6">
                        Sé Parte de <span className="text-pink-400">Este Legado</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
                        Cada sesión es una historia de vida recuperada. Una llamada a tiempo puede cambiar el último capítulo de alguien.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="/contacto" className="px-10 py-4 bg-pink-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-pink-500 transition-all shadow-lg shadow-pink-900/30">
                            Colaborar / Donar
                        </a>
                        <a href="/contacto" className="px-10 py-4 border border-white/20 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white hover:text-black transition-all">
                            Agendar Presentación
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VimumePage;
