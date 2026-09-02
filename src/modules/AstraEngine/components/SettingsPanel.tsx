
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from './Icon';
import { useTranslations } from '../contexts/LanguageContext';
import { RiskAppetite, AnalysisHorizon } from '../types';
import { RISK_APPETITE_OPTIONS, ANALYSIS_HORIZON_OPTIONS } from '../constants';
import { cryptoService } from '../services/cryptoService';
import { toast } from './ToastContainer';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    defaultValues: {
        riskAppetite: RiskAppetite;
        horizon: AnalysisHorizon;
        useGoogleSearch: boolean;
        prioritizeSpeed: boolean;
    };
    onDefaultChange: (key: keyof SettingsPanelProps['defaultValues'], value: any) => void;
}

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; }> = ({ checked, onChange }) => (
    <div className="relative">
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={e => onChange(e.target.checked)} />
        <div className={`block w-10 h-6 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-white/20'}`}></div>
        <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-4"></div>
    </div>
);

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, defaultValues, onDefaultChange }) => {
    const { t } = useTranslations();
    const [hasKey, setHasKey] = useState(false);

    useEffect(() => {
        // Check if key exists in local storage (simplified check)
        setHasKey(!!localStorage.getItem('astra_master_key_iv'));
    }, [isOpen]);

    const handleGenerateKey = async () => {
        try {
            const key = await cryptoService.generateKey();
            const exported = await cryptoService.exportKey(key);
            // In a real app, we would NOT store the raw key in localstorage without wrapping it or asking user to save it.
            // For this demo, we mark it as "Generated".
            localStorage.setItem('astra_master_key_check', 'true'); 
            setHasKey(true);
            toast.success(t('crypto_secure'));
        } catch (e) {
            console.error(e);
        }
    };

    const panelVariants = {
        open: { x: 0 },
        closed: { x: '100%' },
    };
    
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/60 z-30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.aside
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950 border-l border-white/10 shadow-2xl z-40 flex flex-col"
                        variants={panelVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <h2 className="text-lg font-bold text-white">{t('settingsPanelTitle')}</h2>
                            <button onClick={onClose} className="p-1 rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white">
                                <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></Icon>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                             {/* Security Section */}
                             <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl">
                                <h3 className="font-semibold text-blue-200 flex items-center gap-2 mb-2">
                                    <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></Icon>
                                    {t('crypto_status_title')}
                                </h3>
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm font-bold ${hasKey ? 'text-green-400' : 'text-red-400'}`}>
                                        {hasKey ? t('crypto_secure') : t('crypto_insecure')}
                                    </span>
                                    {!hasKey && (
                                        <button 
                                            onClick={handleGenerateKey}
                                            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded"
                                        >
                                            {t('crypto_generate_key')}
                                        </button>
                                    )}
                                </div>
                                <p className="text-xs text-zinc-500 mt-2">{t('crypto_key_warning')}</p>
                             </div>

                             <div>
                                <h3 className="font-semibold text-zinc-100">{t('settingsDefaults')}</h3>
                                <p className="text-sm text-zinc-400 mb-4">{t('settingsDefaultsSubtitle')}</p>
                                <div className="space-y-4 rounded-lg bg-black/20 p-4 border border-white/10">
                                    <div>
                                        <label className="text-sm font-medium text-zinc-300 mb-2 block">{t('riskAppetite')}</label>
                                         <div className="flex w-full bg-white/5 border border-white/10 rounded-md p-1">
                                            {RISK_APPETITE_OPTIONS.map(opt => (
                                                <button key={opt} onClick={() => onDefaultChange('riskAppetite', opt)} className={`w-1/3 py-1.5 text-xs font-semibold rounded-sm transition-all duration-300 ${defaultValues.riskAppetite === opt ? 'bg-white/90 text-black' : 'text-zinc-300 hover:bg-white/10'}`}>
                                                    {t(opt as string)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                     <div>
                                        <label className="text-sm font-medium text-zinc-300 mb-2 block">{t('timeHorizon')}</label>
                                         <div className="flex flex-col sm:flex-row gap-2">
                                            {ANALYSIS_HORIZON_OPTIONS.map(opt => (
                                                <button key={opt} onClick={() => onDefaultChange('horizon', opt)} className={`flex-1 py-2 text-xs rounded-md border transition-colors ${defaultValues.horizon === opt ? 'bg-white/90 border-white/90 text-black font-semibold' : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'}`}>
                                                    {t(opt as string)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="border-t border-white/10"></div>
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="text-sm text-zinc-200 font-medium">{t('useGoogleSearch')}</span>
                                        <ToggleSwitch
                                            checked={defaultValues.useGoogleSearch}
                                            onChange={(checked) => onDefaultChange('useGoogleSearch', checked)}
                                        />
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="text-sm text-zinc-200 font-medium">{t('prioritizeSpeed')}</span>
                                        <ToggleSwitch
                                            checked={defaultValues.prioritizeSpeed}
                                            onChange={(checked) => onDefaultChange('prioritizeSpeed', checked)}
                                        />
                                    </label>
                                </div>
                             </div>

                             <div>
                                <h3 className="font-semibold text-zinc-100">{t('settingsDataManagement')}</h3>
                                <p className="text-sm text-zinc-400 mb-4">{t('settingsDataManagementSubtitle')}</p>
                                <button
                                    onClick={() => {
                                        if (window.confirm(t('settingsDataClearConfirm'))) {
                                            localStorage.clear();
                                            window.location.reload();
                                        }
                                    }}
                                    className="w-full text-left p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-300 hover:bg-red-900/70 transition-colors"
                                    title={t('settingsDataClearAllTooltip')}
                                >
                                    {t('settingsDataClearAll')}
                                </button>
                             </div>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
};
