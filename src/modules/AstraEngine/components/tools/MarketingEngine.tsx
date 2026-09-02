
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from '../../contexts/LanguageContext';
import { Icon, UploadIcon } from '../Icon';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { MarketingCampaign, ContentItem, Lead, MarketingMetric, CampaignStatus, LeadStage } from '../../types';
import { generateMarketingContent } from '../../services/geminiService';
import { ImportModal } from '../ImportModal'; // New Import

// --- Mock Data Seeding ---
const INITIAL_CAMPAIGNS: MarketingCampaign[] = [
    { id: 'c1', nombre: 'Semana - Haciendo nuestro mejor esfuerzo', descripcion: 'Campaña semanal de engagement general', estado: 'Activa', fecha_inicio: '2025-05-01', fecha_fin: '2025-05-07', presupuesto: 10, gasto: 0 },
    { id: 'c2', nombre: 'Diseño de Anuncios', descripcion: 'Diseños de anuncios publicitarios para redes', estado: 'Planificacion', fecha_inicio: '2025-06-01', fecha_fin: '2025-06-30', presupuesto: 10000, gasto: 2500 },
    { id: 'c3', nombre: 'TalentMatch IA', descripcion: 'Lanzamiento plataforma de selección inteligente', estado: 'Activa', fecha_inicio: '2025-04-15', fecha_fin: '2025-07-15', presupuesto: 0, gasto: 0 },
];

const INITIAL_LEADS: Lead[] = [
    { id: 'l1', email: 'contacto@ejemplo.com', nombre: 'Juan', apellido: 'Pérez', etapa: 'Lead', puntuacion: 45, fuente: 'Web' },
    { id: 'l2', email: 'ana.garcia@empresa.es', nombre: 'Ana', apellido: 'García', etapa: 'Cliente', puntuacion: 90, fuente: 'Referido' },
    { id: 'l3', email: 'info@startup.io', nombre: 'Carlos', apellido: 'Ruiz', etapa: 'Suscriptor', puntuacion: 20, fuente: 'LinkedIn' },
];

// --- Sub-components ---

const DashboardWidget: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 flex items-center gap-4">
        <div className={`p-3 rounded-lg ${color} bg-opacity-20 text-white`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-zinc-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const colors: Record<string, string> = {
        'Activa': 'bg-green-500/20 text-green-400 border-green-500/30',
        'Planificacion': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        'Completada': 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
        'Archivada': 'bg-zinc-800 text-zinc-500 border-zinc-700',
    };
    return (
        <span className={`px-2 py-1 rounded text-xs font-medium border ${colors[status] || 'bg-zinc-800 text-zinc-400'}`}>
            {status}
        </span>
    );
};

