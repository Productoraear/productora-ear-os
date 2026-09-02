import React, { useState } from 'react';
import { Send, Instagram, Share2, Target, Zap, BarChart3, ChevronRight, Activity, Landmark, Shield, Heart } from 'lucide-react';

interface SignalAuditProps {
    role?: string;
}

export const SignalAudit = ({ role = 'ARTISTA' }: SignalAuditProps) => {
    const [status, setStatus] = useState<'emergent' | 'developing' | 'consolidated'>('emergent');
    const [loading, setLoading] = useState(false);

    const getRoleContext = () => {
        switch(role) {
            case 'DIPLOMATICO':
                return {
                    tag: 'Protocolo de Excelencia Diplomática',
                    title: 'Auditoría de Relevancia Institucional',
                    labelName: 'Nombre de la Misión / Embajada',
                    labelLink: 'Web Oficial / Memoria Anual',
                    labelSocial: 'Perfil LinkedIn / X (Twitter)',
                    icon: <Landmark size={18} className="text-blue-500 animate-pulse" />,
                    bgIcon: <Landmark size={120} className="text-blue-500" />,
                    placeholder: 'Misión Diplomática...'
                };
            case 'AYUNTAMIENTO':
                return {
                    tag: 'Protocolo de Impacto Ciudadano',
                    title: 'Auditoría de Gestión Cultural',
                    labelName: 'Ayuntamiento / Concejalía',
                    labelLink: 'Portal de Transparencia / Eventos',
                    labelSocial: 'Canales Institucionales',
                    icon: <Shield size={18} className="text-gold-500 animate-pulse" />,
                    bgIcon: <Shield size={120} className="text-gold-500" />,
                    placeholder: 'Administración Local...'
                };
            case 'COORDINADOR_BODA':
                return {
                    tag: 'Protocolo de Estética Nupcial',
                    title: 'Auditoría de Perfeccionismo',
                    labelName: 'Agencia / Marca Personal',
                    labelLink: 'Portfolio de Bodas / Wedding Hub',
                    labelSocial: 'Instagram Portfolio',
                    icon: <Heart size={18} className="text-red-500 animate-pulse" />,
                    bgIcon: <Heart size={120} className="text-red-500" />,
                    placeholder: 'Wedding Identity...'
                };
            case 'VIMUME_CENTRO':
                return {
                    tag: 'Protocolo de Salud Emocional',
                    title: 'Auditoría de Envejecimiento Activo',
                    labelName: 'Nombre del Centro / Residencia',
                    labelLink: 'Web Institucional / Blog de Actividades',
                    labelSocial: 'Canales de Comunicación Familiar',
                    icon: <Landmark size={18} className="text-green-500 animate-pulse" />,
                    bgIcon: <Landmark size={120} className="text-green-500" />,
                    placeholder: 'VIMUME HUB...'
                };
            case 'VIMUME_FAMILIAR':
                return {
                    tag: 'Protocolo de Conexión Generacional',
                    title: 'Auditoría de Legado Familiar',
                    labelName: 'Nombre del Familiar Responsable',
                    labelLink: 'Árbol Genealógico / Documentación',
                    labelSocial: 'Redes de Contacto Familiar',
                    icon: <Heart size={18} className="text-pink-500 animate-pulse" />,
                    bgIcon: <Heart size={120} className="text-pink-500" />,
                    placeholder: 'VIMUME LEGACY...'
                };
            default:
                return {
                    tag: 'Protocolo de Resonancia Hu-manizarte',
                    title: 'Auditoría de Señal Artística',
                    labelName: 'Nombre Artístico / Marca',
                    labelLink: 'Link a Portfolio / Rider Técnico',
                    labelSocial: 'Instagram / Social Proof',
                    icon: <Activity size={18} className="text-gold-500 animate-pulse" />,
                    bgIcon: <Share2 size={120} className="text-gold-500" />,
                    placeholder: 'EAR IDENTITY...'
                };
        }
    };

    const ctx = getRoleContext();

    const handleSend = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 2500);
    };

    return (
        <section className="space-y-16 max-w-4xl mx-auto p-12 bg-black/40 border border-white/5 rounded-[4rem] backdrop-blur-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                {ctx.bgIcon}
            </div>

            <header className="space-y-4 mb-12 relative z-10">
                <div className="flex items-center gap-3">
                    {ctx.icon}
                    <span className="text-gold-500 text-[10px] font-black uppercase tracking-[0.5em]">{ctx.tag}</span>
                </div>
                <h3 className="text-5xl font-black uppercase tracking-tighter">{ctx.title}</h3>
                <p className="text-gray-500 max-w-md font-light text-sm italic">Inyectando datos al oráculo para el cálculo de impacto y relevancia.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-gold-500">{ctx.labelName}</label>
                    <input className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-xl font-bold uppercase tracking-widest text-white outline-none focus:border-gold-500 transition-all placeholder:text-white/10" placeholder={ctx.placeholder} />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-gold-500">{ctx.labelLink}</label>
                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl">
                        <BarChart3 size={20} className="text-gold-500/50" />
                        <input className="bg-transparent border-none outline-none text-xs text-gray-500 w-full" placeholder="https://..." />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-gold-500">{ctx.labelSocial}</label>
                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl">
                        <Instagram size={20} className="text-gold-500/50" />
                        <input className="bg-transparent border-none outline-none text-xs text-gray-500 w-full" placeholder="https://..." />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-gold-500">Estado de Madurez</label>
                    <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/10">
                        {['emergent', 'developing', 'consolidated'].map((s) => (
                            <button 
                                key={s} 
                                onClick={() => setStatus(s as any)}
                                className={`flex-1 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${status === s ? 'bg-gold-500 text-black shadow-lg' : 'text-gray-600 hover:text-white'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-4 relative z-10">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gold-500">Análisis de Barreras Estratégicas</label>
                <textarea className="w-full bg-white/5 border border-white/10 p-8 rounded-3xl text-sm font-light text-gray-400 outline-none focus:border-gold-500 transition-all h-32 resize-none" placeholder="Describe los 3 frenos estratégicos detectados por tu equipo..." />
            </div>

            <button 
                onClick={handleSend}
                disabled={loading}
                className="w-full py-10 bg-gold-500 text-black font-black uppercase tracking-[0.6em] text-xs rounded-3xl hover:bg-white transition-all shadow-[0_20px_80px_rgba(196,163,0,0.35)] flex items-center justify-center gap-4 group"
            >
               {loading ? <Zap className="animate-spin" /> : <Send size={20} className="group-hover:translate-x-2 transition-transform" />}
               {loading ? 'Sincronizando con el Oráculo...' : 'ENVIAR SEÑAL AL SISTEMA'}
            </button>
        </section>
    );
};
