// FIX: Implemented the AuditoriaInternaExtrema component to replace the placeholder content.
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslations } from '../contexts/LanguageContext';
import { Icon } from './Icon';
import { generateExtremeAudit } from '../services/geminiService';
import { EnhancedTextarea } from './EnhancedTextarea';

export const AuditoriaInternaExtrema: React.FC = () => {
    const { t, language } = useTranslations();
    const [directive, setDirective] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('');
    const [error, setError] = useState('');

    const handleAudit = async () => {
        if (!directive.trim()) return;
        setIsLoading(true);
        setResult('');
        setError('');
        try {
            const auditResult = await generateExtremeAudit(directive, language);
            setResult(auditResult);
        } catch (e) {
            console.error("Audit error:", e);
            setError(t('errorUnknown'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center p-8 bg-zinc-950 overflow-y-auto">
            <div className="w-full max-w-4xl">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-4xl font-bold text-white mb-2">{t('tool_auditoriaInterna_title')}</h1>
                    <p className="text-lg text-zinc-400 mb-6">{t('tool_auditoriaInterna_description')}</p>
                </motion.div>
                
                <div className="w-full space-y-4">
                    <EnhancedTextarea
                        value={directive}
                        onChange={(e) => setDirective(e.target.value)}
                        placeholder={t('auditoria_placeholder')}
                        className="w-full p-3 h-32 bg-zinc-900 border border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-zinc-500 resize-none text-base"
                    />
                    <button
                        onClick={handleAudit}
                        disabled={isLoading || !directive.trim()}
                        className="flex items-center justify-center gap-3 py-3 px-8 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-lg shadow-lg hover:shadow-red-500/40 transition-all duration-300 transform hover:scale-105 focus:scale-105 disabled:from-zinc-700 disabled:to-zinc-800 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none disabled:opacity-60"
                    >
                        {isLoading ? (
                           <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t('auditoria_auditing')}...
                           </>
                        ) : (
                           <>
                            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75 14.25 12m0 0 2.25 2.25M14.25 12l2.25-2.25M14.25 12 12 14.25m-2.5-4.125a2.397 2.397 0 0 1-2.397-2.397A2.397 2.397 0 0 1 9.354 3.125m2.885 9.303a2.397 2.397 0 0 1-2.397 2.397A2.397 2.397 0 0 1 7.444 12m5.791 4.875a2.397 2.397 0 0 1 2.397 2.397A2.397 2.397 0 0 1 15.635 21m-4.875-5.791a2.397 2.397 0 0 1 2.397-2.397A2.397 2.397 0 0 1 15.556 12" /></Icon>
                            {t('auditoria_button')}
                           </>
                        )}
                    </button>
                </div>
                
                {result && (
                     <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full mt-8 p-6 bg-black/20 border border-zinc-800 rounded-lg"
                    >
                         <div className="prose prose-invert prose-zinc max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
                        </div>
                    </motion.div>
                )}
                {error && <p className="text-red-400 mt-4">{error}</p>}
            </div>
        </div>
    );
};