export const MarketingEngine: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const { t, language } = useTranslations();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'campaigns' | 'content' | 'leads'>('dashboard');
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    
    // Data State
    const [campaigns, setCampaigns] = useLocalStorage<MarketingCampaign[]>('astra-marketing-campaigns', INITIAL_CAMPAIGNS);
    const [leads, setLeads] = useLocalStorage<Lead[]>('astra-marketing-leads', INITIAL_LEADS);
    const [contentItems, setContentItems] = useLocalStorage<ContentItem[]>('astra-marketing-content', []);
    
    // Content Gen State
    const [selectedCampaignId, setSelectedCampaignId] = useState<string>(campaigns[0]?.id || '');
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState('');

    // Metrics
    const totalBudget = campaigns.reduce((acc, c) => acc + (c.presupuesto || 0), 0);
    const activeCampaignsCount = campaigns.filter(c => c.estado === 'Activa').length;
    const totalLeads = leads.length;
    
    // Handlers
    const handleCreateCampaign = () => {
        const newCampaign: MarketingCampaign = {
            id: `c_${Date.now()}`,
            nombre: 'Nueva Campaña',
            descripcion: '',
            estado: 'Planificacion',
            fecha_inicio: new Date().toISOString().split('T')[0],
            fecha_fin: '',
            presupuesto: 0,
            gasto: 0
        };
        setCampaigns([...campaigns, newCampaign]);
    };

    const handleGenerateContent = async () => {
        if (!prompt.trim() || !selectedCampaignId) return;
        
        const campaign = campaigns.find(c => c.id === selectedCampaignId);
        if (!campaign) return;

        setIsGenerating(true);
        try {
            const result = await generateMarketingContent(campaign, prompt, language);
            setGeneratedContent(result);
            
            // Save as draft
            const newItem: ContentItem = {
                id: `cnt_${Date.now()}`,
                id_campana: campaign.id,
                titulo: prompt.substring(0, 30) + '...',
                cuerpo: result,
                estado: 'Borrador',
                plataforma: 'Email', // Default
                fecha_creacion: new Date().toISOString()
            };
            setContentItems([newItem, ...contentItems]);
        } catch (error) {
            console.error("Error generating content", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleImportLeads = (importedData: any[]) => {
        const newLeads = importedData.map(item => ({
            id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            email: item.email || item.correo || '',
            nombre: item.nombre || item.name || '',
            apellido: item.apellido || '',
            etapa: 'Lead',
            puntuacion: 10,
            fuente: 'Importado'
        } as Lead));
        
        setLeads([...leads, ...newLeads]);
        alert(t('importer_success').replace('{count}', newLeads.length.toString()));
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-zinc-950 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 pb-32">
                <div className="max-w-7xl mx-auto">
                    <header className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                                <Icon className="w-8 h-8 text-fuchsia-500"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></Icon>
                                {t('tool_marketingEngine_title')}
                            </h1>
                            <p className="text-zinc-400">{t('tool_marketingEngine_description')}</p>
                        </div>
                        <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                            {['dashboard', 'campaigns', 'content', 'leads'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
                                >
                                    {t(`marketing_${tab}`)}
                                </button>
                            ))}
                        </div>
                    </header>

                    <main>
                        {activeTab === 'dashboard' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <DashboardWidget title={t('marketing_total_budget')} value={`€${totalBudget.toLocaleString()}`} icon={<Icon className="w-6 h-6 text-green-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.826-1.106-2.231 0-3.058a2.98 2.98 0 0 1 4.242 0c1.172.879 1.172 2.303 0 3.182C13.536 11.219 12.768 11 12 11c-.725 0-1.45-.22-2.003.659" /></Icon>} color="bg-green-500" />
                                    <DashboardWidget title={t('marketing_active_campaigns')} value={activeCampaignsCount} icon={<Icon className="w-6 h-6 text-blue-400"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" /></Icon>} color="bg-blue-500" />
                                    <DashboardWidget title={t('marketing_total_leads')} value={totalLeads} icon={<Icon className="w-6 h-6 text-fuchsia-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-2.253M15 19.128v-3.86a2.25 2.25 0 0 1 .9-1.751M15 19.128S14.25 19.5 12 19.5s-3-1.872-3-1.872v-3.86a2.25 2.25 0 0 1 .9-1.751M12 15.25v3.86m0 0S11.25 19.5 9 19.5s-3-1.872-3-1.872v-3.86a2.25 2.25 0 0 1 .9-1.751M9 15.25v3.86" /></Icon>} color="bg-fuchsia-500" />
                                    <DashboardWidget title={t('marketing_roi')} value="12.5%" icon={<Icon className="w-6 h-6 text-yellow-400"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></Icon>} color="bg-yellow-500" />
                                </div>
                                {/* Charts Placeholder (Bloomberg style grid) */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-96">
                                    <div className="col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 relative overflow-hidden">
                                        <h3 className="text-sm font-bold text-zinc-400 mb-4 uppercase tracking-wider">{t('marketing_performance_simulated')}</h3>
                                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                            {/* Fake Chart Lines */}
                                            <svg viewBox="0 0 100 50" className="w-full h-full text-blue-500 stroke-current fill-none stroke-2">
                                                <path d="M0 40 Q 25 45 50 20 T 100 10" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="col-span-1 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                                        <h3 className="text-sm font-bold text-zinc-400 mb-4 uppercase tracking-wider">{t('marketing_leads_distribution')}</h3>
                                        {/* Fake Pie Chart */}
                                        <div className="w-40 h-40 rounded-full border-8 border-fuchsia-500/30 mx-auto mt-8 relative">
                                            <div className="absolute inset-0 border-t-8 border-r-8 border-blue-500 rounded-full rotate-45"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'campaigns' && (
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                                <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                                    <h3 className="font-bold text-white">{t('marketing_campaigns')}</h3>
                                    <button onClick={handleCreateCampaign} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-500 transition-colors">
                                        + {t('marketing_new_campaign')}
                                    </button>
                                </div>
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-zinc-900 text-zinc-400">
                                        <tr>
                                            <th className="p-4">{t('marketing_campaign_name')}</th>
                                            <th className="p-4">{t('marketing_status')}</th>
                                            <th className="p-4">{t('marketing_budget')}</th>
                                            <th className="p-4 text-right">{t('marketing_actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800">
                                        {campaigns.map(campaign => (
                                            <tr key={campaign.id} className="hover:bg-zinc-800/50 transition-colors">
                                                <td className="p-4 font-medium text-white">
                                                    {campaign.nombre}
                                                    <div className="text-xs text-zinc-500 font-normal truncate max-w-xs">{campaign.descripcion}</div>
                                                </td>
                                                <td className="p-4"><StatusBadge status={campaign.estado} /></td>
                                                <td className="p-4 text-zinc-300">€{campaign.presupuesto.toLocaleString()}</td>
                                                <td className="p-4 text-right">
                                                    <button className="text-blue-400 hover:text-blue-300 mr-3"><Icon className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></Icon></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'content' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                                    <h3 className="font-bold text-white mb-4">{t('marketing_create')}</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-400 mb-2">{t('marketing_campaigns')}</label>
                                            <select 
                                                value={selectedCampaignId} 
                                                onChange={(e) => setSelectedCampaignId(e.target.value)}
                                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-fuchsia-500"
                                            >
                                                {campaigns.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-400 mb-2">{t('marketing_prompt_placeholder')}</label>
                                            <textarea 
                                                value={prompt}
                                                onChange={(e) => setPrompt(e.target.value)}
                                                className="w-full h-32 bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white resize-none focus:ring-2 focus:ring-fuchsia-500"
                                                placeholder={t('marketing_prompt_placeholder')}
                                            />
                                        </div>
                                        <button 
                                            onClick={handleGenerateContent}
                                            disabled={isGenerating || !prompt}
                                            className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                                        >
                                            {isGenerating ? t('marketing_generating') : <><Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 1-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 1 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 1 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 1-2.846.813a4.5 4.5 0 0 1-3.09-3.09Z" /></Icon> {t('marketing_generate')}</>}
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 flex flex-col">
                                    <h3 className="font-bold text-white mb-4">{t('marketing_generated_content')}</h3>
                                    <div className="flex-1 bg-black/20 border border-zinc-700 rounded-lg p-4 overflow-y-auto text-zinc-300 whitespace-pre-wrap">
                                        {generatedContent || <span className="text-zinc-600 italic">{t('marketing_no_content_yet')}</span>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'leads' && (
                             <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                                <div className="p-4 border-b border-zinc-800 flex justify-end">
                                    <button 
                                        onClick={() => setIsImportModalOpen(true)}
                                        className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                                    >
                                        <Icon className="w-4 h-4 text-blue-400">{UploadIcon}</Icon>
                                        {t('importer_button')}
                                    </button>
                                </div>
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-zinc-900 text-zinc-400">
                                        <tr>
                                            <th className="p-4">{t('marketing_leads_name')}</th>
                                            <th className="p-4">{t('marketing_leads_email')}</th>
                                            <th className="p-4">{t('marketing_leads_stage')}</th>
                                            <th className="p-4">{t('marketing_leads_score')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800">
                                        {leads.map(lead => (
                                            <tr key={lead.id} className="hover:bg-zinc-800/50 transition-colors">
                                                <td className="p-4 text-white font-medium">{lead.nombre} {lead.apellido}</td>
                                                <td className="p-4 text-zinc-400">{lead.email}</td>
                                                <td className="p-4"><span className="bg-zinc-800 px-2 py-1 rounded text-xs text-zinc-300">{lead.etapa}</span></td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                                                            <div className="bg-blue-500 h-full" style={{ width: `${lead.puntuacion}%` }}></div>
                                                        </div>
                                                        <span className="text-xs text-zinc-400">{lead.puntuacion}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </main>
                </div>
            </div>
            
            <ImportModal 
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImportLeads}
            />
        </div>
    );
};
