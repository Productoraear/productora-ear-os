import React, { useState, useMemo } from 'react';
import { Send, Target, DollarSign, Briefcase, Mail, CheckCircle2, Info, ChevronDown } from 'lucide-react';
import { 
    DIPLOMATIC_SERVICES, 
    INSTITUTIONAL_SERVICES, 
    WEDDING_SERVICES, 
    VIMUME_SERVICES 
} from '@/data/pricing';

interface AuditFormProps {
    role?: string;
}

const BUDGET_RANGES = [
    { label: '3.000 € - 10.000 €', min: 3000, max: 10000 },
    { label: '10.000 € - 25.000 €', min: 10000, max: 25000 },
    { label: '25.000 € - 100.000 €', min: 25000, max: 100000 },
    { label: '100.000 € - 250.000 €', min: 100000, max: 250000 },
    { label: '+250.000 € (Tailor Made)', min: 250000, max: 1000000 },
];

export const StrategicAuditForm = ({ role = 'ARTISTA' }: AuditFormProps) => {
    const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS'>('IDLE');
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [budgetRange, setBudgetRange] = useState(BUDGET_RANGES[1]);

    const currentServices = useMemo(() => {
        if (role === 'DIPLOMATICO') return DIPLOMATIC_SERVICES;
        if (role === 'AYUNTAMIENTO') return INSTITUTIONAL_SERVICES;
        if (role === 'COORDINADOR_BODA') return WEDDING_SERVICES;
        if (role.startsWith('VIMUME')) return VIMUME_SERVICES;
        return [];
    }, [role]);

    const toggleService = (id: string) => {
        setSelectedServices(prev => 
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const totalPrice = useMemo(() => {
        return selectedServices.reduce((acc, currentId) => {
            const service = currentServices.find(s => s.id === currentId);
            return acc + (service?.basePrice || 0);
        }, 0);
    }, [selectedServices, currentServices]);

    const getRoleContext = () => {
        if (role.startsWith('VIMUME')) {
            return {
                tag: 'Inferencia de Impacto Humano',
                title: 'Plan de Intervención VIMUME',
                description: 'Diseñando el viaje musical para la salud y el bienestar emocional.',
                services: VIMUME_SERVICES,
                budgetLabel: 'Inversión en Bienestar Social',
                roleName: 'VIMUME Expert',
                placeholder: 'Nombre de la Residencia / Familiar / Centro...'
            };
        }
        switch(role) {
            case 'DIPLOMATICO':
                return {
                    tag: 'Inferencia de Prestigio Institucional',
                    title: 'Auditoría de Relevancia y Protocolo',
                    description: 'Diseñando la atmósfera de excelencia para misiones y embajadas.',
                    services: DIPLOMATIC_SERVICES,
                    budgetLabel: 'Rango de Inversión Protocolaria',
                    roleName: 'Cuerpo Diplomático',
                    placeholder: 'Nombre de la Misión / Embajada / Consulado...'
                };
            case 'AYUNTAMIENTO':
                return {
                    tag: 'Inferencia de Impacto Público',
                    title: 'Auditoría de Transformación Social',
                    description: 'Estrategias de cultura y legado para la administración local.',
                    services: INSTITUTIONAL_SERVICES,
                    budgetLabel: 'Presupuesto de Bienestar Público',
                    roleName: 'Gobernanza / Alcaldía',
                    placeholder: 'Ayuntamiento de...'
                };
            case 'COORDINADOR_BODA':
                return {
                    tag: 'Inferencia de Sensibilidad Nupcial',
                    title: 'Auditoría de Boda de Élite',
                    description: 'Orquestando cada detalle para crear experiencias sensoriales únicas.',
                    services: WEDDING_SERVICES,
                    budgetLabel: 'Inversión en la Experiencia de Vida',
                    roleName: 'Wedding Specialist',
                    placeholder: 'Agencia / Marca de Wedding Planning...'
                };
            default:
                return {
                    tag: 'Inferencia Artística 360',
                    title: 'Auditoría de Carrera Artística',
                    description: 'Potenciando el talento y la soberanía creativa.',
                    services: [], // Depende del catálogo de artistas si existiera
                    budgetLabel: 'Inversión en Desarrollo de Carrera',
                    roleName: 'Talento / Artista',
                    placeholder: 'Nombre Artístico / Marca...'
                };
        }
    };

    const ctx = getRoleContext();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('LOADING');
        setTimeout(() => setStatus('SUCCESS'), 2000);
    };

    if (status === 'SUCCESS') {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-gold-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(196,163,0,0.5)]">
                    <Send className="text-black" size={32} />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter">Señal Recibida</h3>
                <p className="text-gray-400 max-w-sm">Tu solicitud estratégica para {ctx.roleName} ha sido inyectada. En breve recibirás la propuesta de despliegue.</p>
                <button onClick={() => setStatus('IDLE')} className="text-gold-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">Nueva Consulta</button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-12 max-w-3xl mx-auto p-12 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-xl relative overflow-hidden group">
            {/* Header Form */}
            <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                    <h3 className="text-2xl font-black uppercase tracking-tighter">
                        {ctx.title}
                    </h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{ctx.tag} | {role} MODE</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gold-500/10 border border-gold-500/20 rounded-full">
                    <Info size={14} className="text-gold-500" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-gold-500">Inferencia Presupuestaria Activa</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-gold-500 flex items-center gap-2">
                        <Briefcase size={12} />
                        Identidad / Entidad / Proyecto
                    </label>
                    <input 
                        required
                        type="text" 
                        className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-white focus:border-gold-500 outline-none transition-all placeholder:text-gray-700"
                        placeholder={ctx.placeholder}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-gold-500 flex items-center gap-2">
                        <Mail size={12} />
                        Canal de Respuesta (Email)
                    </label>
                    <input 
                        required
                        type="email" 
                        className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-white focus:border-gold-500 outline-none transition-all placeholder:text-gray-700 font-mono text-xs"
                        placeholder="tu-correo@entidad-oficial.com"
                    />
                </div>
            </div>

            {/* Checklist Dinámico */}
            {currentServices.length > 0 && (
                <div className="space-y-6">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-gold-500 flex items-center gap-2">
                        <Target size={12} />
                        Recursos y Necesidades Específicas
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {currentServices.map((service) => (
                            <div 
                                key={service.id}
                                onClick={() => toggleService(service.id)}
                                className={`cursor-pointer p-4 rounded-xl border transition-all flex items-center justify-between group/item ${selectedServices.includes(service.id) ? 'bg-gold-500/20 border-gold-500' : 'bg-black/40 border-white/5 hover:border-gold-500/50'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <service.icon size={16} className={selectedServices.includes(service.id) ? 'text-gold-500' : 'text-gray-600'} />
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${selectedServices.includes(service.id) ? 'text-white' : 'text-gray-400'}`}>
                                        {service.label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-mono text-gray-500 group-hover/item:text-gold-500 transition-colors">+{service.basePrice}€</span>
                                    <CheckCircle2 size={14} className={selectedServices.includes(service.id) ? 'text-gold-500' : 'text-gray-800'} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-6">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gold-500 flex items-center gap-2">
                    <DollarSign size={12} />
                    Rango de Inversión Estándar
                </label>
                <div className="relative">
                    <select 
                        className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-white appearance-none focus:border-gold-500 outline-none transition-all pr-12 cursor-pointer font-mono text-sm"
                        value={JSON.stringify(budgetRange)}
                        onChange={(e) => setBudgetRange(JSON.parse(e.target.value))}
                    >
                        {BUDGET_RANGES.map((r, i) => (
                            <option key={i} value={JSON.stringify(r)} className="bg-zinc-900">{r.label}</option>
                        ))}
                    </select>
                    <ChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
            </div>

            <div className="p-8 bg-black/50 border border-white/5 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <DollarSign size={80} />
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                    <div className="space-y-1 text-center md:text-left">
                        <span className="text-[8px] text-gray-600 uppercase font-black">Estimación Dinámica de Ejecución</span>
                        <div className="text-5xl font-black tracking-tighter text-white">
                            {totalPrice > 0 ? `${totalPrice} €` : 'Calculando...'}
                        </div>
                        <p className="text-[9px] text-gold-500 uppercase tracking-[0.2em] font-bold">Inversión por Proyecto / Etapa</p>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gold-500 font-black">Visión de Impacto / Objetivos de la Misión</label>
                <textarea 
                    required
                    minLength={20}
                    className="w-full bg-black/50 border border-white/10 p-8 rounded-[2rem] text-white focus:border-gold-500 outline-none transition-all h-40 resize-none text-sm font-light leading-relaxed"
                    placeholder="Describe los objetivos estratégicos o la visión institucional para este despliegue. Nos anticipamos a tus necesidades..."
                />
            </div>

            <button 
                type="submit"
                disabled={status === 'LOADING'}
                className="w-full py-8 bg-gold-500 text-black font-black uppercase tracking-[0.4em] text-xs rounded-2xl hover:bg-white transition-all shadow-[0_20px_60px_rgba(196,163,0,0.15)] disabled:opacity-50 overflow-hidden relative group"
            >
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative z-10 flex items-center justify-center gap-4">
                    {status === 'LOADING' ? 'Estableciendo Sincronía...' : 'Activar Despliegue Estratégico'}
                </span>
            </button>
        </form>
    );
};

