'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    Save,
    Loader2,
    CheckCircle2,
    AlertCircle,
    User,
    MapPin,
    Phone,
    Link2,
    Palette,
    Wrench,
    Share2,
    Image as ImageIcon,
    Eye,
    LogOut,
    Sparkles,
    Plus,
    X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getMySpaceAction, saveMySpaceAction, logoutSpaceAction, type SpaceInput } from '@/app/actions/spaceActions';

interface SpaceShape {
    slug: string;
    brandName: string;
    headline: string;
    bio: string;
    avatarUrl: string;
    primaryColor: string;
    category: string;
    province: string;
    city: string;
    phone: string;
    websiteUrl: string;
    socialLinks: string[];
    gallery: string[];
    servicesOffered: string[];
    published: boolean;
}

const EMPTY: SpaceShape = {
    slug: '',
    brandName: '',
    headline: '',
    bio: '',
    avatarUrl: '',
    primaryColor: '#ecb613',
    category: '',
    province: '',
    city: '',
    phone: '',
    websiteUrl: '',
    socialLinks: [],
    gallery: [],
    servicesOffered: [],
    published: false
};

interface TagFieldProps {
    label: string;
    values: string[];
    onChange: (next: string[]) => void;
    placeholder: string;
}

function TagField({ label, values, onChange, placeholder }: TagFieldProps) {
    const [draft, setDraft] = useState('');

    function add() {
        const v = draft.trim();
        if (!v) return;
        if (values.includes(v)) {
            setDraft('');
            return;
        }
        onChange([...values, v]);
        setDraft('');
    }

    return (
        <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1.5 block">{label}</span>
            <div className="flex flex-wrap gap-2 mb-2">
                {values.map((v) => (
                    <span key={v} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[11px] font-mono">
                        {v}
                        <button type="button" onClick={() => onChange(values.filter((x) => x !== v))} className="hover:text-white transition-colors">
                            <X size={11} />
                        </button>
                    </span>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            add();
                        }
                    }}
                    placeholder={placeholder}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#0c0a0e] border border-white/10 text-sm text-white outline-none focus:border-[#ecb613]/50 placeholder:text-white/30"
                />
                <button type="button" onClick={add} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[#ecb613] hover:bg-[#ecb613] hover:text-black transition-all">
                    <Plus size={15} />
                </button>
            </div>
        </div>
    );
}

interface FieldProps {
    label: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

function Field({ label, icon, children }: FieldProps) {
    return (
        <label className="block">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1.5 flex items-center gap-1.5">
                <span className="text-[#ecb613]">{icon}</span> {label}
            </span>
            {children}
        </label>
    );
}

const inputBase = 'w-full px-3 py-2.5 rounded-xl bg-[#0c0a0e] border border-white/10 text-sm text-white outline-none focus:border-[#ecb613]/50 placeholder:text-white/30 transition-colors';
const textareaBase = 'w-full px-3 py-2.5 rounded-xl bg-[#0c0a0e] border border-white/10 text-sm text-white outline-none focus:border-[#ecb613]/50 placeholder:text-white/30 transition-colors resize-none';

export default function EspacioEditorSClass() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notice, setNotice] = useState<string | null>(null);
    const [unauthorized, setUnauthorized] = useState(false);

    const [form, setForm] = useState<SpaceShape>(EMPTY);
    const [preview, setPreview] = useState(false);

    useEffect(() => {
        getMySpaceAction().then((res) => {
            if (res.success && res.space) {
                const s = res.space as unknown as SpaceShape;
                setForm({
                    slug: s.slug ?? '',
                    brandName: s.brandName ?? '',
                    headline: s.headline ?? '',
                    bio: s.bio ?? '',
                    avatarUrl: s.avatarUrl ?? '',
                    primaryColor: s.primaryColor ?? '#ecb613',
                    category: s.category ?? '',
                    province: s.province ?? '',
                    city: s.city ?? '',
                    phone: s.phone ?? '',
                    websiteUrl: s.websiteUrl ?? '',
                    socialLinks: Array.isArray(s.socialLinks) ? s.socialLinks : [],
                    gallery: Array.isArray(s.gallery) ? s.gallery : [],
                    servicesOffered: Array.isArray(s.servicesOffered) ? s.servicesOffered : [],
                    published: Boolean(s.published)
                });
            } else {
                setUnauthorized(true);
            }
        }).catch(() => setUnauthorized(true)).finally(() => setLoading(false));
    }, []);

    const patch = (partial: Partial<SpaceShape>) => setForm((prev) => ({ ...prev, ...partial }));

    const completion = useMemo(() => {
        let score = 0;
        if (form.brandName) score++;
        if (form.headline) score++;
        if (form.bio) score++;
        if (form.category) score++;
        if (form.province) score++;
        if (form.phone) score++;
        if (form.servicesOffered.length > 0) score++;
        if (form.gallery.length > 0) score++;
        return Math.round((score / 8) * 100);
    }, [form]);

    async function handleSave() {
        setSaving(true);
        setError(null);
        setNotice(null);
        const payload: SpaceInput = {
            slug: form.slug || undefined,
            brandName: form.brandName,
            headline: form.headline,
            bio: form.bio,
            avatarUrl: form.avatarUrl,
            primaryColor: form.primaryColor,
            category: form.category,
            province: form.province,
            city: form.city,
            phone: form.phone,
            websiteUrl: form.websiteUrl,
            socialLinks: form.socialLinks,
            gallery: form.gallery,
            servicesOffered: form.servicesOffered,
            published: form.published
        };
        const res = await saveMySpaceAction(payload);
        setSaving(false);
        if (res.success) {
            setNotice('Espacio guardado y sincronizado.');
        } else {
            setError(res.error || 'No se pudo guardar.');
        }
    }

    async function handleLogout() {
        await logoutSpaceAction();
        router.push('/espacio/login');
        router.refresh();
    }

    if (loading) {
        return (
            <div className="min-h-[60vh] grid place-items-center">
                <div className="flex flex-col items-center gap-3 text-[#ecb613]">
                    <Loader2 size={28} className="animate-spin" />
                    <span className="text-xs font-mono">Cargando tu Espacio S-Class…</span>
                </div>
            </div>
        );
    }

    if (unauthorized) {
        return (
            <div className="rounded-3xl bg-[#0a080b] border border-white/10 p-10 text-center space-y-5">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FF2B44]/10 border border-[#FF2B44]/30 grid place-items-center text-[#FF2B44]">
                    <AlertCircle size={26} />
                </div>
                <h3 className="font-syne font-black text-xl uppercase">Acceso requerido</h3>
                <p className="text-white/50 text-sm max-w-md mx-auto">Inicia sesión con doble verificación para editar tu espacio individual.</p>
                <button
                    onClick={() => router.push('/espacio/login?from=/espacio')}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#ecb613] to-[#f5d77f] hover:from-white hover:to-white text-black font-black text-xs uppercase tracking-widest transition-all hover:scale-[1.02]"
                >
                    Ir al Login
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
            {/* ─── Formulario de edición ─── */}
            <div className="space-y-6">
                {error && (
                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#FF2B44]/10 border border-[#FF2B44]/30 text-[#ff8a99] text-xs">
                        <AlertCircle size={15} className="shrink-0" /> {error}
                    </div>
                )}
                {notice && (
                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                        <CheckCircle2 size={15} className="shrink-0" /> {notice}
                    </div>
                )}

                {/* Identidad */}
                <section className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 space-y-4">
                    <SectionTitle icon={<User size={15} />} title="Identidad" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Nombre de marca / titular" icon={<Sparkles size={12} />}>
                            <input className={inputBase} value={form.brandName} onChange={(e) => patch({ brandName: e.target.value })} placeholder="Ej. Finca Los Afligidos" />
                        </Field>
                        <Field label="Slug público" icon={<Link2 size={12} />}>
                            <input className={inputBase} value={form.slug} onChange={(e) => patch({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} placeholder="finca-los-afligidos" />
                        </Field>
                    </div>
                    <Field label="Titular / Headline" icon={<Sparkles size={12} />}>
                        <input className={inputBase} value={form.headline} onChange={(e) => patch({ headline: e.target.value })} placeholder="Espacio singular para bodas con acústica S-Class" />
                    </Field>
                    <Field label="Biografía" icon={<User size={12} />}>
                        <textarea className={textareaBase} rows={4} value={form.bio} onChange={(e) => patch({ bio: e.target.value })} placeholder="Describe tu espacio, servicios y propuesta de valor…" />
                    </Field>
                    <Field label="Avatar / Logo (URL)" icon={<ImageIcon size={12} />}>
                        <input className={inputBase} value={form.avatarUrl} onChange={(e) => patch({ avatarUrl: e.target.value })} placeholder="https://…" />
                    </Field>
                </section>

                {/* Localización */}
                <section className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 space-y-4">
                    <SectionTitle icon={<MapPin size={15} />} title="Localización" />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Field label="Categoría" icon={<Wrench size={12} />}>
                            <input className={inputBase} value={form.category} onChange={(e) => patch({ category: e.target.value })} placeholder="Finca, Catering…" />
                        </Field>
                        <Field label="Provincia" icon={<MapPin size={12} />}>
                            <input className={inputBase} value={form.province} onChange={(e) => patch({ province: e.target.value })} placeholder="Madrid / Toledo" />
                        </Field>
                        <Field label="Ciudad" icon={<MapPin size={12} />}>
                            <input className={inputBase} value={form.city} onChange={(e) => patch({ city: e.target.value })} placeholder="Méntrida" />
                        </Field>
                    </div>
                </section>

                {/* Contacto */}
                <section className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 space-y-4">
                    <SectionTitle icon={<Phone size={15} />} title="Contacto & Enlaces" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Teléfono real (WhatsApp)" icon={<Phone size={12} />}>
                            <input className={inputBase} value={form.phone} onChange={(e) => patch({ phone: e.target.value })} placeholder="+34 600 000 000" />
                        </Field>
                        <Field label="Web" icon={<Link2 size={12} />}>
                            <input className={inputBase} value={form.websiteUrl} onChange={(e) => patch({ websiteUrl: e.target.value })} placeholder="https://…" />
                        </Field>
                    </div>
                    <TagField label="Redes sociales (URLs)" values={form.socialLinks} onChange={(v) => patch({ socialLinks: v })} placeholder="https://instagram.com/…" />
                </section>

                {/* Servicios & Galería */}
                <section className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 space-y-4">
                    <SectionTitle icon={<Wrench size={15} />} title="Servicios & Galería" />
                    <TagField label="Servicios ofrecidos" values={form.servicesOffered} onChange={(v) => patch({ servicesOffered: v })} placeholder="Sonorización S-Class, Catering…" />
                    <TagField label="Galería (URLs de imágenes)" values={form.gallery} onChange={(v) => patch({ gallery: v })} placeholder="https://…/foto.jpg" />
                </section>

                {/* Apariencia */}
                <section className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 space-y-4">
                    <SectionTitle icon={<Palette size={15} />} title="Apariencia" />
                    <div className="max-w-xs">
                        <Field label="Color de acento" icon={<Palette size={12} />}>
                            <div className="flex items-center gap-3">
                                <input type="color" value={form.primaryColor} onChange={(e) => patch({ primaryColor: e.target.value })} className="w-12 h-10 rounded-xl bg-transparent border border-white/10 cursor-pointer" />
                                <span className="font-mono text-xs text-white/50">{form.primaryColor}</span>
                            </div>
                        </Field>
                    </div>
                </section>
            </div>

            {/* ─── Panel lateral: estado, vista previa y guardado ─── */}
            <div className="space-y-6">
                <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 space-y-4 xl:sticky xl:top-24">
                    <SectionTitle icon={<Eye size={15} />} title="Estado" />

                    <div>
                        <div className="flex items-center justify-between text-xs mb-2">
                            <span className="font-mono text-white/40 uppercase tracking-widest">Completitud</span>
                            <span className="font-mono text-[#ecb613] font-bold">{completion}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#ecb613] to-[#f5d77f] transition-all duration-500" style={{ width: `${completion}%` }} />
                        </div>
                    </div>

                    <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-xs font-mono uppercase tracking-widest text-white/50">Publicado</span>
                        <button
                            type="button"
                            onClick={() => patch({ published: !form.published })}
                            className={`w-12 h-6 rounded-full transition-all relative ${form.published ? 'bg-[#ecb613]' : 'bg-white/10'}`}
                        >
                            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${form.published ? 'left-6' : 'left-0.5'}`} />
                        </button>
                    </label>

                    {preview && (
                        <div className="rounded-2xl bg-[#0c0a0e] border border-white/10 p-4 space-y-2">
                            <div className="flex items-center gap-3">
                                {form.avatarUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={form.avatarUrl} alt="" className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                                ) : (
                                    <div className="w-12 h-12 rounded-xl grid place-items-center text-white/30 bg-white/5">
                                        <User size={20} />
                                    </div>
                                )}
                                <div>
                                    <p className="font-syne font-black text-sm uppercase" style={{ color: form.primaryColor }}>{form.brandName || 'Tu marca'}</p>
                                    <p className="text-[10px] text-white/40">{form.province}{form.city ? ` · ${form.city}` : ''}</p>
                                </div>
                            </div>
                            {form.headline && <p className="text-xs text-white/70">{form.headline}</p>}
                            {form.servicesOffered.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {form.servicesOffered.slice(0, 3).map((s) => (
                                        <span key={s} className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50">{s}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => setPreview(!preview)}
                        className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                    >
                        <Eye size={14} /> {preview ? 'Ocultar vista previa' : 'Vista previa'}
                    </button>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#ecb613] to-[#f5d77f] hover:from-white hover:to-white text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-[0_8px_25px_rgba(236,182,19,0.25)] disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                        {saving ? 'Guardando…' : 'Guardar espacio'}
                    </button>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full py-2.5 rounded-2xl bg-transparent border border-white/10 text-white/50 hover:text-[#FF2B44] hover:border-[#FF2B44]/40 text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                    >
                        <LogOut size={14} /> Cerrar sesión
                    </button>
                </div>
            </div>
        </div>
    );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
        <h3 className="flex items-center gap-2 text-[#ecb613] text-xs font-mono uppercase tracking-[0.25em]">
            {icon} {title}
        </h3>
    );
}