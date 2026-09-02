import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnalysisResponse } from '../../types';
import { generateProaAnalysis } from '../../services/geminiService';
import { useTranslations } from '../../contexts/LanguageContext';
import { ProaLogo } from './proa/icons';
import { UserInputForm } from './proa/UserInputForm';
import { AnalysisDisplay } from './proa/AnalysisDisplay';
import { WelcomeMessage } from './proa/WelcomeMessage';
import { Icon } from '../Icon';

interface ProaProps {
    onComplete: () => void;
}

export const Proa: React.FC<ProaProps> = ({ onComplete }) => {
    const { t } = useTranslations();
    const [idea, setIdea] = useState<string>('');
    const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isInitialState, setIsInitialState] = useState<boolean>(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!idea.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        setIsInitialState(false);

        try {
            const result = await generateProaAnalysis(idea);
            setAnalysis(result);
        } catch (err) {
            if (err instanceof Error) {
                setError(`${t('proa_error_prefix')}: ${err.message}. ${t('proa_error_suffix')}`);
            } else {
                setError(t('errorUnknown'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center p-4 sm:p-6 lg:p-8 bg-zinc-950 overflow-y-auto">
            <div className="w-full max-w-4xl mx-auto">
                <header className="text-center mb-8">
                    <div className="flex items-center justify-center gap-4 mb-2">
                        <ProaLogo className="h-12 w-12 text-blue-400" />
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-fuchsia-500 text-transparent bg-clip-text">
                            {t('tool_proa_title')}
                        </h1>
                    </div>
                    <p className="text-lg text-zinc-400">
                        {t('tool_proa_description')}
                    </p>
                </header>

                <main>
                    <div className="glass-card rounded-xl p-6 shadow-2xl mb-8">
                        <UserInputForm
                            idea={idea}
                            setIdea={setIdea}
                            onSubmit={handleSubmit}
                            isLoading={isLoading}
                        />
                    </div>

                    <div className="mt-8">
                        {isLoading && (
                             <div className="flex justify-center items-center p-8">
                                <Icon className="w-10 h-10 text-blue-400 animate-spin"><path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" fill="currentColor"/></Icon>
                                <p className="ml-4 text-lg text-zinc-400">{t('proa_analyzing')}</p>
                            </div>
                        )}
                        {error && (
                            <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg text-center">
                                <p className="font-semibold">{t('proa_error_title')}</p>
                                <p>{error}</p>
                            </div>
                        )}
                        {isInitialState && <WelcomeMessage />}
                        {analysis && !isLoading && (
                            <>
                                <AnalysisDisplay analysis={analysis} />
                                <div className="mt-8 text-center">
                                    <button onClick={onComplete} className="py-3 px-8 bg-zinc-700 text-white font-bold rounded-lg hover:bg-zinc-600 transition-colors">
                                        {t('completeAndContinue')}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};