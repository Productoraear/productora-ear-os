import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from '../../contexts/LanguageContext';
import { generateValueProposition } from '../../services/geminiService';
import { ValuePropositionResult } from '../../types';
import { Icon } from '../Icon';
import { EnhancedTextarea } from '../EnhancedTextarea';

export const ValuePropositionArsenal: React.FC = () => {
    const { t, language } = useTranslations();
    const [product, setProduct] = useState('');
    const [stakeholder, setStakeholder] = useState('');
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ValuePropositionResult | null>(null);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!product.trim() || !stakeholder.trim() || !value.trim()) return;
        setIsLoading(true);
        setResult(null);
        setError('');
        try {
            const vpResult = await generateValueProposition(product, stakeholder, value, language);
            setResult(vpResult);
        } catch (e) {
            console.error("Value proposition error:", e);
            setError(t('errorUnknown'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex p-8 bg-zinc-950 overflow-y-auto">
            <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
                {/* Controls */}
                <div className="lg:w-1/3">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="sticky top-8">
                        <h1 className="text-4xl font-bold text-white mb-2">{t('tool_valueProposition_title')}</h1>
                        <p className="text-lg text-zinc-400 mb-6">{t('tool_valueProposition_description')}</p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-zinc-300 mb-2">{t('value_product_label')}</label>
                                <input type="text" value={product} onChange={e => setProduct(e.target.value)} placeholder={t('value_product_placeholder')} className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                             <div>
                                <label className="block text-sm font-semibold text-zinc-300 mb-2">{t('value_stakeholder_label')}</label>
                                <input type="text" value={stakeholder} onChange={e => setStakeholder(e.target.value)} placeholder={t('value_stakeholder_placeholder')} className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                             <div>
                                <label className="block text-sm font-semibold text-zinc-300 mb-2">{t('value_core_label')}</label>
                                <EnhancedTextarea value={value} onChange={e => setValue(e.target.value)} placeholder={t('value_core_placeholder')} className="w-full p-2.5 h-24 bg-zinc-900 border border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" />
                            </div>
                            <button
                                onClick={handleGenerate}
                                disabled={isLoading || !product.trim() || !stakeholder.trim() || !value.trim()}
                                className="w-full flex items-center justify-center gap-3 py-3 px-8 bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 focus:scale-105 disabled:from-zinc-700 disabled:to-zinc-800 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none disabled:opacity-60"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {t('value_generating')}...
                                    </>
                                ) : (
                                    <>
                                    <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.826-1.106-2.231 0-3.058a2.98 2.98 0 0 1 4.242 0c1.172.879 1.172 2.303 0 3.182C13.536 11.219 12.768 11 12 11c-.725 0-1.45-.22-2.003.659Z" /></Icon>
                                    {t('value_button')}
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
                
                {/* Results */}
                <div className="lg:w-2/3">
                    <div className="bg-black/20 p-6 rounded-xl border border-white/10 min-h-[70vh]">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full text-zinc-400">
                                <p>{t('value_generating_long')}</p>
                            </div>
                        ) : result ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                <h2 className="text-3xl font-bold text-blue-300">{result.title}</h2>
                                <p className="text-sm text-zinc-400 font-medium">{t('value_for_stakeholder')} <strong className="text-zinc-200">{result.stakeholder}</strong></p>
                                <div className="space-y-5 pt-4">
                                    <div>
                                        <h3 className="font-semibold text-zinc-200 text-lg mb-1">{t('value_problem')}</h3>
                                        <p className="text-zinc-300 leading-relaxed">{result.problem}</p>
                                    </div>
                                     <div>
                                        <h3 className="font-semibold text-zinc-200 text-lg mb-1">{t('value_solution')}</h3>
                                        <p className="text-zinc-300 leading-relaxed">{result.solution}</p>
                                    </div>
                                     <div>
                                        <h3 className="font-semibold text-zinc-200 text-lg mb-2">{t('value_benefits')}</h3>
                                        <ul className="space-y-2">
                                            {result.benefits.map((b, i) => 
                                            <li key={i} className="flex items-start gap-3">
                                                <Icon className="w-5 h-5 text-green-400 flex-shrink-0 mt-1"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></Icon>
                                                <span className="text-zinc-300">{b}</span>
                                            </li>)}
                                        </ul>
                                    </div>
                                     <div>
                                        <h3 className="font-semibold text-zinc-200 text-lg mb-1">{t('value_differentiation')}</h3>
                                        <p className="text-zinc-300 leading-relaxed">{result.differentiation}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                             <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500">
                                <Icon className="w-16 h-16 mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.826-1.106-2.231 0-3.058a2.98 2.98 0 0 1 4.242 0c1.172.879 1.172 2.303 0 3.182C13.536 11.219 12.768 11 12 11c-.725 0-1.45-.22-2.003.659Z" /></Icon>
                                <p className="font-semibold text-lg">{t('value_placeholder_title')}</p>
                                <p className="text-sm max-w-sm mt-1">{t('value_placeholder_desc')}</p>
                            </div>
                        )}
                        {error && <p className="text-red-400 mt-4">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};