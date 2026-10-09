'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    Crown,
    MessageCircle,
    Music2,
    ShieldCheck,
    Sparkles,
    User,
    Mail,
    Phone,
} from 'lucide-react';
import { artistFunnelService } from '../services/ArtistFunnelService';
import {
    ARTIST_FUNNEL_TIPS,
    ARTIST_FUNNEL_WHATSAPP,
    type ArtistFunnelStage,
    type CompromisoRuta,
} from '../model/artistFunnel';

interface ArtistFunnelPanelProps {
    source?: string;
}

interface FormState {
    nombre: string;
    email: string;
    telefono: string;
    objetivoPrincipal: string;
    ciudad: string;
    genero: string;
}

const EMPTY_FORM: FormState = {
    nombre: '',
    email: '',
    telefono: '',
    objetivoPrincipal: '',
    ciudad: '',
    genero: '',
};

const STAGE_ORDER: readonly ArtistFunnelStage[] = ['CAPTADO', 'NUTRIENDO', 'COMPROMETIDO', 'CERRADO'];

function stageIndex(stage: ArtistFunnelStage): number {
    const idx = STAGE_ORDER.indexOf(stage);
    return idx === -1 ? 0 : idx;
}

export const ArtistFunnelPanel: React.FC<ArtistFunnelPanelProps> = ({ source = 'academia' }) => {
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [stage, setStage] = useState<ArtistFunnelStage>('CAPTADO');
    const [leadId, setLeadId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateField = (field: keyof FormState, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setError(null);
    };

    const handleCapture = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const result = await artistFunnelService.captureArtist(
            {
                nombre: form.nombre,
                email: form.email,
                telefono: form.telefono,
                objetivoPrincipal: form.objetivoPrincipal,
                ciudad: form.ciudad,
                genero: form.genero,
            },
            source
        );

        setIsSubmitting(false);

        if (!result.ok || !result.lead) {
            setError(
                result.reason === 'INVALID_INPUT'
                    ? 'Completa nombre, email, teléfono y objetivo para activar tu ruta.'
                    : result.reason === 'NO_FIRESTORE'
                        ? 'El núcleo de datos no está disponible. Inténtalo de nuevo en un momento.'
                        : 'No se pudo registrar tu solicitud. Inténtalo de nuevo.'
            );
            return;
        }

        setLeadId(result.lead.id);
        setStage('NUTRIENDO');
    };

    const handleCompromiso = async (ruta: CompromisoRuta) => {
        if (!leadId) return;
        await artistFunnelService.transition(leadId, { tipo: 'COMPROMETER', ruta });
        setStage(ruta === 'VIP' ? 'COMPROMETIDO' : 'CERRADO');
    };

    const whatsappLink = `https://wa.me/${ARTIST_FUNNEL_WHATSAPP.replace(/[^0-9]/g, '')}`;

    return (
        <div className="rounded-[2.5rem] bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 md:p-10 overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.8)] relative">
            <div className="absolute top-0 right-0 w-[380px] h-[380px] bg-[#ecb613]/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#00E5FF]/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10">
                {/* Cabecera */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-6 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
                            <Music2 size={24} />
                        </div>
                        <div>
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#ecb613] block font-mono">
                                Ruta de Captación Soberana
                            </span>
                            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white font-syne">
                                Embudo de Artistas S-Class
                            </h3>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono">
                        <ShieldCheck size={14} />
                        <span>ESCRITURA REAL FIRESTORE + N8N</span>
                    </div>
                </div>

                {/* Progreso de etapas */}
                <div className="grid grid-cols-4 gap-2 mb-10">
                    {STAGE_ORDER.map((s) => {
                        const active = stageIndex(stage) >= stageIndex(s);
                        return (
                            <div
                                key={s}
                                className={`rounded-xl px-2 py-2 text-center border transition-all ${active
                                        ? 'bg-[#ecb613]/10 border-[#ecb613]/40 text-white'
                                        : 'bg-white/5 border-white/5 text-white/30'
                                    }`}
                            >
                                <span className="block text-[9px] font-black uppercase tracking-widest">{s}</span>
                            </div>
                        );
                    })}
                </div>

                <AnimatePresence mode="wait">
                    {stage === 'CAPTADO' && (
                        <motion.form
                            key="captura"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            onSubmit={handleCapture}
                            className="space-y-4"
                        >
                            <div className="text-center mb-6">
                                <h4 className="text-2xl font-black uppercase text-white mb-2">
                                    Activa tu acceso al círculo de valor
                                </h4>
                                <p className="text-white/50 text-sm max-w-2xl mx-auto leading-relaxed">
                                    Registra tu proyecto artístico y recibe una secuencia de tips accionables por el canal privado. Sin mirones: cada paso escribe en el motor real de Productora EAR.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field icon={<User size={16} />} label="NOMBRE">
                                    <input
                                        required
                                        type="text"
                                        value={form.nombre}
                                        onChange={(e) => updateField('nombre', e.target.value)}
                                        placeholder="Nombre artístico o real"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#ecb613]/60 transition-all"
                                    />
                                </Field>

                                <Field icon={<Mail size={16} />} label="EMAIL">
                                    <input
                                        required
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => updateField('email', e.target.value)}
                                        placeholder="tucorreo@ejemplo.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#ecb613]/60 transition-all"
                                    />
                                </Field>

                                <Field icon={<Phone size={16} />} label="WHATSAPP REAL">
                                    <input
                                        required
                                        type="tel"
                                        value={form.telefono}
                                        onChange={(e) => updateField('telefono', e.target.value)}
                                        placeholder="+34 600 000 000"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#ecb613]/60 transition-all"
                                    />
                                </Field>

                                <Field icon={<Music2 size={16} />} label="GÉNERO (OPCIONAL)">
                                    <input
                                        type="text"
                                        value={form.genero}
                                        onChange={(e) => updateField('genero', e.target.value)}
                                        placeholder="Solista, mariachi, DJ..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#ecb613]/60 transition-all"
                                    />
                                </Field>
                            </div>

                            <Field icon={<Sparkles size={16} />} label="OBJETIVO PRINCIPAL">
                                <textarea
                                    required
                                    rows={3}
                                    value={form.objetivoPrincipal}
                                    onChange={(e) => updateField('objetivoPrincipal', e.target.value)}
                                    placeholder="Ej: cerrar 10 fechas en fincas esta temporada, entrar en festivales, vivir de mi música..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#ecb613]/60 transition-all resize-none"
                                />
                            </Field>

                            {error && (
                                <p className="text-rose-400 text-xs font-mono text-center">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-5 bg-[#ecb613] text-black font-black uppercase tracking-[0.3em] text-xs rounded-2xl hover:bg-white transition-all disabled:opacity-50 shadow-[0_20px_40px_rgba(236,182,19,0.25)] flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? 'REGISTRANDO...' : 'ACTIVAR MI RUTA'} <Sparkles size={16} />
                            </button>
                        </motion.form>
                    )}

                    {stage === 'NUTRIENDO' && (
                        <motion.div
                            key="tips"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            className="space-y-6"
                        >
                            <div className="text-center">
                                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                                <h4 className="text-2xl font-black uppercase text-white mb-2">Acceso concedido</h4>
                                <p className="text-white/50 text-sm max-w-xl mx-auto leading-relaxed">
                                    Tu secuencia de valor está lista. Aplica estos pasos en orden para acelerar tu posicionamiento.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {ARTIST_FUNNEL_TIPS.map((tip) => (
                                    <div
                                        key={tip.step}
                                        className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#ecb613]/40 transition-all"
                                    >
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="w-7 h-7 rounded-lg bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613] text-xs font-black">
                                                {tip.step}
                                            </span>
                                            <h5 className="text-sm font-bold text-white">{tip.title}</h5>
                                        </div>
                                        <p className="text-xs text-white/50 leading-relaxed">{tip.body}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/10 pt-6 space-y-4">
                                <p className="text-center text-white/60 text-sm font-bold uppercase tracking-widest">
                                    Elige tu ruta de compromiso
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handleCompromiso('LIBRE')}
                                        className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00E5FF]/50 transition-all text-left group"
                                    >
                                        <MessageCircle size={20} className="text-[#00E5FF] mb-3" />
                                        <h5 className="font-black uppercase text-white mb-1">Ruta Libre</h5>
                                        <p className="text-xs text-white/50 leading-relaxed">
                                            WhatsApp directo y asesoría rápida sin coste para resolver dudas y cotizar.
                                        </p>
                                    </button>

                                    <button
                                        onClick={() => handleCompromiso('VIP')}
                                        className="p-6 rounded-2xl bg-[#ecb613]/5 border border-[#ecb613]/40 hover:border-[#ecb613] transition-all text-left group"
                                    >
                                        <Crown size={20} className="text-[#ecb613] mb-3" />
                                        <h5 className="font-black uppercase text-white mb-1">Ruta Blindaje VIP</h5>
                                        <p className="text-xs text-white/50 leading-relaxed">
                                            Depósito deducible y bloqueo exclusivo de fecha/hora. Cero mirones, cero cancelaciones.
                                        </p>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {stage === 'COMPROMETIDO' && (
                        <motion.div
                            key="vip"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            className="text-center space-y-6"
                        >
                            <Crown className="w-14 h-14 text-[#ecb613] mx-auto" />
                            <h4 className="text-2xl font-black uppercase text-white">Blindaje VIP activado</h4>
                            <p className="text-white/50 text-sm max-w-xl mx-auto leading-relaxed">
                                Has optado por la ruta de compromiso mutuo. Nuestro equipo cerrará contigo el bloqueo atómico de fecha/hora y el depósito deducible.
                            </p>
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-[#ecb613] text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white transition-all"
                            >
                                <MessageCircle size={16} /> Abrir WhatsApp de cierre
                            </a>
                        </motion.div>
                    )}

                    {stage === 'CERRADO' && (
                        <motion.div
                            key="libre"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            className="text-center space-y-6"
                        >
                            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
                            <h4 className="text-2xl font-black uppercase text-white">Ruta Libre registrada</h4>
                            <p className="text-white/50 text-sm max-w-xl mx-auto leading-relaxed">
                                Tu solicitud está capturada. Recibirás asesoría rápida por el canal directo.
                            </p>
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white/5 transition-all"
                            >
                                <MessageCircle size={16} /> Abrir WhatsApp
                            </a>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

interface FieldProps {
    icon: React.ReactNode;
    label: string;
    children: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({ icon, label, children }) => (
    <div>
        <label className="block text-[9px] font-black uppercase tracking-widest text-white/40 mb-2">{label}</label>
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">{icon}</span>
            {children}
        </div>
    </div>
);