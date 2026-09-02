"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { 
    Fingerprint, 
    ShieldCheck, 
    ChevronLeft, 
    LayoutDashboard, 
    UserCheck, 
    Eye, 
    Target, 
    Compass, 
    Activity,
    Smartphone,
    Share2,
    Landmark,
    Shield,
    Heart,
    Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Strategic Components
import { StrategicAuditForm } from '@/components/audit/StrategicAuditForm';
import { IdentityAudit } from '@/components/audit/IdentityAudit';
import { EmpathyMap } from '@/components/audit/EmpathyMap';
import { IkigaiCompass } from '@/components/audit/IkigaiCompass';
import { FrictionRadiology } from '@/components/audit/FrictionRadiology';
import { FunnelBuilder } from '@/components/audit/FunnelBuilder';
import { SignalAudit } from '@/components/audit/SignalAudit';

type AuditTab = 'CONTACTO' | 'IDENTIDAD' | 'EMPATIA' | 'FUNNEL' | 'IKIGAI' | 'FRICCION' | 'SEÑAL';

function AuditoriaContent() {
    const searchParams = useSearchParams();
    const role = searchParams?.get('role') || 'ARTISTA';
    const [activeTab, setActiveTab] = useState<AuditTab>('CONTACTO');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const getRoleConfig = () => {
        switch(role) {
            case 'DIPLOMATICO': 
                return { label: 'Protocolo Diplomático', icon: <Landmark size={18} />, color: 'text-blue-500' };
            case 'AYUNTAMIENTO': 
                return { label: 'Protocolo Institucional', icon: <Shield size={18} />, color: 'text-amber-400' };
            case 'COORDINADOR_BODA': 
                return { label: 'Protocolo Nupcial', icon: <Heart size={18} />, color: 'text-red-500' };
            case 'VIMUME_CENTRO':
                return { label: 'Protocolo VIMUME Centro', icon: <Landmark size={18} />, color: 'text-emerald-400' };
            case 'VIMUME_FAMILIAR':
                return { label: 'Protocolo VIMUME Familiar', icon: <Heart size={18} />, color: 'text-pink-500' };
            case 'VIMUME_CUIDADOR':
                return { label: 'Protocolo VIMUME Cuidador', icon: <UserCheck size={18} />, color: 'text-orange-500' };
            case 'VIMUME_INSTITUCION':
                return { label: 'Protocolo VIMUME Institucional', icon: <Shield size={18} />, color: 'text-cyan-400' };
            default: 
                return { label: 'Protocolo Artista', icon: <Sparkles size={18} />, color: 'text-purple-400' };
        }
    };

    const roleConfig = getRoleConfig();

    const menuItems = [
        { id: 'CONTACTO', icon: <Smartphone size={18} />, label: 'Formulario' },
        { id: 'IDENTIDAD', icon: <Fingerprint size={18} />, label: 'Identidad' },
        { id: 'EMPATIA', icon: <Eye size={18} />, label: 'Perfil Audience' },
        { id: 'FUNNEL', icon: <Target size={18} />, label: 'Diseño Funnel' },
        { id: 'IKIGAI', icon: <Compass size={18} />, label: 'Propósito' },
        { id: 'FRICCION', icon: <Activity size={18} />, label: 'Radiografía' },
        { id: 'SEÑAL', icon: <Share2 size={18} />, label: roleConfig.label }
    ];

    if (!isLoaded) return null;

    return (
        <main className="min-h-screen bg-[#0A0A0A] text-white selection:bg-amber-500/30 selection:text-amber-400">
            {/* 🛡️ Header / Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 py-5 px-6 sm:px-12 flex justify-between items-center">
                <div className="flex items-center space-x-4 sm:space-x-8">
                    <Link href="/" className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-all group">
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden sm:inline">Volver al Diamante</span>
                        <span className="sm:hidden">Inicio</span>
                    </Link>
                    <div className="h-5 w-px bg-white/10" />
                    <div className="flex items-center space-x-3">
                        <ShieldCheck size={18} className="text-amber-400" />
                        <span className="text-[10px] uppercase font-mono font-bold tracking-[0.3em] text-zinc-300 hidden md:inline">
                            Audit & Assessment Strategic System
                        </span>
                        <div className={`px-2.5 py-0.5 bg-white/5 border border-white/10 rounded-full flex items-center gap-1.5 ${roleConfig.color}`}>
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider">{role} MODE</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                     <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 animate-pulse">SISTEMA ONLINE</span>
                     <div className="w-8 h-8 rounded-full border border-amber-500/20 bg-amber-500/10 flex items-center justify-center">
                        <LayoutDashboard size={14} className="text-amber-400" />
                     </div>
                </div>
            </nav>

            {/* 🎛️ Sidebar Navigation */}
            <aside className="fixed left-0 top-0 h-full w-20 md:w-72 pt-28 pb-10 px-4 sm:px-6 border-r border-white/10 bg-black/40 backdrop-blur-xl flex flex-col justify-between z-40">
                <div className="space-y-4">
                    <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest px-2 block mb-4 hidden md:block">
                        Instrumental Estratégico
                    </span>
                    <nav className="space-y-1.5">
                        {menuItems.map((item) => (
                            <button 
                                key={item.id}
                                onClick={() => setActiveTab(item.id as AuditTab)}
                                className={`w-full flex items-center space-x-3 p-3.5 rounded-xl transition-all group ${activeTab === item.id ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 font-bold' : 'hover:bg-white/5 text-zinc-400'}`}
                            >
                                <span className={activeTab === item.id ? 'text-black' : 'text-amber-400 group-hover:scale-110 transition-transform'}>
                                    {item.icon}
                                </span>
                                <span className={`text-[11px] font-mono uppercase tracking-wider hidden md:block ${activeTab === item.id ? 'text-black font-bold' : 'text-zinc-400 group-hover:text-white transition-colors'}`}>
                                    {item.label}
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/15 hidden md:block">
                    <div className="flex items-center space-x-2 mb-2">
                         <Activity size={14} className="text-amber-400" />
                         <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">Inferencia Activa</span>
                    </div>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mb-1.5">
                         <div className="bg-amber-500 h-full w-3/4 animate-pulse" />
                    </div>
                    <p className="text-[8px] text-zinc-500 uppercase font-mono">Precisión Actual: 98.4%</p>
                </div>
            </aside>

            {/* 🖥️ Main Content Area */}
            <div className="pl-20 md:pl-72 pt-32 pb-20 px-6 sm:px-12">
                <div className="max-w-5xl mx-auto space-y-8">
                    {/* Render Dinámico basado en Pestaña */}
                    <div className="animate-in fade-in slide-in-from-top duration-500">
                        {activeTab === 'CONTACTO' && <StrategicAuditForm role={role} />}
                        {activeTab === 'IDENTIDAD' && <IdentityAudit />}
                        {activeTab === 'EMPATIA' && <EmpathyMap />}
                        {activeTab === 'FUNNEL' && <FunnelBuilder />}
                        {activeTab === 'IKIGAI' && <IkigaiCompass />}
                        {activeTab === 'FRICCION' && <FrictionRadiology />}
                        {activeTab === 'SEÑAL' && <SignalAudit role={role} />}
                    </div>

                    {/* 🛡️ Footer Analytics */}
                    <footer className="pt-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-500 font-mono text-xs">
                        <div className="flex items-center space-x-2">
                            <Fingerprint size={14} className="text-amber-400/50" />
                            <span className="text-[9px] uppercase tracking-wider">Protocolo de Privacidad Estratégica EAR-OS-2026.01</span>
                        </div>
                        <div className="text-[9px] uppercase tracking-wider flex items-center space-x-4">
                            <span className="text-amber-400">Inferencia: Gemini 2.5</span>
                            <span>Latencia: 184ms</span>
                        </div>
                    </footer>
                </div>
            </div>
        </main>
    );
}

export default function AuditoriaPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-amber-400 font-mono">Cargando Auditoría...</div>}>
            <AuditoriaContent />
        </Suspense>
    );
}
