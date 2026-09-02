import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from '../../contexts/LanguageContext';
import { extractWisdomNuggets } from '../../services/geminiService';
import { ImpactNugget, KnowledgeCategory } from '../../types';
import { Icon } from '../Icon';

const NuggetCard: React.FC<{ nugget: ImpactNugget, onSave: () => void, isSaved: boolean }> = ({ nugget, onSave, isSaved }) => {
    const { t } = useTranslations();
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700 space-y-2"
        >
            <h4 className="font-bold text-blue-400">{nugget.title}</h4>
            <p className="text-sm text-zinc-300">{nugget.insight}</p>
            <div className="flex justify-between items-center pt-2">
                <span className="text-xs font-medium bg-zinc-700 text-zinc-400 px-2 py-1 rounded">
                    {t(`category_${nugget.category}`)}
                </span>
                <button 
                    onClick={onSave} 
                    disabled={isSaved}
                    className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded disabled:bg-green-600 disabled:cursor-not-allowed"
                >
                    {isSaved ? t('saved') : t('impactJournal_save_to_vault')}
                </button>
            </div>
        </motion.div>
    );
};

export const ImpactJournal: React.FC<{ onComplete: () => void, onSaveNugget: (nugget: ImpactNugget) => void }> = ({ onComplete, onSaveNugget }) => {
    const { t, language } = useTranslations();
    const [reflection, setReflection] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [nuggets, setNuggets] = useState<ImpactNugget[]>([]);
    const [savedNuggets, setSavedNuggets] = useState<ImpactNugget[]>([]);
    const [error, setError] = useState('');

    const handleExtract = async () => {
        if (!reflection.trim()) return;
        setIsLoading(true);
        setError('');
        setNuggets([]);
        try {
            const extractedNuggets = await extractWisdomNuggets(reflection, language);
            setNuggets(extractedNuggets);
        } catch (e) {
            console.error("Nugget extraction error:", e);
            setError(t('errorUnknown'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveNugget = (nugget: ImpactNugget) => {
        onSaveNugget(nugget);
        setSavedNuggets(prev => [...prev, nugget]);
    };

    return (
        <div className="flex-1 flex flex-col items-center p-4 md:p-8 bg-zinc-950 overflow-y-auto">
            <div className="w-full max-w-4xl">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t('impactJournal_title')}</h1>
                    <p className="text-base md:text-lg text-zinc-400 mb-6">{t('impactJournal_subtitle')}</p>
                </motion.div>

                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                    <label className="font-semibold text-zinc-200 mb-2 block">{t('impactJournal_reflection_prompt')}</label>
                    <textarea
                        value={reflection}
                        onChange={(e) => setReflection(e.target.value)}
                        placeholder={t('impactJournal_reflection_placeholder')}
                        className="w-full h-40 p-3 bg-zinc-800/50 border border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
                    />
                    <button
                        onClick={handleExtract}
                        disabled={isLoading || !reflection.trim()}
                        className="mt-4 flex items-center justify-center gap-2 py-2 px-5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <Icon className="w-5 h-5 animate-spin"><path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" fill="currentColor"/></Icon>
                                {t('impactJournal_extracting')}
                            </>
                        ) : (
                            t('impactJournal_extract_button')
                        )}
                    </button>
                </div>

                <AnimatePresence>
                    {(nuggets.length > 0 || error) && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full mt-8"
                        >
                            {error && <p className="text-red-400 text-center">{error}</p>}
                            {nuggets.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">{t('impactJournal_nuggets_title')}</h3>
                                    <p className="text-zinc-400 mb-4">{t('impactJournal_nuggets_subtitle')}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {nuggets.map((nugget, i) => (
                                            <NuggetCard 
                                                key={i} 
                                                nugget={nugget} 
                                                onSave={() => handleSaveNugget(nugget)}
                                                isSaved={savedNuggets.includes(nugget)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                             {nuggets.length === 0 && !isLoading && reflection && (
                                <p className="text-zinc-500 text-center">{t('impactJournal_no_nuggets')}</p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <div className="mt-8 text-center">
                    <button onClick={onComplete} className="py-3 px-8 bg-zinc-700 text-white font-bold rounded-lg hover:bg-zinc-600 transition-colors">
                        {t('completeAndContinue')}
                    </button>
                </div>
            </div>
        </div>
    );
};